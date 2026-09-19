import type {
  Account,
  AuthSession,
  PendingRegistration,
  Session,
} from '@/types';

const SESSION_KEY = 'account_opening_draft';
const ACCOUNT_KEY = 'account_opening_account';
const AUTH_KEY = 'account_opening_auth';
const PENDING_KEY = 'account_opening_pending_registration';
const THEME_KEY = 'account_opening_theme';

function readJson<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  const value = localStorage.getItem(key);
  if (!value) return null;

  try {
    return JSON.parse(value) as T;
  } catch {
    localStorage.removeItem(key);
    return null;
  }
}

export function saveSession(session: Session) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function getSession(): Session | null {
  return readJson<Session>(SESSION_KEY);
}

// Important: logout doesnt clear the onboarding draft.
// The user can login later and continue from currentStep.
export function clearAuth() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(AUTH_KEY);
}

export function saveAccount(account: Account) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ACCOUNT_KEY, JSON.stringify(account));
}

export function getAccount(): Account | null {
  return readJson<Account>(ACCOUNT_KEY);
}

export function saveAuth(auth: AuthSession) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
}

export function getAuth(): AuthSession | null {
  return readJson<AuthSession>(AUTH_KEY);
}

export function savePendingRegistration(data: PendingRegistration) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PENDING_KEY, JSON.stringify(data));
}

export function getPendingRegistration(): PendingRegistration | null {
  return readJson<PendingRegistration>(PENDING_KEY);
}

export function clearPendingRegistration() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(PENDING_KEY);
}

export function saveTheme(theme: 'light' | 'dark') {
  if (typeof window === 'undefined') return;
  localStorage.setItem(THEME_KEY, theme);
}

export function getTheme(): 'light' | 'dark' | null {
  if (typeof window === 'undefined') return null;
  const value = localStorage.getItem(THEME_KEY);
  return value === 'dark' || value === 'light' ? value : null;
}
