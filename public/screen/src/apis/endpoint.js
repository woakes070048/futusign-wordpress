import { SITE_URL } from '../strings';
import { getPretty } from './base';
import * as fromRest from '../util/rest';

// eslint-disable-next-line
export const get = (id) => {
  if (getPretty()) {
    return fromRest.get(`${SITE_URL}fs-endpoint?futusign_screen_id=${id.toString()}`);
  }
  return fromRest.get(`${SITE_URL}?futusign_endpoint=1&futusign_screen_id=${id.toString()}`);
};
