/* @flow */

const mockInbox = [
  {
    id: 1,
    action: 'actionAddedSkillTag',
    task: 'Develop Github integration',
    domain: '#Development',
    colonyName: 'Zirtual',
    createdAt: new Date(2018, 8, 20),
    user: {
      walletAddress: '0xdeadbeef',
      username: 'Brad Pitt',
    },
  },
  {
    id: 2,
    action: 'actionAssignedUser',
    task: 'Write docs for JS library',
    domain: '#Development',
    colonyName: 'UNDP',
    createdAt: new Date(2018, 8, 19),
    user: {
      walletAddress: '0xbeefdead',
      username: 'Ragnar Lothbrok',
    },
  },
  {
    id: 3,
    action: 'actionCommentedOn',
    task: 'Design Landing Page',
    domain: '#Design',
    colonyName: 'GitCoin',
    createdAt: new Date(2018, 8, 18),
    user: {
      walletAddress: '0xbeefdwad',
      username: 'Cornelia Bodenbaum',
    },
  },
  {
    id: 4,
    action: 'actionAddedSkillTag',
    task: 'Provide user research',
    domain: '#UX',
    colonyName: 'UPort',
    createdAt: new Date(2018, 8, 16),
    user: {
      walletAddress: '0xbeefdeid',
      username: 'Stefan Zweig',
    },
  },
  {
    id: 5,
    action: 'actionCommentedOn',
    task: 'Write financial report',
    domain: '#Finance',
    colonyName: 'UPort',
    createdAt: new Date(2018, 8, 15),
    user: {
      walletAddress: '0xbeefdeid',
      username: 'Carlos Martinez',
    },
  },
  {
    id: 6,
    action: 'actionAssignedUser',
    task: 'Prepare presentation',
    domain: '#Social Science',
    colonyName: 'OECD',
    createdAt: new Date(2018, 8, 14),
    user: {
      walletAddress: '0xbeefdeid',
      username: 'Ludwig Kartoffelstampfer',
    },
  },
  {
    id: 7,
    action: 'actionAddedSkillTag',
    task: 'Provide Feedback to students',
    domain: '#Math',
    colonyName: 'Cornelsen',
    createdAt: new Date(2018, 8, 13),
    user: {
      walletAddress: '0xbeefdeid',
      username: 'Axel Mäusezahn',
    },
  },
];

export default mockInbox;
