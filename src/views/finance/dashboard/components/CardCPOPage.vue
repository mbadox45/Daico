<script setup>
    // Vue Component
    import { ref, computed, defineProps, onMounted, watch } from 'vue';
    import moment from 'moment';

    // Controller
    import { formatCurrency } from "@/controller/dummy/func_dummy.js";


    // Variable
    const props = defineProps({
        tanggal:{
            type:String
        },
        datas:{
            type:Array,
            default: () => {}
        }
    });

    const days = props.tanggal
    const load_data = ref([])
    const loadingData = ref(false)

    // Function
    const date = computed(()=> moment(props.tanggal).format('DD MMMM YYYY'))
    watch(() => props.datas, (newVal) => {loadProduct(newVal)});

    onMounted(() => {
        loadProduct(props.datas)
    });


    const loadProduct = async(data) => {
        loadingData.value = true
        try {
            const response = data.cpo
            load_data.value = response
            loadingData.value = false
        } catch (error) {
            load_data.value = [
                {name: 'Average Actual Price', exp: 'CPO Olah INL', value:0},
                {name: 'This Month', exp: 'Average CPO KPBN', value:0},
                {name: 'MTD', exp: 'Average CPO KPBN', value:0},
            ]
            loadingData.value = false
        }
    }

</script>
<template>
    <div class="flex flex-column bg-white p-4 w-full border-round shadow-4 gap-4">
        <span class="font-semibold text-2xl flex flex-row-reverse justify-content-between gap-2 border-bottom-1 pb-2 align-items-center text-yellow-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-droplet" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M7.21.8C7.69.295 8 0 8 0q.164.544.371 1.038c.812 1.946 2.073 3.35 3.197 4.6C12.878 7.096 14 8.345 14 10a6 6 0 0 1-12 0C2 6.668 5.58 2.517 7.21.8m.413 1.021A31 31 0 0 0 5.794 3.99c-.726.95-1.436 2.008-1.96 3.07C3.304 8.133 3 9.138 3 10a5 5 0 0 0 10 0c0-1.201-.796-2.157-2.181-3.7l-.03-.032C9.75 5.11 8.5 3.72 7.623 1.82z"/>
                <path fill-rule="evenodd" d="M4.553 7.776c.82-1.641 1.717-2.753 2.093-3.13l.708.708c-.29.29-1.128 1.311-1.907 2.87z"/>
            </svg>
            <span>CPO</span>
        </span>
        <div v-if="load_data.length < 1" class="flex h-10rem align-items-center">
            <div class="w-full">
                <ProgressBar mode="indeterminate" style="height: 6px"></ProgressBar>
            </div>
        </div>
        <div v-else class="flex flex-column gap-4 w-full">
            <div v-for="(item, index) in load_data" class="flex align-items-center w-full gap-3 border-bottom-3 border-left-3 border-round px-3 border-yellow-600 pb-2" :key="index">
                <span class="font-medium w-full text-md text-gray-600 md:text-xl ">{{item.name}}</span>
                <div class="w-full flex flex-column-reverse gap-1 bg-white align-items-end border-round border-white">
                    <span class="font-semibold text-gray-400 text-xs md:text-sm">{{item.exp}}</span>
                    <span class="font-semibold text-yellow-600 text-lg md:text-3xl">
                        <!--<span v-if="loadingData == true">.....</span>-->
                        <span>{{formatCurrency(Number(item.value).toFixed(0))}}</span>
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>