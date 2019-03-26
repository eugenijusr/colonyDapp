/* @flow */

import {
  currentUserColonyPermissionsSelector,
  userAvatarByAddressSelector,
  userByUsernameSelector,
  userSelector,
} from './selectors';
import {
  userPermissionsFetch,
  userFetch,
  userByUsernameFetch,
  userAvatarFetch,
} from './actionCreators';

export const currentUserColonyPermissionsFetcher = Object.freeze({
  fetch: userPermissionsFetch,
  select: currentUserColonyPermissionsSelector,
  ttl: 60 * 1000,
});

export const userFetcher = Object.freeze({
  fetch: userFetch,
  select: userSelector,
  ttl: 60 * 1000,
});

export const userByUsernameFetcher = Object.freeze({
  fetch: userByUsernameFetch,
  select: userByUsernameSelector,
  ttl: 60 * 1000,
});

export const userAvatarByAddressFetcher = Object.freeze({
  fetch: userAvatarFetch,
  select: userAvatarByAddressSelector,
  ttl: 30 * 60 * 1000,
});
