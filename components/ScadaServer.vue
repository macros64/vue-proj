<template>
    <v-card class="pa-2 justify-left align-center">
        <div class="d-inline-flex">
            <StructureItemIcon :item="srv" server />
            <v-text-field v-if="!editMode" v-model="srv.id" class="pl-4" style="width:21rem" label="Id" readonly/>
            <v-text-field v-model="srv.name" class="pl-1 pr-2" style="width:20rem" label="Название" :readonly="!editMode" />
            <div>
                <v-btn v-if="!editMode" icon @click="startEdit">
                    <v-icon>mdi-pencil-box-outline</v-icon>
                </v-btn>
                <v-btn v-if="editMode" icon color="green" @click="saveServer">
                    <v-icon>mdi-content-save</v-icon>
                </v-btn>
                <v-btn v-if="editMode" icon @click="cancelEdit">
                    <v-icon>mdi-close-circle-outline</v-icon>
                </v-btn>
                <DeleteWithConfirm v-if="!addingMode" :what="srv.name" @confirmed="delServer"/>
            </div>
        </div>
        <v-divider />
        <div>
            <template v-if="showComms">
                <v-dialog v-model="addCommShown" persistent max-width="500px">
                    <template #activator="{ on, attrs }">
                    <v-btn icon block outlined tile v-bind="attrs" v-on="on">
                        <v-icon large>mdi-plus-circle-outline</v-icon>
                    </v-btn>
                    </template>
                    <v-card class="justify-center">
                        <ScadaComm :scada-comm="{ 'serverId': srv.id }" adding-mode @cancelled="addCommShown = false" @saved="savedNewComm" />
                    </v-card>
                </v-dialog>
                <ScadaComm v-for="c in srv.scadaComms" :key="c.id" :scada-comm="c"/>
            </template>
        </div>
    </v-card>
</template>
<script>
import { toRaw } from 'vue';
import DeleteWithConfirm from '@/components/DeleteWithConfirm.vue';
import StructureItemIcon from "@/components/StructureItemIcon.vue";
import ScadaComm from '@/components/ScadaComm.vue';
import S4WebServiceProxy from '@/S4WebServiceProxy.js';

export default {
    name: "ScadaServer",
    components: { DeleteWithConfirm, ScadaComm, StructureItemIcon },
    props: {
        id: { type: String, default: '' },
        server: { type: Object, default: () => {} },
        addingMode: { type:Boolean, default: false }
    },
    emits: [ 'cancelled', 'saved', 'deleted' ],
    data() {
        return {
            isLoading: true,
            srv: {},
            srvBackup: {},
            editMode: false,
            showComms: false,
            addCommShown: false
        }
    },
    computed: {
        token() {
            return this.$store.getters.getToken;
        },
    },
    mounted() {
        if(this.server) this.srv = this.server;
        this.editMode = this.addingMode;
        if(this.id && !this.server) {
            this.getServer();
            this.showComms = true;
        }
    },
    methods: {
        startEdit() {
            this.editMode = true;
            this.srvBackup = structuredClone(toRaw(this.srv));
        },
        cancelEdit() {
            this.srv = structuredClone(toRaw(this.srvBackup));
            this.srvBackup = {};
            if(!this.addingMode) this.editMode = false;
            this.$emit('cancelled');
        },
        async saveServer() {
            const ws = new S4WebServiceProxy(this.token);
            const res = await ws.saveServer(this.srv);
            if (res.ok) {
                this.editMode = false;
                this.$emit('saved');
            } else {
                console.log(res.status + ' - ' + res.statusText);
            }
        },
        async getServer() {
            const ws = new S4WebServiceProxy(this.token);
            const res = await ws.getServer(this.id);
            if (res.ok) {
                this.srv = res.data;
            } else {
                console.log(res.statusText);
            }
        },
        async delServer() {
            const ws = new S4WebServiceProxy(this.token);
            const res = await ws.deleteServer(this.srv);
            if (!res.ok) {
                console.log(res.statusText);
            } else {
                this.$emit('deleted');
            }
        },
        savedNewComm() {
            this.addCommShown = false;
            this.getServer();
        }
    }
}
</script>