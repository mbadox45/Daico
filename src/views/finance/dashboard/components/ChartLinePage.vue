<script setup>
    // Vue Component
    import { ref, computed } from 'vue';

    // API
    import {avg_cpo} from '@/api/dummy/avg_cpo.js'

    // Variable
    const chartData = ref();
    const chartOptions = ref();
    const cpo_kpbn = avg_cpo;

    // Function
    const loadProduct = () => {
        const labels = cpo_kpbn.map(item => item.tgl);
        const datas = cpo_kpbn.map(item => item.avg_cpo);
        chartData.value = setChartData(datas, labels);
        chartOptions.value = setChartOptions();
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

    loadProduct()
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