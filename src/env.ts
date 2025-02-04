import * as dotenv from 'dotenv';
import * as fs from 'fs';

const envFile = dotenv.config();
if (envFile.error) {
  // console.error(envFile.error);
}

export function getOsEnv(key: string): string | undefined {
  if (process.env[key]) {
    return process.env[key] as string;
  }
  return undefined;
}

class EnvVar {
  public value?: string;
  constructor(public name: string) {
    this.value = getOsEnv(name);
  }
}

export const env = {
  api: {
    url: getOsEnv('TQ_HOST') || 'https://api.testquality.com',
    xDebug: getOsEnv('APP_XDEBUG') === 'true',
  },
  client_id: getOsEnv('TQ_CLIENT_ID') || '2',
  client_secret:
    getOsEnv('TQ_CLIENT_SECRET') || '93MBS86X7JrK4Mrr1mk4PKfo6b1zRVx9Mrmx0nTa',
  variables: {
    username: new EnvVar('TQ_USERNAME'),
    password: new EnvVar('TQ_PASSWORD'),
    project_id: new EnvVar('TQ_PROJECT_ID'),
    expires_at: new EnvVar('TQ_EXPIRES_AT'),
    access_token: new EnvVar('TQ_ACCESS_TOKEN'),
    refresh_token: new EnvVar('TQ_REFRESH_TOKEN'),
  },
  auth: {
    username: getOsEnv('TQ_USERNAME'),
    password: getOsEnv('TQ_PASSWORD'),
    token: getOsEnv('TQ_TOKEN'),
    remember: getOsEnv('TQ_REMEMBER'),
    project_id: getOsEnv('TQ_PROJECT_ID'),
  },
  log: {
    level: getOsEnv('LOG_LEVEL') || 'info',
    levelInString: getOsEnv('LOG_LEVEL_IN_STRING') === 'true',
    format: getOsEnv('LOG_FORMAT') || 'short',
    data: getOsEnv('LOG_DATA') === 'true',
  },
};

export const saveEnv = () => {
  let content =
    Object.entries(env.auth).reduce(
      // tslint:disable-next-line
      (acc, [key, value]) => {
        const name = 'TQ_' + key.toUpperCase();
        if (value && value !== '') {
          return `${acc}\n${name}=${value}`;
        }
        return acc;
      },
      ''
    ) + '\n';
  if (env.api.url !== 'https://api.testquality.com') {
    content += `TQ_HOST=${env.api.url}\n`;
  }
  fs.writeFileSync('.env', content, { encoding: 'UTF-8', flag: 'w' });
};
