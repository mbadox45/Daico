<script setup>
    // Vue Component
    import { ref, computed, defineProps, onMounted, watch } from 'vue';
    import moment from 'moment';

    // API
    import {listProduct1, listProduct2, listKemasan, listKemasan2} from '@/api/DummyData.js'

    // Variable
    const props = defineProps({
        tanggal:{
            type:String
        }
    });

    const days = props.tanggal
    const product = ref([])
    const product2 = ref([])
    const kemasan = ref([])
    const list_product = listProduct1
    const list_kemasan = listKemasan2

    // Function
    onMounted(() => {
        loadProduct()
    })

    const date = computed(()=> moment(props.tanggal).format('DD MMMM YYYY'))

    const loadProduct = () => {
        product.value = []
        for (let i = 0; i < list_product.length; i++) {
            product.value.push({
                product: list_product[i].product,
                money_rp: list_product[i].money_rp,
                money_usd: list_product[i].money_usd,
                dmo: list_product[i].dmo,
                images: list_product[i].image,
            })
        }

        // product2.value = []
        // for (let i = 0; i < list_product2.length; i++) {
        //     product2.value.push({
        //         product: list_product2[i].product,
        //         money_rp: list_product2[i].money_rp,
        //         money_usd: list_product2[i].money_usd,
        //         images: list_product2[i].image,
        //     })
        // }

        kemasan.value = []
        // for (let i = 0; i < list_kemasan.length; i++) {
        //     kemasan.value.push({
        //         product: list_kemasan[i].product,
        //         money_rp: list_kemasan[i].money,
        //         images: list_kemasan[i].image,
        //     })
        // }
        for (let i = 0; i < list_kemasan.length; i++) {
            kemasan.value.push({
                product: list_kemasan[i].product,
                rp_kemasan: list_kemasan[i].rp_kemasan == null ? '-' : formatCurrency(Number(list_kemasan[i].rp_kemasan)),
                rp_box: list_kemasan[i].rp_box == null ? '-' : formatCurrency(Number(list_kemasan[i].rp_box)),
                rp_box_ppn: list_kemasan[i].rp_box_dmo == null ? '-' : formatCurrency(Number(list_kemasan[i].rp_box_ppn)),
                rp_box_dmo: list_kemasan[i].rp_box_dmo == null ? '-' : formatCurrency(Number(list_kemasan[i].rp_box_dmo)),
                images: list_kemasan[i].image,
            })
        }
    }

    const formatCurrency = (amount) =>  {
        // Convert the number to a string and insert commas every three digits from the right
        let parts = amount.toString().split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');

        // Combine the integer part with the decimal part (if any)
        return parts.join(',');
    }

    watch(() => props.tanggal, () => {
        loadProduct();
    });
