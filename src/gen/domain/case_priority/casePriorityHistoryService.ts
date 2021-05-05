/**
 * Copyright (C) 2021 BitModern, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { tqApi } from 'src/services/http/tqApi';
import { getResponse } from '../../actions/getResponse';
import { QueryParams } from '../../actions/QueryParams';
import { CasePriorityRoute } from '../../routes/Routes';
import { CasePriority } from './CasePriority';
import { CasePriorityHistory } from './CasePriorityHistory';

export const casePriorityHistoryGet = (
  queryParams?: QueryParams<CasePriority>
): Promise<CasePriorityHistory[]> => {
  const config: QueryParams<CasePriority> = {
    method: 'get',
    url: `${queryParams?.url || CasePriorityRoute()}${
      queryParams?.id ? `/${queryParams?.id}` : ''
    }`,
    params: { revision_log: true, id: undefined, ...queryParams?.params },
    cancelToken: queryParams?.cancelToken,
  };

  return queryParams?.batch
    ? queryParams.batch.addBatch<CasePriorityHistory[]>(config)
    : getResponse<CasePriorityHistory[], CasePriority>(tqApi, config);
};