import React, { useCallback, useEffect, useState, ReactNode } from 'react';
import { defineMessages, MessageDescriptor, useIntl } from 'react-intl';
import { useApolloClient } from '@apollo/client';

import { Input } from '~core/Fields';
import { log } from '~utils/debug';
import { Appearance } from '~core/Fields/Input/Input';
import { usePrevious } from '~utils/hooks';
import { isAddress } from '~utils/web3';
import {
  OneToken,
  TokenDocument,
  TokenQuery,
  TokenQueryVariables,
} from '~data/index';
import { DEFAULT_NETWORK_INFO } from '~constants';

import styles from './TokenSelector.css';

const MSG = defineMessages({
  inputLabel: {
    id: 'dashboard.CreateColonyWizard.TokenSelector.label',
    defaultMessage: 'Token Address',
  },
  hint: {
    id: 'dashboard.CreateColonyWizard.TokenSelector.hint',
    defaultMessage: 'You can find them here: {tokenExplorerLink}',
  },
  preview: {
    id: 'dashboard.CreateColonyWizard.TokenSelector.preview',
    defaultMessage: '{name} ({symbol})',
  },
  statusLoading: {
    id: 'dashboard.CreateColonyWizard.TokenSelector.statusLoading',
    defaultMessage: 'Loading token data...',
  },
  statusNotFound: {
    id: 'dashboard.CreateColonyWizard.TokenSelector.statusNotFound',
    defaultMessage: 'Token data not found. Please type in token details',
  },
});

interface Props {
  tokenAddress: string;
  onTokenSelect: (arg0: OneToken | null | void) => any;
  onTokenSelectError?: (arg: boolean) => any;
  tokenData?: OneToken;
  label?: string | MessageDescriptor;
  appearance?: Appearance;

  /** Extra node to render on the top right in the label */
  extra?: ReactNode;
  disabled?: boolean;
}

const getStatusText = (isLoading: boolean, tokenData?: OneToken) => {
  if (isLoading) {
    return { status: MSG.statusLoading };
  }
  if (tokenData === null) {
    return { status: MSG.statusNotFound };
  }
  return tokenData
    ? { status: MSG.preview, statusValues: tokenData }
    : {
        status: MSG.hint,
        statusValues: {
          tokenExplorerLink: DEFAULT_NETWORK_INFO.tokenExplorerLink,
        },
      };
};

const displayName = 'dashboard.CreateColonyWizard.TokenSelector';

const TokenSelector = ({
  tokenAddress,
  onTokenSelect,
  onTokenSelectError,
  tokenData,
  extra,
  label,
  appearance,
  disabled = false,
}: Props) => {
  const apolloClient = useApolloClient();
  const { formatMessage } = useIntl();
  const getToken = useCallback(async () => {
    const { data } = await apolloClient.query<TokenQuery, TokenQueryVariables>({
      query: TokenDocument,
      variables: { address: tokenAddress },
    });
    return data && data.token;
  }, [apolloClient, tokenAddress]);

  const [isLoading, setLoading] = useState(false);

  const handleGetTokenSuccess = useCallback(
    (token: OneToken) => {
      const { name, symbol } = token;
      setLoading(false);
      if (!name || !symbol) {
        onTokenSelect(null);
        return;
      }
      onTokenSelect(token);
      if (onTokenSelectError) {
        onTokenSelectError(false);
      }
    },
    [onTokenSelect, onTokenSelectError],
  );

  const handleGetTokenError = useCallback(
    (error: Error) => {
      setLoading(false);
      onTokenSelect(null);
      if (onTokenSelectError) {
        onTokenSelectError(true);
      }
      log.error(error);
    },
    [onTokenSelect, onTokenSelectError],
  );

  const prevTokenAddress = usePrevious(tokenAddress);

  useEffect(() => {
    // Guard against updates that don't include a new, valid `tokenAddress`,
    // or if the form is submitting or loading.
    if (tokenAddress === prevTokenAddress || isLoading) return;
    if (!tokenAddress || !tokenAddress.length || !isAddress(tokenAddress)) {
      onTokenSelect();
      return;
    }
    // For a valid address, attempt to load token info.
    // This is setting state during `componentDidUpdate`, which is
    // generally a bad idea, but we are guarding against it by checking the
    // state first.
    setLoading(true);
    onTokenSelect();

    // Get the token address and handle success/error
    getToken()
      .then((token: OneToken) => handleGetTokenSuccess(token))
      .catch((error) => handleGetTokenError(error));
  }, [
    tokenAddress,
    getToken,
    isLoading,
    onTokenSelect,
    prevTokenAddress,
    handleGetTokenSuccess,
    handleGetTokenError,
  ]);

  const labelText =
    label && typeof label === 'object' ? formatMessage(label) : label;

  return (
    /**
     * @todo Define custom input component for token addresses
     */
    <div className={styles.inputWrapper}>
      <Input
        name="tokenAddress"
        label={labelText || MSG.inputLabel}
        extra={extra}
        {...getStatusText(isLoading, tokenData)}
        appearance={appearance}
        disabled={disabled}
      />
    </div>
  );
};

TokenSelector.displayName = displayName;

export default TokenSelector;
