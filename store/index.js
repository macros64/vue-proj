import jwtHelper from '@/jwtHelper.js';
import AppSettings from '@/appSettings.js';

export const state = () => {
  return {
    authToken: '',
    validTo: '',
    currentUser: {},
    counterTypes: [],
  };
};

export const mutations = {
  mSetAuth(state, { t, u, v }) {
    state.authToken = t;
    state.currentUser = u;
    state.validTo = v;
  },
  mSetCounterTypes(state, arr) {
    state.counterTypes = arr;
  },
};

export const actions = {
  setAuthData(ctx, payload) {
    const jwtData = jwtHelper.getJwtData(payload.token);
    const validTo = new Date(jwtData.exp * 1000); // unix timestamp is in seconds, js date is in milliseconds
    ctx.commit('mSetAuth', { t: payload.token, u: payload.user, v: validTo });
  },
  logout(ctx) {
    ctx.commit('mSetAuth', { t: '', u: {}, v: '' });
  },
  setCounterTypes(ctx, payload) {
    ctx.commit('mSetCounterTypes', payload);
  },
};

export const getters = {
  isLoggedIn(state) {
    const hasNoValues =
      !state.authToken || !state.validTo || !state.currentUser;
    const isExpired = isNaN(state.validTo) ? false : Date.now() > state.validTo;
    return !hasNoValues && !isExpired;
  },
  getUser(state) {
    return state.currentUser;
  },
  getToken(state) {
    return state.authToken;
  },
  getRoles(state) {
    const jwtData = jwtHelper.getJwtData(state.authToken);
    const val = jwtData[AppSettings.ROLE_CLAIM_KEY];
    return Array.isArray(val) ? val : new Array(val);
  },
  getCounterTypes(state) {
    return state.counterTypes;
  },
};
