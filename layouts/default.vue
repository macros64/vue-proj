<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" :mini-variant="!$vuetify.breakpoint.mobile" :expand-on-hover="!$vuetify.breakpoint.mobile" fixed clipped app>
      <v-list>
        <v-list-item v-for="(item, i) in items" :key="i" :to="item.to" router exact>
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar fixed app clipped-left>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title v-text="title" />
      <v-spacer />
      <v-btn icon @click.stop="isDark = !isDark">
        <v-icon>mdi-{{ `lightbulb${isDark ? '-outline' : ''}` }}</v-icon>
      </v-btn>
      <v-icon>mdi-account</v-icon>
    </v-app-bar>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
    <v-footer :absolute="!fixed" app>
      <span>&copy; {{ new Date().getFullYear() }}</span> 
      <span>&nbsp;{{ buildInfo }}</span>
      <span>&nbsp;{{ coreBuildInfoStr }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import { mapActions } from 'vuex';
import { appRoutes } from '@/router.js';
import S4WebServiceProxy from '@/S4WebServiceProxy.js';
import { S4_BUILD_NUM, S4_COMMIT } from '@/build-info.js';

export default {
  name: 'DefaultLayout',
  /* provide() { // not working in vue2, will store in vuex for a while
    return {
      counterTypesGlobal: computed(() => this.counterTypes),
    };
  }, */
  data() {
    return {
      drawer: !this.$vuetify.breakpoint.mobile,
      fixed: false,
      isDark: false,
      items: [],
      right: true,
      title: 'Счетовод',
      // counterTypes: [],
      buildInfo: 'build #' + S4_BUILD_NUM + ', commit ' + S4_COMMIT,
      coreBuildInfo: { buildNumber: -2, buildCommit: '<unknown>' }
    };
  },
  computed: {
    token() {
      return this.$store.getters.getToken;
    },
    coreBuildInfoStr() {
      return 'Core build #' + this.coreBuildInfo.buildNumber + ', core commit ' + this.coreBuildInfo.buildCommit;
    }
  },
  watch: {
    token(newValue) {
      if (newValue) this.initDictionaries();
    },
    isDark(newValue) {
      this.$vuetify.theme.dark = newValue;
    },
  },
  created() {
    this.$vuetify.theme.dark = this.isDark;

    this.items = [];
    appRoutes.forEach((item) => {
      if (item.meta?.showInNav) {
        this.items.push({
          icon: item.meta?.icon,
          title: item.meta?.title,
          to: item.path,
        });
      }
    });
  },
  async mounted() {
    await this.initCoreInfo();
  },
  methods: {
    ...mapActions(['setCounterTypes']),
    async initDictionaries() {
      if (!this.token) return;
      const ws = new S4WebServiceProxy(this.token);
      const res = await ws.getCounterTypes();
      if (res.ok) {
        // this.counterTypes = res.data;
        res.data.forEach((i) => {
          i.value = i.id;
        });
        this.setCounterTypes(res.data);
      }
    },
    async initCoreInfo() {
      const ws = new S4WebServiceProxy(this.token);
      const res = await ws.getCoreBuldInfo();
      if (res.ok) {
        this.coreBuildInfo = res.data;
      }
    }
  },
};
</script>
