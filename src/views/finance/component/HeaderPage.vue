<script setup>
    // Vue Component
    import { useLayout } from '@/layout/composables/layout';
    import { ref, computed } from 'vue';
    import { useRouter, useRoute } from 'vue-router';
    import { useToast } from 'primevue/usetoast';

    // Components
    import SidebarPage from '@/views/finance/component/SidebarPage.vue'

    // Variable
    const visible = ref(false);
    const route = useRoute();
    const router = useRouter();
    const menu = ref(true);
    const routeName = computed(() => { 
        route.name;
    });

    const items = ref([
        {
            label: 'Dashboard',
            icon: 'pi pi-th-large',
            route:'/',
            root: true,
        },
        {
            label: 'Accounting',
            icon: 'pi pi-book',
            root: true,
            items: [
                {
                    label: 'Target',
                    route:'target',
                    // icon: 'pi pi-bolt',
                },
                {
                    label: 'CPO KPBN',
                    route:'cpo-kpbn',
                    // icon: 'pi pi-server',
                },
                {
                    label: 'Proportion Cost',
                    route:'prop-cost',
                    // icon: 'pi pi-server',
                },
            ]
        },
        {
            label: 'Reporting',
            icon: 'pi pi-chart-bar',
            root: true,
            items: [
                {
                    label: 'Average Price',
                    // icon: 'pi pi-bolt',
                },
                {
                    label: 'Costing HPP',
                    // icon: 'pi pi-server',
                },
                {
                    label: 'Cost Production',
                    // icon: 'pi pi-server',
                },
            ]
        },
        {
            label: 'Master',
            icon: 'pi pi-cog',
            root: true,
            items: [
                {
                    label: 'General Leager',
                    // icon: 'pi pi-bolt',
                    route:'general-leager'
                },
                {
                    label: 'Database',
                    // icon: 'pi pi-server',
                    route:'master-database'
                },
            ]
        },
    ]);

    const onSettingsClick = () => {
        // const roles = localStorage.getItem('roles');
        try {
            // const resp = UserService.logoutUser();
            // const load = resp.data;
            // if (load.code == 200) {
                localStorage.removeItem('usertoken');
                localStorage.removeItem('payload');
                localStorage.removeItem('roles');
                router.push('/auth/login');
                window.close();
            // }
        } catch (error) {
            localStorage.removeItem('usertoken');
            localStorage.removeItem('payload');
            localStorage.removeItem('roles');
            router.push('/auth/login');
            window.close();
        }
    };

</script>

<template>
    <div class="fixed flex px-6 bg-gray-100 align-items-center justify-content-between w-full z-5" style="padding-block: 10px;">
        <div class="flex flex-column w-3">
            <span class="text-2xl font-medium text-teal-800">DAICO</span>
            <span class="text-xs font-semibold text-gray-600">Daily Inventory Costing</span>
        </div>
        <div class="flex justify-content-center w-8">
            <Menubar :model="items" class="bg-transparent flex gap-2 justify-content-center border-none w-full">
                <template #item="{ item }">
                    <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
                        <a v-ripple v-if="item.root" :href="href" @click="navigate" class="text-teal-800 hover:text-teal-500 focus:text-teal-500 active:text-teal-500 flex align-items-center cursor-pointer gap-2 px-3 py-2">
                            <span :class="`${item.icon == null ? 'hidden': item.icon}`" />
                            <span >{{ item.label }}</span>
                        </a>
                        <a v-ripple v-else :href="href" @click="navigate" class="text-teal-800 flex align-items-center cursor-pointer gap-2 px-3 py-2">
                            <span :class="`${item.icon == null ? 'hidden': item.icon}`" />
                            <span class="font-medium">{{ item.label }}</span>
                        </a>
                    </router-link>
                    <a v-else v-ripple :href="item.url" :target="item.target" class="">
                        <div class="text-teal-800 hover:text-teal-500 focus:text-teal-500 active:text-teal-500 flex align-items-center cursor-pointer gap-2 px-3 py-2" v-if="item.root">
                            <span :class="`${item.icon == null ? 'hidden': item.icon}`" />
                            <span>{{ item.label }}</span>
                            <span class="pi pi-fw pi-angle-down" v-show="item.items != null"/>
                        </div>
                        <div class="text-teal-800 flex align-items-center cursor-pointer gap-2 px-3 py-2" v-else>
                            <span :class="`${item.icon == null ? 'hidden': item.icon}`" />
                            <span class="font-medium">{{ item.label }}</span>
                            <span class="pi pi-fw pi-angle-down" v-show="item.items != null"/>
                        </div>
                    </a>
                </template>
            </Menubar  >
        </div>
        <div class="flex justify-content-end align-items-center w-3">
            <a v-ripple @click="onSettingsClick">
                <div class="flex text-teal-800 align-items-center hover:bg-white gap-2 py-2 px-3 cursor-pointer border-round w-auto" >
                    <span class="pi pi-sign-out font-bold" />
                    <span class="font-bold">Sign Out</span>
                </div>
            </a>
        </div>
        <!-- <sidebar-page :visible="visible" @close="toggleSidebar"/> -->
    </div>
</template>