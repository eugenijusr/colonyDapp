/* @flow */

import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { Tab, Tabs, TabList, TabPanel } from '~core/Tabs';
import { Select } from '~core/Fields';

import styles from './Dashboard.css';

import TabMyTasks from './TabMyTasks.jsx';

const MSG = defineMessages({
  tabMyTasks: {
    id: 'dashboard.Dashboard.tabMyTasks',
    defaultMessage: 'My Tasks',
  },
  tabMyColonies: {
    id: 'dashboard.Dashboard.tabMyColonies',
    defaultMessage: 'My Colonies (coming soon)',
  },
  labelFilter: {
    id: 'dashboard.Dashboard.labelFilter',
    defaultMessage: 'Filter',
  },
  placeholderFilter: {
    id: 'dashboard.Dashboard.placeholderFilter',
    defaultMessage: 'Filter',
  },
});

const displayName = 'dashboard.Dashboard';

const Dashboard = () => {
  const filterOptions = [
    { label: 'Option 1', value: 1 },
    { label: 'Option 2', value: 2 },
    { label: 'Option three', value: 'three' },
  ];
  const filterSelect = (
    <Select
      appearance={{ alignOptions: 'left', theme: 'alt' }}
      connect={false}
      elementOnly
      label={MSG.labelFilter}
      name="filter"
      options={filterOptions}
      placeholder={MSG.placeholderFilter}
    />
  );
  return (
    <div className={styles.layoutMain}>
      <main className={styles.content}>
        <Tabs>
          <TabList extra={filterSelect}>
            <Tab>
              <FormattedMessage {...MSG.tabMyTasks} />
            </Tab>
            <Tab disabled>
              <FormattedMessage {...MSG.tabMyColonies} />
            </Tab>
          </TabList>
          <TabPanel>
            <TabMyTasks tasks={[]} />
          </TabPanel>
          <TabPanel>
            <h2>This should not be visible</h2>
          </TabPanel>
        </Tabs>
      </main>
    </div>
  );
};

Dashboard.displayName = displayName;

export default Dashboard;
