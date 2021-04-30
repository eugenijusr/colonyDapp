import React, { useState } from 'react';
import { ColonyRole } from '@colony/colony-js';
import { FormikProps } from 'formik';
import { FormattedMessage, defineMessages } from 'react-intl';

import Button from '~core/Button';
import ColorSelect from '~core/ColorSelect';
import { Color } from '~core/ColorTag';
import { ActionDialogProps } from '~core/Dialog';
import DialogSection from '~core/Dialog/DialogSection';
import { Input, Annotations } from '~core/Fields';
import Heading from '~core/Heading';
import PermissionsLabel from '~core/PermissionsLabel';
import PermissionRequiredInfo from '~core/PermissionRequiredInfo';
import Toggle from '~core/Fields/Toggle';
import NotEnoughReputation from '~dashboard/NotEnoughReputation';

import { useLoggedInUser } from '~data/index';
import { useTransformer } from '~utils/hooks';
import { useDialogActionPermissions } from '~utils/hooks/useDialogActionPermissions';

import { getAllUserRoles } from '../../../transformers';
import { canArchitect } from '../../../users/checks';

import { FormValues } from './CreateDomainDialog';
import styles from './CreateDomainDialogForm.css';

const MSG = defineMessages({
  titleCreate: {
    id: 'dashboard.CreateDomainDialog.CreateDomainDialogForm.titleCreate',
    defaultMessage: 'Create a new team',
  },
  name: {
    id: 'dashboard.CreateDomainDialog.CreateDomainDialogForm.name',
    defaultMessage: 'Team name',
  },
  purpose: {
    id: 'dashboard.CreateDomainDialog.CreateDomainDialogForm.name',
    defaultMessage: 'What is the purpose of this team?',
  },
  annotation: {
    id: 'dashboard.CreateDomainDialog.CreateDomainDialogForm.annotation',
    defaultMessage: 'Explain why you’re creating this team',
  },
  noPermission: {
    id:
      // eslint-disable-next-line max-len
      'dashboard.CreateDomainDialog.CreateDomainDialogForm.noPermission',
    defaultMessage:
      // eslint-disable-next-line max-len
      'You need the {roleRequired} permission in {domain} to take this action.',
  },
});

interface Props extends ActionDialogProps {
  isSubmitting;
  isValid;
}

const CreateDomainDialogForm = ({
  back,
  colony,
  handleSubmit,
  isSubmitting,
  isValid,
  isVotingExtensionEnabled,
  values,
}: Props & FormikProps<FormValues>) => {
  const [domainColor, setDomainColor] = useState(Color.LightPink);

  const { walletAddress, username, ethereal } = useLoggedInUser();

  const allUserRoles = useTransformer(getAllUserRoles, [colony, walletAddress]);

  const hasRegisteredProfile = !!username && !ethereal;
  const canCreateDomain = hasRegisteredProfile && canArchitect(allUserRoles);

  const [userHasPermission, onlyForceAction] = useDialogActionPermissions(
    colony.colonyAddress,
    canCreateDomain,
    isVotingExtensionEnabled,
    values.forceAction,
  );

  const inputDisabled = !userHasPermission || onlyForceAction;

  return (
    <>
      <DialogSection appearance={{ theme: 'heading' }}>
        <Heading
          appearance={{ size: 'medium', margin: 'none' }}
          text={MSG.titleCreate}
          className={styles.title}
        />
        {canCreateDomain && isVotingExtensionEnabled && (
          <Toggle label={{ id: 'label.force' }} name="forceAction" />
        )}
      </DialogSection>
      {!userHasPermission && (
        <DialogSection>
          <PermissionRequiredInfo requiredRoles={[ColonyRole.Architecture]} />
        </DialogSection>
      )}
      <DialogSection>
        <div className={styles.nameAndColorContainer}>
          <div className={styles.domainName}>
            <Input
              label={MSG.name}
              name="teamName"
              appearance={{ colorSchema: 'grey', theme: 'fat' }}
              disabled={inputDisabled}
              maxLength={20}
            />
          </div>
          <ColorSelect
            activeOption={domainColor}
            appearance={{ alignOptions: 'right' }}
            onColorChange={setDomainColor}
            disabled={inputDisabled}
            name="domainColor"
          />
        </div>
      </DialogSection>
      <DialogSection>
        <Input
          label={MSG.purpose}
          name="domainPurpose"
          appearance={{ colorSchema: 'grey', theme: 'fat' }}
          disabled={inputDisabled}
          maxLength={90}
        />
      </DialogSection>
      <DialogSection>
        <Annotations
          label={MSG.annotation}
          name="annotationMessage"
          disabled={inputDisabled}
        />
      </DialogSection>
      {!userHasPermission && (
        <DialogSection appearance={{ theme: 'sidePadding' }}>
          <div className={styles.noPermissionFromMessage}>
            <FormattedMessage
              {...MSG.noPermission}
              values={{
                roleRequired: (
                  <PermissionsLabel
                    permission={ColonyRole.Architecture}
                    name={{ id: `role.${ColonyRole.Architecture}` }}
                  />
                ),
                domain: 'Root',
              }}
            />
          </div>
        </DialogSection>
      )}
      {onlyForceAction && <NotEnoughReputation />}
      <DialogSection appearance={{ align: 'right', theme: 'footer' }}>
        {back && (
          <Button
            text={{ id: 'button.back' }}
            onClick={back}
            appearance={{ theme: 'secondary', size: 'large' }}
          />
        )}
        <Button
          text={{ id: 'button.confirm' }}
          appearance={{ theme: 'primary', size: 'large' }}
          onClick={() => handleSubmit()}
          loading={isSubmitting}
          disabled={inputDisabled || !isValid}
        />
      </DialogSection>
    </>
  );
};

export default CreateDomainDialogForm;
