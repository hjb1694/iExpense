<template>
    <div>
        <table>
            <thead>
                <th>Category</th>
                <th>Cost</th>
            </thead>
            <tbody> 
                <tr> 
                    <td>Food</td>
                    <td>${{ fetchExpenseByCategory('FOOD').toFixed(2) }}</td>
                </tr>
                <tr>
                    <td>Equipment</td>
                    <td>${{ fetchExpenseByCategory('EQUIPMENT').toFixed(2) }}</td>
                </tr> 
                <tr> 
                    <td>Travel</td>
                    <td>${{ fetchExpenseByCategory('TRAVEL').toFixed(2) }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script lang="ts" setup>
    import { useStore } from '@/stores'

    const { fetchExpenseByCategory } = useStore();
</script>