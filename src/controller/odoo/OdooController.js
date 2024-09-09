import RateOdoo from '@/api/odoo_api/currency/RateOdoo.js'

export const loadAllKursJisdor_OdooController = async() => {
    try {
        const response = await RateOdoo.getAll();
        const load = response.data;
        const data = load.data;
        // console.log(data)
        return data
    } catch (error) {
        return null;
    }
}

export const loadByPeriodRate_OdooController = async(tgl) => {
    try {
        const response = await RateOdoo.postRate({tanggal:tgl, mata_uang:'USD'});
        const load = response.data;
        // const data = load.data;
        // console.log(data)
        return load
    } catch (error) {
        return null;
    }
}


export const loadByLatest_OdooController = async() => {
    try {
        const response = await RateOdoo.postRateLatest({mata_uang:'USD'});
        const load = response.data;
        const data = load.latest;
        // console.log(data)
        return data
    } catch (error) {
        return null;
    }
}