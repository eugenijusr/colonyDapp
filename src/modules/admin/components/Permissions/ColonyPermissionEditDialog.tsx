import { FormikProps } from 'formik';

import React, { useCallback, useMemo, useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import * as yup from 'yup';

import { Address } from '~types/index';

import { mergePayload, withKey, mapPayload, pipe } from '~utils/actions';

import { DomainType, UserType } from '~immutable/index';
import { ActionTypeString, ActionTypes } from '~redux/index';
import {
  useSelector,
  useDataMapFetcher,
  useUserDomainRoles,
} from '~utils/hooks';

import { usersByAddressFetcher } from '../../../users/fetchers';

import SingleUserPicker from '~core/SingleUserPicker';
import Heading from '~core/Heading';
import Button from '~core/Button';
import Dialog, { DialogSection } from '~core/Dialog';
import { ActionForm, InputLabel, Checkbox } from '~core/Fields';

import { allUsersAddressesSelector } from '../../../users/selectors';

import styles from './ColonyPermissionEditDialog.css';

const MSG = defineMessages({
  title: {
    id: 'core.ColonyPermissionEditDialog.title',
    defaultMessage: 'Add New Role in {domain}',
  },
  selectUser: {
    id: 'core.ColonyPermissionEditDialog.selectUser',
    defaultMessage: 'Select Member',
  },
  permissionsLabel: {
    id: 'core.ColonyPermissionEditDialog.permissionsLabel',
    defaultMessage: 'Permissions',
  },
  roleDescription0: {
    id: 'core.ColonyPermissionEditDialog.roleDescription0',
    defaultMessage:
      'The highest permission, control all aspects of running a colony.',
  },
  roleDescription1: {
    id: 'core.ColonyPermissionEditDialog.roleDescription1',
    defaultMessage: 'Create and manage new tasks.',
  },
  roleDescription2: {
    id: 'core.ColonyPermissionEditDialog.roleDescription2',
    defaultMessage: 'Set the administration, funding, and architecture roles.',
  },
  roleDescription3: {
    id: 'core.ColonyPermissionEditDialog.roleDescription3',
    defaultMessage: 'Fund tasks and transfer funds between domains.',
  },
  roleDescription4: {
    id: 'core.ColonyPermissionEditDialog.roleDescription4',
    defaultMessage: 'Coming soon...',
  },
  search: {
    id: 'core.ColonyPermissionEditDialog.search',
    defaultMessage: 'Search for a user or paste a wallet address',
  },
  buttonCancel: {
    id: 'core.ColonyPermissionEditDialog.buttonCancel',
    defaultMessage: 'Cancel',
  },
  buttonConfirm: {
    id: 'core.ColonyPermissionEditDialog.buttonConfirm',
    defaultMessage: 'Confirm',
  },
});

interface Props {
  cancel: () => void;
  close: () => void;
  domain: DomainType;
  /*   selectedUser?: UserType; */
  colonyAddress: Address;
  submit: ActionTypeString;
  success: ActionTypeString;
  error: ActionTypeString;
}

const supFilter = (data, filterValue) => {
  if (!filterValue) {
    return data;
  }

  const filtered = data.filter(
    user =>
      user &&
      filterValue &&
      (user.profile.username
        .toLowerCase()
        .includes(filterValue.toLowerCase()) ||
        user.profile.walletAddress
          .toLowerCase()
          .includes(filterValue.toLowerCase())),
  );

  const customValue = {
    id: 'filterValue',
    profile: {
      walletAddress: filterValue,
      displayName: filterValue,
    },
  };

  return [customValue].concat(filtered);
};

const validationSchema = yup.object({
  user: yup.object().required(),
  domainId: yup.number(),
  colonyAddress: yup.string().required(),
  roles: yup.array().of(yup.string().required()),
});

const ColonyPermissionEditDialog = ({
  domain,
  /* selectedUser, */
  colonyAddress,
  cancel,
  close,
}: Props) => {
  // Prepare userData for SingleUserPicker
  const userAddressesInStore = useSelector(allUsersAddressesSelector);

  const userData = useDataMapFetcher<UserType>(
    usersByAddressFetcher,
    Array.from(userAddressesInStore),
  );

  const users = useMemo(
    () =>
      userData
        .filter(({ data }) => !!data)
        .map(({ data, key }) => ({
          id: key,
          ...data,
        })),
    [userData],
  );

  const availableRoles = [
    'Root',
    'Administration',
    'Architecture',
    'Funding',
    'Arbitration',
  ];

  /* Currently arbitration should appear in the list of roles
    but can not be set yet
   */
  const checkIfCanBeSet = role => {
    if (role === 'Arbitration' || role === 'Root') {
      return false;
    }
    return true;
  };

  const transform = useCallback(
    pipe(
      withKey(colonyAddress),
      mapPayload(p => ({
        userAddress: p.user.profile.walletAddress,
        domainId: p.domainId,
        roles: p.roles.reduce((accumulator, role) => {
          if (checkIfCanBeSet(role)) {
            accumulator[role.toUpperCase()] = true;
            return accumulator;
          }
          return accumulator;
        }, {}),
      })),
      mergePayload({ colonyAddress }),
    ),
    [colonyAddress],
  );

  // When updating the selected user fetch that user's Roles
  const [currentUser, setCurrentUser] = useState(null);

  const updateCurrentUser = useCallback(({ profile: { walletAddress } }) => {
    setCurrentUser(walletAddress);
  }, []);

  // Get current user roles to populate the checkboxes
  const useCurrentUserForRoles = (): Array<string> => {
    const { data } = useUserDomainRoles(
      colonyAddress,
      domain.id,
      // selectedUser ||
      currentUser,
    );
    if (data && Object.keys(data).length !== 0) {
      return Object.keys(data).reduce((accumulator, role) => {
        if (data[role]) {
          // Role is capitalised in the ddb and needs to be readable
          const roleLow = role.toLowerCase();
          const readableRole =
            roleLow.charAt(0).toUpperCase() + roleLow.slice(1);
          accumulator.push(readableRole);
          return accumulator;
        }
        return accumulator;
      }, []);
    }
    return [];
  };
  const selectedRoles = useCurrentUserForRoles();

  return (
    <Dialog cancel={cancel}>
      <ActionForm
        initialValues={{
          domainId: domain.id,
          colonyAddress,
          roles: selectedRoles,
          userAddress: null,
        }}
        onSuccess={close}
        submit={ActionTypes.COLONY_DOMAIN_USER_ROLES_SET}
        error={ActionTypes.COLONY_DOMAIN_USER_ROLES_SET_ERROR}
        success={ActionTypes.COLONY_DOMAIN_USER_ROLES_SET_SUCCESS}
        transform={transform}
        validationSchema={validationSchema}
      >
        {({ isSubmitting, isValid }: FormikProps<any>) => {
          return (
            <div className={styles.dialogContainer}>
              <Heading
                appearance={{ size: 'medium', margin: 'none' }}
                text={MSG.title}
                textValues={{ domain: domain.name }}
              />
              <div className={styles.titleContainer}>
                <InputLabel label={MSG.selectUser} />
                <SingleUserPicker
                  appearance={{ width: 'wide' }}
                  data={users}
                  isResettable
                  name="user"
                  placeholder={MSG.search}
                  filter={supFilter}
                  onSelected={user => updateCurrentUser(user)}
                />
              </div>
              <InputLabel label={MSG.permissionsLabel} />
              {availableRoles.map((role, id) => (
                <div key={role} className={styles.permissionChoiceContainer}>
                  <Checkbox
                    className={styles.permissionChoice}
                    value={role}
                    name="roles"
                    disabled={role === 'Arbitration' || role === 'Root'}
                  >
                    <span className={styles.permissionChoiceDescription}>
                      <Heading
                        text={role}
                        appearance={{ size: 'small', margin: 'none' }}
                      />
                      <FormattedMessage {...MSG[`roleDescription${id}`]} />
                    </span>
                  </Checkbox>
                </div>
              ))}
              <DialogSection appearance={{ align: 'right' }}>
                <Button
                  appearance={{ theme: 'secondary', size: 'large' }}
                  onClick={cancel}
                  text={MSG.buttonCancel}
                />
                <Button
                  appearance={{ theme: 'primary', size: 'large' }}
                  loading={isSubmitting}
                  text={MSG.buttonConfirm}
                  disabled={!isValid}
                  type="submit"
                />
              </DialogSection>
            </div>
          );
        }}
      </ActionForm>
    </Dialog>
  );
};

ColonyPermissionEditDialog.displayName = 'core.ColonyPermissionEditDialog';

export default ColonyPermissionEditDialog;