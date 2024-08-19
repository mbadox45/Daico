import Laporan_Produksi from "@/api/det_alloc/Laporan_Produksi.js";
import {msg_success, msg_warning, msg_error} from '@/controller/dummy/func_dummy.js';
import { formatCurrency } from "@/controller/dummy/func_dummy.js";


const loadForTableCRUD_DetAllocController = async(tgl) => {
    try {
        const response = await loadByPeriod_DetAllocController(tgl);
        const list = [];
        if (response != null) {
            
        }
        return list;
    } catch (error) {
        return null;
    }
}

export const loadByPeriod_DetAllocController = async(tgl) => {
    try {
        const response = await Laporan_Produksi.getByDate({tanggal: tgl});
        const load = response.data;
        const data = load.laporanProduksi
        return data;
    } catch (error) {
        return null;
    }
}

export const loadAllByPeriod_DetAllocController = async(tgl) => {
    try {
        const response = await Laporan_Produksi.getByDate({tanggal: tgl});
        const load = response.data;
        return load;
    } catch (error) {
        return null;
    }
}

export const loadByPeriodRekap_DetAllocController = async(tgl) => {
    try {
        const response = await Laporan_Produksi.getByDateRekap({tanggal: tgl});
        const load = response.data;
        const data = load.laporanProduksi
        return data;
    } catch (error) {
        return null;
    }
}

export const loadAllByPeriodRekap_DetAllocController = async(tgl) => {
    try {
        const response = await Laporan_Produksi.getByDateRekap({tanggal: tgl});
        const load = response.data;
        const data = load.data
        return data;
    } catch (error) {
        return null;
    }
}

