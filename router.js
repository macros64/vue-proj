import Vue from 'vue';
import Router from 'vue-router';

import Index from '@/pages/index.vue';
import BuildingsList from '@/pages/buildings.vue';
import ConsumptionReport from '@/pages/report.vue';
import UsersList from '@/pages/users.vue';
import ServersList from '@/pages/servers.vue';
import LoginPage from '@/pages/login.vue';
import AccessDenied from '@/pages/denied.vue';

import SingleBuilding from '@/components/SingleBuilding.vue';
import ScadaServer from '@/components/ScadaServer.vue';
import ScadaComm from '@/components/ScadaComm.vue';
import CommLine from '@/components/CommLine.vue';

Vue.use(Router);

export const appRoutes = [{
    path: '/',
    component: Index,
    meta: { title: 'Index', icon: 'mdi-apps', showInNav: true },
  }, { 
    path: '/login', 
    component: LoginPage 
  }, { 
    path: '/denied', 
    component: AccessDenied 
  }, {
    path: '/buildings',
    component: BuildingsList,
    meta: {
      title: 'Buildings',
      icon: 'mdi-city',
      showInNav: true,
      roles: ['Admin', 'Operator'],
    },
  }, {
    path: '/report',
    component: ConsumptionReport,
    meta: {
      title: 'Report',
      icon: 'mdi-table-large',
      showInNav: true,
      roles: ['Admin', 'Operator'],
    },
  }, {
    path: '/users',
    component: UsersList,
    meta: {
      title: 'Users',
      icon: 'mdi-account-multiple',
      showInNav: true,
      roles: ['Admin'],
    },
  }, {
    path: '/building/:id/:mode?',
    component: SingleBuilding,
    name: 'building-route',
    props: true,
    meta: { roles: ['Admin', 'Operator'] },
  }, {
    path: '/servers',
    component: ServersList,
    meta: {
      title: 'Servers',
      icon: 'mdi-file-tree-outline',
      showInNav: true,
      roles: ['Admin'],
    },
  }, {
    path: '/server/:id',
    component: ScadaServer,
    props: true,
    meta: { roles: ['Admin']  }
  }, {
    path: '/comm/:id',
    component: ScadaComm,
    props: true,
    meta: { roles: ['Admin']  }
  }, {
    path: '/commLine/:id',
    component: CommLine,
    props: true,
    meta: { roles: ['Admin']  }
  },
];

export function createRouter() {
  return new Router({
    mode: 'history',
    routes: appRoutes,
  });
}
