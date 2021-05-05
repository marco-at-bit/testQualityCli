/**
 * Copyright (C) 2021 BitModern, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

/* eslint-disable import/no-cycle */

import { CasePriority } from './CasePriority';
import { LabelAssignedApi } from '../label_assigned/LabelAssignedApi';
import { TestApi } from '../test/TestApi';

export interface CasePriorityApi extends CasePriority {
  label_assigned?: LabelAssignedApi;
  test?: TestApi[];
}
