/* @flow */

import update from 'immutability-helper';

import {
  TRANSACTION_EVENT_DATA_RECEIVED,
  TRANSACTION_EVENT_DATA_ERROR,
  TRANSACTION_RECEIPT_ERROR,
  TRANSACTION_RECEIPT_RECEIVED,
  TRANSACTION_SEND_ERROR,
  TRANSACTION_SENT,
  TRANSACTION_STARTED,
} from '../actionTypes';

type PendingTransaction = {
  sendError?: string,
};

type OutgoingTransaction = {
  eventData?: Object,
  eventDataError?: Error,
  receiptReceived?: boolean,
  receiptError?: Error,
  transactionId: string,
};

type State = {
  pending: {
    [transactionId: string]: PendingTransaction,
  },
  outgoing: {
    [hash: string]: OutgoingTransaction,
  },
};

type Action = {
  type: string,
  payload: Object,
};

const INITIAL_STATE: State = {
  pending: {},
  outgoing: {},
};

const updateOutgoingTransaction = (state: State, hash: string, mod: Object) =>
  update(state, {
    outgoing: {
      [hash]: mod,
    },
  });

const updatePendingTransaction = (
  state: State,
  transactionId: string,
  mod: Object,
) =>
  update(state, {
    pending: {
      [transactionId]: mod,
    },
  });

const transactionsReducer = (
  state: State = INITIAL_STATE,
  { type, payload = {} }: Action = {},
): State => {
  switch (type) {
    case TRANSACTION_STARTED: {
      const { actionType, transactionId, options, params } = payload;
      return updatePendingTransaction(state, transactionId, {
        $set: {
          actionType,
          options,
          params,
        },
      });
    }
    case TRANSACTION_SENT: {
      const { transactionId, hash } = payload;
      return update(state, {
        pending: { $unset: [transactionId] },
        outgoing: {
          [hash]: {
            $set: state.pending[transactionId],
          },
        },
      });
    }
    case TRANSACTION_RECEIPT_RECEIVED: {
      const { hash } = payload;
      return updateOutgoingTransaction(state, hash, {
        receiptReceived: { $set: true },
      });
    }
    case TRANSACTION_EVENT_DATA_RECEIVED: {
      const { eventData, hash } = payload;
      return updateOutgoingTransaction(state, hash, {
        eventData: { $set: eventData },
      });
    }
    case TRANSACTION_SEND_ERROR: {
      const { sendError, transactionId } = payload;
      return updatePendingTransaction(state, transactionId, {
        sendError: { $set: sendError },
      });
    }
    case TRANSACTION_RECEIPT_ERROR: {
      const { receiptError, hash } = payload;
      return updateOutgoingTransaction(state, hash, {
        receiptError: { $set: receiptError },
      });
    }
    case TRANSACTION_EVENT_DATA_ERROR: {
      const { eventDataError, hash } = payload;
      return updateOutgoingTransaction(state, hash, {
        eventDataError: { $set: eventDataError },
      });
    }
    default:
      return state;
  }
};

export default transactionsReducer;
