import { barChartOptionsApex, comboChartOptionsApex, stackedChartOptionsApex} from "@/controller/dummy/func_dummy.js";
import moment from "moment";

export const revenueYtd = async() => {
    // Revenue Ytd
    const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const data1 =[353.32, 802, 852.69, 1207.45, 1718.87, 1643.25, 0, 0, 0, 0, 0, 0]
    const data2 =[378.46, 187.77, 190.14, 240.53, 194.27, 242.86, 0, 0, 0, 0, 0, 0]
    const label1 = 'Target RKAP'
    const label2 = 'Pendapatan'
    const type1 = 'line'
    const type2 = 'bar'
    const colors = ['rgba(245, 217, 5, 0.6)', 'rgba(0, 34, 255, 1)']
    const total = '*'
    const scale1 = 'number'
    const scale2 = 'number'
    const typeChart = 'line'
    
    const listLabels = []
    for (let i = 0; i < labels.length; i++) {
        listLabels.push(moment(labels[i],'MMMM').format('MMM'))
    }

    return {
        name: 'Revenue YTD (in IDR Bn)',
        type: typeChart,
        chartOptions: comboChartOptionsApex(total, label1, label2, listLabels, colors, scale1, scale2),
        series: [
            {
                name: label2,
                type: type2,
                data: data2
            }, 
            {
                name: label1,
                type: type1,
                data: data1
            }
        ],
    }
}

export const grossProfit = async() => {
    // Revenue Ytd
    const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const data1 =[3, 4.43, 6.19, 10.66, 5.43, 4.85, 0, 0, 0, 0, 0, 0]
    const data2 =[11.4, 8.3, 11.8, 25.6, 10.6, 11.8, 0, 0, 0, 0, 0, 0]
    const sum = parseFloat(data2.reduce((accumulator, currentValue) => accumulator + currentValue, 0).toFixed(2));
    const total = sum+'B IDR of Gross Profit (YTD)'
    const label1 = 'GPM%'
    const label2 = 'Laba Kotor'
    const type1 = 'line'
    const type2 = 'column'
    const colors = ['rgba(157, 5, 245, 0.6)', 'rgba(0, 34, 255, 1)']
    const scale1 = 'percent' 
    const scale2 = 'number'
    const typeChart = 'line'

    const listLabels = []
    for (let i = 0; i < labels.length; i++) {
        listLabels.push(moment(labels[i],'MMMM').format('MMM'))
    }

    return {
        name: 'Gross Profit Margin & Amount (in % & IDR Bn)',
        total: sum+'B IDR of Gross Profit (YTD)',
        type: typeChart,
        chartOptions: comboChartOptionsApex(total, label1, label2, listLabels, colors, scale1, scale2),
        series: [
            {
                name: label2,
                type: type2,
                data: data2
            }, 
            {
                name: label1,
                type: type1,
                data: data1
            }
        ],
    }
}

export const ebitda = async() => {
    // Revenue Ytd
    const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const data1 =[-0.65, 0.22, -1.13, 6.69, -0.86, 2.71, 0, 0, 0, 0, 0, 0]
    const data2 =[-2.46, 0.4, -2.14, 16.1, -1.67, 6.59, 0, 0, 0, 0, 0, 0]
    const sum = parseFloat(data2.reduce((accumulator, currentValue) => accumulator + currentValue, 0).toFixed(2));
    const total = sum+'B IDR of EBITDA (YTD)'
    const label1 = 'EBITDA%'
    const label2 = 'EBITDA'
    const type1 = 'line'
    const type2 = 'column'
    const colors = ['rgba(212, 109, 6, 0.6)', 'rgba(0, 34, 255, 1)']
    const scale1 = 'percent'
    const scale2 = 'number'
    const typeChart = 'line'

    const listLabels = []
    for (let i = 0; i < labels.length; i++) {
        listLabels.push(moment(labels[i],'MMMM').format('MMM'))
    }

    return {
        name: 'EBITDA Margin & Amount (in % & IDR Bn)',
        type: typeChart,
        chartOptions: comboChartOptionsApex(total, label1, label2, listLabels, colors, scale1, scale2),
        series: [
            {
                name: label2,
                type: type2,
                data: data2
            }, 
            {
                name: label1,
                type: type1,
                data: data1
            }
        ],
    }
}

