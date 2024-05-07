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
                items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-th-large', to: '/' }]
            },
            
            {
                label: 'Management',
                items: [
                    { label: 'Accounting', icon: 'pi pi-fw pi-dollar', items:[
                        { label: 'Target', icon: 'pi pi-fw pi-th-large', to: '/target' },
                        { label: 'CPO', icon: 'pi pi-fw pi-th-large', to: '/cpo' },
                        { label: 'Proportion Cost', icon: 'pi pi-fw pi-th-large', to: '/prop-cost' },
                    ]},
                    { label: 'Reporting', icon: 'pi pi-fw pi-book', items:[
                        { label: 'Average Price', icon: 'pi pi-fw pi-th-large', },
                        { label: 'Costing HPP', icon: 'pi pi-fw pi-th-large', },
                        { label: 'Cost Production', icon: 'pi pi-fw pi-th-large', to: '/cost-prod' },
                    ]},
                    // { label: 'Configuration', icon: 'pi pi-fw pi-cog', items:[
                    //     { label: 'General Leager', icon: 'pi pi-fw pi-shield', to: '/general-leager' },
                    //     { label: 'Database', icon: 'pi pi-fw pi-database', to: '/database' },
                    //     { label: 'Master Data', icon: 'pi pi-fw pi-server', 
                    //         // to: '/master-data',
                    //         items:[
                    //             { label: 'Allocation', to: '/master-data/allocation' },
                    //             { label: 'Management Report', to: '/master-data/m_report' },
                    //             { label: 'Cost Centre', to: '/master-data/cost_centre' },
                    //             { label: 'Plant', to: '/master-data/plant' },
                    //             { label: 'Category', to: '/master-data/category' },
                    //             { label: 'Bulky', to: '/master-data/bulky' },
                    //         ]
                    //     },
                    // ]},
                ]
            },

            {
                label: 'Configuration',
                items: [
                    { label: 'General Leager', icon: 'pi pi-fw pi-shield', to: '/general-leager' },
                    { label: 'Database', icon: 'pi pi-fw pi-database', to: '/database' },
                    { label: 'Master Data', icon: 'pi pi-fw pi-server', 
                        // to: '/master-data',
                        items:[
                            { label: 'Allocation', to: '/master-data/allocation' },
                            { label: 'Management Report', to: '/master-data/m_report' },
                            { label: 'Cost Centre', to: '/master-data/cost_centre' },
                            { label: 'Plant', to: '/master-data/plant' },
                            { label: 'Category', to: '/master-data/category' },
                            { label: 'Bulky', to: '/master-data/bulky' },
                        ]
                    },
                    // { label: 'Configuration', icon: 'pi pi-fw pi-cog', items:[
                    // ]},
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
