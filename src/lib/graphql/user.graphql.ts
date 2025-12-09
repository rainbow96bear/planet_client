export const SIGNUP_MUTATION = `
    mutation Signup($input: UserSignupInput!) {
    signup(input: $input) {
        user {
        id
        }
    }
    }
`;