export const add_DetAllocController = async(form) => {
    try {
        const response = await Laporan_Produksi.addPost(form);
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

export const update_DetAllocController = async(id,form) => {
    try {
        const response = await Laporan_Produksi.updatePost(id,form);
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

export const postData_DetAllocController = async(tgl, form) => {
    const data = form;
    let msg = {severity: '', content: ''}
    let kondisi;

    for (let i = 0; i < data.length; i++) {
        if (data[i].value != null) {
            if (i < (data.length - 1)) {
                continue;
            }
            kondisi = true
        } else {
            msg = {severity:'warn', content:`Mohon data di lengkapi terlebih dahulu`};
            kondisi = false
            break;
        }
    }
    if (kondisi == true) {
        for (let i = 0; i < data.length; i++) {
            let list;
            if (data[i].id_plant == null) {
                list = {
                    id: null,
                    // id_plant: form[i].id_plant,
                    id_uraian: data[i].id_uraian,
                    value: data[i].value,
                    tanggal: tgl,
                }
            } else {
                list = {
                    id: null,
                    id_plant: data[i].id_plant,
                    id_uraian: data[i].id_uraian,
                    value: data[i].value,
                    tanggal: tgl,
                }
            }
            await add_DetAllocController(list)
        }
        msg = { severity: 'success', content: 'Data berhasil di simpan' };
    }
    return msg;
}

export const loadLaporanProduksi = async(data) => {
    const recap = data == null ? null : data.recap == null ? null : data.recap;
    const laporanProduksi = recap == null ? null : recap.laporanProduksi == null ? null : recap.laporanProduksi;
    const setting = recap == null ? null : recap.settings == null ? null : recap.settings;
    const list = []
    const refinery = await refineryProd(laporanProduksi);
    const packaging = await packageProduct(laporanProduksi, setting);
    const material = await materialConsume(laporanProduksi);
    const chemical = await chemicalConsume(laporanProduksi);
    if (refinery.length > 0) {
        for (let i = 0; i < refinery.length; i++) {
            list.push({
                name: refinery[i].name,
                id_kategori: refinery[i].id_kategori,
                kategori: refinery[i].kategori,
                satuan: refinery[i].satuan,
                plant: refinery[i].plant,
                qty: refinery[i].qty,
            })
        }
    }
    if (chemical.length > 0) {
        for (let i = 0; i < chemical.length; i++) {
            list.push({
                name: chemical[i].name,
                id_kategori: chemical[i].id_kategori,
                kategori: chemical[i].kategori,
                satuan: chemical[i].satuan,
                plant: chemical[i].plant,
                qty: chemical[i].qty,
            })
        }
    }
    if (packaging.length > 0) {
        for (let i = 0; i < packaging.length; i++) {
            list.push({
                name: packaging[i].name,
                id_kategori: packaging[i].id_kategori,
                kategori: packaging[i].kategori,
                satuan: packaging[i].satuan,
                plant: packaging[i].plant,
                qty: packaging[i].qty,
            })
        }
    }
    if (material.length > 0) {
        for (let i = 0; i < material.length; i++) {
            list.push({
                name: material[i].name,
                id_kategori: material[i].id_kategori,
                kategori: material[i].kategori,
                satuan: material[i].satuan,
                plant: material[i].plant,
                qty: material[i].qty,
            })
        }
    }
    // return chemical;
    return list;
}

const chemicalConsume = async(data) => {
    const list = []
    if (data != null) {
        const chemical = data.find(item => item.id == 6);

        for (let a = 0; a < data.length; a++) {
            if (data[a].id == 6) {
                const uraian = data[a].uraian
                if (uraian != null) {
                    const plant_total = []
                    const plant_oil = []
                    for (let i = 0; i < uraian.length; i++) {
                        const items = uraian[i].items;
                        for (let j = 0; j < items.length; j++) {
                            const plan = items[j].plant == null ? null : items[j].plant
                            list.push({
                                name: uraian[i].nama,
                                id_kategori: data[a].id,
                                kategori: data[a].nama,
                                satuan: uraian[i].satuan,
                                plant: (plan == null ? '' : plan.nama),
                                qty: items[j].qty == 0 ? '-' : formatCurrency(Number(items[j].qty).toFixed(2)),
                            })

                            // Menentukan Jumlah Qty Berdasarkan Plant
                            if (uraian[i].id == 24) {
                                plant_oil.push({
                                    id_uraian: i,
                                    id:plan.id,
                                    nama:plan.nama,
                                    qty: items[j].qty
                                })
                            } else if (uraian[i].id == 23) {
                                continue;
                            } else {
                                plant_total.push({
                                    id_uraian: i,
                                    id:plan.id,
                                    nama:plan.nama,
                                    qty: items[j].qty
                                })
                            }
                        }
                        list.push({
                            name: '<span class="underline font-medium">Total ' + uraian[i].nama + '</span>',
                            satuan: uraian[i].satuan,
                            id_kategori: data[a].id,
                            kategori: data[a].nama,
                            plant: null,
                            qty: uraian[i].total_qty == 0 ? '-' : formatCurrency(Number(uraian[i].total_qty).toFixed(2)),
                        })
                    }
                    
                    // Spent Bleaching Earth
                    const sumByIdAndUraian = plant_total.reduce((acc, item) => {
                        if (!acc[item.id]) {
                            acc[item.id] = { id: item.id, nama: item.nama, qty: 0 };
                        }
                        // Add for id_uraian = 0, subtract for others
                        if (item.id_uraian === 0) {
                            acc[item.id].qty += item.qty;
                        } else {
                            acc[item.id].qty -= item.qty;
                        }
                        return acc;
                    }, {});
                    
                    const result = Object.values(sumByIdAndUraian);

                    for (let j = 0; j < result.length; j++) {
                        const plan = plant_oil.find(item => item.id == result[j].id);
                        const val = result[j].qty + (result[j].qty*plan.qty/100);

                        list.push({
                            name: 'Spent Bleaching Earth',
                            id_kategori: data[a].id,
                            kategori: data[a].nama,
                            satuan: 'Kg',
                            plant: (result[j].name == null ? '' : result[j].nama),
                            qty: val == 0 ? '-' : formatCurrency(Number(val).toFixed(2)),
                        })
                    }
                }
            }
        }
    }
    return list;
}

const materialConsume = async(data) => {
    const list = []
    if (data != null) {
        for (let a = 0; a < data.length; a++) {
            if (data[a].id >= 11 && data[a].id <= 14) {
                const uraian = data[a].uraian
                if (uraian != null) {
                    let uraian_income;
                    let uraian_other;
                    if (data[a].id != 14) {
                        uraian_income = uraian.filter(item => item.nama.toLowerCase().includes('incoming'))
                        uraian_other = uraian.filter(item => !item.nama.toLowerCase().includes('incoming'))
                    } else {
                        uraian_income = uraian.filter(item => item.nama.toLowerCase().includes('pemakaian'))
                        uraian_other = uraian.filter(item => !item.nama.toLowerCase().includes('pemakaian'))
                    }

                    // Incoming list
                    let total_income = 0
                    for (let i = 0; i < uraian_income.length; i++) {
                        const items = uraian_income[i].items;
                        for (let j = 0; j < items.length; j++) {
                            const plan = items[j].plant == null ? null : items[j].plant;
                            list.push({
                                name: uraian_income[i].nama,
                                id_kategori: data[a].id,
                                kategori: data[a].nama,
                                satuan: uraian_income[i].satuan,
                                plant: (plan == null ? '' : plan.nama),
                                qty: items[j].qty == 0 ? '-' : formatCurrency(Number(items[j].qty).toFixed(2)),
                            })
                        }
                        total_income += uraian_income[i].total_qty
                    }

                    // Keterangan
                    list.push({
                        name: data[a].id == 14 ? '<span class="font-italic underline font-semibold">Allocation :</span>' : data[a].id == 12 ? '<span class="font-italic underline font-semibold">Distribution to :</span>' : '<span class="font-italic underline font-semibold">Outgoing : </span>',
                        id_kategori: data[a].id,
                        kategori: data[a].nama,
                        satuan: '',
                        plant: '',
                        qty: '',
                    })

                    // Other List
                    let total_other = 0
                    let satuan = '';
                    for (let i = 0; i < uraian_other.length; i++) {
                        const items = uraian_other[i].items;
                        for (let j = 0; j < items.length; j++) {
                            if (data[a].id == 13) {
                                if (uraian_other[i].id != 60) {
                                    const plan = items[j].plant == null ? null : items[j].plant;
                                    list.push({
                                        name: uraian_other[i].nama,
                                        id_kategori: data[a].id,
                                        kategori: data[a].nama,
                                        satuan: uraian_other[i].satuan,
                                        plant: (plan == null ? '' : plan.nama),
                                        qty: items[j].qty == 0 ? '-' : formatCurrency(Number(items[j].qty).toFixed(2)),
                                    })
                                } else {
                                    continue;
                                }
                            } else {
                                const plan = items[j].plant == null ? null : items[j].plant;
                                list.push({
                                    name: uraian_other[i].nama,
                                    id_kategori: data[a].id,
                                    kategori: data[a].nama,
                                    satuan: uraian_other[i].satuan,
                                    plant: (plan == null ? '' : plan.nama),
                                    qty: items[j].qty == 0 ? '-' : formatCurrency(Number(items[j].qty).toFixed(2)),
                                })
                            }
                        }
                        
                        if (data[a].id != 13 && uraian_other[i].id != 60) {
                            total_other += uraian_other[i].total_qty
                            satuan = uraian_other[i].satuan
                            list.push({
                                name: '<span class="underline font-medium">Total ' + uraian_other[i].nama + '</span>',
                                id_kategori: data[a].id,
                                kategori: data[a].nama,
                                satuan: uraian_other[i].satuan,
                                plant: '',
                                qty: uraian_other[i].total_qty == 0 ? '-' : formatCurrency(Number(uraian_other[i].total_qty).toFixed(2)),
                            })
                        }
                    }

                    // Nilai Total & Selisih
                    list.push({
                        name: '<span class="font-bold text-teal-500">TOTAL</span>',
                        id_kategori: data[a].id,
                        kategori: data[a].nama,
                        satuan: satuan,
                        plant: '',
                        qty: total_other == 0 ? '-' : formatCurrency(Number(total_other).toFixed(2)),
                    })
                    const selisih = total_income - total_other
                    list.push({
                        name: '<span class="font-bold text-red-500">SELISIH</span>',
                        id_kategori: data[a].id,
                        kategori: data[a].nama,
                        satuan: satuan,
                        plant: '',
                        qty: selisih == 0 ? '-' : selisih < 0 ? `(${formatCurrency(Number(selisih).toFixed(2)*(-1))})` : `${formatCurrency(Number(selisih).toFixed(2))}`,
                    })


                    if (data[a].id == 13) {
                        const list_uraian = uraian_other.find(item => item.id == 60);
                        const items = list_uraian == null ? null : list_uraian.items == null || list_uraian.items.length < 1 ? null : list_uraian.items
                        if (items != null) {
                            for (let i = 0; i < items.length; i++) {
                                const plan = items[i].plant == null ? null : items[i].plant;
                                list.push({
                                    name: list_uraian.nama,
                                    id_kategori: data[a].id,
                                    kategori: data[a].nama,
                                    satuan: list_uraian.satuan,
                                    plant: (plan == null ? '' : plan.nama),
                                    qty: items[i].qty == 0 ? '-' : formatCurrency(Number(items[i].qty).toFixed(2)),
                                })
                            }
                        }
                        list.push({
                            name: '<span class="underline font-medium">Total ' + list_uraian.nama + '</span>',
                            id_kategori: data[a].id,
                            kategori: data[a].nama,
                            satuan: list_uraian.satuan,
                            plant: '',
                            qty: list_uraian.total_qty == 0 ? '-' : formatCurrency(Number(list_uraian.total_qty).toFixed(2)),
                        })
                    }
                }
            }
        }
    }

    return list;
}

const packageProduct = async(data, setting) => {
    const L_to_kg = setting == null ? 0 : setting.find(item => item.id == 2) == null ? 0 : setting.find(item => item.id == 2).setting_value == null || setting.find(item => item.id == 2).setting_value == '0' ? 0 : Number(setting.find(item => item.id == 2).setting_value)
    const mL_to_kg = setting == null ? 0 : setting.find(item => item.id == 5) == null ? 0 : setting.find(item => item.id == 5).setting_value == null || setting.find(item => item.id == 5).setting_value == '0' ? 0 : Number(setting.find(item => item.id == 5).setting_value)
    const liter_1 = setting == null ? 0 : setting.find(item => item.id == 3) == null ? 0 : setting.find(item => item.id == 3).setting_value == null || setting.find(item => item.id == 3).setting_value == '0' ? 0 : Number(setting.find(item => item.id == 3).setting_value)
    const liter_2 = setting == null ? 0 : setting.find(item => item.id == 4) == null ? 0 : setting.find(item => item.id == 4).setting_value == null || setting.find(item => item.id == 4).setting_value == '0' ? 0 : Number(setting.find(item => item.id == 4).setting_value)
    const list = [];
    if (data != null) {
        for (let a = 0; a < data.length; a++) {
            if (data[a].id >= 7 && data[a].id <= 10) {
                const uraian = data[a].uraian
                if (uraian != null) {
                    const olein = uraian.filter(item => item.nama.toLowerCase().includes('olein'));
                    const carton = uraian.filter(item => item.nama.toLowerCase().includes('carton'));
                    const consume = uraian.filter(item => item.nama.toLowerCase().includes('consumable'));

                    // List push data
                    let sum_olein = 0;
                    for (let i = 0; i < olein.length; i++) {
                        sum_olein += Number(olein[i].total_qty);
                        list.push({
                            name: olein[i].nama,
                            id_kategori: data[a].id,
                            kategori: data[a].nama,
                            satuan: olein[i].satuan,
                            plant: '',
                            qty: olein[i].total_qty == 0 ? '-' : formatCurrency(Number(olein[i].total_qty).toFixed(2)),
                        })
                    }

                    // Sum Qty Carton
                    let sum_carton = 0;
                    for (let i = 0; i < carton.length; i++) {
                        sum_carton += Number(carton[i].total_qty)
                    }
                    
                    // Finish Product
                    let finish = 0;
                    if (data[a].id == 9) {
                        finish = sum_carton * mL_to_kg
                    } else {
                        finish = sum_carton * L_to_kg
                    }
                    list.push({
                        name: '<span class="font-italic font-medium">- To Finished Product</span>',
                        id_kategori: data[a].id,
                        kategori: data[a].nama,
                        satuan: 'Kg',
                        plant: '',
                        qty: finish == 0 ? '-' : formatCurrency(Number(finish).toFixed(2)),
                    })

                    // Sample, Hold And Remelt
                    let sample = sum_olein - finish;
                    list.push({
                        name: '<span class="font-italic font-medium">- To Sample, Hold And Remelt</span>',
                        id_kategori: data[a].id,
                        kategori: data[a].nama,
                        satuan: 'Kg',
                        plant: '',
                        qty: sample == 0 ? '-' : sample < 0 ? '(' + formatCurrency(Number(sample).toFixed(2) * -1) + ')' : formatCurrency(Number(sample).toFixed(2)),
                    })

                    list.push({
                        name: '<span class="font-italic font-bold">Carton</span>',
                        id_kategori: data[a].id,
                        kategori: data[a].nama,
                        satuan: '',
                        plant: '',
                        qty: '',
                    })
                    for (let i = 0; i < carton.length; i++) {
                        list.push({
                            name: carton[i].nama,
                            id_kategori: data[a].id,
                            kategori: data[a].nama,
                            satuan: carton[i].satuan,
                            plant: '',
                            qty: carton[i].total_qty == 0 ? '-' : formatCurrency(Number(carton[i].total_qty).toFixed(2)),
                        })
                    }

                    list.push({
                        name: '<span class="font-italic font-bold">Pouch</span>',
                        id_kategori: data[a].id,
                        kategori: data[a].nama,
                        satuan: '',
                        plant: '',
                        qty: '',
                    })
                    if (data[a].id == 9) {
                        const carton_pillow = uraian.filter(item => item.nama.toLowerCase().includes('250 ml') || item.nama.toLowerCase().includes('450 ml'));
                        const carton_pouch = uraian.filter(item => item.nama.toLowerCase().includes('900 ml') || item.nama.toLowerCase().includes('1800 ml'));
                        for (let i = 0; i < carton_pillow.length; i++) {
                            const qty = carton_pillow[i].total_qty * 0
                            list.push({
                                name: 'Pouch ' + carton_pillow[i].nama,
                                id_kategori: data[a].id,
                                kategori: data[a].nama,
                                satuan: 'Pillow',
                                plant: '',
                                qty: qty == 0 ? '-' : qty < 0 ? '(' + formatCurrency(Number(qty).toFixed(2) * -1) + ')' : formatCurrency(Number(qty).toFixed(2)),
                            })
                        }
                        for (let i = 0; i < carton_pouch.length; i++) {
                            const qty = carton_pouch[i].total_qty * 0
                            list.push({
                                name: 'Pouch ' + carton_pouch[i].nama,
                                id_kategori: data[a].id,
                                kategori: data[a].nama,
                                satuan: 'Pouch',
                                plant: '',
                                qty: qty == 0 ? '-' : qty < 0 ? '(' + formatCurrency(Number(qty).toFixed(2) * -1) + ')' : formatCurrency(Number(qty).toFixed(2)),
                            })
                        }
                    } else {
                        const carton_1l = uraian.filter(item => item.nama.toLowerCase().includes('1 l'));
                        const carton_2l = uraian.filter(item => item.nama.toLowerCase().includes('2 l'));
                        for (let i = 0; i < carton_1l.length; i++) {
                            const qty = carton_1l[i].total_qty * liter_1
                            list.push({
                                name: 'Pouch ' + carton_1l[i].nama,
                                id_kategori: data[a].id,
                                kategori: data[a].nama,
                                satuan: 'Pouch',
                                plant: '',
                                qty: qty == 0 ? '-' : qty < 0 ? '(' + formatCurrency(Number(qty).toFixed(2) * -1) + ')' : formatCurrency(Number(qty).toFixed(2)),
                            })
                        }
                        for (let i = 0; i < carton_2l.length; i++) {
                            const qty = carton_2l[i].total_qty * liter_2
                            list.push({
                                name: 'Pouch ' + carton_2l[i].nama,
                                id_kategori: data[a].id,
                                kategori: data[a].nama,
                                satuan: 'Pouch',
                                plant: '',
                                qty: qty == 0 ? '-' : qty < 0 ? '(' + formatCurrency(Number(qty).toFixed(2) * -1) + ')' : formatCurrency(Number(qty).toFixed(2)),
                            })
                        }
                    }

                    // Consumable
                    for (let i = 0; i < consume.length; i++) {
                        list.push({
                            name: consume[i].nama,
                            id_kategori: data[a].id,
                            kategori: data[a].nama,
                            satuan: consume[i].satuan,
                            plant: '',
                            qty: consume[i].total_qty == 0 ? '-' : consume[i].total_qty < 0 ? '(' + formatCurrency(Number(consume[i].total_qty).toFixed(2) * -1) + ')' : formatCurrency(Number(consume[i].total_qty).toFixed(2)),
                        })
                    }
                }
            }
        }
    }
    return list;
}

const refineryProd = async(data) => {
    const list = []
    if (data != null) {
        for (let a = 0; a < data.length; a++) {
            if (data[a].id >= 1 && data[a].id <= 5 ) {
                const uraian = data[a].uraian 
                if (uraian != null) {
                    const plant_total = []
                    for (let i = 0; i < uraian.length; i++) {
                        const items = uraian[i].items;
                        const plant = []
                        for (let j = 0; j < items.length; j++) {
                            const plan = items[j].plant == null ? null : items[j].plant
                            if (plan != null) {
                                plant.push({
                                    id:plan.id,
                                    nama:plan.nama,
                                    qty: items[j].qty
                                })

                                // Menentukan Nilai qty Losses
                                plant_total.push({
                                    id_uraian: i,
                                    id:plan.id,
                                    nama:plan.nama,
                                    qty: items[j].qty
                                })
                            }
                            if (i >= 0 && i < (uraian.length - 1)) {
                                list.push({
                                    name: uraian[i].nama + ' ' + (plan == null ? '' : plan.nama),
                                    id_kategori: data[a].id,
                                    kategori: data[a].nama,
                                    satuan: uraian[i].satuan,
                                    plant: (plan == null ? '' : plan.nama),
                                    qty: items[j].qty == 0 ? '-' : formatCurrency(Number(items[j].qty).toFixed(2)),
                                })
                            }
                        }

                        // Menentukan Nilai Total QTY masing2 Uraian
                        if (i < (uraian.length - 1)) {
                            list.push({
                                name: '<span class="underline font-medium">Total ' + uraian[i].nama + '</span>',
                                satuan: uraian[i].satuan,
                                id_kategori: data[a].id,
                                kategori: data[a].nama,
                                plant: null,
                                qty: uraian[i].total_qty == 0 ? '-' : formatCurrency(Number(uraian[i].total_qty).toFixed(2)),
                            })
                        }
            
                        if (i > 0 && i < (uraian.length - 1)) {
                            if (plant.length > 0) {
                                const item = uraian[0].items;
                                const plan = []
                                for (let j = 0; j < item.length; j++) {
                                    plan.push({
                                        id:item[j].plant.id,
                                        nama:item[j].plant.nama,
                                        qty: item[j].qty
                                    })
                                }
                                let persen_rendemen = 0;
                                for (let j = 0; j < plant.length; j++) {
                                    const qty = plan.find(item => item.id == plant[j].id).qty
                                    const persen = qty == 0 || plant[j].qty == 0 ? 0 : (Number(plant[j].qty) / Number(qty))*100;
                                    persen_rendemen += persen
                                    list.push({
                                        name: '<span class="font-italic">'+ uraian[i].nama + ' (Rendement %) ' + plant[j].nama + '</span>',
                                        satuan: '%',
                                        id_kategori: data[a].id,
                                        kategori: data[a].nama,
                                        plant: plant[j].nama,
                                        qty: persen == 0 ? '-' : `${formatCurrency(Number(persen).toFixed(2))}%`,
                                    })
                                }
                                list.push({
                                    name: '<span class="font-semibold font-italic underline">TOTAL ' + uraian[i].nama + ' (Rendement %) :</span>',
                                    satuan: '%',
                                    id_kategori: data[a].id,
                                    kategori: data[a].nama,
                                    plant: '',
                                    qty:  persen_rendemen == 0 ? '-' : `${formatCurrency(Number(persen_rendemen).toFixed(2))}%`,
                                })
                            }
                        }

                        if (i == (uraian.length - 1)) {
                            const sumByIdAndUraian = plant_total.reduce((acc, item) => {
                                if (!acc[item.id]) {
                                    acc[item.id] = { id: item.id, nama: item.nama, qty: 0 };
                                }
                                // Add for id_uraian = 0, subtract for others
                                if (item.id_uraian === 0) {
                                    acc[item.id].qty += item.qty;
                                } else {
                                    acc[item.id].qty -= item.qty;
                                }
                                return acc;
                            }, {});
                            
                            const result = Object.values(sumByIdAndUraian);

                            // Get Losses (Kg)
                            let total_losses = 0;
                            for (let j = 0; j < result.length; j++) {
                                total_losses += result[j].qty
                                list.push({
                                    name: '<span class="font-medium font-italic">Losses (Kg) ' + result[j].nama +'</span>',
                                    satuan: 'Kg',
                                    id_kategori: data[a].id,
                                    kategori: data[a].nama,
                                    plant: result[j].nama,
                                    qty: result[j].qty == 0 ? '-' : result[j].qty < 0 ? `(${formatCurrency(Number(result[j].qty).toFixed(2)*(-1))})` : `${formatCurrency(Number(result[j].qty).toFixed(2))}`,
                                })
                            }
                            list.push({
                                name: '<span class="font-semibold font-italic underline">TOTAL Losses (Kg) </span>',
                                satuan: 'Kg',
                                id_kategori: data[a].id,
                                kategori: data[a].nama,
                                plant: '',
                                qty: total_losses == 0 ? '-' : total_losses < 0 ? `(${formatCurrency(Number(total_losses).toFixed(2)*(-1))})` : `${formatCurrency(Number(total_losses).toFixed(2))}`,
                            })

                            // Get Losses (Rendement %)
                            let total_losses_rend = 0
                            for (let j = 0; j < result.length; j++) {
                                const item = uraian[0].items;
                                const qty = item.find(look => look.plant.id == result[j].id)
                                const losses_rendement = qty.qty == 0 ? 0 : result[j].qty / qty.qty
                                total_losses_rend += losses_rendement
                                list.push({
                                    name: '<span class="font-medium font-italic">Losses (Rendement %) ' + result[j].nama +'</span>',
                                    satuan: '%',
                                    id_kategori: data[a].id,
                                    kategori: data[a].nama,
                                    plant: result[j].nama,
                                    qty: losses_rendement == 0 ? '-' : losses_rendement < 0 ? `${formatCurrency(Number(losses_rendement).toFixed(2)*(-1))}%` : `${formatCurrency(Number(losses_rendement).toFixed(2))}%`,
                                })
                            }
                            list.push({
                                name: '<span class="font-semibold font-italic underline">TOTAL Losses (Rendement %)</span>',
                                satuan: '%',
                                id_kategori: data[a].id,
                                kategori: data[a].nama,
                                plant: '',
                                qty: total_losses_rend == 0 ? '-' : total_losses_rend < 0 ? `${formatCurrency(Number(total_losses_rend).toFixed(2)*(-1))}%` : `${formatCurrency(Number(total_losses_rend).toFixed(2))}%`,
                            })
                            for (let j = 0; j < items.length; j++) {
                                list.push({
                                    name: uraian[i].nama,
                                    satuan: uraian[i].satuan,
                                    id_kategori: data[a].id,
                                    kategori: data[a].nama,
                                    plant: '',
                                    qty: items[j].qty == 0 ? '-' : formatCurrency(Number(items[j].qty).toFixed(0)),
                                })
                            }
                        }
                    }
                }
            }
        }
    }
    return list
}