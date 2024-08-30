import stockRetail from '@/api/accounting/stockRetail.js';
import kapasitasWh from '@/api/accounting/kapasitasWh.js';
import { formatCurrency, productableType } from "@/controller/dummy/func_dummy.js";
import {msg_success, msg_warning, msg_error} from '@/controller/dummy/func_dummy.js';
import moment from 'moment';

export const loadLatest_StockRetailController = async() => {
    try {
        const response = await stockRetail.getLatest()
        const load = response.data;
        const data = load.data;
        return data;
    } catch (error) {
        return null;
    }
}

export const add_StockRetailController = async(form) => {
    try {
        const response = await stockRetail.addPost(form);
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

export const update_StockRetailController = async(id,form) => {
    try {
        const response = await stockRetail.updatePost(id,form);
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

export const addKapasitas_StockRetailController = async(form) => {
    try {
        const response = await kapasitasWh.addPost(form);
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

export const updateKapasitas_StockRetailController = async(id,form) => {
    try {
        const response = await kapasitasWh.updatePost(id,form);
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

export const postData_StockRetailController = async(form, form2) => {
    let msg = {severity: '', content: ''}
    const list = []

    // Kapasitas WH
    for (let i = 0; i < form2.length; i++) {
        list.push({
            id: form2[i].id,
            location_id: form2[i].location_id,
            location_name: form2[i].location_name,
            tanggal: form2[i].tanggal,
            value: form2[i].value,
        })
    }
    // Stock Retail
    for (let i = 0; i < form.length; i++) {
        list.push({
            id: form[i].id,
            produk: form[i].produk,
            location_id: form[i].location_id,
            location_name: form[i].location_name,
            ctn: form[i].ctn,
            tanggal: form[i].tanggal,
            productable_type: form[i].productable_type,
            productable_id: form[i].productable_id,
        })
    }

    let kondisi;
    for (let i = 0; i < list.length; i++) {
        if (i == 0) {
            if (list[i].location_id != null && list[i].value != null) {
                if (i < (list.length - 1)) {
                    continue;
                }
                kondisi = true
            } else {
                msg = {severity:'warn', content:`Mohon data diisi value pada bagian Kapasitas WH`};
                kondisi = false
                break;
            }
        } else {
            if (list[i].location_id != null && list[i].ctn != null && list[i].productable_id != null && list[i].productable_type != null) {
                if (i < (list.length - 1)) {
                    continue;
                }
                kondisi = true
            } else {
                msg = {severity:'warn', content:`Mohon data diisi value pada bagian ${list[i].tank_name} ${list[i].capacity}`};
                kondisi = false
                break;
            }
        }
    }

    // Proses Post Data
    if (kondisi == true) {
        const date = moment().format('YYYY-MM-DD');
        for (let i = 0; i < list.length; i++) {
            // const verify = form.find(item => item.tanggal == list[i].tanggal)
            const cond = date == list[i].tanggal ? 'update' : 'add'
            // console.log(cond, list[i].tanggal, date)
            // console.log(list[i])
            if (i == 0) {
                if (cond == 'update') {
                    await updateKapasitas_StockRetailController(list[i].id, list[i])
                } else {
                    list[i].tanggal = date
                    await addKapasitas_StockRetailController(list[i])
                }
            } else {
                if (cond == 'update') {
                    await update_StockRetailController(list[i].id, list[i])
                } else {
                    list[i].tanggal = date
                    await add_StockRetailController(list[i])
                }
            }
        }
        msg = { severity: 'success', content: 'Data berhasil di simpan' };
    }

    return msg
}

export const loadTable_StockRetailController = async() => {
    const response = await loadLatest_StockRetailController()
    const location = response == null ? null : response.location == null || response.location.length < 1 ? null : response.location
    const totalStock = response == null ? null : response.totalStock == null || response.totalStock.length < 1 ? null : response.totalStock
    const dataPallet = response == null ? null : response.dataPallet == null || response.dataPallet.length < 1 ? null : response.dataPallet

    const list = []
    const list_stock = []

    const list_pallet = []
    if (dataPallet != null) {
        for (let i = 0; i < dataPallet.length; i++) {
            const pallet = Number(dataPallet[i].value);
            const ctn = pallet * 55;
            const mt = ctn * 0.010864;
            list_pallet.push({
                id: dataPallet[i].id,
                location_id: dataPallet[i].location_id,
                location_name: dataPallet[i].location.name,
                tanggal: dataPallet[i].tanggal,
                pallet: pallet,
                ctn: ctn,
                mt: mt,
            })
        }
    }

    // menentukan total stock
    if (totalStock != null) {
        const item = totalStock.item;
        let total_mt = 0;
        const list_item = []
        for (let i = 0; i < item.length; i++) {
            const seleksi = item[i].name.includes('900') ? 10.8 : 
                            item[i].name.includes('1800') ? 10.8 : 
                            item[i].name.includes('450') ? 10.8 : 12

            const mt = Number(item[i].total) == null || Number(item[i].total) == 0 ? 0 : Number(item[i].total) * seleksi * (0.905/1000)
            total_mt += mt
            list_item.push({
                location_id: null,
                location_name: null,
                ctn: item[i].total,
                mt: mt,
                produk: `${item[i].name}`
            })
        }
        list_stock.push({
            lokasi: 'TOTAL STOCK',
            tot_ctn : totalStock.totalCtn,
            tot_mt : total_mt,
            items: list_item
        })
    }

    // load data stock base on location
    if (location != null) {
        for (let i = 0; i < location.length; i++) {
            let total_mt = 0, total_pallet = 0;
            const items = location[i].items;
            const list_item = []
            const kapasitas_wh = list_pallet.find(item => item.location_name == location[i].name)
            for (let j = 0; j < items.length; j++) {
                const seleksi = items[j].extended_productable.nama.includes('900') ? 10.8 : 
                                items[j].extended_productable.nama.includes('1800') ? 10.8 : 
                                items[j].extended_productable.nama.includes('450') ? 10.8 : 12

                const mt = Number(items[j].ctn) == null || Number(items[j].ctn) == 0 ? 0 : Number(items[j].ctn) * seleksi * (0.905/1000)
                total_mt += mt
                const pallet = Number(items[j].ctn) == null || Number(items[j].ctn) == 0 ? 0 : Number(items[j].ctn) / 55
                total_pallet += pallet
                const product = await productableType(items[j].productable_type)
                list_item.push({
                    location_id: items[j].location.id,
                    location_name: items[j].location.name,
                    id: items[j].id,
                    ctn: items[j].ctn,
                    mt: mt,
                    pallet: pallet,
                    productable_id: items[j].productable_id,
                    tanggal: items[j].tanggal,
                    productable_type: product,
                    produk: `${items[j].extended_productable.product.nama} ${items[j].extended_productable.product.productable.name} ${items[j].extended_productable.nama}`
                })
            }
            list.push({
                lokasi: location[i].name,
                tot_ctn : location[i].totalCtn,
                tot_mt : total_mt,
                tot_pallet : total_pallet,
                items: list_item,
                kapasitas_wh: kapasitas_wh
            })
        }
    }

    const result = {
        list: list,
        list_stock: list_stock,
    }

    // return response;
    return result;
}