<script setup>
import { onMounted, ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

const payload = ref(JSON.parse(localStorage.getItem('payload')));
const token = localStorage.getItem('usertoken');
const roles = localStorage.getItem('roles');

const model = ref([]);

onMounted(() => {
    token;
    load();
    Menu();
});

const Menu = () => {
    // console.log(roles)
    if (roles == 'distributor') {
        model.value = [
            {
                label: 'Menu',
                items: [
                    { label: 'Beranda', icon: 'pi pi-fw pi-home', to: '/beranda' },
                    { label: 'Survey', icon: 'pi pi-fw pi-comments', to: '/survey-user' },
                ]
            },
            {
                label: 'Profile',
                items: [
                    { label: 'Update Password', icon: 'pi pi-fw pi-lock', to: '/update-password' },
                ]
            },
        ];
    } else {
        model.value = [
            {
                label: 'Home',
                items: [{ label: 'Home', icon: 'pi pi-fw pi-home', to: '/home' }]
            },
            
            {
                label: 'Management',
                items: [
                    { label: 'Users', icon: 'pi pi-fw pi-users', to: '/users',},
                    // { label: 'Categories', icon: 'pi pi-fw pi-check-square', to: '/categories', },
                    { label: 'Questions', icon: 'pi pi-fw pi-question-circle', to: '/questions', },
                    { label: 'Survey', icon: 'pi pi-fw pi-comments', to: '/survey', },
                    // { label: 'Response', icon: 'pi pi-fw pi-reply', to: '/respon', },
                ]
            },
        ]
    }
}

const load = () => {
    // console.log(token.value)
}
</script>

<template>
    <ul class="layout-menu">
        <li class="mb-3 text-center">
            <img src="/layout/inl.png" alt="Prime Blocks" class="w-6 mt-3" />
        </li>
        <li class="text-center">
            <strong>{{ payload.name }}</strong>
        </li>
        <li class="text-center mb-5">
            <span>{{ payload.email }}</span>
        </li>
        <Divider class="my-5" />
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
