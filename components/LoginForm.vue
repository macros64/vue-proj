<template>
  <v-card>
    <div>
      <v-text-field
        ref="userName"
        v-model="uName"
        class="pa-4"
        label="Имя пользователя"
        :rules="uNameRules"
        hide-details="auto"
        @keydown.enter="submit"
        @keydown.esc="cancel"
      ></v-text-field>
    </div>
    <div>
      <v-text-field
        ref="password"
        v-model="password"
        class="pa-4"
        label="Пароль"
        :rules="pwdRules"
        hide-details="auto"
        :append-icon="showPwd ? 'mdi-eye' : 'mdi-eye-off'"
        :type="showPwd ? 'text' : 'password'"
        @keydown.enter="submit"
        @keydown.esc="cancel"
        @click:append="showPwd = !showPwd"
      ></v-text-field>
    </div>
    <v-card-actions class="justify-end">
      <v-btn color="primary" x-large @click="submit">Войти</v-btn>
      <v-btn color="primary" x-large class="q-ml-sm" @click="cancel"
        >Отмена</v-btn
      >
    </v-card-actions>
  </v-card>
</template>
<script>
import { mapActions } from 'vuex';
import S4WebServiceProxy from '@/S4WebServiceProxy.js';

export default {
  name: 'LoginForm',
  data() {
    return {
      uName: '',
      password: '',
      isLoading: false,
      uNameRules: [
        (value) => !!value || 'Required.',
        (value) => (value && value.length >= 3) || 'Min 3 characters',
      ],
      pwdRules: [(value) => !!value || 'Required.'],
      showPwd: false,
    };
  },
  computed: {
    userName() {
      return this.$store.getters.getUser.Email;
    },
    loggedIn() {
      return this.$store.getters.isLoggedIn;
    },
  },
  methods: {
    ...mapActions(['setAuthData']),
    async submit() {
      this.isLoading = true;
      const ws = new S4WebServiceProxy();
      const res = await ws.tryLogin(this.uName, this.password);
      if (res) {
        this.setAuthData(res);
      } else {
        // console.log("auth error");
      }
      this.isLoading = false;
    },
    cancel() {
      alert('cancel');
    },
  },
};
</script>
<style></style>
