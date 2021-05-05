/**
 * Copyright (C) 2021 BitModern, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

/* eslint-disable import/no-cycle */

import { Purpose } from './Purpose';

export interface PurposeHistory extends Purpose {
  _id: string;
  operation: 'create' | 'delete' | 'update';
}