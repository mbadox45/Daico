import OutstandingCpo from '@/api/cpo/OutstandingCpo.js';
import KpbnCpo from '@/api/cpo/KpbnCpo.js';

export const loadCPOOutstanding = async() => {
    try {
        const list = []
        const response = await OutstandingCpo.getAll()
        const load = response.data;
        const data = load.data;
        for (let a = 0; a < data.length; a++) {
            list.push({
                id:data[a].id,
                kontrak: data[a].kontrak,
                supplier: data[a].supplier,
                harga:data[a].harga,
                qty: data[a].qty,
                value: data[a].value,
            })
        }
        return list;
    } catch (error) {
        return null
    }
}

export const loadAvgCPO = async(tgl) => {
    try {
        const response = await KpbnCpo.getByDate({tanggal: tgl})
        const load = response.data;
        const data = load.data;
        return data
    } catch (error) {
        return null;
    }
}