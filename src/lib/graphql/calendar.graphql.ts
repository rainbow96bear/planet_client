// src/lib/graphql/calendar.ts

export const GET_CALENDAR_EVENTS = `
  query GetCalendarEvents(
    $userId: ID!
    $year: Int
    $month: Int
    $date: Time
    $filter: CalendarEventFilter
  ) {
    calendarEvents(
      userId: $userId
      year: $year
      month: $month
      date: $date
      filter: $filter
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

export const GET_CALENDAR_EVENT = `
  query GetCalendarEvent($eventId: ID!) {
    calendarEvent(eventId: $eventId) {
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

export const CREATE_CALENDAR_EVENT = `
  mutation CreateCalendarEvent($input: CreateCalendarInput!) {
    createCalendarEvent(input: $input) {
      id
      title
      startAt
      endAt
      visibility
    }
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
      startAt
      endAt
      visibility
      updatedAt
    }
  }
`;

export const DELETE_CALENDAR_EVENT = `
  mutation DeleteCalendarEvent($eventId: ID!) {
    deleteCalendarEvent(eventId: $eventId)
  }
`;