</script>
<template>
    <!-- Cards Minimum Selling -->
    <div class="flex flex-column w-full gap-3 mt-4">
        <div class="flex justify-content-between p-3 border-bottom-1 border-gray-400">
            <span class="font-medium text-xl">Minimum Selling Price (Excl. Levy Duty)</span>
            <small class="font-normal text-500">GPM 5% Base On CPO Olah INL</small>
        </div>

        <div class="flex flex-row-reverse justify-content-between align-items-start gap-5">
            <!-- Loading  -->
            <div class="w-full shadow-4 p-3 bg-white border-round">
                <div class="flex gap-2 align-items-center mb-3">
                    <i class="pi pi-info-circle text-xl text-orange-500 font-bold"></i>
                    <span class="text-xl uppercase text-center text-orange-500 font-bold">Retail</span>
                </div>

                <DataTable :value="kemasan" class="border-round">
                    <Column field="product">
                        <template #header>
                            <small class="uppercase">product</small>
                        </template>
                        <template #body="{data}">
                            <span class="font-semibold text-600 text-lg">{{data.product}}</span>
                        </template>
                    </Column>
                    <Column field="name">
                        <template #header>
                            <small class="uppercase">Rp / Kemasan</small>
                        </template>
                        <template #body="{data}">
                            <div class="flex justify-content-between">
                                <span class="font-medium text-teal-600 text-md">Rp. </span>
                                <span class="font-medium text-teal-600 text-md">{{data.rp_kemasan}}</span>
                            </div>
                        </template>
                    </Column>
                    <Column field="category">
                        <template #header>
                            <small class="uppercase">Rp / Box</small>
                        </template>
                        <template #body="{data}">
                            <div class="flex justify-content-between">
                                <span class="font-medium text-pink-600 text-md">Rp. </span>
                                <span class="font-medium text-pink-600 text-md">{{data.rp_box}}</span>
                            </div>
                        </template>
                    </Column>
                    <Column field="quantity">
                        <template #header>
                            <small class="uppercase">Rp / Box (+PPN)</small>
                        </template>
                        <template #body="{data}">
                            <div class="flex justify-content-between">
                                <span class="font-medium text-yellow-600 text-md">Rp. </span>
                                <span class="font-medium text-yellow-600 text-md">{{data.rp_box_ppn}}</span>
                            </div>
                        </template>
                    </Column>
                    <Column field="quantity" style="width: 10rem;">
                        <template #header>
                            <small class="uppercase">Rp / Box +DMO (+PPN)</small>
                        </template>
                        <template #body="{data}">
                            <div class="flex justify-content-between">
                                <span class="font-medium text-purple-600 text-md">Rp. </span>
                                <span class="font-medium text-purple-600 text-md">{{data.rp_box_dmo}}</span>
                            </div>
                        </template>
                    </Column>
                </DataTable>

            </div>
    
            <!-- Unloading -->
            <div class="w-9">
                <div class="grid">
                    <!-- <div class="col-12">
                        <div class="p-3 bg-white shadow-4 border-round align-items-center flex gap-2">
                            <i class="pi pi-info-circle text-xl text-yellow-500 font-bold"></i>
                            <span class="text-xl uppercase text-center text-yellow-500 font-bold">Bulk</span>
                        </div>
                    </div> -->
                    <div v-for="(item, index) in product" :key="index" :class="`${index >= 0 && index < (product.length -1) ? 'col-6' : 'col'}`">
                        <div class="flex flex-column gap-2 justify-content-between align-items-center p-3 border-round bg-bluegray-700 shadow-4">
                            <div class="flex justify-content-between w-full align-items-center gap-2">
                                <div class="flex w-full align-items-center gap-2">
                                    <Avatar :image="item.images" shape="circle" class="bg-white p-1" />
                                    <span class="uppercase font-semibold text-bluegray-100 text-lg">{{item.product}}</span>
                                </div>
                                <small class="text-400">Bulk</small>
                            </div>
                            <div class="flex w-full bg-white gap-3 px-3 border-round">
                                <div class="flex flex-column gap-2 w-full text-bluegray-700">
                                    <span class="font-medium text-sm flex justify-content-center gap-2 w-full border-bottom-1 border-bluegray-700 p-2">
                                        <span>LOCO</span>
                                    </span>
                                    <span class="font-medium text-sm flex justify-content-between gap-2 text-red-500 w-full px-2">
                                        <span>Rp</span>
                                        <span>{{item.money_rp}}</span>
                                    </span>
                                    <span class="font-medium text-sm flex justify-content-between gap-2 text-green-500 w-full px-2 pb-2">
                                        <span>$</span>
                                        <span>{{item.money_usd}}</span>
                                    </span>
                                </div>
                                <div class="flex flex-column gap-2 w-full text-bluegray-700">
                                    <span class="font-medium text-sm flex justify-content-center gap-2 w-full border-bottom-1 border-bluegray-700 p-2">
                                        <span>DMO</span>
                                    </span>
                                    <span class="font-medium text-sm flex justify-content-between gap-2 text-red-500 w-full px-2">
                                        <span>Rp</span>
                                        <span>{{item.dmo.money_rp}}</span>
                                    </span>
                                    <span class="font-medium text-sm flex justify-content-between gap-2 text-green-500 w-full px-2 pb-2">
                                        <span>$</span>
                                        <span>{{item.dmo.money_usd}}</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
    </div>
</template>