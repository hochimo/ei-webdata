import typeorm from 'typeorm';

const Follow = new typeorm.EntitySchema({
  name: 'Follow',
  tableName: 'follow',
  columns: {
    id: {
      primary: true,
      type: Number,
      generated: true,
    },
    followerId: {
      type: Number,
    },
    followedId: {
      type: Number,
    },
  },
  uniques: [
    {
      name: 'UQ_follow_follower_followed',
      columns: ['followerId', 'followedId'],
    },
  ],
});

export default Follow;
