/* @flow */

import { Map as ImmutableMap } from 'immutable';
import { combineReducers } from 'redux-immutable';

import type { ReducerType } from '~redux';
import type { AllTokensMap } from '~immutable';

import { TokenRecord } from '~immutable';
import { ACTIONS } from '~redux';
import { ZERO_ADDRESS } from '~utils/web3/constants';

import { DASHBOARD_TOKENS } from '../constants';

const INITIAL_STATE = ImmutableMap([
  [
    ZERO_ADDRESS,
    TokenRecord({ address: ZERO_ADDRESS, symbol: 'ETH', name: 'Ether' }),
  ],
]);

const tokensReducer: ReducerType<
  AllTokensMap,
  {|
    TOKEN_INFO_FETCH_SUCCESS: *,
  |},
> = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ACTIONS.TOKEN_INFO_FETCH_SUCCESS: {
      const { name, symbol, tokenAddress } = action.payload;
      const newInfo = {
        address: tokenAddress,
        name,
        symbol,
      };
      const existingRecord = state.get(tokenAddress);
      const record = existingRecord
        ? existingRecord.merge(newInfo)
        : TokenRecord(newInfo);
      return state.set(tokenAddress, record);
    }
    default:
      return state;
  }
};

export default combineReducers({
  [DASHBOARD_TOKENS]: tokensReducer,
});
