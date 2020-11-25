import React, { useCallback } from 'react';
import { FormikProps, FormikHelpers } from 'formik';
import { defineMessages, useIntl, FormattedMessage } from 'react-intl';
import * as yup from 'yup';

import Button from '~core/Button';
import Dialog, { DialogSection } from '~core/Dialog';
import { Form, Input, Textarea } from '~core/Fields';
import Heading from '~core/Heading';
import { AnyToken } from '~data/index';
import { Address } from '~types/index';
import { createAddress } from '~utils/web3';
import Paragraph from '~core/Paragraph';

import TokenItem from './TokenItem/index';

import styles from './TokenEditDialog.css';

const MSG = defineMessages({
  title: {
    id: 'core.TokenEditDialog.title',
    defaultMessage: 'Manage tokens',
  },
  errorAddingToken: {
    id: 'core.TokenEditDialog.errorAddingToken',
    defaultMessage: `Sorry, there was an error adding this token. Learn more about tokens at: https://colony.io.`,
  },
  fieldLabel: {
    id: 'core.TokenEditDialog.fieldLabel',
    defaultMessage: 'Contract address',
  },
  textareaLabel: {
    id: 'core.TokenEditDialog.textareaLabel',
    defaultMessage: 'Explain why you’re making these changes (optional)',
  },
  buttonCancel: {
    id: 'core.TokenEditDialog.buttonCancel',
    defaultMessage: 'Cancel',
  },
  buttonConfirm: {
    id: 'core.TokenEditDialog.buttonConfirm',
    defaultMessage: 'Confirm',
  },
  noTokensText: {
    id: 'core.TokenEditDialog.noTokensText',
    defaultMessage: `It looks no tokens have been added yet. Get started using the form above.`,
  },
  notListedToken: {
    id: 'core.TokenEditDialog.notListedToken',
    defaultMessage: `If token is not listed above, please add any ERC20 compatibile token contract address below.`
  }
});

interface Props {
  addTokenFn: (address: Address) => Promise<any>;
  cancel: () => void;
  close: () => void;
  nativeTokenAddress?: Address;
  removeTokenFn: (address: Address) => Promise<any>;
  tokens: AnyToken[];
}

interface FormValues {
  tokenAddress: Address;
  description?: string;
}

const validationSchema = yup.object({
  tokenAddress: yup
    .string()
    .address()
    // @todo validate against entering a duplicate address
    .required(),
  description: yup.string().nullable(),
});

const TokenEditDialog = ({
  addTokenFn,
  tokens = [],
  nativeTokenAddress,
  cancel,
  close,
  removeTokenFn,
}: Props) => {
  const { formatMessage } = useIntl();

  const handleSubmit = useCallback(
    async (
      { tokenAddress }: FormValues,
      { resetForm, setSubmitting, setFieldError }: FormikHelpers<FormValues>,
    ) => {
      try {
        await addTokenFn(createAddress(tokenAddress));
        resetForm();
      } catch (e) {
        setFieldError('tokenAddress', formatMessage(MSG.errorAddingToken));
        setSubmitting(false);
      }
    },
    [addTokenFn, formatMessage],
  );
  return (
    <Dialog cancel={cancel}>
      <DialogSection appearance={{ theme: 'heading' }}>
        <Heading
          appearance={{ margin: 'none', size: 'medium', theme: 'dark' }}
          text={MSG.title}
        />
      </DialogSection>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        {tokens.length > 0 ? (
          <div className={styles.tokenChoiceContainer}>
            {tokens.map((token) => (
              <TokenItem
                key={token.address}
                nativeTokenAddress={nativeTokenAddress}
                removeTokenFn={removeTokenFn}
                token={token}
              />
            ))}
          </div>
        ) : (
          <Heading appearance={{ size: 'normal' }} text={MSG.noTokensText} />
        )}
      </DialogSection>
      <Form
        initialValues={{
          tokenAddress: '',
          description: '',
        }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        {({ isSubmitting, isValid, dirty }: FormikProps<FormValues>) => (
          <>
            <DialogSection>
              <Paragraph className={styles.description}>
                <FormattedMessage {...MSG.notListedToken} />
              </Paragraph>
              <Input label={MSG.fieldLabel} name="tokenAddress" appearance={{ colorSchema: "grey" }} />
              <div className={styles.textarea}>
                <Textarea
                  appearance={{
                    colorSchema: 'grey',
                    resizable: 'vertical',
                  }}
                  label={MSG.textareaLabel}
                  name="description"
                  maxLength={4000}
                />
              </div>
            </DialogSection>
            <DialogSection appearance={{ align: 'right' }}>
              <Button
                appearance={{ theme: 'secondary', size: 'large' }}
                text={MSG.buttonCancel}
                onClick={close}
              />
              <Button
                appearance={{ theme: 'primary', size: 'large' }}
                text={MSG.buttonConfirm}
                loading={isSubmitting}
                disabled={!isValid || isSubmitting || !dirty}
                type="submit"
              />
            </DialogSection>
          </>
        )}
      </Form>
    </Dialog>
  );
};

TokenEditDialog.displayName = 'core.TokenEditDialog';

export default TokenEditDialog;
