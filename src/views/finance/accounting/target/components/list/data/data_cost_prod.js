import Laporan_Produksi from '@/api/det_alloc/Laporan_Produksi.js';
import DailyDmoAPI from '@/api/target/DailyDmo.js';
import MonthlyDmoAPI from '@/api/target/MonthlyDmo.js';
import BulkyProdMaster from '@/api/master/BulkyProdMaster.js';
import RetailProdMaster from '@/api/master/RetailProdMaster.js';

export const loadDataProd = async(tgl) => {
    const prod = await loadReportProduction(tgl);
    if (prod == null) {
        return 0;
    } else {
        const loadProd = Object.entries(prod).map(([key, value]) => {
            const items = [];
            for (let i = 0; i < value.length; i++) {
                if (value[i] && Object.keys(value[i])[0].startsWith('total ')) {
                    items[items.length - 1].totals = items[items.length - 1].totals || [];
                    items[items.length - 1].totals.push({
                        name: Object.keys(value[i])[0],
                        value: Object.values(value[i])[0]
                    });
                } else {
                    items.push(value[i]);
                }
            }
            return {
                name: key,
                items: items
            };
        });
        const uraian = loadProd.find(item => item.name == 'Refinery')
        const total_cpo_olah = uraian.items.find(item => item.id_uraian == 1)
        if (total_cpo_olah == null) {
            return 0;
        } else {
            return total_cpo_olah.totals[0].value;
        }
    }

}

export const loadDailyDmo = async(tgl) => {
    try {
        const response = await DailyDmoAPI.getByDate({tanggal:tgl});
        const load = response.data;
        const data = load.data
        let total = 0;
        for (let i = 0; i < data.length; i++) {
            total = total + Number(data[i].value);
        }
        return total;
    } catch (error) {
        return null;
    }
}

export const loadMonthlyDmo = async(tgl) => {
    try {
        const response = await MonthlyDmoAPI.getByDate({tanggal:tgl});
        const load = response.data;
        const data = load.data
        return data;
    } catch (error) {
        return null;
    }
}

export const loadMasterBulkProd = async() => {
    try {
        const response = await BulkyProdMaster.getAll();
        const load = response.data;
        const data = load.mBulky
        return data;
    } catch (error) {
        return null;
    }
}

export const loadMasterRetailProd = async() => {
    try {
        const response = await RetailProdMaster.getAll();
        const load = response.data;
        const data = load.mBulky
        return data;
    } catch (error) {
        return null;
    }
}

const loadReportProduction = async(tgl) => {
    try {
        const response = await Laporan_Produksi.getByDate({tanggal:tgl});
        const load = response.data;
        const data = load.data;
        return data;
    } catch (error) {
        return null;
    }
}