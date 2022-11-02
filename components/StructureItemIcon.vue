<template>
    <v-tooltip right>
        <template #activator="{ on, attrs }">
            <v-icon :color="iconParams.color" v-bind="attrs" v-on="on">{{iconParams.icon}}</v-icon>
        </template>
        <span>
            {{iconParams.hint}}
        </span>
    </v-tooltip>
</template>
<script>
export default {
    props: {
        item: { type: Object, default: () => {} },
        server: { type: Boolean, default: false },
        comm: { type: Boolean, default: false },
        building: { type: Boolean, default: false },
        line: { type: Boolean, default: false },
    },
    computed: {
        isServer() {
            return this.server || this.item.type === 'srv';
        },
        isComm() {
            return this.comm || this.item.type === 'comm';
        },
        isBuilding() {
            return this.building || this.item.type === 'building';
        },
        isCommLine() {
            return this.line || this.item.type === 'commLine';
        },
        iconParams() {
            let iconName = '';
            let iconColor = 'grey';
            let iconHint = '';
            if(this.isServer || this.isComm) {
                iconName = this.isServer ? 'mdi-lan-connect' : 'mdi-network-outline';
                if(new Date(this.item.lastSync).getFullYear() > 2000) {
                    if(this.item.syncStatus === 0) iconColor = 'green';  // synchronized
                    if(this.item.syncStatus === 1) iconColor = 'green';  // in progress
                    if(this.item.syncStatus === 2) iconColor = 'red';    // error
                    if(this.item.syncStatus === 3) iconColor = 'orange'; // need sync
                    iconHint = this.item.lastSync + ' - ' + this.item.errorMessage;
                } else {
                    iconHint = 'no data';
                }
            } else if(this.isBuilding) {
                iconName = 'mdi-office-building';
                iconColor = 'green';
                iconHint = this.item.city + ' ' + this.item.address;
            } else if(this.isCommLine) {
                iconName = 'mdi-lan';
                iconColor = 'green';
                iconHint = this.item.commLineType === 0 ? this.item.tcpHost + ':' + this.item.tcpPort : this.item.comPortName;
            }
            return { icon: iconName, color: iconColor, hint: iconHint };
        }
    }
}
</script>