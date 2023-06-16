function saveCurrentUrlToSessionStorage() {
  const exludedUrls = ['/auth/login', '/auth/signup', '/auth/verify-request'];
  const currentRoute = window.location.pathname;

  if (!exludedUrls.includes(currentRoute)) {
    const sessionStorage = window.sessionStorage;
    sessionStorage.setItem('prevUrl', currentRoute);
  }
}

export default saveCurrentUrlToSessionStorage;
