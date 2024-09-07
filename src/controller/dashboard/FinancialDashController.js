import { setChartOptionsCombo, setChartDataCombo, setBasicBarChartData, setBasicBarChartOptions, setChartStackedBarData, setChartStackedBarOptions } from "@/controller/dummy/func_dummy.js";
import moment from "moment";


export const revenueYtd = async() => {
    // Revenue Ytd
    const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const data1 =[353.32, 802, 852.69, 1207.45, 1718.87, 1643.25, 0, 0, 0, 0, 0, 0]
    const data2 =[378.46, 187.77, 190.14, 240.53, 194.27, 242.86, 0, 0, 0, 0, 0, 0]
    const label1 = 'Target RKAP'
    const label2 = 'Real'
    const backgroundColor1 = 'rgba(255, 255, 255, 1)'
    const borderColor1 = 'rgba(0, 69, 252, 1)'
    const backgroundColor2 = 'rgba(108, 204, 24, 0.2)'
    const borderColor2 = 'rgba(108, 204, 24, 1)'
    const type1 = 'line'
    const type2 = 'bar'
    const options1 = 'number' 
    const options2 = 'number' 

    const listLabels = []
    for (let i = 0; i < labels.length; i++) {
        listLabels.push(moment(labels[i],'MMMM').format('MMM'))
    }

    return {
        name: 'Revenue YTD (in IDR Bn)',
        type: `${type1} ${type2}`,
        chartData: setChartDataCombo(listLabels, data1, data2, label1, label2, backgroundColor1, borderColor1, backgroundColor2, borderColor2, type1, type2),
        chartOptions: setChartOptionsCombo(options1, options2),
    }
}

export const grossProfit = async() => {
    // Revenue Ytd
    const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const data1 =[3, 4.43, 6.19, 10.66, 5.43, 4.85, 0, 0, 0, 0, 0, 0]
    const data2 =[11.4, 8.3, 11.8, 25.6, 10.6, 11.8, 0, 0, 0, 0, 0, 0]
    const sum = parseFloat(data2.reduce((accumulator, currentValue) => accumulator + currentValue, 0).toFixed(2));

    const label1 = 'GPM%'
    const label2 = 'Laba Kotor'
    const backgroundColor1 = 'rgba(255, 255, 255, 1)'
    const borderColor1 = 'rgba(0, 69, 252, 1)'
    const backgroundColor2 = 'rgba(32, 153, 110, 0.5)'
    const borderColor2 = 'rgba(32, 153, 110, 1)'
    const type1 = 'line'
    const type2 = 'bar'
    const options1 = 'percent' 
    const options2 = 'number'

    const listLabels = []
    for (let i = 0; i < labels.length; i++) {
        listLabels.push(moment(labels[i],'MMMM').format('MMM'))
    }

    return {
        name: 'Gross Profit Margin & Amount (in % & IDR Bn)',
        total: sum+'B IDR of Gross Profit (YTD)',
        type: `${type1} ${type2}`,
        chartData: setChartDataCombo(listLabels, data1, data2, label1, label2, backgroundColor1, borderColor1, backgroundColor2, borderColor2, type1, type2),
        chartOptions: setChartOptionsCombo(options1, options2),
    }
}

export const ebitda = async() => {
    // Revenue Ytd
    const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const data1 =[-0.65, 0.22, -1.13, 6.69, -0.86, 2.71, 0, 0, 0, 0, 0, 0]
    const data2 =[-2.46, 0.4, -2.14, 16.1, -1.67, 6.59, 0, 0, 0, 0, 0, 0]
    const sum = parseFloat(data2.reduce((accumulator, currentValue) => accumulator + currentValue, 0).toFixed(2));

    const label1 = 'EBITDA%'
    const label2 = 'EBITDA'
    const backgroundColor1 = 'rgba(255, 255, 255, 1)'
    const borderColor1 = 'rgba(0, 69, 252, 1)'
    const backgroundColor2 = 'rgba(32, 153, 110, 0.5)'
    const borderColor2 = 'rgba(32, 153, 110, 1)'
    const type1 = 'line'
    const type2 = 'bar'
    const options1 = 'percent'
    const options2 = 'number' 

    const listLabels = []
    for (let i = 0; i < labels.length; i++) {
        listLabels.push(moment(labels[i],'MMMM').format('MMM'))
    }

    return {
        name: 'EBITDA Margin & Amount (in % & IDR Bn)',
        total: sum+'B IDR of EBITDA (YTD)',
        type: `${type1} ${type2}`,
        chartData: setChartDataCombo(listLabels, data1, data2, label1, label2, backgroundColor1, borderColor1, backgroundColor2, borderColor2, type1, type2),
        chartOptions: setChartOptionsCombo(options1, options2),
    }
}

