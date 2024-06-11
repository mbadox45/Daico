import InitialSupply from '@/api/avg_price/InitialSupply.js';

export const loadAvgPriceByDate = async(tgl) => {
    try {
        const response = await InitialSupply.getByDate(tgl);
        const load = response.data;
        const data = load.data;
        return data
    } catch (error) {
        return null;
    }
}

export const addAvgPriceByDate = async(tgl) => {
    try {
        const response = await InitialSupply.getByDate(tgl);
        const load = response.data;
        const data = load.data;
        return data
    } catch (error) {
        return null;
    }
}
