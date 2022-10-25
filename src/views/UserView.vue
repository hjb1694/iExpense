<template>
    <div> 
        <teleport to="body">
            <app-modal :isModalShown="isAddNewUserModalShown" @hideModal="hideAddNewUserModal">
                <template #modalHeader>
                    Add User
                </template>
                <template #modalBody>
                    <form @submit.prevent autocomplete="off">
                        <div class="fgrp">
                            <label for="firstName" class="field-label">First Name</label>
                            <input id="firstName" v-model="firstNameAdd" type="text" class="text-input" />
                            <div v-if="showFirstNameAddError" class="errbox">
                                Please include a first name.
                            </div>
                        </div>
                        <div class="fgrp">
                            <label for="lastName" class="field-label">Last Name</label>
                            <input id="lastName" v-model="lastNameAdd" type="text" class="text-input"/>
                            <div v-if="showLastNameAddError" class="errbox">
                                Please include a last name.
                            </div>
                        </div>
                    </form>
                </template>
                <template #modalFooter>
                    <button class="add-user-btn" type="submit" @click="addNewUser">Add User</button>
                </template>
            </app-modal>
        </teleport>
        <teleport to="body">
            <app-modal :isModalShown="isEditUserModalShown" @hideModal="hideResetEditUserModal">
                <template #modalHeader>
                    Edit User
                </template>
                <template #modalBody>
                    <form @submit.prevent autocomplete="off">
                        <div class="fgrp">
                            <label for="firstName" class="field-label">First Name</label>
                            <input id="firstName" v-model="firstNameEdit" type="text" class="text-input" />
                            <div v-if="showFirstNameEditError" class="errbox">
                                Please include a first name.
                            </div>
                        </div>
                        <div class="fgrp">
                            <label for="lastName" class="field-label">Last Name</label>
                            <input id="lastName" v-model="lastNameEdit" type="text" class="text-input"/>
                            <div v-if="showLastNameEditError" class="errbox">
                                Please include a last name.
                            </div>
                        </div>
                    </form>
                </template>
                <template #modalFooter>
                    <button class="add-user-btn" type="submit" @click="modifyUser">Save Changes</button>
                </template>
            </app-modal>
        </teleport>
        <table>
            <thead>
                <tr>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Total Expense</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="user in users" :key="user.id">
                    <td>{{ user.getFirstName() }}</td>
                    <td>{{ user.getLastName() }}</td>
                    <td>$ {{ user.getExpenseTotal().toFixed(2) }}</td>
                    <td>
                        <button @click="showEditUserModal(user.id)">Edit</button>
                        <button @click="delUser(user.id)">Delete</button>
                    </td>
                </tr>

            </tbody>

        </table>
        <button class="add-user-btn mt-2" @click="isAddNewUserModalShown = true">Add User</button>
    </div>
</template>

<script lang="ts" setup>
    import AppModal from '../components/Modal.vue'
    import { ref } from 'vue'
    import { useStore } from '../stores'

    const isAddNewUserModalShown = ref<boolean>(false);
    const firstNameAdd = ref<string>('');
    const lastNameAdd = ref<string>('');
    const showFirstNameAddError = ref<boolean>(false);
    const showLastNameAddError = ref<boolean>(false);

    const isEditUserModalShown = ref<boolean>(false);
    const firstNameEdit = ref<string>('');
    const lastNameEdit = ref<string>('');
    const showFirstNameEditError = ref<boolean>(false);
    const showLastNameEditError = ref<boolean>(false);
    const currentEditUserId = ref<string>('');

    const { users, addUser, deleteUser, getUserById, editUser } = useStore();

    const validateNewUser = () => {
        showFirstNameAddError.value = false;
        showLastNameAddError.value = false;
        let valid = true;

        if(firstNameAdd.value.length < 2){
            showFirstNameAddError.value = true;
            valid = false;
        }

        if(lastNameAdd.value.length < 2){
            showLastNameAddError.value = true;
            valid = false;
        }

        return valid;

    }

    const addNewUser = (): void => {
        if(!validateNewUser()){
            return;
        }

        console.log('firstNameAdd ', firstNameAdd.value);

        addUser(firstNameAdd.value, lastNameAdd.value);

        firstNameAdd.value = '';
        lastNameAdd.value = '';

        isAddNewUserModalShown.value = false;

    }

    const delUser = (id: string): void => {
        deleteUser(id)
    }

    const showEditUserModal = (userId: string) => {
        console.log('userId ', userId);
        currentEditUserId.value = userId;
        const user = getUserById(userId);
        firstNameEdit.value = user.getFirstName();
        lastNameEdit.value = user.getLastName();
        isEditUserModalShown.value = true;
    }

    const modifyUser = () => {

        editUser(currentEditUserId.value, firstNameEdit.value, lastNameEdit.value);

        hideResetEditUserModal();

    }

    const hideResetEditUserModal = () => {

        currentEditUserId.value = '';
        firstNameEdit.value = '';
        lastNameEdit.value = '';
        isEditUserModalShown.value = false;

    }

    const hideAddNewUserModal = () => isAddNewUserModalShown.value = false;
    

</script>

<style scoped>

    .add-user-btn{
        background:#4286ad;
        padding:.5rem 1rem;
        border:none;
        color:#fff;
        font-family:inherit;
    }

    .errbox{
        margin:1rem 0;
        color:#f00;
        font-size:1.4rem;
    }

</style>