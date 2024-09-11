import { stackedChartOptionsApex, barStackedChartOptionsApex, distributedColumnChart} from "@/controller/dummy/func_dummy.js";
import moment from "moment";


export const persediaanAwal = async() => {

    const labels = [''];
    const dataSeries = [
        { label: 'Cash Released - Baseline', data: [506] },
        { label: 'Piutang - Baseline', data: [42] }
    ];

    const typeChart = 'bar';
    const total = '*';
    const toolbar = true
    // Generating the series dynamically using a loop
    const series = dataSeries.map(dataItem => ({
        name: dataItem.label,
        data: dataItem.data
    }));
    const columnWidth = '20%'
    return {
        name: 'Inventory - Persediaan Awal (31 Dec) (In IDR Bn)',
        type: typeChart,
        chartOptions: stackedChartOptionsApex(total, labels, toolbar, columnWidth),
        series: series,
    };
}

export const addlProd = async() => {

    const labels = [''];
    const dataSeries = [
        { label: 'Cash Released - Add`l Prod', data: [1037] },
        { label: 'Piutang - Add`l Prod', data: [12] },
        { label: 'Bottom Stock - Add`l Prod', data: [16] },
        { label: 'Existing Stock - Add`l Prod', data: [182] }
    ];

    const typeChart = 'bar';
    const total = '*';

    const toolbar = true


    // Generating the series dynamically using a loop
    const series = dataSeries.map(dataItem => ({
        name: dataItem.label,
        data: dataItem.data
    }));
    const columnWidth = '20%'

    return {
        name: 'Inventory - Add`l Prod(per 17 Jul) (In IDR Bn)',
        type: typeChart,
        chartOptions: stackedChartOptionsApex(total, labels, toolbar, columnWidth),
        series: series,
    };
}

export const retailInven = async() => {

    const labels = ['01 Jan', '09 Jul', '17 Jul'];
    const dataSeries = [
        { label: 'RBD Olein IV-60 (Salvaco & Nusakita)', data: [550.63, 510, 496] },
        { label: 'RBD Olein IV-57 (INL)', data: [1168.07, 207, 160] },
        { label: 'RBD Olein IV-56 (Minyakita)', data: [346.74, 119, 101] }
    ];

    const typeChart = 'bar'
    const total = 'by Day'

    const series = dataSeries.map(dataItem => ({
        name: dataItem.label,
        data: dataItem.data
    }));

    return {
        name: 'Retail Inventory Level (in Tons)',
        total: total,
        type: typeChart,
        chartOptions: stackedChartOptionsApex(total, labels, null, null),
        series: series,
    }
}

export const bulkInven = async() => {

    const labels = ['31 Mar', '07 Jul', '14 Jul'];
    const dataSeries = [
        { label: 'RBDPO', data: [244.43, 339, 225] },
        { label: 'RBD Stearin', data: [9382.22, 2398, 1663] },
        { label: 'RBD Olein IV-56 (Bulk)', data: [2968.24, 630, 462.98] },
        { label: 'RBD Olein IV-57 (Bulk)', data: [1072.44, 584, 549.11] },
        { label: 'RBD Olein IV-58 (Bulk)', data: [5687.65, 4668, 4595.17] },
        { label: 'RBD Olein IV-60 (Bulk)', data: [47.54, 47.54, 47.54] },
        { label: 'PFAD', data: [2166, 676, 569.57] }
    ];

    const typeChart = 'bar'
    const total = 'by Week'

    const series = dataSeries.map(dataItem => ({
        name: dataItem.label,
        data: dataItem.data
    }));

    return {
        name: 'Bulk Inventory Level (in Tons)',
        total: total,
        type: typeChart,
        chartOptions: stackedChartOptionsApex(total, labels, null, null),
        series: series,
    }
}

