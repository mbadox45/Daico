<script setup>
    // Vue Component
    import { useLayout } from '@/layout/composables/layout';
    import { ref, computed, onMounted } from 'vue';
    import { useRouter } from 'vue-router';
    import { useToast } from 'primevue/usetoast';
    import moment from 'moment';

    // Components
    import CardPotensiPage from '@/views/finance/dashboard/components/CardPotensiPage.vue'
    import CardProductPage from '@/views/finance/dashboard/components/CardProductPage.vue'
    import ChartDougnutPage from '@/views/finance/dashboard/components/ChartDougnutPage2.vue'
    import ChartLinePage from '@/views/finance/dashboard/components/ChartLinePage.vue'

    // API
    import {listProduct1, listProduct2, listKemasan} from '@/api/DummyData.js'

    // Variable
    const userName = ref(JSON.parse(localStorage.getItem('payload')))
    const product = ref([])
    const product2 = ref([])
    const kemasan = ref([])
    const list_product = listProduct1
    const list_product2 = listProduct2
    const list_kemasan = listKemasan

    const bulan = ref(Number(moment().format('M')) );
    const list_bulan = ref([]);
    const tahun = ref(Number(moment().format('yyyy')));
    const list_tahun = ref([]);
    const tanggal = ref(`${tahun.value}-${bulan.value.toString().padStart(2, '0')}-01`)

    // Function
    onMounted(() => {
        loadProduct()
    })

    const loadProduct = () => {
        product.value = []
        for (let i = 0; i < list_product.length; i++) {
            product.value.push({
                product: list_product[i].product,
                money_rp: list_product[i].money_rp,
                money_usd: list_product[i].money_usd,
                images: list_product[i].image,
            })
        }

        product2.value = []
        for (let i = 0; i < list_product2.length; i++) {
            product2.value.push({
                product: list_product2[i].product,
                money_rp: list_product2[i].money_rp,
                money_usd: list_product2[i].money_usd,
                images: list_product2[i].image,
            })
        }

        kemasan.value = []
        for (let i = 0; i < list_kemasan.length; i++) {
            kemasan.value.push({
                product: list_kemasan[i].product,
                money_rp: list_kemasan[i].money,
                images: list_kemasan[i].image,
            })
        }

        loadBulan()
        loadTahun()
    }

    const loadBulan = () => {
        list_bulan.value = []
        if (tahun.value >= Number(moment().format('yyyy'))) {
            const month = Number(moment().format('M'))
            for (let i = 1; i <= month; i++) {
                const dateString = `2024-${i.toString().padStart(2, '0')}-01`;
                const monthName = moment(dateString, 'YYYY-MM-DD').format('MMMM');
                list_bulan.value.push({ id: i, name: monthName });
            }
        } else {
            for (let i = 1; i <= 12; i++) {
                const dateString = `2024-${i.toString().padStart(2, '0')}-01`;
                const monthName = moment(dateString, 'YYYY-MM-DD').format('MMMM');
                list_bulan.value.push({ id: i, name: monthName });
            }
        }
    }

    const loadTahun = () => {
        const year = Number(moment().format('yyyy'))
        list_tahun.value = []
        for (let i = 2020; i <= year; i++) {
            list_tahun.value.push({ id: i, name: i });
        }
    }

    const loadTanggal = () => {
        tanggal.value = `${tahun.value}-${bulan.value.toString().padStart(2, '0')}-01`;
    }

</script>

