/**
 * Shape of the user info persisted in localStorage under the "userInfo" key.
 */
export interface UserInfo {
  userId?: string;
  name: string;
  email: string;
  picture: string;
  mobile?: number | null;
  role?: string;
}

/**
 * Redux state slice for the user feature.
 */
export interface UserState {
  userInfo: UserInfo | null;
}
