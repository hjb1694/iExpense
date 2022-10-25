<template>
    <header class="header"> 
        <h1 class="header__logo">iExpense</h1>
        <nav class="nav">
            <button @click="goTo('/')">Users</button>
            <button @click="goTo('/expenses')">Expenses</button>
            <button @click="goTo('/company-expenses')">Company Expenses</button>
        </nav>
    </header>
</template>

<script lang="ts" setup>
    import { useRouter } from 'vue-router';

    const { push } = useRouter();

    const goTo = (path: string) => {
        push(path);
    }

</script>

<style scoped>
    .header{
        padding:1.5rem;
        background: #4286ad; 
        color: #fff;
        display:flex;
        justify-content:space-between;
        align-items:center;
    }

    .header__logo{
        font-size:2.4rem;
    }

    .nav{
        display:flex;
    }

    .nav button{
        background:transparent;
        font-family:inherit;
        border:none;
        font-weight:bold;
        font-size:1.6rem;
        color:#fff;
    }

    .nav button:not(:last-child){
        margin-right:1.5rem;
    }
</style>