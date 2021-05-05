/**
 * Copyright (C) 2021 BitModern, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { tqApi } from 'src/services/http/tqApi';
import { getResponse } from '../../actions/getResponse';
import { QueryParams } from '../../actions/QueryParams';
import { TestRoute } from '../../routes/Routes';
import { Test } from './Test';
import { TestHistory } from './TestHistory';

export const testHistoryGet = (
  queryParams?: QueryParams<Test>
): Promise<TestHistory[]> => {
  const config: QueryParams<Test> = {
    method: 'get',
    url: `${queryParams?.url || TestRoute()}${
      queryParams?.id ? `/${queryParams?.id}` : ''
    }`,
    params: { revision_log: true, id: undefined, ...queryParams?.params },
    cancelToken: queryParams?.cancelToken,
  };

  return queryParams?.batch
    ? queryParams.batch.addBatch<TestHistory[]>(config)
    : getResponse<TestHistory[], Test>(tqApi, config);
};