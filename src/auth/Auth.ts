import { ReturnToken } from './ReturnToken';
import { logger } from '../Logger';
import { AxiosResponse } from 'axios';
import { AUTH, GeneralError, VERIFICATION } from '../exceptions/GeneralError';
import { env } from '../env';
import { testQualityApi } from '../http/TestQualityApi';

/**
 * Copyright (C) 2021 BitModern, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

const grantPath = '/oauth/access_token';

export class Auth {
  public static checkForFailure(response: AxiosResponse<ReturnToken>): boolean {
    if (response.data.verification_ended_at) {
      // if verification ended then we don't have a token
      throw new GeneralError(
        'Email verification is required to login',
        VERIFICATION
      );
    } else if (!response.data.access_token) {
      throw new GeneralError('Auth failed', AUTH);
    }
    return true;
  }

  private token?: ReturnToken;
  private authCallback?: (me: Auth) => Promise<ReturnToken | undefined>;
  private log = logger;

  constructor(cb?: (me: Auth) => Promise<ReturnToken | undefined>) {
    if (cb) {
      this.setAuthCallback(cb);
    }
  }

  public setAuthCallback(
    cb: (me: Auth) => Promise<ReturnToken | undefined>
  ): void {
    this.authCallback = cb;
  }

  public updateToken(token?: ReturnToken): ReturnToken | undefined {
    this.token = token;
    return this.token;
  }

  public async login(
    username: string,
    password: string,
    properties?: any
  ): Promise<ReturnToken | undefined> {
    try {
      const response = await testQualityApi.post<ReturnToken>(grantPath, {
        grant_type: 'password',
        client_id: env.client_id,
        client_secret: env.client_secret,
        username,
        password,
        ...properties,
      });
      Auth.checkForFailure(response);
      this.updateToken(response.data);
      this.addInterceptors();
      this.log.info('Logged In');
      return this.token;
    } catch (e) {
      this.log.error('Failed to connect', e);
      throw e;
    }
  }

  public async refresh(
    refreshToken?: string
  ): Promise<ReturnToken | undefined> {
    const token = this.getToken();
    if (refreshToken || token) {
      try {
        const response = await testQualityApi.post<ReturnToken>(grantPath, {
          grant_type: 'refresh_token',
          client_id: env.client_id,
          client_secret: env.client_secret,
          refresh_token: refreshToken || token?.refresh_token,
        });
        Auth.checkForFailure(response);
        this.updateToken(response.data);
        this.addInterceptors();
        this.log.info('Refreshed');
        return this.token;
      } catch (e) {
        this.log.error('Failed to refresh', e);
        if (this.authCallback) {
          return this.authCallback(this);
        }
        throw e;
      }
    }
    throw Error('No Refresh Token');
  }

  public async getAccessToken(): Promise<string | undefined> {
    let token = this.token;
    if (token) {
      const expiresAt = parseInt(token.expires_at, 10);
      if (expiresAt < new Date().getTime()) {
        // token has expired, try to get a token
        token = await this.refresh();
      }
      return token?.access_token;
    }
    return undefined;
  }

  public isLoggedIn(): boolean {
    return this.token !== undefined;
  }

  protected getToken() {
    return this.token;
  }

  protected addInterceptors(): void {
    testQualityApi.interceptors.request.use(
      async (config) => {
        const accessToken = await this.getAccessToken();
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        if (env.api.xDebug) {
          config.params = config.params || {};
          config.params.XDEBUG_SESSION_START = 'PHPSTORM';
        }
        return config;
      },
      (error) => {
        this.log.error('Request error', error);
        return Promise.reject(error);
      }
    );
  }
}
