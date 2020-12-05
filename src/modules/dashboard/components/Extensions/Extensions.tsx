import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { extensions } from '@colony/colony-js';

import BreadCrumb from '~core/BreadCrumb';
import Heading from '~core/Heading';
import { useColonyExtensionsQuery } from '~data/index';
import { Address } from '~types/index';
import { SpinnerLoader } from '~core/Preloaders';
import extensionData from '~data/staticData/extensionData';

import styles from './Extensions.css';

import ExtensionCard from './ExtensionCard';

const MSG = defineMessages({
  title: {
    id: 'dashboard.Extensions.title',
    defaultMessage: 'Extensions',
  },
  description: {
    id: 'dashboard.Extensions.description',
    defaultMessage: 'Extend the functionality of your colony with extensions',
  },
  installedExtensions: {
    id: 'dashboard.Extensions.installedExtensions',
    defaultMessage: 'Installed Extensions',
  },
  availableExtensions: {
    id: 'dashboard.Extensions.availableExtensions',
    defaultMessage: 'Available Extensions',
  },
});

interface Props {
  colonyAddress: Address;
}

const Extensions = ({ colonyAddress }: Props) => {
  const { data, loading } = useColonyExtensionsQuery({
    variables: { address: colonyAddress },
  });
  if (loading) {
    return <SpinnerLoader appearance={{ size: 'medium' }} />;
  }
  const installedExtensions = data ? data.colony.installedExtensions : [];

  const installedExtensionsData = installedExtensions.map(
    ({ extensionId, address }) => ({
      ...extensionData[extensionId],
      address,
    }),
  );
  const availableExtensionsData = extensions
    .filter(
      (name: string) =>
        !installedExtensions.find(({ extensionId }) => name === extensionId),
    )
    .map((id: string) => ({
      ...extensionData[id],
    }));
  return (
    <div className={styles.main}>
      <div className={styles.content}>
        <BreadCrumb elements={[MSG.title]} appearance={{ theme: 'dark' }} />
        <p className={styles.description}>
          <FormattedMessage {...MSG.description} />
        </p>
        <hr />
        {installedExtensionsData.length ? (
          <>
            <Heading
              tagName="h3"
              appearance={{ size: 'normal', margin: 'small' }}
              text={MSG.installedExtensions}
            />
            <div className={styles.cards}>
              {installedExtensionsData.map((extension) => (
                <ExtensionCard
                  key={extension.extensionId}
                  extension={extension}
                />
              ))}
            </div>
          </>
        ) : null}
        {availableExtensionsData.length ? (
          <div className={styles.availableExtensionsWrapper}>
            <Heading
              tagName="h3"
              appearance={{ size: 'normal', margin: 'small' }}
              text={MSG.availableExtensions}
            />
            <div className={styles.cards}>
              {availableExtensionsData.map((extension) => (
                <ExtensionCard
                  key={extension.extensionId}
                  extension={extension}
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>
      <div className={styles.sidebar} />
    </div>
  );
};

export default Extensions;
