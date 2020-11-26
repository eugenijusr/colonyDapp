export const CONNECT_ROUTE = '/connect';
export const COLONY_HOME_ROUTE = '/colony/:colonyName';
export const COLONY_EVENTS_ROUTE = `${COLONY_HOME_ROUTE}/events`;
export const COLONY_EXTENSIONS_ROUTE = `${COLONY_HOME_ROUTE}/extensions`;
export const PROGRAM_ROUTE = `${COLONY_HOME_ROUTE}/program/:programId`;
export const MEMBERS_ROUTE = `${COLONY_HOME_ROUTE}/members`;
export const MEMBERS_BY_DOMAIN_ROUTE = `${COLONY_HOME_ROUTE}/members/:domainId`;
export const LEVEL_ROUTE = `${PROGRAM_ROUTE}/level/:levelId`;
export const LEVEL_EDIT_ROUTE = `${PROGRAM_ROUTE}/level/:levelId/edit`;
export const TASK_ROUTE = `${COLONY_HOME_ROUTE}/task/:draftId`;
export const CREATE_COLONY_ROUTE = '/create-colony';
export const CREATE_USER_ROUTE = '/create-user';
export const INBOX_ROUTE = '/inbox';
export const USER_EDIT_ROUTE = '/edit-profile';
export const USER_ROUTE = '/user/:username';
export const WALLET_ROUTE = '/wallet';
export const ADMIN_DASHBOARD_ROUTE = `${COLONY_HOME_ROUTE}/admin`;
export const NOT_FOUND_ROUTE = '/404';
export const LANDING_PAGE_ROUTE = '/landing';
