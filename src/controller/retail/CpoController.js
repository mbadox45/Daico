import OutstandingCpo from '@/api/cpo/OutstandingCpo.js';
import ActualCpo from '@/api/cpo/ActualCpo.js';
import KpbnCpo from '@/api/cpo/KpbnCpo.js';
import StockAwalCpo from '@/api/cpo/StockAwalCpo.js';

import moment from 'moment';
import {msg_success, msg_warning, msg_error} from '@/controller/dummy/func_dummy.js';

// Stock Awal CPO
export const loadCpoStockAwalAll_CpoController = async() => {
    try {
        const response = await StockAwalCpo.getAll();
        const load = response.data;
        const data = load.data;
        return data;
    } catch (error) {
        return null;
    }
}
export const loadCpoStockAwalByDate_CpoController = async(tgl) => {
    try {
        const response = await StockAwalCpo.getByDate({tanggal:tgl});
        const load = response.data;
        const data = load.data;
        return data;
    } catch (error) {
        return null;
    }
}
export const addCpoStockAwal_CpoController = async(form) => {
    try {
        const response = await StockAwalCpo.addPost(form);
        const load = response.data;
        if (load.success == true) {
            return msg_success;
        } else {
            return msg_warning
        }
    } catch (error) {
        return msg_error
    }
}
export const updateCpoStockAwal_CpoController = async(id,form) => {
    try {
        const response = await StockAwalCpo.updatePost(id,form);
        const load = response.data;
        if (load.success == true) {
            return msg_success;
        } else {
            return msg_warning
        }
    } catch (error) {
        return msg_error
    }
}


// CPO KPBN
export const loadCpoKpbnAll_CpoController = async() => {
    try {
        const response = await KpbnCpo.getAll();
        const load = response.data;
        const data = load.data;
        return data;
    } catch (error) {
        return null;
    }
}
export const loadCpoKpbnByDate_CpoController = async(tgl) => {
    try {
        const response = await KpbnCpo.getByDate({tanggal:tgl});
        const load = response.data;
        const data = load.data;
        return data;
    } catch (error) {
        return null;
    }
}
export const addCpoKpbn_CpoController = async(form) => {
    try {
        const response = await KpbnCpo.addKpbn(form);
        const load = response.data;
        if (load.success == true) {
            return msg_success;
        } else {
            return msg_warning
        }
    } catch (error) {
        return msg_error
    }
}
export const updateCpoKpbn_CpoController = async(id,form) => {
    try {
        const response = await KpbnCpo.updateKpbn(id,form);
        const load = response.data;
        if (load.success == true) {
            return msg_success;
        } else {
            return msg_warning
        }
    } catch (error) {
        return msg_error
    }
}
export const loadTableStockAwal_CpoController = async(tgl) => {
    const response = await loadCpoStockAwalByDate_CpoController(tgl);

    const list = []

    const awal = response == null ? null : response.dataStockAwal == null ? null : response.dataStockAwal;
        list.push({
            name:'Stock Awal',
            id: awal == null ? null : awal.id == null ? null: awal.id,
            tanggal: awal == null ? moment().format('YYYY-MM-DD') : awal.tanggal == null ? moment().format('YYYY-MM-DD') : moment(awal.tanggal).format('YYYY-MM-DD'),
            qty: awal == null ? 0 : awal.qty == null ? 0 : Number(awal.qty).toFixed(2),
            harga: awal == null ? 0 : awal.harga == null ? 0 : Number(awal.harga).toFixed(2),
            value: awal == null ? 0 : awal.value == null ? 0 : Number(awal.value).toFixed(2),
        })
        const incoming = response == null ? null : response.dataIncoming == null ? null : response.dataIncoming;
        list.push({
            name:'Incoming s.d tgl ' + (incoming == null ? null : incoming.latestDate == null ? null : moment(incoming.latestDate).format('DD MMMM YYYY')),
            id: null,
            tanggal: incoming == null ? moment().format('YYYY-MM-DD') : incoming.latestDate == null ? moment().format('YYYY-MM-DD') : moment(incoming.latestDate).format('YYYY-MM-DD'),
            qty: incoming == null ? 0 : incoming.totalQty == null ? 0 : Number(incoming.totalQty).toFixed(2),
            harga: incoming == null ? 0 : incoming.totalHarga == null ? 0 : Number(incoming.totalHarga).toFixed(2),
            value: incoming == null ? 0 : incoming.totalValue == null ? 0 : Number(incoming.totalValue).toFixed(2),
        })
        const tersedia = response == null ? null : response.stokTersedia == null ? null : response.stokTersedia;
        list.push({
            name:'Stock Tersedia',
            id: null,
            tanggal: null,
            qty: tersedia == null ? 0 : tersedia.totalQty == null ? 0 : Number(tersedia.totalQty).toFixed(2),
            harga: tersedia == null ? 0 : tersedia.totalHarga == null ? 0 : Number(tersedia.totalHarga).toFixed(2),
            value: tersedia == null ? 0 : tersedia.totalValue == null ? 0 : Number(tersedia.totalValue).toFixed(2),
        })
        const cpo = response == null ? null : response.cpoOlah == null ? null : response.cpoOlah;
        list.push({
            name:'CPO Olah',
            id:null,
            tanggal: null,
            qty: cpo == null ? 0 : cpo.totalQty == null ? 0 : Number(cpo.totalQty).toFixed(2),
            harga: cpo == null ? 0 : cpo.totalHarga == null ? 0 : Number(cpo.totalHarga).toFixed(2),
            value: cpo == null ? 0 : cpo.totalValue == null ? 0 : Number(cpo.totalValue).toFixed(2),
        })
    return list;
}

// CPO Incomming
export const loadCpoIncommingAll_CpoController = async() => {
    try {
        const response = await ActualCpo.getAll();
        const load = response.data;
        const data = load.data;
        return data;
    } catch (error) {
        return null;
    }
}
export const loadCpoIncommingByDate_CpoController = async(tgl) => {
    try {
        const response = await ActualCpo.getByDate({tanggal:tgl});
        const load = response.data;
        const data = load.data;
        return data;
    } catch (error) {
        return null;
    }
}
export const addCpoIncomming_CpoController = async(form) => {
    try {
        const response = await ActualCpo.addActual(form);
        const load = response.data;
        if (load.success == true) {
            return msg_success;
        } else {
            return msg_warning
        }
    } catch (error) {
        return msg_error
    }
}
export const updateCpoIncomming_CpoController = async(id,form) => {
    try {
        const response = await ActualCpo.updateActual(id,form);
        const load = response.data;
        if (load.success == true) {
            return msg_success;
        } else {
            return msg_warning
        }
    } catch (error) {
        return msg_error
    }
}

// CPO Outstanding
export const loadCpoOutstandingAll_CpoController = async() => {
    try {
        const response = await OutstandingCpo.getAll();
        const load = response.data;
        const data = load.data;
        return data;
    } catch (error) {
        return null;
    }
}
export const addCpoOutstanding_CpoController = async(form) => {
    try {
        const response = await OutstandingCpo.addOutstanding(form);
        const load = response.data;
        if (load.success == true) {
            return msg_success;
        } else {
            return msg_warning
        }
    } catch (error) {
        return msg_error
    }
}
export const updateCpoOutstanding_CpoController = async(id,form) => {
    try {
        const response = await OutstandingCpo.updateOutstanding(id,form);
        const load = response.data;
        if (load.success == true) {
            return msg_success;
        } else {
            return msg_warning
        }
    } catch (error) {
        return msg_error
    }
}