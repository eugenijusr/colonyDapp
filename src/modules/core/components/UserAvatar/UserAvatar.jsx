/* @flow */

import React from 'react';

import getIcon from '../../../../lib/identicon';

import Avatar from '~core/Avatar';
import UserInfo from '~core/UserInfo';

type Props = {
  /** Avatar image URL (can be a base64 encoded string) */
  avatarURL: ?string,
  /** Is passed through to Avatar */
  className?: string,
  /** Avatars that are not set have a different placeholder */
  notSet?: boolean,
  /** Avatar size (default is between `s` and `m`) */
  size?: 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl',
  /*
   * The user's name (aka Display Name)
   */
  displayName?: string,
  /** For the title */
  username: string,
  /** Address of the current user for identicon fallback */
  walletAddress: string,
  /* Whether to show or not show the UserInfo tooltip over the avatar */
  hasUserInfo?: boolean,
};

const UserAvatar = ({
  avatarURL,
  className,
  notSet,
  size,
  displayName,
  username,
  walletAddress,
  hasUserInfo = false,
}: Props) => (
  <UserInfo
    displayName={displayName}
    username={username}
    walletAddress={walletAddress}
    trigger={hasUserInfo ? 'hover' : 'disabled'}
  >
    <Avatar
      avatarURL={avatarURL || (!notSet ? getIcon(walletAddress) : null)}
      className={className}
      notSet={notSet}
      placeholderIcon="circle-person"
      size={size}
      title={!hasUserInfo ? username : ''}
    />
  </UserInfo>
);

UserAvatar.displayName = 'UserAvatar';

export default UserAvatar;
