<template>
  <div class="flex flex-center">
    <v-card class="pa-2">
      <v-text-field v-model="bld.city" label="Город" :readonly="!editMode" />
      <v-text-field v-model="bld.address" label="Адрес" :readonly="!editMode" />
      <v-divider />
      <template v-if="editMode">
        <v-card-actions class="justify-center">
          <v-btn @click="cancelEdit">Cancel</v-btn>
          <v-btn color="primary" @click="saveBuilding">Save</v-btn>
        </v-card-actions>
      </template>
      <template v-if="!editMode">
        <v-card-actions class="justify-center">
          <v-btn v-if="list" icon :to="{ name: 'building-route', params: { id: bld.id } }">
            <v-icon>mdi-launch</v-icon>
          </v-btn>
          <v-btn icon :to="{ name: 'building-route', params: { id: bld.id, mode: 'edit' } }">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </v-card-actions>
      </template>

      <template v-if="showCommLines">
        <h2>Communication Lines</h2>
        <v-divider />
        <div class="d-flex flex-wrap">
          <v-dialog v-model="addCommLineShown" persistent max-width="700px">
            <template #activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on">
                <v-icon>mdi-plus-circle-outline</v-icon>
              </v-btn>
            </template>
            <CommLine :comm-line="{ 'buildingId': bld.id }" adding-mode @cancelled="addCommLineShown = false" @saved="savedNewCommLine" />
          </v-dialog>
          <CommLine v-for="l in bld.commLines" :key="l.id" :comm-line="l" @deleted="getData"/>
        </div>
      </template> 

      <template v-if="showRooms">
        <h2>Rooms</h2>
        <v-divider />
        <div class="d-flex flex-wrap">
          <v-dialog v-model="addRoomShown" persistent max-width="700px">
            <template #activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on">
                <v-icon>mdi-plus-circle-outline</v-icon>
              </v-btn>
            </template>
            <single-room adding-mode :rm="{ 'buildingId' : bld.id }" :building="bld" @cancelled="addRoomShown = false" @saved="roomSaved" />
          </v-dialog>

          <single-room v-for="r in bld.rooms" :key="r.id" :rm="r" :building="bld" class="ma-2" @deleted="roomDeleted" @saved="roomSaved" />
        </div>
      </template>

    </v-card>
  </div>
</template>

<script>
import S4WebServiceProxy from '@/S4WebServiceProxy.js';
import SingleRoom from '@/components/SingleRoom.vue';
import CommLine from '@/components/CommLine.vue';

export default {
  name: 'SingleBuilding',
  components: { SingleRoom, CommLine },
  props: {
    id: { type: String, default: '' },
    building: { type: Object, default: () => {} },
    mode: { type: String, default: 'list' },
    // showCommLines: { type: Boolean, default: false },
    addingMode: { type:Boolean, default: false },
    list: { type:Boolean, default: false }
  },
  emits: [ 'saved', 'cancelled', 'deleted' ],

  data() {
    return {
      bld: {},
      editMode: false,
      delDialogShown: false,
      isLoading: true,
      addRoomShown: false,
      addCommLineShown: false
    };
  },
  computed: {
    token() {
      return this.$store.getters.getToken;
    },
    isAdmin() {
      return this.$store.getters.getRoles.includes('Admin');
    },
    isSingleRecord() {
      return !this.editMode && !this.addingMode && !this.list;
    },
    showCommLines() {
      return this.isAdmin && this.isSingleRecord;
    },
    showRooms() {
      return this.isSingleRecord;
    }
  },
  mounted() {
    this.getData();
    this.editMode = (this.mode?.toLowerCase() === 'edit') || this.addingMode ;
  },
  methods: {
    async getData() {
      this.isLoading = true;
      if (this.building) {
        this.bld = this.building;
      } else if (this.id) {
        const ws = new S4WebServiceProxy(this.token);
        const res = await ws.getBuilding(this.id);
        if (res.ok) this.bld = res.data;
        else if (res.status === 401) {
          // auth failure, e.g. token expired
          this.$store.dispatch('logout');
          this.$router.push('/login');
        }
      }
      this.isLoading = false;
    },
    async saveBuilding() {
      const ws = new S4WebServiceProxy(this.token);
      const res = await ws.saveBuilding(this.bld);
      if (res.ok) {
        this.editMode = false;
        this.$emit('saved');
      } else if (res.status === 401) {
        // auth failure, e.g. token expired
        this.$store.dispatch('logout');
        this.$router.push('/login');
      } else {
        console.log(res.status + ' - ' + res.statusText);
      }
    },
    cancelEdit() {
      this.editMode = false;
      this.$emit('cancelled');
    },
    roomSaved() {
      this.addRoomShown = false;
      this.getData();
    },
    roomDeleted() {
      this.getData();
    },
    savedNewCommLine() {
      this.addCommLineShown = false;
      this.getData();
    }
  },
};
</script>
