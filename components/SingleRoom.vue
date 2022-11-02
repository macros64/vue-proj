<template>
  <div style="max-width: 160px">
    <v-card class="pa-2">
      <v-text-field v-model="room.number" label="кв" :readonly="!editMode" />
      <v-tooltip top>
        <template #activator="{ on, attrs }">
          <div v-bind="attrs" v-on="on">
            <v-switch v-model="room.needToSumTariffs" :readonly="!editMode" label="Сумм"/>
          </div>
        </template>
        <span>
          Суммировать показания счетчиков в отчете (Т1 + Т2 + Т3)
        </span>
      </v-tooltip>
      
      <div class="row pl-4">
        Счетчики
        <v-btn v-if="editMode" icon @click="addNewCounter">
          <v-icon>mdi-plus-circle-outline</v-icon>
        </v-btn>
      </div>
      <div v-for="c in room.counters" :key="c.id" class="flex row pl-4 pb-5">
        <template v-if="editMode">
          <v-select v-if="needToChooseCommLine" v-model="c.communicationLineId" :items="commLines" label="Comm Line" item-value="id" item-text="name" />
          <v-select :value="c.type.id" :items="counterTypes" label="Type">
            <template #selection="i">
              <v-icon>{{ i.item.resourceType.iconName }}</v-icon
              >{{ i.item.name }}
            </template>
            <template #item="i">
              <v-icon>{{ i.item.resourceType.iconName }}</v-icon
              >{{ i.item.name }}
            </template>
          </v-select>

          <v-text-field v-model="c.serialNumber" label="Serial" />
          <v-text-field v-model="c.bookNumber" label="Book" />
          <v-text-field v-model="c.abonentNumber" label="Abon" />

          <v-btn icon @click="deleteCounter(c)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
        <template v-else>
          <v-chip color="primary" class="ma-1">
            <v-icon>{{ c.type.resourceType.iconName }}</v-icon>
            {{ c.type.name }}
          </v-chip>
        </template>
      </div>
      <v-divider />
      <v-card-actions class="justify-center">
        <v-btn v-if="!editMode" icon @click="startEdit">
          <v-icon>mdi-pencil-box-outline</v-icon>
        </v-btn>
        <v-btn v-if="editMode" @click="cancelEdit">Cancel</v-btn>
        <v-btn v-if="editMode" color="primary" @click="saveRoom">Save</v-btn>
        <DeleteWithConfirm v-if="!editMode" :what="room.number" @confirmed="deleteRoom"/>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { toRaw } from 'vue';
import S4WebServiceProxy from '@/S4WebServiceProxy.js';
import DeleteWithConfirm from '@/components/DeleteWithConfirm.vue';

export default {
  name: 'SingleRoom',
  components: { DeleteWithConfirm },
  // inject: ["counterTypesGlobal"], // not working in vue2, so use store for a while
  props: {
    id: { type: String, default: '' },
    rm: { type: Object, default: () => {} },
    building: { type: Object, default: () => {} },
    mode: { type: String, default: '' },
    addingMode: { type:Boolean, default: false }
  },
  emits: ['saved', 'cancelled', 'deleted'],

  data() {
    return {
      room: {},
      roomBackup: {},
      editMode: false,
      listMode: false,
      delDialogShown: false,
      isLoading: false
    };
  },
  computed: {
    token() {
      return this.$store.getters.getToken;
    },
    counterTypes() {
      return this.$store.getters.getCounterTypes; // this.counterTypesGlobal.value;
    },
    commLines() {
      return this.building.commLines;
    },
    needToChooseCommLine() {
      return this.commLines.length > 1;
    }
  },
  mounted() {
    this.room = this.rm;
    this.editMode = this.mode?.toLowerCase() === 'edit' || this.addingMode;
    if (!this.room.counters) this.$set(this.room, 'counters', []); // make new property reacive, see https://v2.vuejs.org/v2/guide/reactivity.html
  },
  methods: {
    async saveRoom() {
      if (!this.room.buildingId) this.room.buildingId = this.building.id;
      const ws = new S4WebServiceProxy(this.token);
      const res = await ws.saveRoom(this.room);
      if (res.ok) {
        this.editMode = false;
        this.$emit('saved');
      } else {
        console.log(res.status + ' - ' + res.statusText);
      }
    },
    startEdit() {
      this.editMode = true;
      this.roomBackup = structuredClone(toRaw(this.room));
    },
    cancelEdit() {
      if (this.room.id) this.editMode = false;
      this.room = structuredClone(toRaw(this.roomBackup));
      this.roomBackup = {};
      this.$emit('cancelled');
    },
    async deleteRoom() {
      const ws = new S4WebServiceProxy(this.token);
      const res = await ws.deleteRoom(this.room);
      if (!res.ok) {
        console.log(res.statusText);
      }
      this.$emit('deleted');
    },
    addNewCounter() {
      this.room.counters.push({
        type: this.counterTypes[0],
        communicationLineId: this.building?.commLines[0]?.id,
      });
    },
    deleteCounter(counter) {
      const idx = this.room.counters.indexOf(counter);
      if (idx >= 0) this.room.counters.splice(idx, 1);
    },
  },
};
</script>