export const netProfit = async() => {
    // Revenue Ytd
    const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const data1 =[0.01, -0.06, -0.07, 0.02, -0.05, 0, 0, 0, 0, 0, 0, 0]
    const data2 =[4.97, -10.98, -12.93, 5.07, -9.16, -0.31, 0, 0, 0, 0, 0, 0]
    const sum = parseFloat(data2.reduce((accumulator, currentValue) => accumulator + currentValue, 0).toFixed(2));

    const label1 = 'NPM%'
    const label2 = 'Laba Bersih'
    const backgroundColor1 = 'rgba(255, 255, 255, 1)'
    const borderColor1 = 'rgba(0, 69, 252, 1)'
    const backgroundColor2 = 'rgba(32, 153, 110, 0.5)'
    const borderColor2 = 'rgba(32, 153, 110, 1)'
    const type1 = 'line'
    const type2 = 'bar'
    const options1 = 'percent'
    const options2 = 'number' 

    const listLabels = []
    for (let i = 0; i < labels.length; i++) {
        listLabels.push(moment(labels[i],'MMMM').format('MMM'))
    }

    return {
        name: 'NET Profit Margin & Amount (in % & IDR Bn)',
        total: sum+' Bn IDR of Net Profit (YTD)',
        type: `${type1} ${type2}`,
        chartData: setChartDataCombo(listLabels, data1, data2, label1, label2, backgroundColor1, borderColor1, backgroundColor2, borderColor2, type1, type2),
        chartOptions: setChartOptionsCombo(options1, options2),
    }
}

export const cashBalance = async() => {
    // Revenue Ytd
    const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const data =[343, 365, 553, 581, 486, 535, 0, 0, 0, 0, 0, 0]
    const label = 'Laba Bersih'
    const type = 'bar'

    const listLabels = []
    for (let i = 0; i < labels.length; i++) {
        listLabels.push(moment(labels[i],'MMMM').format('MMM'))
    }

    return {
        name: 'Cash Balance (YTD Jun-24; in IDR Bn)',
        total: 'by Month',
        type: type,
        chartData: setBasicBarChartData(data, listLabels, label, type),
        chartOptions: setBasicBarChartOptions(),
    }

}

export const cffPayment = async() => {
    // Revenue Ytd
    const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const data =[14.2, 14.2, 14.2, 14.2, 14.2, 14.2, 0, 0, 0, 0, 0, 0]
    const label = 'Pembayaran Pinjaman Kepada Pihak Berelasi'
    const type = 'bar'

    const listLabels = []
    for (let i = 0; i < labels.length; i++) {
        listLabels.push(moment(labels[i],'MMMM').format('MMM'))
    }

    return {
        name: 'CFF Payment Schedule (in IDR Bn)',
        total: 'by Month',
        type: type,
        chartData: setBasicBarChartData(data, listLabels, label, type),
        chartOptions: setBasicBarChartOptions(),
    }
}

export const cashFlow = async() => {

    const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const data1 =[178.02, 235.31, 457.8, 256.91, 150.12, 224.94, 0, 0, 0, 0, 0, 0]
    const data2 =[-265.33, -197.78, -164.38, -159.9, -229.55, -227.66, 0, 0, 0, 0, 0, 0]
    const data3 =[-2.46, 0, -93.86, -62.93, -0.05, -0.15, 0, 0, 0, 0, 0, 0]
    const data4 =[-14.67, -14.37, -14.39, -14.79, -14.42, -51.46, 0, 0, 0, 0, 0, 0]

    const label1 = 'CFO in'
    const label2 = 'CFO out'
    const label3 = 'CFI'
    const label4 = 'CFF'

    const type = 'bar'
    const typeAll = 'stackedBar'

    const listLabels = []
    for (let i = 0; i < labels.length; i++) {
        listLabels.push(moment(labels[i],'MMMM').format('MMM'))
    }

    return {
        name: 'Cash Flow Movement (YTD Jun-24; in IDR Bn)',
        type: typeAll,
        chartData: setChartStackedBarData(listLabels, data1, data2, data3, data4, label1, label2, label3, label4, type),
        chartOptions: setChartStackedBarOptions(data1, data2, data3, data4),
    }
}