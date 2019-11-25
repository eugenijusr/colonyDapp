import { EventTypes, Versions } from '~data/constants';
import { ROOT_DOMAIN } from '~constants';
import { EventMigrationFunction } from './types';

const addRootDomain: EventMigrationFunction<
  // @todo Improve Event typing in migrations
  // @body I'm just using this event as I have no idea how to define all that are valid
  EventTypes.TASK_CREATED,
  Versions.V2
> = ({ payload, meta, ...event }) => ({
  ...event,
  payload: {
    ...payload,
    domainId: ROOT_DOMAIN,
  },
  meta: {
    ...meta,
    version: Versions.V2,
  },
});

export const V2Migrations: [
  Versions.V2,
  Record<string, EventMigrationFunction<any, Versions.V2>>,
] = [
  Versions.V2,
  {
    [EventTypes.COMMENT_STORE_CREATED]: addRootDomain,
    [EventTypes.DUE_DATE_SET]: addRootDomain,
    [EventTypes.PAYOUT_SET]: addRootDomain,
    [EventTypes.PAYOUT_REMOVED]: addRootDomain,
    [EventTypes.SKILL_SET]: addRootDomain,
    [EventTypes.TASK_CREATED]: addRootDomain,
    [EventTypes.TASK_CANCELLED]: addRootDomain,
    [EventTypes.TASK_CLOSED]: addRootDomain,
    [EventTypes.TASK_DESCRIPTION_SET]: addRootDomain,
    [EventTypes.TASK_FINALIZED]: addRootDomain,
    [EventTypes.TASK_STORE_REGISTERED]: addRootDomain,
    [EventTypes.TASK_TITLE_SET]: addRootDomain,
    [EventTypes.WORK_INVITE_SENT]: addRootDomain,
    [EventTypes.WORKER_ASSIGNED]: addRootDomain,
    [EventTypes.WORKER_UNASSIGNED]: addRootDomain,
  },
];