export const netProfit = async() => {
    // Revenue Ytd
    const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const data1 =[0.01, -0.06, -0.07, 0.02, -0.05, -0.002, 0, 0, 0, 0, 0, 0]
    const data2 =[4.97, -10.98, -12.93, 5.07, -9.16, -0.31, 0, 0, 0, 0, 0, 0]
    const sum = parseFloat(data2.reduce((accumulator, currentValue) => accumulator + currentValue, 0).toFixed(2));
    const total = sum+' Bn IDR of Net Profit (YTD)'

    const label1 = 'NPM%'
    const label2 = 'Laba Bersih'
    const type1 = 'line'
    const type2 = 'column'
    const colors = ['rgba(6, 212, 178, 0.6)', 'rgba(0, 34, 255, 1)']
    const scale1 = 'percent'
    const scale2 = 'number'
    const typeChart = 'line'

    const listLabels = []
    for (let i = 0; i < labels.length; i++) {
        listLabels.push(moment(labels[i],'MMMM').format('MMM'))
    }

    return {
        name: 'NET Profit Margin & Amount (in % & IDR Bn)',
        type: typeChart,
        chartOptions: comboChartOptionsApex(total, label1, label2, listLabels, colors, scale1, scale2),
        series: [
            {
                name: label2,
                type: type2,
                data: data2
            }, 
            {
                name: label1,
                type: type1,
                data: data1
            }
        ],
    }
}

export const cashBalance = async() => {
    // Revenue Ytd
    const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const data =[343, 365, 553, 581, 486, 535, 0, 0, 0, 0, 0, 0]
    const label = 'Laba Bersih'
    const type = 'bar'
    const color = ['rgba(6, 130, 212, 0.6)']
    const strokeColor = ['rgb(2, 76, 125)']
    const dataLabelStat = true
    const total = 'by Month'
    const typeChart = 'line'

    const listLabels = []
    for (let i = 0; i < labels.length; i++) {
        listLabels.push(moment(labels[i],'MMMM').format('MMM'))
    }

    return {
        name: 'Cash Balance (YTD Jun-24; in IDR Bn)',
        type: typeChart,
        chartOptions: barChartOptionsApex(listLabels, color, strokeColor, dataLabelStat, total),
        series: [
            {
                name: label,
                type: type,
                data: data
            }
        ],
    }

}

export const cffPayment = async() => {
    // Revenue Ytd
    const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const data =[14.2, 14.2, 14.2, 14.2, 14.2, 14.2, 0, 0, 0, 0, 0, 0]
    const label = 'Pembayaran Pinjaman Kepada Pihak Berelasi'
    const type = 'bar'
    const color = ['rgba(204, 4, 4, 0.6)']
    const strokeColor = ['rgb(69, 1, 1)']
    const dataLabelStat = true
    const total = 'by Month'
    const typeChart = 'line'

    const listLabels = []
    for (let i = 0; i < labels.length; i++) {
        listLabels.push(moment(labels[i],'MMMM').format('MMM'))
    }

    return {
        name: 'CFF Payment Schedule (in IDR Bn)',
        total: 'by Month',
        type: typeChart,
        chartOptions: barChartOptionsApex(listLabels, color, strokeColor, dataLabelStat, total),
        series: [
            {
                name: label,
                type: type,
                data: data
            }
        ],
    }
}

export const cashFlow = async() => {

    const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const dataSeries = [
        { label: 'CFO in', data: [178.02, 235.31, 457.8, 256.91, 150.12, 224.94, 0, 0, 0, 0, 0, 0] },
        { label: 'CFO out', data: [-265.33, -197.78, -164.38, -159.9, -229.55, -227.66, 0, 0, 0, 0, 0, 0] },
        { label: 'CFI', data: [-2.46, 0, -93.86, -62.93, -0.05, -0.15, 0, 0, 0, 0, 0, 0] },
        { label: 'CFF', data: [-14.67, -14.37, -14.39, -14.79, -14.42, -51.46, 0, 0, 0, 0, 0, 0] }
    ];

    const typeChart = 'bar';
    const total = '*';

    const listLabels = []
    for (let i = 0; i < labels.length; i++) {
        listLabels.push(moment(labels[i],'MMMM').format('MMM'))
    }
    // Generating the series dynamically using a loop
    const series = dataSeries.map(dataItem => ({
        name: dataItem.label,
        data: dataItem.data
    }));

    return {
        name: 'Cash Flow Movement (YTD Jun-24; in IDR Bn)',
        type: typeChart,
        chartOptions: stackedChartOptionsApex(total, listLabels),
        series: series,
    };
}

export const cfiPayment = async() => {

    const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const dataSeries = [
        { label: 'Kontraktor EPC PMG II by ETI', data: [0, 0, 0, 0, 0, 0, 0, 47.97, 0, 0, 0, 0] },
        { label: 'Pekerjaan Bangunan Perusahaan', data: [0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0] },
        { label: 'Licensor Biodiesel by Desment Technology', data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 81.9] }
    ];

    const typeChart = 'bar'
    const total = '*'

    const listLabels = []
    for (let i = 0; i < labels.length; i++) {
        listLabels.push(moment(labels[i],'MMMM').format('MMM'))
    }

    const series = dataSeries.map(dataItem => ({
        name: dataItem.label,
        data: dataItem.data
    }));

    return {
        name: 'Cash Flow Movement (YTD Jun-24; in IDR Bn)',
        type: typeChart,
        chartOptions: stackedChartOptionsApex(total, listLabels),
        series: series,
    }
}