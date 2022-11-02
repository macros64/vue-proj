<template>
  <v-layout class="column">
    <h1>Структура сети</h1>
    <hr />
    <v-dialog v-model="addDialogShown" persistent max-width="500px">
        <template #activator="{ on, attrs }">
        <v-btn icon block outlined tile v-bind="attrs" v-on="on">
            <v-icon large>mdi-plus-circle-outline</v-icon>
        </v-btn>
        </template>
        <v-card class="justify-center">
            <ScadaServer :server="{}" adding-mode @cancelled="addDialogShown = false" @saved="savedNew" />
        </v-card>
    </v-dialog>
    <v-treeview open-all hoverable dense :items="servers">
      <template #prepend="{ item }">
        <StructureItemIcon :item="item" />
      </template>
      <template #append="{ item }">
        <StructureItemButtons :item="item" @deleted="getData" />
      </template>
    </v-treeview>
  </v-layout>
</template>
<script>
import S4WebServiceProxy from '@/S4WebServiceProxy.js';
// import ScadaServer from "@/components/ScadaServer.vue";
import StructureItemIcon from "@/components/StructureItemIcon.vue";
import StructureItemButtons from "@/components/StructureItemButtons.vue";

export default {
  name: 'ServersList',

  components: { StructureItemIcon, StructureItemButtons /* ScadaServer */ },

  data() {
    return {
      isLoading: true,
      addDialogShown: false,
      servers: [],
    }
  },

  computed: {
    token() {
      return this.$store.getters.getToken;
    },
  },
  mounted() {
    this.getData();
  },
  methods: {
    async getData() {
      this.isLoading = true;
      const ws = new S4WebServiceProxy(this.token);
      const res = await ws.getServersFull();
      if (res.ok) {
        this.servers = res.data;
        this.servers.forEach(s => { 
          s.type = 'srv'
          if('scadaComms' in s) {
            s.children = s.scadaComms;
            s.children.forEach(c => {
              c.type = 'comm';
              if('buildings' in c) {
                c.children = c.buildings;
                c.children.forEach(b => { 
                  b.name = b.city + ' ' + b.address;
                  b.type = 'building';
                  if('commLines' in b) {
                    b.children = b.commLines;
                    b.children.forEach(l => { 
                      l.type = 'commLine';
                    });
                  }
                });
              }
            });
          }
        });
      } else if (res.status === 401) {
        // auth failure, e.g. token expired
        this.$store.dispatch('logout');
        this.$router.push('/login');
      }
      this.isLoading = false;
    },
    savedNew() {
      this.addDialogShown = false;
      this.getData();
    }
  }

};
</script>
