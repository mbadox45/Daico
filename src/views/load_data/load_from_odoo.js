import RateOdoo from '@/api/odoo_api/currency/RateOdoo.js'

export const loadAllKursJisdor = async() => {
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