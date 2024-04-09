<script setup>
    // Vue Component
    import { useLayout } from '@/layout/composables/layout';
    import { ref, onMounted, defineProps, watch  } from 'vue';
    import { useRouter, useRoute } from 'vue-router';

    // Props
    const props = defineProps({
        visible:{
            type:Boolean
        },
    });

    const emit = defineEmits(['close'])
    const router = useRouter()

    // Variables
    const sidebarVisible = ref(props.visible);
    const list_menu = ref([])

    // Watch for changes in the visible prop
    watch(() => props.visible, (newValue) => {
        sidebarVisible.value = newValue;
        console.log(newValue)
    });

    const close = () => {
        emit('close',false)
    }

    const redirect = (link) => {
        router.push({name: link});
    }

    const load_menu = () => {
        list_menu.value = [
            {label: 'Dashboard', icon: 'pi pi-home', to: 'dashboard'},
            {label: 'Master', icon: 'pi pi-cog', items: [
                {label: 'Category', icon: 'pi pi-cog', to: 'category'},
            ]},
        ]
    }

    onMounted(()=> {
        load_menu()
    })

</script>

<template>
    <Sidebar v-model:visible="sidebarVisible" :showCloseIcon="false" :dismissable="false" class="bg-teal-50" style="padding: 0px; width: 23rem;">
        <div class="flex flex-column h-full">
            <div class="flex justify-content-between">
                <div class="flex align-items-center justify-content-between w-full gap-3 px-3">
                    <Image src="/images/inl.png" alt="Minyak" width="50" />
                    <div class="flex flex-column">
                        <span class="font-bold text-lg">Rio Teguh Ardiarta</span>
                        <span class="font-normal">UI & UX Designer</span>
                    </div>
                </div>
                <Button icon="pi pi-times" size="small" rounded text severity="danger" @click="close"/>
            </div>
            <div class="overflow-y-auto">
                <hr class="border-top-1 border-none" />
                <ul class="list-none p-0 m-0">
                    <li>
                        <ul class="list-none p-0 my-3 overflow-hidden">
                            <li>
                                <span class="font-semibold text-sm text-gray-600">Main Menu</span>
                            </li>
                            <li>
                                <a v-ripple class="flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors p-ripple" @click="redirect('dashboard')">
                                    <i class="pi pi-home mr-2"></i>
                                    <span class="font-medium">Dashboard</span>
                                </a>
                            </li>
                            <!-- <li>
                                <a
                                    v-ripple
                                    v-styleclass="{
                                        selector: '@next',
                                        enterClass: 'hidden',
                                        enterActiveClass: 'slidedown',
                                        leaveToClass: 'hidden',
                                        leaveActiveClass: 'slideup'
                                    }"
                                    class="flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors p-ripple"
                                >
                                    <i class="pi pi-chart-line mr-2"></i>
                                    <span class="font-medium">Master</span>
                                    <i class="pi pi-chevron-down ml-auto"></i>
                                </a>
                                <ul class="list-none py-0 pl-3 pr-0 m-0 hidden overflow-y-hidden transition-all transition-duration-400 transition-ease-in-out">
                                    <li>
                                        <a
                                            v-ripple
                                            v-styleclass="{
                                                selector: '@next',
                                                enterClass: 'hidden',
                                                enterActiveClass: 'slidedown',
                                                leaveToClass: 'hidden',
                                                leaveActiveClass: 'slideup'
                                            }"
                                            class="flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors p-ripple"
                                        >
                                            <i class="pi pi-chart-line mr-2"></i>
                                            <span class="font-medium">Revenue</span>
                                            <i class="pi pi-chevron-down ml-auto"></i>
                                        </a>
                                        <ul class="list-none py-0 pl-3 pr-0 m-0 hidden overflow-y-hidden transition-all transition-duration-400 transition-ease-in-out">
                                            <li>
                                                <a v-ripple class="flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors p-ripple">
                                                    <i class="pi pi-table mr-2"></i>
                                                    <span class="font-medium">View</span>
                                                </a>
                                            </li>
                                            <li>
                                                <a v-ripple class="flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors p-ripple">
                                                    <i class="pi pi-search mr-2"></i>
                                                    <span class="font-medium">Search</span>
                                                </a>
                                            </li>
                                        </ul>
                                    </li>
                                    <li>
                                        <a v-ripple class="flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors p-ripple">
                                            <i class="pi pi-chart-line mr-2"></i>
                                            <span class="font-medium">Expenses</span>
                                        </a>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <a v-ripple class="flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors p-ripple">
                                    <i class="pi pi-users mr-2"></i>
                                    <span class="font-medium">Team</span>
                                </a>
                            </li>
                            <li>
                                <a v-ripple class="flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors p-ripple">
                                    <i class="pi pi-calendar mr-2"></i>
                                    <span class="font-medium">Calendar</span>
                                </a>
                            </li>
                            <li>
                                <a v-ripple class="flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors p-ripple">
                                    <i class="pi pi-cog mr-2"></i>
                                    <span class="font-medium">Settings</span>
                                </a>
                            </li> -->
                        </ul>
                    </li>
                </ul>
            </div>
            <div class="px-3 mt-auto w-full">
                <hr class="border-top-1 border-none" />
                <a v-ripple class="flex align-items-center justify-content-center gap-2 bg-pink-500 text-white cursor-pointer p-3 border-round text-700 hover:surface-100 hover:text-pink-500 transition-duration-150 transition-colors p-ripple">
                    <i class="pi pi-sign-out"></i>
                    <span class="font-medium">Sign Out</span>
                </a>
            </div>
        </div>
    </Sidebar>
</template>