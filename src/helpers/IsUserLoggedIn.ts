import { store } from '../store/store';

function IsUserLoggedIn() {
  const { userInfo } = store.getState().user;
  return !!userInfo;
}

export default IsUserLoggedIn;