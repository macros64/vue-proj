<template>
    <v-dialog v-model="delDialogShown" persistent max-width="500px">
        <template #activator="{ on, attrs }">
        <v-btn icon v-bind="attrs" v-on="on">
            <v-icon>mdi-delete</v-icon>
        </v-btn>
        </template>
        <v-card class="justify-center">
            <div class="align-center">
                <v-icon large>mdi-delete</v-icon>
                <div class="ml-2">Are you sure you want to delete <strong>{{what}}</strong>?</div>
            </div>
            <v-card-actions>
                <v-btn color="primary" @click="delDialogShown = false">Cancel</v-btn>
                <v-btn color="red" @click="deleteRoom">Delete</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
export default {
    props: {
        what: { type: String, default: '' }
    },
    emits: ['confirmed'],
    data() {
        return {
            delDialogShown: false,
        };
    },
    methods: {
        deleteRoom() {
            this.delDialogShown = false;
            this.$emit('confirmed');
        }
    }
}
</script>