<template>
    <div class="modal" v-if="isModalShown"> 
        <div class="modal__backdrop" @click="hideModal"></div> 
        <div class="modal__dialog">
            <header class="modal__header">
                <h2><slot name="modalHeader"></slot></h2>
                <button class="modal__close-btn" @click="hideModal">&times;</button>
            </header>
            <section class="modal__body">
                <slot name="modalBody"></slot>
            </section>
            <footer class="modal__footer"> 
                <slot name="modalFooter"></slot>
            </footer>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { defineProps, ref, watch, defineEmits } from 'vue'


    const props = defineProps({
        isModalShown: {
            type: Boolean,
            default: false
        }
    });

    const emit = defineEmits(['hideModal']);

    const isModalShown = ref<boolean>(props.isModalShown);

    watch(() => props.isModalShown, (val) => {
        isModalShown.value = val;
    });

    const hideModal = () => {
        isModalShown.value = false;
        emit('hideModal');
    }
</script>

<style scoped>
    .modal{
        position:fixed;
        display:flex;
        align-items:center;
        justify-content:center;
        top:0;
        left:0;
        width:100%;
        height:100%;
    }

    .modal__backdrop{
        position:fixed;
        background:rgba(0,0,0,.5);
        width:100%;
        height:100%;
        z-index:5;
    }

    .modal__dialog{
        width:50rem;
        background:#fff;
        z-index:6;
        box-shadow:0 0 1rem rgba(0,0,0,.4);
    }

    .modal__header{
        background:#4286ad;
        color:#fff;
        padding:1rem;
        display:flex;
        justify-content:space-between;
        align-items:center;
    }

    .modal__body{
        padding:1rem;
        min-height:5rem;
        border-bottom:1px solid #ccc;
    }

    .modal__footer{
        padding:1rem;
        min-height:3rem;
        background:#ddd;
    }

    .modal__close-btn{
        background:transparent;
        color:#fff;
        border:none;
        font-size:3rem;
    }

</style>
