const AUTH_STORAGE_KEY = "ims_auth";
const AUTH_STORAGE_EVENT = "ims-auth-changed";

function emitAuthChange() {
  window.dispatchEvent(new CustomEvent(AUTH_STORAGE_EVENT));
}

export function getStoredAuth() {
  const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY);

  if (!storedAuth) {
    return {
      token: "",
      user: null
    };
  }

  try {
    const parsedAuth = JSON.parse(storedAuth);

    if (parsedAuth?.token && parsedAuth?.user) {
      return parsedAuth;
    }
  } catch (error) {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }

  return {
    token: "",
    user: null
  };
}

export function setStoredAuth(auth) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
  emitAuthChange();
}

export function clearStoredAuth() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  emitAuthChange();
}

export { AUTH_STORAGE_EVENT };
