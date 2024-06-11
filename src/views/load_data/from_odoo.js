import RateOdoo from '@/api/odoo_api/currency/RateOdoo.js';
import CurrencyOdoo from '@/api/odoo_api/currency/CurrencyOdoo.js';

export const loadCurrency = async() => {
    try {
        const response = await CurrencyOdoo.getAll();
        const load = response.data;
        const data = load.data;
        return data
    } catch (error) {
        return null
    }
}

export const loadRate = async() => {
    try {
        const response = await RateOdoo.getAll();
        const load = response.data;
        const data = load.data;
        return data
    } catch (error) {
        return null
    }
}

export const loadRateByDate = async(tgl, mata_uang) => {
    try {
        const response = await RateOdoo.postRate({tanggal: tgl, mata_uang: mata_uang});
        const load = response.data;
        const data = load.data;
        return data
    } catch (error) {
        return null
    }
}