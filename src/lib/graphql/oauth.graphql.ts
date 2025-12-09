export const OAUTH_LOGIN = `
mutation OAuthLogin($input: OauthLoginInput!) {
    oauthLogin(input: $input) {
        ... on AuthTokens {
            refreshToken
            refreshTokenExpiresAt
        }
        ... on SignupRequired {
            signupToken
            provider
            providerId
        }
    }
}`;