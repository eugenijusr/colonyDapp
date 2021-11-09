import React, { useState, useMemo, ReactNode } from 'react';
import { useIntl, FormattedMessage, defineMessages } from 'react-intl';
import { nanoid } from 'nanoid';
import findLastIndex from 'lodash/findLastIndex';
import { ColonyRole } from '@colony/colony-js';

import PermissionsLabel from '~core/PermissionsLabel';
import { TransactionMeta, TransactionStatus } from '~dashboard/ActionsPage';
import ColorTag, { Color } from '~core/ColorTag';
import FriendlyName from '~core/FriendlyName';
import MemberReputation from '~core/MemberReputation';
import Tag from '~core/Tag';
import Numeral from '~core/Numeral';

import {
  ColonyAction,
  useSubgraphColonyMetadataQuery,
  useSubgraphDomainMetadataQuery,
  Colony,
  useUser,
} from '~data/index';
import { ColonyAndExtensionsEvents } from '~types/index';
import {
  getSpecificActionValuesCheck,
  sortMetdataHistory,
  parseColonyMetadata,
  parseDomainMetadata,
  getColonyMetadataMessageDescriptorsIds,
  getDomainMetadataMessageDescriptorsIds,
  getRoleEventDescriptorsIds,
} from '~utils/colonyActions';
import { useDataFetcher } from '~utils/hooks';
import { getFormattedTokenValue } from '~utils/tokens';
import { MotionVote } from '~utils/colonyMotions';

import { ipfsDataFetcher } from '../../../../core/fetchers';

import { EventValues } from '../ActionsPageFeed';
import { STATUS } from '../../ActionsPage/types';
import { EVENT_ROLES_MAP } from '../../ActionsPage/staticMaps';
import motionSpecificStyles from '../../ActionsPage/ActionsComponents/DefaultMotion.css';

import styles from './ActionsPageEvent.css';

const displayName = 'dashboard.ActionsPageFeed.ActionsPageEvent';

const MSG = defineMessages({
  rolesTooltip: {
    id: 'dashboard.ActionsPageFeed.ActionsPageEvent.rolesTooltip',
    defaultMessage: `{icon} {role, select,
      1 {This permission allows modify colony-wide parameters, upgrade the
        colony and manage permissions in Root Domain.}
      6 {This permission allows an account to manipulate payments (tasks) in
        their domain and to raise disputes.}
      other {This is a generic placeholder for a permissions type.
        You should not be seeing this}
    }`,
  },
  voteYes: {
    id: 'dashboard.ActionsPageFeed.ActionsPageEvent.voteYes',
    defaultMessage: 'YES',
  },
  voteNo: {
    id: 'dashboard.ActionsPageFeed.ActionsPageEvent.voteNo',
    defaultMessage: 'NO',
  },
});

interface Props {
  eventIndex: number;
  eventName?: string;
  eventValues?: Record<string, any>;
  transactionHash: string;
  createdAt: Date;
  values?: EventValues;
  emmitedBy?: string;
  actionData: ColonyAction;
  colony: Colony;
  children?: ReactNode;
  rootHash?: string;
}

interface DomainMetadata {
  domainName: string | null;
  domainPurpose: string | null;
  domainColor: string | null;
}