export const penagihanPiutang = async() => {

    const labels = [
                    'Arcis Global Merchants', 
                    'Cipta Usaha Negeri', 
                    'Mitra Food Prime', 
                    'Inti Hidup Sejahtera', 
                    'Perusahaan Perdagangan Indonesia', 
                    'Akbar Putra Pratama', 
                    'Union Global Resources', 
                    'Chaliza Pesona Nusa', 
                    'Inti Khatulistiwa Perkasa', 
                    'Hudori Berkah Jaya', 
                    'Others'
                ];
    const dataSeries = [
        { label: 'Outstanding', data: [44.33, 26.99, 21.74, 5.6, 15.29, 7.69, 12.51, 3.65, 9.6, 6.19, 13.6] },
        { label: 'Lunas', data: [0, 3.66, 0.35, 5.11, 0.2, 3.76, 1.02, 4.89, 0, 0.86, 13.45] }
    ];

    const outstandingData = dataSeries.find(series => series.label === 'Outstanding');
    const sum = outstandingData ? outstandingData.data.reduce((acc, val) => acc + val, 0) : 0;
    const total = parseFloat(sum).toFixed(2)+' Bn IDR of Total Piutang Outstanding'
    const typeChart = 'bar'

    const series = dataSeries.map(dataItem => ({
        name: dataItem.label,
        data: dataItem.data
    }));

    return {
        name: 'Penagihan Piutang Top 20 Debitur (per 12 Jul; in IDR Bn)',
        total: total,
        type: typeChart,
        chartOptions: barStackedChartOptionsApex(total, labels),
        series: series,
    }
}

export const salesRevenue = async() => {
    const labels = ['Curret Potensial (Real)', 'EBITDA Positive (Target)', 'Net Profit Positive (Target)'];
    const colors = [
                    'rgba(255, 69, 96, 0.85)', 
                    'rgba(119, 93, 208, 0.85)',
                    'rgba(84, 110, 122, 0.85)',
                ]
    const typeChart = 'bar'
    return {
        name: 'Sales Revenue Forecast (FY`24) (in IDR Bn)',
        total: '*',
        type: typeChart,
        chartOptions: distributedColumnChart(labels, colors),
        series: [
            {
                data: [4018.2, 5408.7, 10066]
            }
        ],
    }
}

export const salesVolumeBulk = async() => {
    const labels = ['Curret Potensial (Real)', 'EBITDA Positive (Target)', 'Net Profit Positive (Target)'];
    const colors = [
                    'rgba(0, 143, 251, 0.85)', 
                    'rgba(0, 227, 150, 0.85)', 
                    'rgba(254, 176, 25, 0.85)',
                ]
    const typeChart = 'bar'
    return {
        name: 'Sales Volume / Month (Bulk - OLEIN) (in Tons)',
        total: '*',
        type: typeChart,
        chartOptions: distributedColumnChart(labels, colors),
        series: [
            {
                data: [22000, 35000, 70000]
            }
        ],
    }
}
export const salesVolumeRetail = async() => {
    const labels = ['Curret Potensial (Real)', 'EBITDA Positive (Target)', 'Net Profit Positive (Target)'];
    const colors = [
                    'rgba(38, 166, 154, 0.85)',
                    'rgba(209, 12, 232, 0.85)', 
                    'rgba(254, 176, 25, 0.85)',
                ]
    const typeChart = 'bar'
    return {
        name: 'Sales Volume / Month (Retail - OLEIN) (in Tons)',
        total: '*',
        type: typeChart,
        chartOptions: distributedColumnChart(labels, colors),
        series: [
            {
                data: [2000, 2000, 7000]
            }
        ],
    }
}

export const costEfficiency = async () => {
    // Revenue Ytd
    const labels = ['Refining', 'Fractionation', 'Man Power', 'Admin OH', 'Logistics', 'Insurance'];
    const data1 = [0, 0, 1.5, 0.5, 0, 0]; // Actual values
    const data2 = [2.1, 2.7, 2, 0.7, 3.8, 0.2]; // Target values

    const label1 = 'Actual';
    const label2 = 'Remaining';
    const typeChart = 'bar';
    const total = '*'


    // Calculate the remaining target for each point
    const remaining = data2.map((target, index) => Math.max(target - data1[index], 0));

    return {
        name: 'Cost Efficiency Achievement (USD / Ton CPO Olah)',
        total: 'by Week',
        type: typeChart,
        chartOptions: stackedChartOptionsApex(total, labels, true),
        series: [
            {
                name: label1,
                data: data1 // Remaining data as the bottom part of the bar
            },
            {
                name: label2,
                data: remaining // Actual data as the top part of the bar
            }
        ]
    };
};