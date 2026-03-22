/**
 * Doctor area gate (static site): requires prior unlock on login-local.html.
 * Password is set in doctor-password.js (loaded only on the login page).
 */
(function () {
  var LOGIN_PAGE = 'login-local.html';
  var STORAGE_KEY = 'chandio_doctor_gate_ok_v1';

  function getPathFileName() {
    try {
      var u = new URL(window.location.href);
      var parts = u.pathname.split('/');
      return parts[parts.length - 1] || '';
    } catch (_) {
      return '';
    }
  }

  function isUnlocked() {
    try {
      return window.localStorage.getItem(STORAGE_KEY) === '1';
    } catch (_) {
      return false;
    }
  }

  function goToLogin() {
    try {
      var u = new URL(window.location.href);
      var loginUrl = new URL(LOGIN_PAGE, u);
      loginUrl.searchParams.set('next', u.pathname + u.search + u.hash);
      window.location.replace(loginUrl.toString());
    } catch (_) {
      window.location.replace(LOGIN_PAGE);
    }
  }

  if (getPathFileName().toLowerCase() === LOGIN_PAGE) return;

  if (isUnlocked()) return;
  goToLogin();
})();
