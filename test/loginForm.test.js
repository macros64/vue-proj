import { shallowMount } from '@vue/test-utils';
import Vue from 'vue';
import Vuetify from 'vuetify';
import LoginForm from '../components/LoginForm.vue';

Vue.use(Vuetify);

describe('Login Form', () => {
  it('test initial values', () => {
    const lForm = shallowMount(LoginForm);
    expect(lForm.vm.uName).toEqual('');
    expect(lForm.vm.password).toEqual('');
    expect(lForm.vm.isLoading).toEqual(false);
  });

  it('test has 2 inputs', () => {
    const lForm = shallowMount(LoginForm);

    expect(lForm.findComponent({ ref: 'userName' }).exists()).toBe(true);
    expect(lForm.findComponent({ ref: 'password' }).exists()).toBe(true);
  });
});
