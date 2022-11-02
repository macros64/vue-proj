<template>
    <v-card class="pa-2 justify-left align-center">
        <div class="d-inline-flex">
            <StructureItemIcon :item="comm" comm />
            <!-- v-text-field v-if="!editMode" v-model="comm.id" class="pl-4" style="width:21rem" label="Id" readonly/ -->
            <v-text-field v-model="comm.name" class="pl-1 pr-2" style="width:20rem" label="Название" :readonly="!editMode" />
            <div>
                <v-btn v-if="!editMode" icon @click="startEdit">
                    <v-icon>mdi-pencil-box-outline</v-icon>
                </v-btn>
                <v-btn v-if="editMode" icon color="green" @click="saveComm">
                    <v-icon>mdi-content-save</v-icon>
                </v-btn>
                <v-btn v-if="editMode" icon @click="cancelEdit">
                    <v-icon>mdi-close-circle-outline</v-icon>
                </v-btn>
                <DeleteWithConfirm v-if="!addingMode" :what="comm.name" @confirmed="delComm" />
            </div>
        </div>
        <v-divider />
        <div>
            <template v-if="showBuildings">
                <v-dialog v-model="addBuildingShown" persistent max-width="500px">
                    <template #activator="{ on, attrs }">
                    <v-btn icon block outlined tile v-bind="attrs" v-on="on">
                        <v-icon large>mdi-plus-circle-outline</v-icon>
                    </v-btn>
                    </template>
                    <v-card class="justify-center">
                        <SingleBuilding :building="{ 'scadaCommId': comm.id }" adding-mode @cancelled="addBuildingShown = false" @saved="savedNewBuilding" />
                    </v-card>
                </v-dialog>
                <div class="d-inline-flex">
                    <SingleBuilding v-for="b in comm.buildings" :key="b.id" :building="b" list/>
                </div>
            </template>
        </div>
    </v-card>

</template>
<script>
import { toRaw } from 'vue';
import SingleBuilding from '@/components/SingleBuilding.vue';
import S4WebServiceProxy from '@/S4WebServiceProxy.js';
import StructureItemIcon from "@/components/StructureItemIcon.vue";
export default {
    name: "ScadaComm",
    components: { StructureItemIcon, SingleBuilding },
    props: {
        id: { type: String, default: '' },
        scadaComm: { type: Object, default: () => {} },
        addingMode: { type:Boolean, default: false }
    },
    emits: [ 'cancelled', 'saved', 'deleted' ],
    data() {
        return {
            isLoading: true,
            comm: {},
            commBackup: {},
            editMode: false,
            showBuildings: false,
            addBuildingShown: false
        }
    },
    computed: {
        token() {
            return this.$store.getters.getToken; 
        },
    },
    mounted() { 
        if(this.scadaComm) this.comm = this.scadaComm;
        this.editMode = this.addingMode;
        if(this.id && !this.scadaComm) {
            this.getComm();
            this.showBuildings = true;
        }
    },
    methods: {
        startEdit() {
            this.editMode = true;
            this.commBackup = structuredClone(toRaw(this.comm));
        },
        cancelEdit() {
            this.comm = structuredClone(toRaw(this.commBackup));
            this.commBackup = {};
            if(!this.addingMode) this.editMode = false;
            this.$emit('cancelled');
        },
        async getComm() {
            const ws = new S4WebServiceProxy(this.token);
            const res = await ws.getComm(this.id);
            if (res.ok) {
                this.comm = res.data;
            } else {
                console.log(res.statusText);
            }
        },
        async saveComm() {
            const ws = new S4WebServiceProxy(this.token);
            const res = await ws.saveComm(this.comm);
            if (res.ok) {
                this.editMode = false;
                this.$emit('saved');
            } else {
                console.log(res.status + ' - ' + res.statusText);
            }
        },
        async delComm() {
            const ws = new S4WebServiceProxy(this.token);
            const res = await ws.deleteComm(this.comm);
            if (!res.ok) {
                console.log(res.statusText);
            } else {
                this.$emit('deleted');
            }
        },
        savedNewBuilding() {
            this.addBuildingShown = false;
            this.getComm();
        }
    }
}
</script>