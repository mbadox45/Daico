import { barChartOptionsApex2, barChartOptionsApex, comboChartOptionsApex, distributedColumnChart2} from "@/controller/dummy/func_dummy.js";

export const volumeTon1 = async() => {
    const labels = ['Kontrak QTY (Ton)', 'Delivery QTY (Ton)', 'Produksi CPO (Ton)'];
    const colors = [
                    'rgba(0, 143, 251, 0.85)', 
                    'rgba(254, 176, 25, 0.85)',
                    'rgba(0, 227, 150, 0.85)', 
                ]
    const typeChart = 'bar'
    return {
        name: 'SDHI',
        total: '*',
        type: typeChart,
        chartOptions: distributedColumnChart2(labels, colors),
        series: [
            {
                data: [150050, 115830, 129050]
            }
        ],
    }
}

export const volumeTon2 = async() => {
    const labels = ['Kontrak QTY (Ton)', 'Delivery QTY (Ton)', 'Produksi CPO (Ton)'];
    const colors = [
                    'rgba(0, 143, 251, 0.85)', 
                    'rgba(254, 176, 25, 0.85)',
                    'rgba(0, 227, 150, 0.85)', 
                ]
    const typeChart = 'bar'
    return {
        name: 'SDBI',
        total: '*',
        type: typeChart,
        chartOptions: distributedColumnChart2(labels, colors),
        series: [
            {
                data: [2400000, 2380000, 2400000]
            }
        ],
    }
}

export const rerataHarga1 = async() => {
    const labels = ['Rerata Harga Kontrak (Rp)', 'Rerata Harga Delivery (Rp)'];
    const colors = [
                    'rgba(0, 143, 251, 0.85)', 
                    'rgba(254, 176, 25, 0.85)',
                ]
    const typeChart = 'bar'
    return {
        name: 'SDHI',
        total: '*',
        type: typeChart,
        chartOptions: distributedColumnChart2(labels, colors),
        series: [
            {
                data: [15549, 14865]
            }
        ],
    }
}

export const rerataHarga2 = async() => {
    const labels = ['Rerata Harga Kontrak (Rp)', 'Rerata Harga Delivery (Rp)'];
    const colors = [
                    'rgba(0, 143, 251, 0.85)', 
                    'rgba(254, 176, 25, 0.85)',
                ]
    const typeChart = 'bar'
    return {
        name: 'SDBI',
        total: '*',
        type: typeChart,
        chartOptions: distributedColumnChart2(labels, colors),
        series: [
            {
                data: [13187, 12805]
            }
        ],
    }
}

export const volumeLineBar = async() => {
    // Revenue Ytd
    const labels = ['01/12', '02/12', '04/12', '04/12', '05/12', '06/12', '07/12', '08/12', '09/12', '10/12', '11/12', '12/12', '13/12' , '14/12', '15/12', '16/12', '17/12', '18/12', '19/12', '31/12'];
    const data1 = [null, 8000, 18000, 13000, 14000, 16000, null, null, 10000, 14500, 6000, 4500, 25000, null, null, 9000, 8000, 3500, 4000, null]
    const data2 = [1000, 6000, 10000, 5000, 6000, 6500, 6500, 5100, 7000, 6100, 5000, 5500, 10000, 8000, 2000, 5000, 5000, 10500, 4000, 0]
    const data3 = [4000, 6300, 8000, 9300, 8000, 6500, 9500, 5000, 8800, 6100, 5000, 5500, 10000, 8000, 2000, 5000, 5000, 10500, 4000, 0]
    const label1 = 'Kontrak Qty (Ton)'
    const label2 = 'Delivery Qty (Ton)'
    const label3 = 'Produksi CPO (Ton)'
    const type = 'line'
    const color = ['rgba(6, 130, 212, 0.6)', 'rgba(245, 217, 5, 0.6)', 'rgba(0, 227, 150, 0.85)', ]
    const strokeColor = ['rgba(6, 130, 212, 0.6)', 'rgba(245, 217, 5, 0.6)', 'rgba(0, 227, 150, 0.85)', ]
    const dataLabelStat = false
    const total = ''
    // const typeChart = 'bar'

    const listLabels = []
    for (let i = 0; i < labels.length; i++) {
        listLabels.push(labels[i])
    }

    return {
        name: 'Cash Balance (YTD Jun-24; in IDR Bn)',
        type: type,
        chartOptions: barChartOptionsApex2(listLabels, color, strokeColor, dataLabelStat, total),
        series: [
            {
                name: label1,
                type: 'bar',
                data: data1
            },
            {
                name: label2,
                type: type,
                data: data2
            },
            {
                name: label3,
                type: type,
                data: data3
            }
        ],
    }
}

export const kpbnMdex = async() => {
    // Revenue Ytd
    const labels = ['02/12', '03/12', '04/12', '05/12', '06/12', '09/12', '10/12', '11/12', '12/12', '13/12', '16/12', '17/12', '18/12', '19/12'];
    const data1 = [15655, 15788, 15900, 15976, 16000, 15940, 15760, 15675, 15602, 15553, 15589, 15327, 14919, 14646]
    const data2 = [5217, 5343, 5287, 5287, 5336, 5308, 5165, 5113, 5160, 4994, 4900, 4889, 4700]
    const label1 = 'KPBN'
    const label2 = 'MDEX'
    const type = 'line'
    const color = ['rgba(245, 217, 5, 0.6)', 'rgba(6, 130, 212, 0.6)']
    const strokeColor = ['rgba(245, 217, 5, 0.6)', 'rgba(6, 130, 212, 1)']
    const dataLabelStat = false
    const total = ''
    // const typeChart = 'bar'

    const listLabels = []
    for (let i = 0; i < labels.length; i++) {
        listLabels.push(labels[i])
    }

    return {
        name: 'Cash Balance (YTD Jun-24; in IDR Bn)',
        type: type,
        chartOptions: barChartOptionsApex2(listLabels, color, strokeColor, dataLabelStat, total),
        series: [
            {
                name: label1,
                type: type,
                data: data1
            },
            {
                name: label2,
                type: type,
                data: data2
            }
        ],
    }
}

export const kursUsdToRp = async() => {
    // Revenue Ytd
    const labels = ['02/12', '03/12', '04/12', '05/12', '06/12', '09/12', '10/12', '11/12', '12/12', '13/12', '16/12', '17/12', '18/12'];
    const data = [15895, 15955, 15963, 15918, 15855, 15855, 15865, 15895, 15935, 15965, 16018, 16028, 16083]
    const label = 'Kurs USD to Rp'
    const type = 'line'
    const color = ['rgba(6, 130, 212, 0.6)']
    const strokeColor = ['rgba(6, 130, 212, 1)']
    const dataLabelStat = false
    const total = 'Kurs USD to Rp'
    // const typeChart = 'bar'

    const listLabels = []
    for (let i = 0; i < labels.length; i++) {
        listLabels.push(labels[i])
    }

    return {
        name: 'Cash Balance (YTD Jun-24; in IDR Bn)',
        type: type,
        chartOptions: barChartOptionsApex2(listLabels, color, strokeColor, dataLabelStat, total),
        series: [
            {
                name: label,
                type: type,
                data: data
            },
        ],
    }
}