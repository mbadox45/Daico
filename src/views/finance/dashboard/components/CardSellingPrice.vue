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

    const userName = ref(JSON.parse(localStorage.getItem('payload')))
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
    <div class="flex flex-column gap-5 w-full mt-5">
        <div class="flex justify-content-between border-bottom-1 border-gray-300 pb-3">
            <span class="font-medium text-xl">Minimum Selling Price (Excl. Levy Duty)</span>
            <small class="font-normal text-500">GPM 5% Base On CPO Olah INL</small>
        </div>

        <div class="flex flex-row-reverse justify-content-between gap-5">
            <!-- Loading  -->
            <div class="w-full bg-white shadow-3 border-round p-4">
                <div class="w-full flex justify-content-between gap-3 border-bottom-1 border-gray-300 pb-2">
                    <span class="font-medium text-yellow-600 uppercase text-lg">Retail</span>
                    <small class="text-400"> Finish Product</small>
                </div>
                <div class="flex flex-column justify-content-between gap-3 mt-3">
                    <div v-for="(item, index) in kemasan" :key="index" class="w-full flex flex-column align-items-center gap-2" :class="kemasan.length-1 != index ? 'border-bottom-1 border-gray-400 pb-2' : ''">
                        <div class="flex flex-column w-full">
                            <span class="uppercase font-semibold text-600 text-sm">{{item.product}}</span>
                            <!-- <small class="text-400">Product</small> -->
                        </div>
                        <div class="flex gap-2 justify-content-center w-full">
                            <div class="flex flex-column w-full">
                                <small class="text-400">Rp / Kemasan</small>
                                <span class="uppercase font-normal text-yellow-600 text-lg">Rp {{item.rp_kemasan}}</span>
                            </div>
                            <div class="flex flex-column w-full">
                                <small class="text-400">Rp / Box</small>
                                <span class="uppercase font-normal text-yellow-600 text-lg">Rp {{item.rp_box}}</span>
                            </div>
                            <div class="flex flex-column w-full">
                                <small class="text-400">Rp / Box (+PPN)</small>
                                <span class="uppercase font-normal text-yellow-600 text-lg">Rp {{item.rp_box_ppn}}</span>
                            </div>
                            <div class="flex flex-column w-full">
                                <small class="text-400">Rp / Box +DMO (+PPN)</small>
                                <span class="uppercase font-normal text-yellow-600 text-lg">Rp {{item.rp_box_dmo}}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    
            <!-- Unloading -->
            <div class="w-full">
                <span class="font-medium text-yellow-600 uppercase text-lg">Bulk</span>
                <!-- <Divider>
                </Divider> -->
                <div class="flex flex-wrap justify-content-between gap-3 mt-3">
                    <div v-for="(item, index) in product" :key="index" class="flex flex-column gap-2 justify-content-between align-items-center p-2 border-round bg-bluegray-700" style="width: 48%;">
                        <div class="flex justify-content-center w-full align-items-center gap-2">
                            <Avatar :image="item.images" shape="circle" />
                            <span class="uppercase font-semibold text-white text-xl">{{item.product}}</span>
                        </div>
                        <div class="flex w-full gap-2">
                            <div class="flex flex-column gap-2 w-full bg-white border-round text-orange-700">
                                <span class="font-medium text-sm flex justify-content-center gap-2 w-full border-bottom-1 border-bluegray-700 p-2">
                                    <span>LOCO</span>
                                </span>
                                <span class="font-medium text-sm flex justify-content-between gap-2 w-full px-2">
                                    <span>Rp</span>
                                    <span>{{item.money_rp}}</span>
                                </span>
                                <span class="font-medium text-sm flex justify-content-between gap-2 w-full px-2 pb-2">
                                    <span>$</span>
                                    <span>{{item.money_usd}}</span>
                                </span>
                            </div>
                            <div class="flex flex-column gap-2 w-full bg-white border-round text-orange-700">
                                <span class="font-medium text-sm flex justify-content-center gap-2 w-full border-bottom-1 border-bluegray-700 p-2">
                                    <span>DMO</span>
                                </span>
                                <span class="font-medium text-sm flex justify-content-between gap-2 w-full px-2">
                                    <span>Rp</span>
                                    <span>{{item.dmo.money_rp}}</span>
                                </span>
                                <span class="font-medium text-sm flex justify-content-between gap-2 w-full px-2 pb-2">
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
</template>