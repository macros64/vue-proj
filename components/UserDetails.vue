<template>
    <v-card class="pa-2 flex flex-center">
        <v-text-field v-model="ourUser.email" label="E-Mail" :readonly="!editMode" />
        <v-text-field v-model="ourUser.login" label="Имя пользователя" :readonly="!editMode" />
        <v-text-field v-if="adding" v-model="ourUser.password" label="Пароль" /> <!-- only for new users registration -->
        <v-select v-if="!adding" v-model="ourUser.roles" :items="roles" chips label="Роли" multiple outlined /><!-- no support for new users yet -->
        <v-autocomplete v-model="ourUser.buildings" :items="buildings" chips label="Адреса" multiple outlined item-text="text" item-value="id" return-object deletable-chips/>
        <v-autocomplete v-model="ourUser.rooms" :items="rooms" chips label="Квартиры" multiple outlined item-text="text" item-value="id" return-object deletable-chips />
        <v-card-actions>
            <v-btn v-if="!editMode" icon @click="editMode = true">
                <v-icon>mdi-pencil-box-outline</v-icon>
            </v-btn>
            <v-btn v-if="editMode" icon color="green" @click="saveUser">
                <v-icon>mdi-content-save</v-icon>
            </v-btn>
            <v-btn v-if="editMode" icon @click="cancelEdit">
                <v-icon>mdi-close-circle-outline</v-icon>
            </v-btn>
        </v-card-actions>
    </v-card>
</template>
<script>
import S4WebServiceProxy from '@/S4WebServiceProxy.js';
export default {
    props: {
        id: { type: String, default: '' },
        user: { type: Object, default: () => { } },
        adding: { type: Boolean, default: false },
        edit: { type: Boolean, default: false }
    },
    emits: ['cancelled', 'saved'],
    data() {
        return {
            ourUser: {},
            editMode: false,
            buildings: [],
            rooms: []
        }
    },
    computed: {
        token() {
            return this.$store.getters.getToken;
        },
        roles() {
            return [ {
                text: 'Администратор системы',
                value: 'Admin'
            }, {
                text: 'Оператор объекта',
                value: 'Operator'
            }, {
                text: 'CommSync',
                value: 'CommUpdater'
            }, {
                text: 'ServerSync',
                value: 'RapidSync'
            }, {
                text: 'Абонент',
                value: 'Abonent'
            }];
        }
    },
    async mounted() {
        if (this.user) this.ourUser = this.user;
        this.editMode = this.adding || this.edit;
        await this.getData();
    },
    methods: {
        async saveUser() {
            const ws = new S4WebServiceProxy(this.token);
            const res = await ws.saveUser(this.ourUser);
            if (res.ok) {
                this.exitEditIfNeeded();
                this.$emit('saved');
            } else if (res.status === 401) {
                // auth failure, e.g. token expired
                this.$store.dispatch('logout');
                this.$router.push('/login');
            } else {
                console.log(res.statusText);
            }
            
        },
        cancelEdit() {
            this.exitEditIfNeeded();
            this.$emit('cancelled');
        },
        exitEditIfNeeded() {
            if(!this.edit && !this.adding) this.editMode = false; // выходим из режима только если мы открываем пользователя из таблички
        },
        async getData() {
            const ws = new S4WebServiceProxy(this.token);
            const res = await ws.getBuildings(true); 
            if (res.ok) {
                this.buildings = res.data;
                this.rooms = [];
                this.buildings.forEach(b => {
                    b.text = b.city + ' ' + b.address;
                    b.rooms?.forEach(r => {
                        r.text = b.city + ' ' + b.address + ' кв. ' + r.number;
                        this.rooms.push(r);
                    });
                    b.rooms = null; // we don't need them here, so save some memory
                });
            } else if (res.status === 401) {
                // auth failure, e.g. token expired
                this.$store.dispatch('logout');
                this.$router.push('/login');
            }
        }
    }
}
</script>