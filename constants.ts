
// DECLARED IN SECONDS FOR USING IN JWT
export const ACCESS_TOKEN_EXPIRATION = 30*60; // (30m)
export const INVITATION_LINK_EXPIRATION = 60*60*24*7; // 7D
export const REFRESH_TOKEN_EXPIRATION = 60*60*24*15 //15D



export const COOKIE_SETTINGS = {
    REFRESH_TOKEN: {
      httpOnly: true,
      maxAge: REFRESH_TOKEN_EXPIRATION * 1000, //DECLARED IN MILLISECONDS (15d)
    },
  };
  
  //In seconds
  