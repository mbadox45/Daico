<script setup>
    // Vue Component
    import { ref, onMounted, computed, defineProps, watch } from 'vue';
    import moment from 'moment';
    import { useRouter, useRoute } from 'vue-router';

    // API ========================================================================================================================================================
    // import {loadMainTarget} from '@/views/load_data/target.js';
    import {reportTarget} from '@/controller/retail/TargetController.js';

    const props = defineProps({
        tanggal:{
            type:String
        }
    });

    // VARIABLE
    const loadingTable = ref(false)
    const products = ref([]);
    const dmos = ref({})
    const cpo_olah_vs_rkap = ref([]);
    const cpo_olah_vs_utility = ref([]);

    const router = useRouter();

    watch(() => props.tanggal, (newVal) => {loadData(newVal)});

    // Function ===================================================================================================================================================
    // onMounted(() => {
    //     loadData(props.tanggal)
    // });

    const loadData = async(tgl) => {
        loadingTable.value = true;
        const response = await reportTarget(tgl)
        products.value = response
        loadingTable.value = false;
    }

    const calculateCustomerTotal = (name, cond) => {
        let total = 0;

        if (products.value) {
            for (let product of products.value) {
                if (name == 'all') {
                    if (cond == 'real') {
                        total = total + Number(product.real);
                    } else {
                        total = total + Number(product.rkap);
                    }
                } else {
                    if (product.type === name) {
                        if (cond == 'real') {
                            total = total + Number(product.real);
                        } else {
                            total = total + Number(product.rkap);
                        }
                    } else {
                        continue;
                    }
                }
            }
        }

        return total;
    };

</script>

<template>
    <div class="flex flex-column gap-5">
        <div class="flex justify-content-between gap-4">
            <span class="text-xl font-bold font-italic">Report Target Penjualan & Produksi</span>
        </div>
        <!-- Table -->
        <div v-if="loadingTable == true" class="flex flex-column-reverse justify-content-center align-items-center gap-3">
            <div>
                <span class="text-xl font-normal">Loading...</span>
            </div>
            <div>
                <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" animationDuration="1s" aria-label="Custom ProgressSpinner" />
            </div>
        </div>
        <div v-else class="flex flex-column gap-5">
            <div v-if="products.length < 1" class="w-full flex justify-content-center h-5rem align-items-center">
                <span class="font-light text-xl">--- Data not found ---</span>
            </div>
            <div v-else class="flex flex-column gap-2">
                <div v-for="(produk, index) in products" class="flex flex-column gap-2 p-3 border-round border-3 border-gray-200" :key="index">
                    <span class="font-semibold text-sm font-italic">{{produk.nama}}</span>
                    <div class="pt-3 w-full flex flex-column gap-2">
                        <div class="grid">
                            <div class="col-12">
                                <div class="grid">
                                    <div class="col-8 px-4">
                                        <div class="grid border-round bg-green-600 font-bold text-sm text-white">
                                            <div class="col-3 text-center">PRODUCT</div>
                                            <div class="col-3 text-center">REAL</div>
                                            <div class="col-3 text-center">RKAP</div>
                                            <div class="col-3 text-center">DIFF</div>
                                        </div>
                                    </div>
                                    <div class="col-4 px-4">
                                        <div class="grid border-round bg-green-600 font-bold text-sm text-white">
                                            <div class="col-6 text-center">REAL</div>
                                            <div class="col-6 text-center">SISA TARGET</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-12" v-if="produk.items.length < 1">
                                <div class="grid">
                                    <div class="col-12 flex justify-content-center">
                                        <span class="font-light text-md">--- Data not found ---</span>
                                    </div>
                                </div>
                            </div>
                            <div class="col-12" v-else>
                                <div class="px-2">
                                    <div class="grid border-round align-items-center" v-for="(qty, indexs) in produk.items" :class="indexs == 0 ? 'mt-0' : 'mt-1'" :key="indexs">
                                        <div class="col-12 py-1" v-if="indexs < (produk.items.length - 1) && qty.nama != null">
                                            <span class="font-italic underline font-medium uppercase">{{ qty.nama }}</span>
                                        </div>
                                        <div class="col-12 py-1" v-if="qty.items.length > 1">
                                            <div class="grid" v-for="(items, num) in qty.items" :key="num">
                                                <div class="col-8 py-1">
                                                    <div class="grid text-xs font-medium">
                                                        <div class="col-3">{{ items.productable_name }}</div>
                                                        <div class="col-3 text-right">{{ items.total_real }}</div>
                                                        <div class="col-3 text-right">{{ items.total_rkap }}</div>
                                                        <div class="col-3 text-right">{{ items.total_diff }}</div>
                                                    </div>
                                                </div>
                                                <div class="col-4">
                                                    <div class="grid text-xs font-medium">
                                                        <div class="col-6"></div>
                                                        <div class="col-6"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-12 py-1">
                                            <div class="grid">
                                                <div class="col-8">
                                                    <div :class="index < 1 ? 'bg-gray-900 text-white' : 'border-top-1 border-bottom-1'" class="grid font-bold text-sm font-italic">
                                                        <div class="col-3">{{ qty.name }}</div>
                                                        <div class="col-3 text-right">{{ qty.total_real }}</div>
                                                        <div class="col-3 text-right">{{ qty.total_rkap }}</div>
                                                        <div class="col-3 text-right">{{ qty.total_diff }}</div>
                                                    </div>
                                                </div>
                                                <div class="col-4">
                                                    <div class="grid font-bold text-sm bg-gray-900 text-white font-italic">
                                                        <div class="col-6 text-right">{{ qty.persen_real }}</div>
                                                        <div class="col-6 text-right">{{ qty.persen_remaining }}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="w-full flex justify-content-between gap-4">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>