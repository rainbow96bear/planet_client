export const ISSUE_ACCESS_TOKEN = `
    mutation IssueAccessToken($refreshToken: String!) {
        issueAccessToken(refreshToken: $refreshToken) {
            accessToken
            expiresAt
        }
    }
`;

export const REFRESH_ACCESS_TOKEN = `
    mutation RefreshAccessToken {
        refreshAccessToken {
        accessToken
        expiresAt
        newRefreshToken
        refreshExpiresAt
        }
    }
`;