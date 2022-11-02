<template>
  <div>
    <v-data-table :loading="isLoading" :items="users" :headers="userCols">
      <template #top>
        <v-toolbar>
          <v-toolbar-title>Пользователи системы</v-toolbar-title>
          <v-spacer />
          <v-dialog v-model="addDialogShown" persistent max-width="500px">
            <template #activator="{ on, attrs }">
              <v-btn v-bind="attrs" v-on="on">
                <v-icon left>mdi-account-plus-outline</v-icon>
                Добавить пользователя
              </v-btn>
            </template>
            <v-card class="justify-center">
              <UserDetails adding @saved="userSaved" @cancelled="closeDialogs"/>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template #[`item.actions`]="{ item }">
        <div v-if="item.login !== currentUsername">
          <v-dialog v-model="editDialogShown[item.id]" persistent max-width="500px">
            <template #activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on">
                <v-icon>mdi-account-edit-outline</v-icon>
              </v-btn>
            </template>
            <v-card class="justify-center">
              <UserDetails edit :user="item" @saved="userSaved" @cancelled="closeDialogs"/>
            </v-card>
          </v-dialog>
          <v-btn icon @click="toggleUserLock(item)">
            <v-icon>mdi-account-lock{{item.isLocked ? '' : '-open-outline'}}</v-icon>
          </v-btn>
          <v-dialog v-model="setPasswordDialogShown[item.id]" persistent max-width="500px">
            <template #activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on">
                <v-icon>mdi-account-key-outline</v-icon>
              </v-btn>
            </template>
            <v-card class="pa-2">
              <v-card-title>Новый пароль</v-card-title>
              <v-text-field v-model="newPassword" outlined/>
              <v-card-actions>
                <v-btn color="primary" @click="setUserPassword(item)">Save</v-btn>
                <v-btn @click="closeUserPassword">Cancel</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>
      </template>
    </v-data-table>
  </div>
</template>
<script>
import S4WebServiceProxy from '@/S4WebServiceProxy.js';
import UserDetails from '~/components/UserDetails.vue';

export default {
  name: 'UsersList',
  components: { UserDetails },
  data() {
    return {
      isLoading: true,
      addDialogShown: false,
      editDialogShown: {},
      setPasswordDialogShown: {},
      newPassword: '',
      users: [],
      userCols: [
        // { value: "id", text: "ID" },
        { value: "email", text: "E-Mail" },
        { value: "login", text: "Имя пользователя" },
        { value: 'actions', sortable: false }
      ]
    }
  },
  computed: {
    token() {
      return this.$store.getters.getToken;
    },
    currentUsername() {
      return this.$store.getters.getUser.login;
    }
  },
  mounted() {
    this.getData();
  },
  methods: {
    async getData() {
      this.isLoading = true;
      const ws = new S4WebServiceProxy(this.token);
      const res = await ws.getUsers();
      if (res.ok) {
        this.users = res.data;
      } else if (res.status === 401) {
        // auth failure, e.g. token expired
        this.$store.dispatch('logout');
        this.$router.push('/login');
      }
      this.isLoading = false;
    },
    closeDialogs() {
      this.addDialogShown = false;
      for (const key in this.editDialogShown) this.editDialogShown[key] = false;
    },
    userSaved() {
      this.closeDialogs();
      this.getData();
    },
    async toggleUserLock(usr) {
      // we need to fing our user in data to use reactivity
      const uIndex = this.users.findIndex(u => u.id === usr.id);
      const ws = new S4WebServiceProxy(this.token);
      const res = await ws[usr.isLocked ? 'unlockUser' : 'lockUser'](usr);
      if (res.ok) {
        const user = this.users[uIndex];
        user.isLocked = !user.isLocked;
        this.$set(this.users, uIndex, user);
      } else if (res.status === 401) {
        // auth failure, e.g. token expired
        this.$store.dispatch('logout');
        this.$router.push('/login');
      }
    },
    async setUserPassword(usr) {
      const ws = new S4WebServiceProxy(this.token);
      const res = await ws.setUserPassword(usr, this.newPassword);
      if (res.ok) {
        this.closeUserPassword();
      } else if (res.status === 401) {
        // auth failure, e.g. token expired
        this.$store.dispatch('logout');
        this.$router.push('/login');
      }
    },
    closeUserPassword() {
      this.newPassword = '';
      for (const key in this.setPasswordDialogShown) this.setPasswordDialogShown[key] = false;
    }
  }
}
</script>
