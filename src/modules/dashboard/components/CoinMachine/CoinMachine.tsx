import React, { useMemo } from 'react';
import { Redirect, useParams } from 'react-router-dom';
import { defineMessages, FormattedMessage } from 'react-intl';
import { Extension } from '@colony/colony-js';
import { bigNumberify } from 'ethers/utils';

import ExternalLink from '~core/ExternalLink';
import { SpinnerLoader } from '~core/Preloaders';
import BreadCrumb, { Crumb } from '~core/BreadCrumb';

import {
  useColonyExtensionsQuery,
  useCoinMachineSaleTokensQuery,
  useCurrentPeriodTokensQuery,
  Colony,
  useCoinMachineSalePeriodQuery,
} from '~data/index';

import Chat from './Chat';
import SaleStateWidget from './SaleStateWidget';
import BuyTokens from './BuyTokens';
import TokenSalesTable from './TokenSalesTable';
import RemainingDisplayWidget, {
  DataDisplayType,
} from './RemainingDisplayWidget';

import styles from './CoinMachine.css';

const MSG = defineMessages({
  loading: {
    id: 'dashboard.CoinMachine.loading',
    defaultMessage: `Loading Buy Tokens`,
  },
  title: {
    id: 'dashboard.CoinMachine.title',
    defaultMessage: `Tokens`,
  },
  buyTokens: {
    id: 'dashboard.CoinMachine.buyTokens',
    defaultMessage: 'Buy {symbol}',
  },
  learnMore: {
    id: 'dashboard.CoinMachine.learnMore',
    defaultMessage: 'Learn More',
  },
});

type Props = {
  colony: Colony;
};

const displayName = 'dashboard.CoinMachine';

const LEARN_MORE_LINK = '';

const CoinMachine = ({
  colony: { colonyAddress, colonyName },
  colony,
}: Props) => {
  /* To add proper logic later */
  const isSale = true;

  const { data, loading } = useColonyExtensionsQuery({
    variables: { address: colonyAddress },
  });

  const {
    data: saleTokensData,
    loading: saleTokensLoading,
  } = useCoinMachineSaleTokensQuery({
    variables: { colonyAddress },
  });

  const {
    data: salePeriodData,
    loading: salePeriodLoading,
  } = useCoinMachineSalePeriodQuery({
    variables: { colonyAddress },
    fetchPolicy: 'network-only',
  });

  const { transactionHash } = useParams<{
    transactionHash: string;
  }>();

  const {
    data: periodTokensData,
    loading: periodTokensLoading,
  } = useCurrentPeriodTokensQuery({
    variables: { colonyAddress },
    fetchPolicy: 'network-only',
  });

  const periodTokens = useMemo(() => {
    if (!saleTokensData || !periodTokensData || !isSale) {
      return undefined;
    }
    return {
      decimals: saleTokensData.coinMachineSaleTokens.sellableToken.decimals,
      soldPeriodTokens: bigNumberify(
        periodTokensData.currentPeriodTokens.activeSoldTokens,
      ),
      maxPeriodTokens: bigNumberify(
        periodTokensData.currentPeriodTokens.maxPerPeriodTokens,
      ),
      targetPeriodTokens: bigNumberify(
        periodTokensData.currentPeriodTokens.targetPerPeriodTokens,
      ),
    };
  }, [periodTokensData, saleTokensData, isSale]);

  const isSoldOut = useMemo(
    () =>
      periodTokens !== undefined &&
      periodTokens.soldPeriodTokens.gte(periodTokens.maxPeriodTokens),
    [periodTokens],
  );

  if (
    loading ||
    saleTokensLoading ||
    salePeriodLoading ||
    !data?.processedColony?.installedExtensions ||
    periodTokensLoading
  ) {
    return (
      <div className={styles.loadingSpinner}>
        <SpinnerLoader
          loadingText={MSG.loading}
          appearance={{ theme: 'primary', size: 'massive' }}
        />
      </div>
    );
  }

  const { installedExtensions } = data.processedColony;
  const coinMachineExtension = installedExtensions.find(
    ({ extensionId }) => extensionId === Extension.CoinMachine,
  );
  /*
   * Only allow access to the Coin Machine page, if the extension is:
   * - installed
   * - enable
   * - not deprecated
   */
  if (
    !coinMachineExtension ||
    !coinMachineExtension?.details?.initialized ||
    coinMachineExtension?.details?.deprecated
  ) {
    return <Redirect to={`/colony/${colonyName}`} />;
  }

  const saleToken = saleTokensData?.coinMachineSaleTokens?.sellableToken;
  const timeRemaining = parseInt(
    salePeriodData?.coinMachineSalePeriod?.timeRemaining || '0',
    10,
  );
  const periodLength = parseInt(
    salePeriodData?.coinMachineSalePeriod?.periodLength || '0',
    10,
  );
  const breadCrumbs: Crumb[] = [
    MSG.title,
    <div>
      <FormattedMessage
        {...MSG.buyTokens}
        values={{ symbol: saleToken?.symbol }}
      />
      <ExternalLink
        className={styles.learnMore}
        text={{ id: 'text.learnMore' }}
        href={LEARN_MORE_LINK}
      />
    </div>,
  ];

  return (
    <div className={styles.main}>
      <BreadCrumb elements={breadCrumbs} />
      <div className={styles.grid}>
        {(transactionHash && (
          <div className={styles.saleStarted}>
            <SaleStateWidget
              colony={colony}
              sellableToken={saleToken}
              timeLeftToNextSale={timeRemaining}
              transactionHash={transactionHash}
              purchaseToken={
                saleTokensData?.coinMachineSaleTokens?.purchaseToken
              }
            />
          </div>
        )) || (
          <>
            <div className={styles.buy}>
              <BuyTokens
                colony={colony}
                /*
                 * @TODO Determine if the sale is currently ongoing
                 * And only disable it if it insn't
                 */
                isCurrentlyOnSale={isSale}
                isSoldOut={isSoldOut}
              />
            </div>
            <div className={styles.timeRemaining}>
              <RemainingDisplayWidget
                displayType={DataDisplayType.Time}
                appearance={{ theme: !isSoldOut ? 'white' : 'danger' }}
                value={timeRemaining}
                periodLength={periodLength}
                colonyAddress={colonyAddress}
              />
            </div>
            <div className={styles.tokensRemaining}>
              <RemainingDisplayWidget
                displayType={DataDisplayType.Tokens}
                periodTokens={periodTokens}
              />
            </div>
          </>
        )}
        <div className={styles.sales}>
          {/* @TODO: Connect real tableData to TokenSalesTable */}
          <TokenSalesTable tableData={[]} />
        </div>
        <div className={styles.comments}>
          <Chat
            colony={colony}
            transactionHash={coinMachineExtension.address}
          />
        </div>
      </div>
    </div>
  );
};

CoinMachine.displayName = displayName;

export default CoinMachine;