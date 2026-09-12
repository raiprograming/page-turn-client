import { store } from '../store/store';

function isAdminLoggedIn() {
  const { userInfo } = store.getState().user;
  return userInfo?.role === 'admin';
}

export default isAdminLoggedIn;