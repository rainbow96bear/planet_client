export const UPDATE_TODO_DONE = `
  mutation UpdateTodoDone($id: ID!, $isDone: Boolean!) {
    updateTodoDone(id: $id, isDone: $isDone) {
      id
      isDone
    }
  }
`;