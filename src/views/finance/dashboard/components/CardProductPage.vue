<script setup>
    // Vue Component
    import { ref, computed } from 'vue';

    // API
    import {listProduct, listKemasan} from '@/api/DummyData.js'

    // Variable
    const product = ref([])
    const kemasan = ref([])
    const list_product = listProduct
    const list_kemasan = listKemasan

    // Function
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

        kemasan.value = []
        for (let a = 0; a < list_kemasan.length; a++) {
            kemasan.value.push({
                product: list_kemasan[a].product,
                money_rp: list_product[a].money_rp,
                images: list_kemasan[a].image,
            })
        }
    }

    loadProduct()
</script>

<template>
    <div class="flex flex-column gap-2 px-4 py-2">
        <div class="text-center bg-yellow-100 py-2">
            <span class="font-semibold">MINIMUM SELLING PRICE (EXCL. LEVY DUTY) --> GPM 7% Base On CPO Olah INL</span>
        </div>
        <div class="gap-7 flex align-items-start">
            <!-- Card for Products -->
            <!-- <div class="py-2 px-3 bg-red-50 border-1 border-yellow-100 align-items-center justify-content-center flex gap-2 border-round flex-shrink-1 my-2" v-for="(item, index) in product" :key="index" style="width: 25rem;">
                <Avatar :image="item.images" class="flex align-items-center justify-content-center mr-2" size="xlarge" />
                <div class="flex flex-column gap-2 w-full">
                    <span class="font-bold uppercase text-xl">{{item.product}}</span>
                    <div class="flex justify-content-between align-items-center w-full bg-white">
                        <span class="font-semibold mx-2">Rp {{item.money_rp}}</span>
                        <span class="font-semibold mx-2">USD {{item.money_usd}}</span>
                    </div>
                </div>
            </div> -->
            <div class="flex flex-wrap w-full">
                <Card v-for="(item, index) in product" :key="index" class="w-4 border-noround border-1 shadow-none border-red-500">
                    <template #content>
                        <div class="py-0 px-0 flex">
                            <Avatar :image="item.images" class="flex align-items-center justify-content-center mr-2" size="large" />
                            <div class="flex flex-column gap-2 w-full">
                                <span class="font-bold uppercase text-md">{{item.product}}</span>
                                <div class="flex justify-content-between align-items-center w-full bg-white text-xs">
                                    <span class="font-semibold">Rp {{item.money_rp}}</span>
                                    <span class="font-semibold">USD {{item.money_usd}}</span>
                                </div>
                            </div>
                        </div>
                    </template>
                </Card>
            </div>

            <div class="flex flex-wrap w-6">
                <Card v-for="(item, index) in kemasan" :key="index" class="w-6 border-noround border-1 shadow-none border-yellow-500">
                    <template #content>
                        <div class="py-0 px-0 flex gap-2">
                            <Avatar :image="item.images" class="flex align-items-center justify-content-center" size="large" />
                            <div class="flex flex-column gap-2 w-full">
                                <span class="font-bold uppercase text-md">{{item.product}}</span>
                                <div class="flex justify-content-between align-items-center w-full bg-white text-sm">
                                    <span class="font-semibold" style="color:#135D66;">Rp {{item.money_rp}}</span>
                                </div>
                            </div>
                        </div>
                    </template>
                </Card>
            </div>
        </div>
    </div>
</template>