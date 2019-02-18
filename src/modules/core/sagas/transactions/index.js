/* @flow */

import { takeEvery } from 'redux-saga/effects';

import { ACTIONS } from '~redux';

import {
  refreshMultisigTransaction,
  rejectMultisigTransaction,
  signedMultisigTransaction,
  signMultisigTransaction,
} from './multisigTransaction';
import onTransactionCreated from './onTransactionCreated';
import estimateGasCost from './estimateGasCost';
import onTransactionSent from './onTransactionSent';

export * from './createTransaction';

export default function* transactionsSagas(): any {
  /*
   * 1. TRANSACTION_CREATED
   * When new outgoing transactions are created, we run the corresponding lifecycle method, if it exists
   */
  yield takeEvery(ACTIONS.TRANSACTION_CREATED, onTransactionCreated);
  /*
   * 2. TRANSACTION_ESTIMATE_GAS
   * After a user clicks on a transaction in the gas station, the gas limit and gas price are estimated
   */
  yield takeEvery(ACTIONS.TRANSACTION_ESTIMATE_GAS, estimateGasCost);
  /*
   * 3. TRANSACTION_SEND
   * is responsible for sending transactions which have been created with
   * a specific method, for a specific client.
   */
  yield takeEvery(ACTIONS.TRANSACTION_SEND, onTransactionSent);

  /* Multisig */
  yield takeEvery(
    ACTIONS.MULTISIG_TRANSACTION_CREATED,
    refreshMultisigTransaction,
  );
  yield takeEvery(ACTIONS.MULTISIG_TRANSACTION_SIGN, signMultisigTransaction);
  yield takeEvery(
    ACTIONS.MULTISIG_TRANSACTION_REJECT,
    rejectMultisigTransaction,
  );
  yield takeEvery(
    ACTIONS.MULTISIG_TRANSACTION_SIGNED,
    signedMultisigTransaction,
  );
}
