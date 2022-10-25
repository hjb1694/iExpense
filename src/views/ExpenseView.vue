<template>
    <div>
        <teleport to="body">
            <app-modal :isModalShown="isNewExpenseModalShown" @hideModal="hideResetAddExpenseModal">
                <template #modalHeader>
                    Add Expense
                </template>
                <template #modalBody>
                    <form @submit.prevent>
                        <div class="fgrp">
                            <label for="user" class="field-label">User</label>
                            <select class="select-input" v-model="newExpenseUserId">
                                <option value="" selected disabled hidden>-- SELECT --</option>
                                <option v-for="user in users" :key="user.id" :value="user.id">
                                    {{ user.getFullName() }}
                                </option>
                            </select>
                        </div>
                        <div class="fgrp">
                            <label for="category" class="field-label">Category</label>
                            <select class="select-input" v-model="newExpenseCategory">
                                <option value="" selected disabled hidden>-- SELECT --</option>
                                <option value="FOOD">Food</option>
                                <option value="EQUIPMENT">Equipment</option>
                                <option value="TRAVEL">Travel</option>
                            </select>
                        </div>
                        <div class="fgrp">
                            <label for="desc" class="field-label">Description</label>
                            <input id="desc" v-model="newExpenseDescription" type="text" class="text-input" />
                        </div>
                        <div class="fgrp">
                            <label for="cost" class="field-label">Cost</label>
                            <input id="cost" v-model.number="newExpenseCost" type="number" class="text-input" />
                        </div>
                    </form>
                </template>
                <template #modalFooter>
                    <button @click="addExp">Add</button>
                </template>
            </app-modal>
        </teleport>
        <teleport to="body">
            <app-modal :isModalShown="isEditExpenseModalShown" @hideModal="hideResetEditExpenseModal">
                <template #modalHeader>
                    Edit Expense
                </template>
                <template #modalBody>
                    <form @submit.prevent>
                        <div class="fgrp">
                            <label for="user" class="field-label">User</label>
                            <select class="select-input" v-model="editExpenseUserId">
                               <option v-for="user in users" :key="user.id" :value="user.id">{{user.getFullName() }}</option>
                            </select>
                        </div>
                        <div class="fgrp">
                            <label for="category" class="field-label">Category</label>
                            <select class="select-input" v-model="editExpenseCategory">
                                <option value="FOOD">Food</option>
                                <option value="EQUIPMENT">Equipment</option>
                                <option value="TRAVEL">Travel</option>
                            </select>
                        </div>
                        <div class="fgrp">
                            <label for="desc" class="field-label">Description</label>
                            <input id="desc" v-model="editExpenseDescription" type="text" class="text-input" />
                        </div>
                        <div class="fgrp">
                            <label for="cost" class="field-label">Cost</label>
                            <input id="cost" v-model.number="editExpenseCost" type="number" class="text-input" />
                        </div>
                    </form>
                </template>
                <template #modalFooter>
                    <button @click="editExp">Save Changes</button>
                </template>
            </app-modal>
        </teleport>
        <table>
            <thead>
                <tr>
                    <th>Full Name</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th>Cost</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <template v-if="allExpenses.length">
                    <tr v-for="exp in allExpenses" :key="exp.id">
                        <td>{{ exp.fullName }}</td>
                        <td>{{ exp.category }}</td>
                        <td>{{ exp.description }}</td>
                        <td>$ {{ exp.cost.toFixed(2) }}</td>
                        <td>
                            <button @click="handleEditButtonClick(exp)">Edit</button>
                            <button @click="delExp(exp.userId, exp.expenseId)">Delete</button>
                        </td>
                    </tr>
                </template>
            </tbody>
        </table>
        <button @click="isNewExpenseModalShown = true">Add Expense</button>
    </div>
</template>

<script lang="ts" setup>
    import AppModal from '../components/Modal.vue';
    import { useStore } from '../stores';
    import { ref, computed, onMounted } from 'vue'

    const allExpenses = ref([]); 

    const isNewExpenseModalShown = ref<boolean>(false);
    const isEditExpenseModalShown = ref<boolean>(false);

    const newExpenseUserId = ref<string>('');
    const newExpenseCategory = ref<string>('');
    const newExpenseDescription = ref<string>('');
    const newExpenseCost = ref<number>(0);

    const editExpenseUserId = ref<string>('');
    const editExpenseExpId = ref<string>('');
    const editExpenseCategory = ref<string>('');
    const editExpenseDescription = ref<string>('');
    const editExpenseCost = ref<number>(0);

    const { users, addExpense, fetchAllExpenses, removeExpense, editExpense } = useStore();

    const validateNewExpense = () => {
        let isValid = true;

        if(!newExpenseUserId){
            isValid = false;
        }

        if(!newExpenseCategory){
            isValid = false;
        }

        if(newExpenseDescription.length < 10){
            isValid = false;
        }

        if(newExpenseCost <= 0){
            isValid = false;
        }

        return isValid;

    }

    const addExp = () => {
        if(!validateNewExpense()){
            return;
        }

        addExpense(newExpenseUserId.value, newExpenseCategory.value, newExpenseDescription.value, newExpenseCost.value)
        allExpenses.value = fetchAllExpenses();

        hideResetAddExpenseModal();

    
    }

    const handleEditButtonClick = (expense) => {

        editExpenseUserId.value = expense.userId;
        editExpenseExpId.value = expense.expenseId;
        editExpenseCategory.value = expense.category;
        editExpenseDescription.value = expense.description;
        editExpenseCost.value = expense.cost;

        isEditExpenseModalShown.value = true;

    }

    const editExp = () => {
        editExpense(
            editExpenseUserId.value,
            editExpenseExpId.value,
            editExpenseCategory.value, 
            editExpenseDescription.value, 
            editExpenseCost.value
        );
        allExpenses.value = fetchAllExpenses();
        hideResetEditExpenseModal();
    }

    const hideResetAddExpenseModal = () => {
        isNewExpenseModalShown.value = false;
        newExpenseUserId.value = '';
        newExpenseCategory.value = '';
        newExpenseDescription.value = '';
        newExpenseCost.value = 0;
    }

    const hideResetEditExpenseModal = () => {
        isEditExpenseModalShown.value = false;
    }

    const delExp = (userId: string, expId: string) => {
        removeExpense(userId, expId);
        allExpenses.value = fetchAllExpenses();
    }

    onMounted(() => {
        allExpenses.value = fetchAllExpenses();
    });


</script>

<style scoped>

</style>