import Rekening from '@/api/accounting/rekening.js';
import RekeningKerja from '@/api/accounting/rekening_kerja.js';
import {loadTypeRekening} from '@/views/load_data/master_config.js'
import {loadAllKursJisdor} from '@/views/load_data/load_from_odoo.js'
import moment from 'moment';

export const loadRekening = async() => {
    try {
        const response = await Rekening.getAll();
        const load = response.data;
        const data = load.data;
        return data
    } catch (error) {
        return null;
    }
}

export const loadRekeningKerjaLatest = async() => {
    try {
        const response = await RekeningKerja.getLatest();
        const load = response.data;
        const data = load.data;
        return data
    } catch (error) {
        return null;
    }
}

export const RekeningUnitKerja = async() => {
    const items = await loadRekening();
    const items_kerja = await loadRekeningKerjaLatest();
    const items_type = await loadTypeRekening();
    const jisdor = await loadAllKursJisdor()
    const filter = jisdor.filter(item => moment(item.name).format('YYYY-MM') == moment().format('YYYY-MM'))
    filter.sort((a, b) => b.id - a.id);
    const nilai_tukar = Number(filter[0].rate)
    // Rekening Cash
    let list = []
    for (let i = 0; i < items.length; i++) {
        list.push({
            id: null,
            rekening_id: items[i].id,
            jenis_id: items[i].jenis_id,
            nama: items[i].nama,
            nomor: items[i].nomor,
            keterangan: items[i].keterangan,
            matauang: items[i].matauang.name,
            jenis: items[i].jenis.nama,
            value: 0,
            latest_date: null,
            tipe_id: items[i].tipe_id,
        })
    }
    let data = []
    let total = 0
    if (items_kerja != null) {
        for (let i = 0; i < list.length; i++) {
            const item = items_kerja.find(item => item.rekening_id == list[i].rekening_id)
            total += item == null ? 0 : Number(item.value)
            data[i] = {
                id: item == null ? null : item.id,
                rekening_id: list[i].rekening_id,
                jenis_id: list[i].jenis_id,
                nama: list[i].nama,
                nomor: list[i].nomor,
                keterangan: list[i].keterangan,
                matauang: list[i].matauang,
                jenis: list[i].jenis,
                value: item == null ? 0 : list[i].matauang == 'USD' ? Number(item.value) * nilai_tukar : Number(item.value),
                latest_date: item == null ? null : item.tanggal,
                tipe_id: items[i].tipe_id,
            }
        }
        list = data
    }

    const list_on_hand = []
    const rekening = list
    let tot_on_hand = 0;
    for (let i = 0; i < items_type.length; i++) {
        let total = 0
        const rek = rekening.filter(item => item.tipe_id == items_type[i].id)
        if (rek != null) {
            for (let j = 0; j < rek.length; j++) {
                total += rek[j].value
            }
        }
        list_on_hand.push({
            id: items_type[i].id,
            nama: items_type[i].nama,
            value: total,
        })
        tot_on_hand += total
    }
    return {
        list_rekening: list,
        total: total,
        list_on_hand: list_on_hand,
        total_on_hand: tot_on_hand,
    }
}

export const addRekeningKerja = async(data) => {
    try {
        const response = await RekeningKerja.addPost(data);
        const load = response.data;
        return {
            success: load.success,
            message: load.message
        }
    } catch (error) {
        return {
            success: error.response.data.success,
            message: error.response.data.message
        };
    }
}

export const updateRekeningKerja = async(id, data) => {
    try {
        const response = await RekeningKerja.updatePost(id, data);
        const load = response.data;
        return {
            success: load.success,
            message: load.message
        }
    } catch (error) {
        return {
            success: error.response.data.success,
            message: error.response.data.message
        };
    }
}