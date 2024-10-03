const tasksData = [
  {
    title: 'Running',
    tasks: [
      {
        id: 1,
        name: 'Long run',
        subtasks: [
          {
            id: 101,
            name: 'Warm-up',
            subtasks: [
              { id: 1001, name: 'Dynamic stretches', subtasks: [{ id: 2001, name: 'Arm circles' }] },
              { id: 1002, name: 'Jog for 10 minutes' },
            ],
          },
          { id: 102, name: 'Intervals' },
        ],
      },
      { id: 2, name: 'Intervals' },
    ],
  },
  {
    title: 'Gym',
    tasks: [
      {
        id: 3,
        name: 'Upper body workout',
        subtasks: [
          { id: 105, name: 'Chest press' },
          { id: 106, name: 'Pull-ups' },
        ],
      },
    ],
  },
  {
    title: 'Nutrition',
    tasks: [
      {
        id: 4,
        name: 'Meal prep',
        subtasks: [
          { id: 107, name: 'Prepare breakfast' },
          { id: 108, name: 'Cook dinner' },
        ],
      },
    ],
  },
  {
    title: 'Recovery',
    tasks: [
      {
        id: 5,
        name: 'Stretching',
        subtasks: [
          { id: 109, name: 'Foam rolling' },
          { id: 110, name: 'Yoga' },
        ],
      },
    ],
  },
];

export default tasksData;




