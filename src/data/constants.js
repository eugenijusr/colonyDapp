/* @flow */

export const VERSION = Number(process.env.VERSION) || 1;

export const TASK_STATUS = Object.freeze({
  CLOSED: 'CLOSED',
  CANCELLED: 'CANCELLED',
  FINALIZED: 'FINALIZED',
});

export const TASK_EVENT_TYPES = Object.freeze({
  COMMENT_STORE_CREATED: 'COMMENT_STORE_CREATED',
  TASK_CREATED: 'TASK_CREATED',
  TASK_UPDATED: 'TASK_UPDATED',
  DOMAIN_SET: 'DOMAIN_SET',
  DUE_DATE_SET: 'DUE_DATE_SET',
  SKILL_SET: 'SKILL_SET',
  WORK_REQUEST_CREATED: 'WORK_REQUEST_CREATED',
  WORK_INVITE_SENT: 'WORK_INVITE_SENT',
  COMMENT_POSTED: 'COMMENT_POSTED',
  TASK_CANCELLED: 'TASK_CANCELLED',
  TASK_CLOSED: 'TASK_CLOSED',
  TASK_FINALIZED: 'TASK_FINALIZED',
  WORKER_ASSIGNED: 'WORKER_ASSIGNED',
  WORKER_UNASSIGNED: 'WORKER_UNASSIGNED',
  PAYOUT_SET: 'PAYOUT_SET',
});

// @TODO: Add inbox event types
export const USER_EVENT_TYPES = Object.freeze({
  READ_UNTIL: 'READ_UNTIL',
});

export const COLONY_EVENT_TYPES = Object.freeze({
  AVATAR_UPLOADED: 'AVATAR_UPLOADED',
  AVATAR_REMOVED: 'AVATAR_REMOVED',
  DOMAIN_CREATED: 'DOMAIN_CREATED',
  PROFILE_CREATED: 'PROFILE_CREATED',
  PROFILE_UPDATED: 'PROFILE_UPDATED',
  TASK_STORE_REGISTERED: 'TASK_STORE_REGISTERED',
  TASK_STORE_UNREGISTERED: 'TASK_STORE_UNREGISTERED',
  TOKEN_INFO_ADDED: 'TOKEN_INFO_ADDED',
});
