<script setup>
    // Vue Component
    import { ref, computed } from 'vue';

    // API
    import {listProduct} from '@/api/DummyData.js'

    // Variable
    const product = ref([])
    const list_product = listProduct

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
    }

    loadProduct()
</script>

<template>
    <div class="bg-gray-100 px-3 py-3 flex flex-wrap">
        <!-- Card for Products -->
        <div class="py-2 px-3 bg-red-50 border-1 border-yellow-100 align-items-center flex gap-2 border-round flex-shrink-1 mx-1 my-2" v-for="(item, index) in product" :key="index" style="width: 300px;">
            <Avatar :image="item.images" class="flex align-items-center justify-content-center mr-2" size="xlarge" />
            <div class="flex flex-column gap-2 w-full">
                <span class="font-bold uppercase text-xl">{{item.product}}</span>
                <div class="flex justify-content-between align-items-center w-full bg-white gap-8">
                    <span class="font-semibold">Rp {{item.money_rp}}</span>
                    <span class="font-semibold">USD {{item.money_rp}}</span>
                </div>
            </div>
        </div>
    </div>
    <!-- <div class="grid gap-2 w-auto" >
        <div class="col-6 border-1 border-yellow-100 bg-white border-round" v-for="(item, index) in product" :key="index" style="display: inline-block;">
            <Avatar :image="item.images" class="flex align-items-center justify-content-center mr-2" size="xlarge" />
            <div class="flex flex-column gap-2 w-full">
                <span class="font-bold uppercase text-xl">{{item.product}}</span>
                <div class="flex justify-content-between align-items-center w-full bg-white gap-8">
                    <span class="font-semibold">Rp {{item.money_rp}}</span>
                    <span class="font-semibold">USD {{item.money_rp}}</span>
                </div>
            </div>
        </div>
    </div> -->
</template>