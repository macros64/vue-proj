<template>
  <div>
    <h1>Адреса</h1>
    <hr />
    <div class="d-inline-flex">
      <SingleBuilding v-for="b in buildings" :key="b.Id" :building="b" class="ma-2" list @deleted="getData" />
    </div>
  </div>
</template>
<script>
import SingleBuilding from '@/components/SingleBuilding.vue';
import S4WebServiceProxy from '@/S4WebServiceProxy.js';

export default {
  name: 'BuildingList',
  components: { SingleBuilding },
  data() {
    return {
      buildings: [],
      isLoading: false,
      addDialog: false,
    };
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
      const res = await ws.getBuildings();
      if (res.ok) {
        this.buildings = res.data;
      } else if (res.status === 401) {
        // auth failure, e.g. token expired
        this.$store.dispatch('logout');
        this.$router.push('/login');
      }
      this.isLoading = false;
    },
    savedBuilding() {
      this.addDialog = false;
      this.getData();
    },
  },
};
</script>
