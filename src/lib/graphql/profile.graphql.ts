export const GET_PROFILE = `
  query GetProfile {
    myProfile {
      id
      nickname
      bio
      profileImage
      theme
      followerCount
      followingCount
    }
  }
`;

export const UPDATE_PROFILE = `
  mutation UpdateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
      id
      nickname
      bio
      profileImage
      theme
      followerCount
      followingCount
    }
  }
`;

export const UPDATE_PROFILE_THEME = `
  mutation UpdateTheme($input: UpdateProfileInput!) {
    updateMyProfile(input: $input) {
      id
      userID
      nickname
      bio
      profileImage
      theme
      followerCount
      followingCount
    }
  }
`;
