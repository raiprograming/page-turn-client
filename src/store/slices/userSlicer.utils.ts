import type { UserInfo } from '../types';

const USER_INFO_KEY = 'userInfo';

/**
 * Reads and parses the persisted userInfo object from localStorage.
 * Returns null if the key is missing or the stored value is invalid JSON.
 */
export const getUserInfoFromStorage = (): UserInfo | null => {
  try {
    const raw = localStorage.getItem(USER_INFO_KEY);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw) as UserInfo;
  } catch {
    return null;
  }
};

/**
 * Removes the persisted userInfo object from localStorage.
 */
export const clearUserInfoFromStorage = (): void => {
  localStorage.removeItem(USER_INFO_KEY);
};
