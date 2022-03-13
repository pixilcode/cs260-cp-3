function getStartOfWeek(date) {
  const startOfWeek = new Date();
  startOfWeek.setDate(date.getDate() - date.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  return startOfWeek;
}

const today = new Date();
const prevWeek = new Date();
const prevPrevWeek = new Date();

prevWeek.setDate(today.getDate() - 7);
prevPrevWeek.setDate(today.getDate() - 14);

export const weekGoals = [
  {
    weekStart: getStartOfWeek(prevPrevWeek),
    goal: 14,
  },
  {
    weekStart: getStartOfWeek(prevWeek),
    goal: 10,
  },
];
export const stories = [
  {
    id: 1,
    title: "Complete module for API calls",
    description: {
      role: "an application developer",
      goal: "a module that I can use to make API calls",
      purpose: "I don't have to worry about the details of making an API call",
    },
    status: "In Progress",
    completionDate: null,
    points: 13,
    tasks: [
      {
        id: 0,
        completed: false,
        title: "Get Person ID",
        completionDate: null,
      },
      {
        id: 1,
        completed: false,
        title: "Get all buildings",
        completionDate: null,
      },
      {
        id: 2,
        completed: true,
        title: "Get vending machine locations",
        completionDate: new Date(),
      },
    ],
  },
  {
    id: 2,
    title: "Set up database",
    description: {
      role: "a database user",
      goal: "a database that has all of the information about our products",
      purpose: "I can retrieve that information for use in my application",
    },
    status: "In Progress",
    completionDate: null,
    points: 8,
    tasks: [
      {
        id: 0,
        completed: false,
        title: "Set up recommendations database",
        completionDate: null,
      },
      {
        id: 1,
        completed: true,
        title: "Write up database schema",
        completionDate: new Date(),
      },
      {
        id: 2,
        completed: false,
        title: "Document database API",
        completionDate: null,
      },
      {
        id: 3,
        completed: false,
        title: "Write club database tests",
        completionDate: null,
      },
    ],
  },
];
