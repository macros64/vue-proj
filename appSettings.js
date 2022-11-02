import { CORE_WS } from '@/env_spec.js';

export default class AppSettings {
  static get CORE_ROOT_URL() {
    return CORE_WS;
  }

  static get ROLE_CLAIM_KEY() {
    return 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
  }
}
