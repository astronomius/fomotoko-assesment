import { RequestCookies } from 'next/dist/compiled/@edge-runtime/cookies';

export function isAuthenticated(cookies: RequestCookies) {
  // Try to get token from cookies
  const token = cookies.get('auth_token');
  return !!token?.value;
}

export function getUserRole(cookies: RequestCookies) {
  const role = cookies.get('user_role');
  return role?.value || null;
}

export function setAuthCookies(token: string, role: string) {
  if (typeof window !== 'undefined') {
    document.cookie = `auth_token=${token}; path=/; max-age=86400`;
    document.cookie = `user_role=${role}; path=/; max-age=86400`;
  }
}

export function logout() {
  if (typeof window !== 'undefined') {
    document.cookie = `auth_token=; path=/; max-age=0`;
    document.cookie = `user_role=; path=/; max-age=0`;
    window.location.href = '/authentication/login';
  }
}
