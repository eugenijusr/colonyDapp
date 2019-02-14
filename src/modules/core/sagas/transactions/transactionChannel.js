/* @flow */

import type { ContractResponse } from '@colony/colony-js-client';

import { END, eventChannel } from 'redux-saga';

import type {
  TransactionRecordType,
  TransactionParams,
  TransactionEventData,
} from '~immutable';

import {
  transactionEventDataReceived,
  transactionReceiptReceived,
  transactionSent,
} from '../../actionCreators';

const channelSendTransaction = async ({ id, params }, txPromise, emit) => {
  try {
    const result = await txPromise;
    const { hash } = result.meta.transaction;
    emit(transactionSent(id, { hash, params }));
    return result;
  } catch (error) {
    emit(error);
  }
  return null;
};

const channelGetTransactionReceipt = async ({ id, params }, sentTx, emit) => {
  const {
    meta: { receiptPromise },
  } = sentTx;
  if (receiptPromise) {
    try {
      const receipt = await receiptPromise;
      emit(transactionReceiptReceived(id, { receipt, params }));
      return receipt;
    } catch (error) {
      emit(error);
    }
  } else {
    emit(new Error('No receipt promise found'));
  }
  return null;
};

const channelGetEventData = async ({ id, params }, sentTx, emit) => {
  const { eventDataPromise } = sentTx;
  if (eventDataPromise) {
    try {
      const eventData = await eventDataPromise;
      emit(transactionEventDataReceived(id, { eventData, params }));
    } catch (error) {
      emit(error);
    }
  } else {
    emit(new Error('No event promise found'));
  }
};

const channelStart = async (tx, txPromise, emit) => {
  const sentTx = await channelSendTransaction(tx, txPromise, emit);
  if (!sentTx) return emit(END);

  const receipt = await channelGetTransactionReceipt(tx, sentTx, emit);
  if (!receipt) return emit(END);

  if (receipt.status === 1) {
    await channelGetEventData(tx, sentTx, emit);
  } else {
    // If the receipt was received but the tx wasn't successful,
    // emit an error event and stop the channel.
    // TODO use revert reason strings (once supported)
    emit(new Error('The transaction was unsuccessful'));
  }
  return emit(END);
};

/*
 * Given a promise for sending a transaction, send the transaction and
 * emit actions with the transaction status.
 */
const transactionChannel = <P: TransactionParams, E: TransactionEventData>(
  txPromise: Promise<ContractResponse<E>>,
  tx: TransactionRecordType<P, E>,
) =>
  eventChannel(emit => {
    channelStart(tx, txPromise, emit);
    return () => {};
  });

export default transactionChannel;