<template>
    <div class="flex flex-column gap-5 mt-5 md:mt-0 ">
        <!-- <div class="flex md:flex-row flex-column align-items-start gap-4 w-full"> -->
        <div class="flex md:flex-row flex-column gap-4 w-full">
            <div class="flex flex-column w-full gap-4">

                <!-- Cards Update Date & View Avg Kurs -->
                <div class="bg-white p-4 border-round shadow-3 flex justify-content-between w-full">
                    <div class="flex flex-column gap-2 w-auto">
                        <strong class="font-medium text-2xl text-700 flex justify-content-between align-items-center uppercase">Dashboard Trading <i class="pi pi-desktop text-2xl ml-3"></i></strong>
                        <span class="font-normal text-400">Update data s.d {{ moment().format('MMM YYYY') }} </span>
                        <Button label="Change Month" severity="info" size="small" class="mt-3"/>
                    </div>
                    <div class="flex flex-column p-3 bg-bluegray-50 border-round">
                        <span class="text-5xl text-500 flex gap-3 justify-content-between"><span>Rp</span> <span>15.711</span></span>
                        <Divider/>
                        <div class="font-medium border-round flex gap-2 w-auto">
                            <small class="flex gap-2 text-cyan-500 text-xs"><i class="pi pi-caret-right"></i> Average Kurs</small>
                        </div>
                    </div>
                </div>

                <!-- Cards Minimum Selling -->
                <div class="flex flex-column bg-white p-4 border-round shadow-3 gap-5 w-full">
                    <div class="flex justify-content-between">
                        <span class="font-medium text-xl">Minimum Selling Price (Excl. Levy Duty)</span>
                        <small class="font-normal text-500">GPM 7% Base On CPO Olah INL</small>
                    </div>
    
                    <!-- Loading  -->
                    <div>
                        <span class="font-medium text-yellow-600">Product</span>
                        <div class="flex flex-wrap md:flex-nowrap justify-content-between gap-3 mt-2">
                            <div v-for="(item, index) in kemasan" :key="index" class="w-full" :class="kemasan.length-1 != index ? 'border-right-1 border-gray-400' : ''">
                                <div class="flex flex-column">
                                    <span class="uppercase font-semibold text-600 text-md">{{item.product}}</span>
                                    <small class="text-400">Product</small>
                                </div>
                                <span class="uppercase font-normal text-yellow-600 text-2xl">Rp {{item.money_rp}}</span>
                            </div>
                        </div>
                    </div>
    
                    <!-- Unloading -->
                    <div>
                        <span class="font-medium text-yellow-600">Bulk</span>
                        <div class="flex flex-wrap justify-content-between gap-3 mt-2">
                            <div v-for="(item, index) in product2" :key="index" class="w-full md:w-5 flex justify-content-between align-items-center pb-3 border-bottom-1 border-gray-300">
                                <div class="flex flex-column">
                                    <span class="uppercase font-semibold text-600 text-md">{{item.product}}</span>
                                    <small class="text-400">Bulk</small>
                                </div>
                                <div class="flex flex-column gap-2 w-auto">
                                    <span class="font-medium text-600 text-red-500 text-md flex justify-content-between gap-2 w-full">
                                        <span>Rp</span>
                                        <span>{{item.money_rp}}</span>
                                    </span>
                                    <span class="font-medium text-600 text-green-500 text-md flex justify-content-between gap-2 w-full">
                                        <span>$</span>
                                        <span>{{item.money_usd}}</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="flex flex-wrap justify-content-between gap-3">
                            <div v-for="(item, index) in product" :key="index" class="w-full md:w-5 flex justify-content-between align-items-center py-2 border-bottom-1 border-gray-300" >
                                <div class="flex flex-column">
                                    <span class="uppercase font-semibold text-600 text-md">{{item.product}}</span>
                                    <small class="text-400">Unloading</small>
                                </div>
                                <div class="flex flex-column gap-2 w-auto">
                                    <span class="font-medium text-600 text-red-500 text-md flex justify-content-between gap-2 w-full">
                                        <span>Rp</span>
                                        <span>{{item.money_rp}}</span>
                                    </span>
                                    <span class="font-medium text-600 text-green-500 text-md flex justify-content-between gap-2 w-full">
                                        <span>$</span>
                                        <span>{{item.money_usd}}</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Cards Statistics -->
            <chart-dougnut-page/>
        </div>
        <card-potensi-page/>

        <!-- Chart Avg  -->
        <!-- <div class="flex md:flex-row flex-column align-items-start gap-4 w-full">
            <div class="bg-white p-4 border-round shadow-3 flex justify-content-between w-full">
                <div class="flex flex-column gap-2 w-auto">
                    <strong class="font-medium text-2xl text-700 flex justify-content-between align-items-center">Hello Dogs! <i class="pi pi-users text-2xl"></i></strong>
                    <span class="font-normal text-400">Update data s.d {{ moment().format('31 MMM YYYY') }} </span>
                    <Button label="Change Date" severity="info" size="small" class="mt-3"/>
                </div>
                <div class="flex flex-column p-3 bg-bluegray-50 border-round">
                    <span class="text-5xl text-500 flex gap-3 justify-content-between"><span>Rp</span> <span>15.711</span></span>
                    <Divider/>
                    <div class="font-medium border-round flex gap-2 w-auto">
                        <small class="flex gap-2 text-cyan-500 text-xs"><i class="pi pi-caret-right"></i> Average Kurs</small>
                    </div>
                </div>
            </div>
        </div> -->
    </div>
</template>