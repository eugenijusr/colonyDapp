/* @flow */

import * as yup from 'yup';

import { DocStore } from '../../../lib/database/stores';
import { colonyMeta } from './meta';

import type { StoreBlueprint } from '~types';

const domainsIndexStoreBlueprint: StoreBlueprint = {
  // TODO: implement
  // $FlowFixMe
  getAccessController() {
    return {
      async canAppend() {
        return true;
      },
      grant() {},
      revoke() {},
      save() {},
      async setup() {
        return true;
      },
    };
  },
  name: 'domainsIndex',
  schema: yup.object({
    meta: colonyMeta,
    doc: {
      name: yup.string(),
      databases: yup.object({
        tasksIndex: yup.string(),
      }),
    },
  }),
  type: DocStore,
};

export default domainsIndexStoreBlueprint;
