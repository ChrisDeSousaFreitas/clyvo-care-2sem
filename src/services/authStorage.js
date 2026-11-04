import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'clyvo.backend.jwt';
const USERNAME_KEY = 'clyvo.backend.username';

let unauthorizedHandler = null;

export async function saveSession(token, username) {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
  await SecureStore.setItemAsync(USERNAME_KEY, username);
}

export async function getStoredToken() {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function getStoredUsername() {
  return SecureStore.getItemAsync(USERNAME_KEY);
}

export async function clearSession() {
  await Promise.all([
    SecureStore.deleteItemAsync(TOKEN_KEY),
    SecureStore.deleteItemAsync(USERNAME_KEY),
  ]);
}

export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = handler;
}

export async function handleUnauthorized() {
  await clearSession();
  if (typeof unauthorizedHandler === 'function') {
    unauthorizedHandler();
  }
}
