import { comboChartOptionsApex, stackedChartOptionsApex} from "@/controller/dummy/func_dummy.js";
import moment from "moment";

export const utilVolumeCPO = async() => {
    // Revenue Ytd
    const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const data1 =[21.01, 20.87, 23.9, 21.84, 22.94, 21.74, 0, 0, 0, 0, 0, 0]
    const data2 =[11906, 11747, 16984, 8861, 15513, 8919, 0, 0, 0, 0, 0, 0]
    const label1 = 'Utilization rate aktual'
    const label2 = 'Volume CPO Olah'
    const type1 = 'line'
    const type2 = 'bar'
    const colors = ['rgba(245, 217, 5, 0.6)', 'rgba(0, 34, 255, 1)']
    const total = 'by Month'
    const scale1 = 'percent'
    const scale2 = 'number'
    const typeChart = 'line'
    
    const listLabels = []
    for (let i = 0; i < labels.length; i++) {
        listLabels.push(moment(labels[i],'MMMM').format('MMM'))
    }

    return {
        name: 'Utilization & Volume CPO Olah (in % & Tons)',
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

export const cpoSOurcing = async () => {
    // Revenue Ytd
    const labels = ['04 Aug', '11 Aug', '18 Aug', '25 Aug', '01 Sep', '08 Sep', '15 Sep', '22 Sep'];
    const data1 = [3500, 0, 0, 0, 0, 0, 0, 0]; // Actual values
    const data2 = [7500, 7500, 7600, 7400, 7500, 7500, 7500, 7500]; // Target values

    const label1 = 'Actual';
    const label2 = 'Remaining';
    const typeChart = 'bar';

    // Calculate the remaining target for each point
    const remaining = data2.map((target, index) => Math.max(target - data1[index], 0));

    return {
        name: 'CPO Sourcing Schedule (in Tons)',
        total: 'by Week',
        type: typeChart,
        chartOptions: stackedChartOptionsApex(label1, label2),
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