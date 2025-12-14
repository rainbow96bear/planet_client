export const GET_MY_CALENDAR_EVENTS = `
  query GetMyCalendarEvents($year: Int!, $month: Int!) {
    myCalendarEvents(year: $year, month: $month) {
      id
      title
      emoji
      startAt
      endAt
      visibility
      createdAt
      updatedAt
    }
  }
`;

export const GET_MY_CALENDAR_EVENT = `
  query GetMyCalendarEvent($eventId: ID!) {
    myCalendarEvent(eventId: $eventId) {
      id
      title
      emoji
      description
      startAt
      endAt
      visibility
      todos {
        id
        content
        isDone
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;


export const GET_USER_CALENDAR_EVENTS = `
  query GetUserCalendarEvents(
    $userId: ID!
    $year: Int!
    $month: Int!
  ) {
    userCalendarEvents(
      userId: $userId
      year: $year
      month: $month
    ) {
      id
      title
      emoji
      startAt
      endAt
      visibility
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_CALENDAR_EVENT = `
  mutation CreateCalendarEvent($input: CreateCalendarInput!) {
    createCalendarEvent(input: $input) {
      id
      title
      emoji
      description
      startAt
      endAt
      visibility
      todos {
        id
        content
        isDone
      }
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_CALENDAR_EVENT = `
  mutation DeleteCalendarEvent($eventId: ID!) {
    deleteCalendarEvent(eventId: $eventId)
  }
`;

export const UPDATE_CALENDAR_EVENT = `
  mutation UpdateCalendarEvent(
    $eventId: ID!
    $input: UpdateCalendarInput!
  ) {
    updateCalendarEvent(eventId: $eventId, input: $input) {
      id
      title
      emoji
      description
      startAt
      endAt
      visibility
      todos {
        id
        content
        isDone
      }
      updatedAt
    }
  }
`;

export const GET_MY_CALENDAR_DAILY_EVENT = `
  query MyCalendarEventsByDate($date: Time!) {
    myCalendarEventsByDate(date: $date) {
      id
      title
      emoji
      description
      startAt
      endAt
      visibility
      todos {
        id
        content
        isDone
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;