<template>
    <v-card class="pa-2 flex flex-center">
        <div>
            <StructureItemIcon :item="line" line />
            <v-text-field v-if="!editMode" v-model="line.id" class="pl-4 limit-width" label="Id" readonly/>
            <v-text-field v-model="line.name" class="pl-1 pr-2 limit-width" label="Название" :readonly="!editMode" />
            <v-text-field v-model="line.description" class="pl-1 pr-2 limit-width" label="Описание" :readonly="!editMode" />
            <v-text-field v-if="!addingMode" v-model="line.scadaId" class="pl-1 pr-2 limit-width" label="ScadaId" :readonly="!editMode" />
            
            <v-select v-model="line.commLineType" label="Тип линии" class="pl-1 pr-2 limit-width" :items="lineTypes" :readonly="!editMode" />

            <template v-if="line.commLineType == 0">
                <v-text-field v-model="line.tcpHost" class="pl-1 pr-2 limit-width" label="Хост" :readonly="!editMode" />
                <v-text-field v-model="line.tcpPort" class="pl-1 pr-2 limit-width" label="Порт" :readonly="!editMode" />
            </template>
            <template v-else>
                <v-text-field v-model="line.comPortName" class="pl-1 pr-2 limit-width" label="Порт" :readonly="!editMode" />
                <v-select :items="comBaudRates" :value="line.comPortBaudRate" label="Скорость порта" class="pl-1 pr-2 limit-width" :readonly="!editMode" />
                <v-slider hint="Im a hint" class="pl-1 pr-2 limit-width" max="8" min="5" label="Биты данных" thumb-label :readonly="!editMode" :value="line.comPortDataBits" />
                <v-select :items="stopBits" :value="line.comPortStopBits" label="Стоп-биты" class="pl-1 pr-2 limit-width" :readonly="!editMode" />
                <v-select :items="parityTypes" :value="line.comPortParity" label="Чётность" class="pl-1 pr-2 limit-width" :readonly="!editMode" />
                <v-checkbox v-model="line.dtr" label="DTR" class="pl-1 pr-2 limit-width" :readonly="!editMode" />
                <v-checkbox v-model="line.rts" label="RTS" class="pl-1 pr-2 limit-width" :readonly="!editMode" />
            </template>

            <div>
                <v-btn v-if="!editMode" icon @click="startEdit">
                    <v-icon>mdi-pencil-box-outline</v-icon>
                </v-btn>
                <v-btn v-if="editMode" icon color="green" @click="saveLine">
                    <v-icon>mdi-content-save</v-icon>
                </v-btn>
                <v-btn v-if="editMode" icon @click="cancelEdit">
                    <v-icon>mdi-close-circle-outline</v-icon>
                </v-btn>
                <DeleteWithConfirm v-if="!addingMode" :what="line.name" @confirmed="delLine" />
            </div>
        </div>
    </v-card>
</template>
<script>
import { toRaw } from 'vue';
import S4WebServiceProxy from '@/S4WebServiceProxy.js';
import StructureItemIcon from "@/components/StructureItemIcon.vue";

export default {
    components: { StructureItemIcon },
    props: {
        id: { type: String, default: '' },
        commLine: { type: Object, default: () => {} },
        addingMode: { type:Boolean, default: false }
    },
    emits: [ 'cancelled', 'saved', 'deleted' ],
    data() {
        return {
            isLoading: true,
            line: {},
            lineBackup: {},
            editMode: false
        }
    },
    computed: {
        token() {
            return this.$store.getters.getToken; 
        },
        comBaudRates() {
            return [ '9600', '115200' ];
        },
        lineTypes() {
            return [{
                text: "TCP клиент",
                value: 0
            }, {
                text: "COM порт",
                value: 1
            }];
        },
        parityTypes() {
            return [{
                text: "NONE",
                value: 0
            }, {
                text: "ODD",
                value: 1
            }, {
                text: "EVEN",
                value: 2
            }, {
                text: "MARK",
                value: 3
            }, {
                text: "SPACE",
                value: 4
            }];
        },
        stopBits() {
            return [{
                text: "0",
                value: 0
            }, {
                text: "1",
                value: 1
            }, {
                text: "2",
                value: 2
            }, {
                text: "1,5",
                value: 3
            }];
        }
    },
    mounted() { 
        if(this.commLine) this.line = this.commLine;
        this.editMode = this.addingMode;
        if(this.id && !this.commLine) this.getCommLine();
        if(this.addingMode) {
            this.line.comPortStopBits = 0;
            this.line.commLineType = 0;
            this.line.comPortParity = 0;
            this.line.comPortStopBits = 0;
            this.line.comPortDataBits = 7;
        }
    },
    methods: {
        startEdit() {
            this.editMode = true;
            this.lineBackup = structuredClone(toRaw(this.line));
        },
        cancelEdit() {
            this.line = structuredClone(toRaw(this.lineBackup));
            this.lineBackup = {};
            if(!this.addingMode) this.editMode = false;
            this.$emit('cancelled');
        },
        async getCommLine() {
            const ws = new S4WebServiceProxy(this.token);
            const res = await ws.getCommLine(this.id);
            if (res.ok) {
                this.line = res.data;
            } else {
                console.log(res.statusText);
            }
        },
        async saveLine() {
            const ws = new S4WebServiceProxy(this.token);
            const res = await ws.saveCommLine(this.line);
            if (res.ok) {
                this.editMode = false;
                this.$emit('saved');
            } else {
                console.log(res.status + ' - ' + res.statusText);
            }
        },
        async delLine() {
            const ws = new S4WebServiceProxy(this.token);
            const res = await ws.deleteCommLine(this.line);
            if (!res.ok) {
                console.log(res.statusText);
            } else {
                this.$emit('deleted');
            }
        },
    }
}
</script>
<style scoped>
.limit-width{
    width: 20rem
}
</style>