export const COOKIE_SETTINGS = {
    REFRESH_TOKEN: {
      httpOnly: true,
      maxAge: 6048e5, // 7 * 24 * 3600 * 1000 (7d)
    },
  };
  
  export const ACCESS_TOKEN_EXPIRATION = 18e5; // 1800 * 1000 (30m)
  export const INVITATION_LINK_EXPIRATION = 1000*60*60*24*7; // 7D
  export const REFRESH_TOKEN_EXPIRATION = 1000*60*60*24*15 //15D