const ActionsPageEvent = ({
  eventIndex,
  createdAt,
  transactionHash,
  eventName = ColonyAndExtensionsEvents.Generic,
  values,
  emmitedBy,
  actionData,
  colony: { colonyAddress, nativeTokenAddress, tokens },
  colony,
  children,
  rootHash,
}: Props) => {
  let metadataJSON;
  const [metdataIpfsHash, setMetdataIpfsHash] = useState<string | undefined>(
    undefined,
  );

  const initiator = useUser(
    values?.agent ||
      values?.user ||
      values?.creator ||
      values?.staker ||
      values?.voter ||
      '',
  );

  const [
    previousDomainMetadata,
    setPreviousDomainMetadata,
  ] = useState<DomainMetadata | null>();

  /*
   * @NOTE See nanoId's docs about the reasoning for this
   * https://github.com/ai/nanoid#react
   *
   * We're creating a object with event names for keys, which, as values,
   * have an array of ids, for each available permission
   */
  const [autogeneratedIds] = useState<Record<string, string[]>>(() => {
    const eventsToIdsMap = {};
    Object.keys(EVENT_ROLES_MAP).map((name) => {
      eventsToIdsMap[name] = [...new Array(EVENT_ROLES_MAP[eventName])].map(
        nanoid,
      );
      return null;
    });
    return eventsToIdsMap;
  });

  const colonyMetadataHistory = useSubgraphColonyMetadataQuery({
    variables: {
      address: colonyAddress.toLowerCase(),
    },
  });

  const domainMetadataHistory = useSubgraphDomainMetadataQuery({
    variables: {
      colonyAddress: colonyAddress.toLowerCase(),
      domainId: values?.fromDomain?.ethDomainId || 0,
    },
  });
  /*
   * Fetch a historic metadata hash using IPFS
   */
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { data: ipfsMetadata } = useDataFetcher(
      ipfsDataFetcher,
      [metdataIpfsHash as string],
      [metdataIpfsHash],
    );
    metadataJSON = ipfsMetadata;
  } catch (error) {
    // silent error
  }

  /*
   * Determine if the current medata is different from the previous one,
   * and in what way
   */
  const getColonyMetadataChecks = useMemo(() => {
    if (
      eventName === ColonyAndExtensionsEvents.ColonyMetadata &&
      !!colonyMetadataHistory?.data?.colony &&
      !!actionData
    ) {
      const {
        data: {
          colony: { metadataHistory },
        },
      } = colonyMetadataHistory;
      const sortedMetdataHistory = sortMetdataHistory(metadataHistory);
      const currentMedataIndex = findLastIndex(
        sortedMetdataHistory,
        ({ transaction: { id: hash } }) => hash === actionData.hash,
      );
      /*
       * We have a previous metadata entry
       */
      if (currentMedataIndex > 0) {
        const prevMetdata = sortedMetdataHistory[currentMedataIndex - 1];
        if (prevMetdata) {
          setMetdataIpfsHash(prevMetdata.metadata);
          if (metadataJSON) {
            /*
             * If we have a metadata json, parse into the expected values and then
             * compare them agains the ones from the current action
             *
             * This should be the default case for a colony with metadata history
             */
            return getSpecificActionValuesCheck(
              eventName as ColonyAndExtensionsEvents,
              actionData,
              parseColonyMetadata(metadataJSON),
            );
          }
        }
      }
      /*
       * We don't have a previous metadata entry, so fall back to the current
       * action's values
       */
      const { colonyDisplayName, colonyAvatarHash, colonyTokens } = actionData;
      return {
        nameChanged: !!colonyDisplayName,
        logoChanged: !!colonyAvatarHash,
        tokensChanged: !!colonyTokens.length,
      };
    }
    /*
     * Default fallback, just use the current colony's values
     */
    const {
      displayName: colonyDisplayName,
      avatarHash,
      tokenAddresses,
    } = colony;
    return {
      nameChanged: !!colonyDisplayName,
      logoChanged: !!avatarHash,
      tokensChanged: !!tokenAddresses?.length,
    };
  }, [colonyMetadataHistory, actionData, metadataJSON, eventName, colony]);
  const roleNameMessage = {
    id: `role.${
      values?.roles && values?.roles[eventIndex]
        ? values?.roles[eventIndex].id
        : 'unknown'
    }`,
  };
  const { formatMessage } = useIntl();
  const formattedRole = formatMessage(roleNameMessage).toLowerCase();

  const getDomainMetadataChecks = useMemo(() => {
    if (
      eventName === ColonyAndExtensionsEvents.DomainMetadata &&
      !!domainMetadataHistory?.data?.domains?.length &&
      !!actionData
    ) {
      const domain = domainMetadataHistory?.data?.domains[0];
      const sortedMetdataHistory = sortMetdataHistory(domain?.metadataHistory);
      const currentMedataIndex = findLastIndex(
        sortedMetdataHistory,
        ({ transaction: { id: hash } }) => hash === actionData.hash,
      );
      /*
       * We have a previous metadata entry
       */
      if (currentMedataIndex > 0) {
        const prevMetdata = sortedMetdataHistory[currentMedataIndex - 1];
        if (prevMetdata) {
          setMetdataIpfsHash(prevMetdata.metadata);
          if (metadataJSON) {
            const previousParsedMetadata = parseDomainMetadata(metadataJSON);
            setPreviousDomainMetadata(previousParsedMetadata);
            return getSpecificActionValuesCheck(
              eventName as ColonyAndExtensionsEvents,
              actionData,
              previousParsedMetadata,
            );
          }
        }
      }
    }
    const { domainColor, domainName, domainPurpose } = actionData;
    return {
      nameChanged: !!domainName,
      colorChanged: !!domainColor,
      descriptionChanged: !!domainPurpose,
    };
  }, [domainMetadataHistory, actionData, metadataJSON, eventName]);

  const getEventTitleMessageDescriptor = useMemo(() => {
    switch (eventName) {
      case ColonyAndExtensionsEvents.ColonyMetadata:
        return getColonyMetadataMessageDescriptorsIds(
          ColonyAndExtensionsEvents.ColonyMetadata,
          getColonyMetadataChecks,
        );
      case ColonyAndExtensionsEvents.DomainMetadata:
        return getDomainMetadataMessageDescriptorsIds(
          ColonyAndExtensionsEvents.DomainMetadata,
          getDomainMetadataChecks,
        );
      case ColonyAndExtensionsEvents.ColonyRoleSet:
        return getRoleEventDescriptorsIds(
          values?.roles &&
            values?.roles[eventIndex] &&
            values?.roles[eventIndex]?.setTo,
          ColonyAndExtensionsEvents.ColonyRoleSet,
          'event',
        );
      case ColonyAndExtensionsEvents.ArbitraryReputationUpdate:
        return `event.${ColonyAndExtensionsEvents.ArbitraryReputationUpdate}.title`;
      default:
        return 'event.title';
    }
  }, [
    eventName,
    getDomainMetadataChecks,
    getColonyMetadataChecks,
    eventIndex,
    values,
  ]);

  const { domainPurpose, domainName, domainColor } = actionData;

  const colonyNativeToken = tokens.find(
    ({ address }) => address === nativeTokenAddress,
  );
  const decimalStakeAmount = getFormattedTokenValue(
    values?.stakeAmount || 0,
    colonyNativeToken?.decimals,
  );
  return (
    <div className={styles.main}>
      <div className={styles.wrapper}>
        <div className={styles.status}>
          <TransactionStatus status={STATUS.Succeeded} showTooltip={false} />
        </div>
        <div className={styles.content}>
          <div className={styles.text}>
            <FormattedMessage
              id={getEventTitleMessageDescriptor}
              values={{
                ...values,
                fromDomain: values?.fromDomain?.name,
                toDomain: values?.toDomain?.name,
                oldColor: (
                  <ColorTag
                    color={
                      Number(previousDomainMetadata?.domainColor) ||
                      Color.LightPink
                    }
                  />
                ),
                domainColor: (
                  <ColorTag color={Number(domainColor) || Color.LightPink} />
                ),
                // Fallback to current name/description when there is no previous metadata obj
                oldDescription:
                  previousDomainMetadata?.domainPurpose || domainPurpose,
                oldName: previousDomainMetadata?.domainName || domainName,
                domainPurpose,
                domainName,
                eventName,
                /*
                 * Usefull if a event isn't found or doesn't have a message descriptor
                 */
                eventNameDecorated: <b>{eventName}</b>,
                role: formattedRole,
                clientOrExtensionType: (
                  <span className={styles.highlight}>{emmitedBy}</span>
                ),
                initiator: values?.initiator || (
                  <span className={styles.userDecoration}>
                    <FriendlyName user={initiator} autoShrinkAddress />
                  </span>
                ),
                storageSlot: values?.slot?.toHexString(),
                amountTag: (
                  <div className={styles.amountTag}>
                    <Tag
                      appearance={{
                        theme: 'primary',
                        colorSchema: 'inverted',
                        fontSize: 'tiny',
                        margin: 'none',
                      }}
                    >
                      <Numeral
                        value={decimalStakeAmount}
                        suffix={` ${colonyNativeToken?.symbol}`}
                      />
                    </Tag>
                  </div>
                ),
                staker: (
                  <>
                    <span className={styles.userDecoration}>
                      <FriendlyName user={initiator} autoShrinkAddress />
                    </span>
                    <div className={motionSpecificStyles.reputation}>
                      <MemberReputation
                        walletAddress={values?.staker || values?.voter || ''}
                        colonyAddress={colony.colonyAddress}
                        rootHash={rootHash}
                      />
                    </div>
                  </>
                ),
                backedSideTag:
                  values?.vote === MotionVote.Yay
                    ? values?.motionTag
                    : values?.objectionTag,
                voteSide: (
                  <FormattedMessage
                    {...(values?.vote === MotionVote.Yay
                      ? MSG.voteYes
                      : MSG.voteNo)}
                  />
                ),
                isSmiteAction: values?.isSmiteAction,
              }}
            />
          </div>
          <div className={styles.details}>
            <div className={styles.roles}>
              {eventName &&
                EVENT_ROLES_MAP[eventName] &&
                EVENT_ROLES_MAP[eventName].map((role, index) => {
                  if (
                    (!values?.isSmiteAction && role === ColonyRole.Root) ||
                    (values?.isSmiteAction && role !== ColonyRole.Root)
                  ) {
                    return (
                      <PermissionsLabel
                        key={autogeneratedIds[eventName][index]}
                        appearance={{ theme: 'simple' }}
                        permission={role}
                        minimal
                        infoMessage={MSG.rolesTooltip}
                        infoMessageValues={{
                          role,
                          icon: (
                            <div className={styles.tooltipIcon}>
                              <PermissionsLabel
                                permission={role}
                                appearance={{ theme: 'white' }}
                              />
                            </div>
                          ),
                        }}
                      />
                    );
                  }

                  return null;
                })}
            </div>
            {transactionHash && (
              <div className={styles.meta}>
                <TransactionMeta
                  transactionHash={transactionHash}
                  createdAt={createdAt}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      {children && <div>{children}</div>}
    </div>
  );
};

ActionsPageEvent.displayName = displayName;

export default ActionsPageEvent;
