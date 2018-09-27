/* @flow */
import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import camelcase from 'camelcase';

import { TableRow, TableCell } from '~core/Table';
import Link from '~core/Link';
import Time from '~core/Time';
import UserMention from '~core/UserMention';

import type { Activity, ActivityAction } from './types';

import styles from './ActivityFeedItem.css';

const MSG = defineMessages({
  actionAddedSkillTag: {
    id: 'ActivityFeedItem.actionAddedSkillTag',
    defaultMessage: 'Added skill tag to {task}',
  },
  actionAssignedUser: {
    id: 'ActivityFeedItem.actionAssignedUser',
    defaultMessage: 'Assigned {user} to {task}',
  },
  actionCommentedOn: {
    id: 'ActivityFeedItem.actionCommentedOn',
    defaultMessage: 'Commented on {task}',
  },
  activityMeta: {
    id: 'ActivityFeedItem.activityMeta',
    defaultMessage: '{organizationName} in {domain}',
  },
});

type Props = {
  activity: Activity,
};

const getEventActionKey = (actionType: ActivityAction) =>
  camelcase(`action-${actionType}`);

const ActivityFeedItem = ({
  activity: {
    actionType,
    user,
    task,
    organization,
    domainTag,
    date: activityDate,
  },
}: Props) => (
  <TableRow>
    <TableCell className={styles.activityFeedItemCell}>
      <div className={styles.placeholderItem}>
        <p>
          <FormattedMessage
            {...MSG[getEventActionKey(actionType)]}
            values={{
              user: user ? <UserMention ensName={user} /> : null,
              task: (
                <b>
                  <Link to="/">{task}</Link>
                </b>
              ),
            }}
          />
        </p>
        <p>
          <b>
            <FormattedMessage
              {...MSG.activityMeta}
              values={{
                organizationName: organization,
                // TODO: make this domain (I think that's what this is...?) a core component, like `UserMention`
                domain: <Link to="/">#{domainTag}</Link>,
              }}
            />
          </b>{' '}
          |{' '}
          <small>
            <Time value={activityDate} />
          </small>
        </p>
        <div className={styles.placeholderCoverUp} />
      </div>
    </TableCell>
  </TableRow>
);

export default ActivityFeedItem;
