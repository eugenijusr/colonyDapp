import { LogDescription, id as topicId, bigNumberify } from 'ethers/utils';
import { ColonyRole } from '@colony/colony-js';

import { SubgraphEvent, SubgraphTransaction, SubgraphBlock } from '~data/index';
import { Address, SortDirection } from '~types/index';

import { createAddress } from '../web3';
import { log } from '../debug';

/*
 * Needed to omit the unused `decode()` function as well as add
 * information related to the transaction and block
 */
export type ExtendedLogDescription = Omit<LogDescription, 'decode'> & {
  timestamp?: number;
  block?: number;
  hash?: string;
  index?: string;
};

/*
 * Needed since the types auto generated by graphql don't account for prop
 * renaming in the queries, so they still expect there old names
 */
export type NormalizedSubgraphEvent = SubgraphEvent & {
  transaction?: SubgraphTransaction & {
    transactionHash?: string;
    block?: SubgraphBlock & {
      number?: string;
    };
  };
};

/*
 * @NOTE Only use internally
 *
 * Specific function to parse known, expected, values
 * This parses values for any known addresses
 */
const addressArgumentParser = (values: {
  user?: string;
  agent?: string;
  creator?: string;
  staker?: string;
  escalator?: string;
  recipient?: string;
}): {
  user?: Address;
  agent?: Address;
  creator?: Address;
  staker?: Address;
  escalator?: Address;
  recipient?: Address;
} => {
  const parsedValues: {
    user?: Address;
    agent?: Address;
    creator?: Address;
    staker?: Address;
    escalator?: Address;
    recipient?: Address;
  } = {};
  ['user', 'agent', 'creator', 'staker', 'escalator', 'recipient'].map(
    (propName) => {
      if (values[propName]) {
        parsedValues[propName] = createAddress(values[propName]);
      }
      return null;
    },
  );
  return parsedValues;
};

/*
 * @NOTE Only use internally
 *
 * Specific function to parse known, expected, values
 * This parses values for the ColonyRoleSet and RecoveryRoleSet events
 */
const roleArgumentParser = (values: {
  domainId?: string;
  role?: string;
  setTo?: string;
}): {
  domainId?: number;
  role?: ColonyRole;
  setTo?: boolean;
} => {
  const parsedValues: {
    domainId?: number;
    role?: ColonyRole;
    setTo?: boolean;
  } = {};
  if (values?.domainId) {
    parsedValues.domainId = parseInt(values.domainId, 10);
  }
  if (values?.role) {
    parsedValues.role = parseInt(values.role, 10);
  }
  if (values?.setTo) {
    parsedValues.setTo = Boolean(values.setTo);
  }
  return parsedValues;
};

/*
 * Utility to parse events that come from the subgraph handler
 * into events that resemble the Log format that we get directly from the chain
 */
export const parseSubgraphEvent = ({
  name,
  args,
  transaction,
  id,
}: NormalizedSubgraphEvent): ExtendedLogDescription => {
  const blockNumber =
    transaction?.block?.number &&
    parseInt(transaction.block.number.replace('block_', ''), 10);
  const parsedArguments = JSON.parse(args);
  let parsedEvent: ExtendedLogDescription = {
    name: name.substring(0, name.indexOf('(')),
    signature: name,
    topic: topicId(name),
    ...(blockNumber && { blockNumber }),
    /*
     * Parse the normal values, and any specialized parsers we might have
     */
    values: {
      ...parsedArguments,
      ...roleArgumentParser(parsedArguments),
      ...addressArgumentParser(parsedArguments),
    },
  };
  /*
   * If we fetched the id in the subgraph query, then we can also construct
   * a unique event id (blockNumber + logIndex) which can be used to sort
   * the events historically.
   *
   * This is needed since multiple events can be emmited inside a since block,
   * meaning we can't just go by block number or timestamp alone
   */
  if (blockNumber && id) {
    /*
     * `lastIndexOf` gets the start of the occurance, and 6 is the length of
     * the keyword occurence
     *
     * Padding with 7 zeros is a bit overkill, but we ensure that can support
     * up to a million events happen inside a block
     */
    const logIndex = id.slice(id.lastIndexOf('event_') + 6).padStart(7, '0');
    parsedEvent.index = `${blockNumber}${logIndex}`;
  }
  /*
   * If we also fetched transaction values, parse them as well
   * Note that we attempt to parse the block number earlier in this function
   */
  if (transaction) {
    const { transactionHash, block } = transaction;
    parsedEvent = {
      ...parsedEvent,
      ...(transactionHash && { hash: transactionHash }),
      ...(block?.timestamp && {
        timestamp: parseInt(block.timestamp, 10) * 1000,
      }),
    };
  }
  return parsedEvent;
};

export const sortSubgraphEventByIndex = (
  firstEvent: ExtendedLogDescription,
  secondEvent: ExtendedLogDescription,
  direction: SortDirection = SortDirection.ASC,
): number => {
  if (!firstEvent?.index || !secondEvent?.index) {
    log.verbose(
      `Subgraph events intended for sorting do not contain an index. Sort function will return untrustworthy positioning`,
      `Event: ${firstEvent?.name},`,
      `Index: ${firstEvent?.index},`,
      `Event: ${secondEvent?.name},`,
      `Index: ${secondEvent?.index},`,
    );
    return 0;
  }
  const firstIndex = bigNumberify(firstEvent.index);
  const secondIndex = bigNumberify(secondEvent.index);
  if (direction === SortDirection.ASC) {
    return firstIndex.sub(secondIndex).toNumber();
  }
  return secondIndex.sub(firstIndex).toNumber();
};
