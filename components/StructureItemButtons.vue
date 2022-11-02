<template>
    <span>
        <v-btn icon @click="openItem">
            <v-icon>mdi-launch</v-icon>
        </v-btn>
        <DeleteWithConfirm :what="item.name" @confirmed="delItem"/>
    </span>
</template>
<script>
import DeleteWithConfirm from '@/components/DeleteWithConfirm.vue';
import S4WebServiceProxy from '@/S4WebServiceProxy.js';

export default {
    components: { DeleteWithConfirm },
    props: {
        item: { type: Object, default: () => {} }
    },
    emits: [ 'deleted', 'error' ],
    computed: {
        token() {
            return this.$store.getters.getToken;
        }
    },
    methods: {
        openItem() {
            if(this.item.type === 'srv')  this.$router.push('/server/' + this.item.id);
            if(this.item.type === 'comm')  this.$router.push('/comm/' + this.item.id);
            if(this.item.type === 'building')  this.$router.push('/building/' + this.item.id);
            if(this.item.type === 'commLine')  this.$router.push('/commLine/' + this.item.id);
        },
        async delItem() {
            const ws = new S4WebServiceProxy(this.token);
            let method = '';
            if(this.item.type === 'srv') method = 'deleteServer';
            if(this.item.type === 'comm') method = 'deleteComm';
            if(this.item.type === 'building') method = 'deleteBuilding';
            if(this.item.type === 'commLine') method = 'deleteCommLine';

            const res = await ws[method](this.item);
            if (res.ok) {
                this.$emit('deleted');
            } else {
                console.log(res.statusText);
                this.$emit('error');
            }
        }
    }
}
</script>