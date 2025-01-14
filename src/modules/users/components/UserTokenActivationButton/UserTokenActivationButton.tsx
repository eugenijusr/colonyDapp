import React from 'react';
import { bigNumberify } from 'ethers/utils';

import { TokenActivationPopover } from '~users/TokenActivation';

import { getFormattedTokenValue } from '~utils/tokens';
import Numeral from '~core/Numeral';

import { UserLock, UserToken } from '~data/index';
import { Address } from '~types/index';

import styles from './UserTokenActivationButton.css';

const displayName = 'users.UserTokenActivationButton';

interface Props {
  userLock: UserLock;
  nativeToken: UserToken;
  colonyAddress: Address;
}

const UserTokenActivationButton = ({
  nativeToken,
  userLock,
  colonyAddress,
}: Props) => {
  const inactiveBalance = bigNumberify(nativeToken?.balance || 0);

  const lockedBalance = bigNumberify(userLock?.totalObligation || 0);
  const activeBalance = bigNumberify(userLock?.activeTokens || 0);
  const totalBalance = inactiveBalance.add(activeBalance).add(lockedBalance);
  const isPendingBalanceZero = bigNumberify(
    userLock?.pendingBalance || 0,
  ).isZero();

  const formattedTotalBalance = getFormattedTokenValue(
    totalBalance,
    nativeToken.decimals,
  );

  return (
    <TokenActivationPopover
      activeTokens={activeBalance}
      inactiveTokens={inactiveBalance}
      totalTokens={totalBalance}
      lockedTokens={lockedBalance}
      token={nativeToken}
      colonyAddress={colonyAddress}
      isPendingBalanceZero={isPendingBalanceZero}
    >
      {({ toggle, ref }) => (
        <>
          <button
            type="button"
            className={styles.tokens}
            onClick={toggle}
            ref={ref}
          >
            <span
              className={`${styles.dot} ${
                (inactiveBalance.gt(0) || totalBalance.isZero()) &&
                styles.dotInactive
              }`}
            />
            <Numeral
              suffix={` ${nativeToken?.symbol} `}
              value={formattedTotalBalance}
            />
          </button>
        </>
      )}
    </TokenActivationPopover>
  );
};

UserTokenActivationButton.displayName = displayName;

export default UserTokenActivationButton;
