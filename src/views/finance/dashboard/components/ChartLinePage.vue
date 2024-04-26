<script setup>
    // Vue Component
    import { ref, computed, onMounted, defineProps } from 'vue';
    import moment from 'moment';

    // API
    import {avg_cpo} from '@/api/dummy/avg_cpo.js'
    import KpbnCpo from '@/api/cpo/KpbnCpo.js';

    // Variable
    const props = defineProps({
        tanggal:{
            type:String
        },
    });

    const date = props.tanggal;

    // const tanggal = computed(() => { 
    //     date
    // });

    const chartData = ref();
    const chartOptions = ref();
    const cpo_kpbn = avg_cpo;
    const products = ref();

    // Function

    onMounted(() => {
        // loadProduct()
        loadData()
    })
    const loadProduct = () => {
        const labels = cpo_kpbn.map(item => item.tgl);
        const datas = cpo_kpbn.map(item => item.avg_cpo);
        chartData.value = setChartData(datas, labels);
        chartOptions.value = setChartOptions();
    }

    const loadData = async () => {
        try {
            const list = []
            // const dateString = '2024-03-01';
            const dateString = date;
            const response = await KpbnCpo.getByDate({tanggal: dateString})
            const load = response.data;
            const data = load.data;
            for (let a = 0; a < data.length; a++) {
                list.push({
                    id:data[a].id,
                    tanggal:moment(data[a].tanggal).format('DD-MMM-YYYY'),
                    avg:data[a].avg,
                    // avg:formatCurrency(data[a].avg),
                })
            }
            console.log(list)
            const labels = list.map(item => item.tanggal);
            const datas = list.map(item => item.avg);
            chartData.value = setChartData(datas, labels);
            chartOptions.value = setChartOptions();
        } catch (error) {
            chartData.value = []
            chartOptions.value = []
        }
    }

    const formatCurrency = (amount) => {
        let parts = amount.toString().split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');

        return parts.join(',');
    }

    const setChartData = (data, label) => {
        const documentStyle = getComputedStyle(document.body);
        
        return {
            labels: label,
            datasets: [
                {
                    label: 'Avg CPO KPBN',
                    data: data,
                    fill: false,
                    borderColor: documentStyle.getPropertyValue('--cyan-500'),
                    tension: 0.4
                }
            ]
        };
    }

    const setChartOptions = () => {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        return {
            maintainAspectRatio: false,
            aspectRatio: 0.6,
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
                    }
                }
            }
        };
    };
</script>

<template>
    <div class="flex flex-column gap-2">
        <div class="gap-7 flex align-items-start">
            <div class="card flex flex-wrap w-full border-round shadow-3">
                <div class="w-full bg-white pt-2 text-center">
                    <Chart type="line" :data="chartData" :options="chartOptions" class="h-30rem" />
                </div>
            </div>
        </div>
    </div>
</template>