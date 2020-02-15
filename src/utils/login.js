export default {
  check(options) {
    if (localStorage.getItem("user")) {
      return true;
    } else {
      return false;
    }
  },
  logoff() {
    localStorage.removeItem("user");
  }
};
