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
    import ChartDougnutPage from '@/views/finance/dashboard/components/ChartDougnutPage.vue'
    import ChartLinePage from '@/views/finance/dashboard/components/ChartLinePage.vue'

    // API
    import {listProduct1, listProduct2, listKemasan} from '@/api/DummyData.js'

    // Variable
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
    <div>
        <!-- Header + Menu -->
    
        <!-- Card Product -->
        <!-- <card-product-page/> -->

        <div class="flex flex-column gap-3 py-2">
            <div class="flex justify-content-between align-items-end gap-5">
                <div class="w-auto flex gap-6 justify-content-between">
                    <span>Avg Kurs :</span>
                    <span class="font-bold"> Rp 15.711</span>
                </div>
                <div class="w-5 flex flex-column gap-1">
                    <span class="font-light text-sm">Data Period</span>
                    <div class="p-inputgroup p-fluid w-full">
                        <span class="p-inputgroup-addon bg-white">
                            <i class="pi pi-calendar"></i>
                        </span>
                        <Dropdown v-model="tahun" :options="list_tahun" optionLabel="name" optionValue="id" placeholder="Tahun" @change="loadBulan" checkmark :highlightOnSelect="false" class="w-full" />
                        <Dropdown v-model="bulan" :options="list_bulan" optionLabel="name" optionValue="id" placeholder="Bulan" checkmark :highlightOnSelect="false" class="w-full" />
                        <span class="p-inputgroup-addon bg-white text-green-500 hover:bg-green-500 hover:text-white" @click="loadTanggal">
                            <i class="pi pi-check font-bold"></i>
                        </span>
                    </div>
                </div>
            </div>
            <div class="p-3 border-1 border-round border-gray-300 flex flex-column gap-5 bg-white">
                <span class="font-semibold text-xl text-center w-full border-bottom-1 pb-3 border-gray-300">MINIMUM SELLING PRICE (EXCL. LEVY DUTY) <i class="pi pi-angle-double-right mx-3 text-xl"></i> GPM 7% Base On CPO Olah INL</span>
                <!-- Produk Kemasan -->
                <div class="flex flex-wrap justify-content-between column-gap-3 row-gap-3 w-full h-auto">
                    <div v-for="(item, index) in kemasan" :key="index" class="p-3 border-round bg-bluegray-400 shadow-2" style="width: 24.2%;">
                            <div class="py-0 px-0 flex align-items-center gap-2">
                                <div class="flex flex-column gap-2 w-full">
                                    <div class="flex justify-content-between border-bottom-1 pb-2 align-items-center w-full text-2xl text-white">
                                        <span class="font-light">Rp {{item.money_rp}}</span>
                                    </div>
                                    <span class="font-medium uppercase text-md text-200">{{item.product}}</span>
                                </div>
                                <Image :src="item.images" class="flex align-items-center justify-content-center" width="60" />
                            </div>
                    </div>
                </div>
                <!-- Produk Mentah -->
                <div class="flex flex-wrap justify-content-between column-gap-3 row-gap-3 w-full h-auto">
                    <div v-for="(item, index) in product" :key="index" class="flex flex-column px-4 py-3 border-round bg-yellow-100 shadow-2" style="width: 32.6%;">
                        <div class="py-0 px-0 flex align-items-center gap-2">
                            <div class="flex flex-column gap-2 w-full">
                                <span class="font-medium uppercase w-full border-bottom-1 pb-2 text-yellow-600 text-md">{{item.product}}</span>
                                <div class="flex justify-content-between align-items-center w-full text-xl text-red-600">
                                    <span class="font-normal">Rp {{item.money_rp}}</span>
                                    <span class="font-normal">$ {{item.money_usd}}</span>
                                </div>
                            </div>
                            <div class="flex flex-column justify-content-center align-items-end">
                                <Image :src="item.images" width="60" />
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Produk Jadi -->
                <div class="flex flex-wrap justify-content-between column-gap-3 row-gap-3 w-full h-auto">
                    <div v-for="(item, index) in product2" :key="index" class="flex flex-column px-4 py-3 border-round bg-yellow-100 shadow-2" style="width: 24.2%;">
                            <div class="py-0 px-0 flex align-items-center gap-2">
                                <div class="flex flex-column gap-2 w-full">
                                    <span class="font-medium uppercase w-full border-bottom-1 pb-2 text-yellow-600 text-md">{{item.product}}</span>
                                    <div class="flex justify-content-between align-items-center w-full text-xl text-red-600">
                                        <span class="font-normal">Rp {{item.money_rp}}</span>
                                        <span class="font-normal">$ {{item.money_usd}}</span>
                                    </div>
                                </div>
                                <div class="flex flex-column justify-content-center align-items-end">
                                    <Image :src="item.images" width="60" />
                                </div>
                            </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Chart Dougnut Realisasi RKAP & Kinerja Produksi -->
        <chart-dougnut-page/>
        
        <card-potensi-page/>

        <!-- Chart Dougnut Realisasi RKAP & Kinerja Produksi -->
        <chart-line-page :tanggal="tanggal"/>
    </div>
</template>