import path from 'path';
import fs from 'fs';

export interface UserCredentials {
  username: string;
  password: string;
  sessionFile: string;
  cookieName?: string;
}

interface UserData {
  userId: string;
  defaultCourtId: string;
  userDataFile: string;
}

interface Urls {
  powerAppUrl: string;
  powerAppApiUrl: string;
}

export interface Config {
  users: {
    preUser: UserCredentials & UserData;
  };
  urls: Urls;
}

export const config: Config = {
  users: {
    preUser: {
      username: getEnvVar('USER_EMAIL'),
      password: getEnvVar('USER_PASSWORD'),
      sessionFile: pathToFile('.sessions/', `${getEnvVar('USER_EMAIL')}.json`),
      userDataFile: pathToFile('.dynamic/', `${getEnvVar('USER_EMAIL')}.json`),
      userId: getUserIdAndDefaultCourtId(pathToFile('.dynamic/', `${getEnvVar('USER_EMAIL')}.json`)).userId,
      defaultCourtId: getUserIdAndDefaultCourtId(pathToFile('.dynamic/', `${getEnvVar('USER_EMAIL')}.json`)).defaultCourtId,
    },
  },
  urls: {
    powerAppUrl: getEnvVar('BASE_URL'),
    powerAppApiUrl: getEnvVar('API_URL'),
  },
};

/**
 * Retrieves an environment variable by name.
 * @param name - The name of the environment variable to retrieve.
 * @returns The value of the environment variable.
 * @throws Will throw an error if the environment variable is not set.
 */
export function getEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Error: ${name} environment variable is not set`);
  }
  return value;
}

/**
 * Reads the user ID and court ID from a JSON file.
 * If the file does not exist, it returns empty strings for both IDs.
 * @param pathToConfig - The path to the configuration file.
 * @returns An object containing userId and courtId.
 */
function getUserIdAndDefaultCourtId(pathToConfig: string): { userId: string; defaultCourtId: string } {
  const dynamicDataPath = pathToConfig;
  if (!fs.existsSync(dynamicDataPath)) {
    // File does not exist yet (e.g., first run before setup)
    return { userId: '', defaultCourtId: '' };
  }
  const dynamicDataRaw = fs.readFileSync(dynamicDataPath, 'utf-8');
  const parsed = JSON.parse(dynamicDataRaw);
  return {
    userId: parsed.userId,
    defaultCourtId: parsed.defaultCourtId,
  };
}

/**
 * Constructs a path to a configuration file based on the expected path and the name of the file.
 * @param expectedPath - The relative path within the playwright-e2e folder.
 * @param nameOfFile - The name of the configuration file.
 * @returns The full path to the configuration file.
 * @throws Will throw an error if either expectedPath or nameOfFile is not provided.
 */
function pathToFile(expectedPath: string, nameOfFile: string): string {
  if (!expectedPath || !nameOfFile) {
    throw new Error('Folder path or name of file is not set');
  }

  const projectRoot = process.cwd();
  return path.join(projectRoot, './playwright-e2e/', expectedPath, nameOfFile);
}
