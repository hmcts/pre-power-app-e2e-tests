import path from 'path';
import { fileURLToPath } from 'url';

export interface UserCredentials {
  username: string;
  password: string;
  sessionFile: string;
  cookieName?: string;
}

interface Urls {
  powerAppUrl: string;
}

export interface Config {
  users: {
    preUser: UserCredentials;
  };
  urls: Urls;
}

export const config: Config = {
  users: {
    preUser: {
      username: getEnvVar('USER_EMAIL'),
      password: getEnvVar('USER_PASSWORD'),
      sessionFile: path.join(fileURLToPath(import.meta.url), '../../.sessions/') + `${getEnvVar('USER_EMAIL')}.json`,
    },
  },
  urls: {
    powerAppUrl: getEnvVar('BASE_URL'),
  },
};

export function getEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Error: ${name} environment variable is not set`);
  }
  return value;
}
