import stockBulky from '@/api/accounting/stockBulky.js';
import { formatCurrency, productableType } from "@/controller/dummy/func_dummy.js";
import {msg_success, msg_warning, msg_error} from '@/controller/dummy/func_dummy.js';
import moment from 'moment';

export const loadLatest_StockBulkyController = async() => {
    try {
        const response = await stockBulky.getLatest()
        const load = response.data;
        const data = load.data;
        return data;
    } catch (error) {
        return null;
    }
}

export const add_StockBulkyController = async(form) => {
    try {
        const response = await stockBulky.addPost(form);
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

export const update_StockBulkyController = async(id,form) => {
    try {
        const response = await stockBulky.updatePost(id,form);
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

export const postData_StockBulkyController = async(form) => {
    let msg = {severity: '', content: ''}
    const list = []
    for (let i = 0; i < form.length; i++) {
        list.push({
            id: form[i].id,
            tanggal: form[i].tanggal,
            tank_id: form[i].tank_id,
            tank_name: form[i].tank_name,
            capacity: form[i].capacity,
            productable_type: form[i].productable_id.type,
            productable_id: form[i].productable_id.id,
            stok_mt: form[i].stok_mt,
            stok_exc_btm_mt: form[i].stok_exc_btm_mt,
            umur: form[i].umur,
            remarks: form[i].remarks,
        })
    }

    // Proses List
    let kondisi;
    for (let i = 0; i < list.length; i++) {
        if (list[i].productable_type != null && list[i].productable_type != null && list[i].productable_id != null && list[i].stok_mt != null && list[i].stok_exc_btm_mt != null && list[i].umur != null && list[i].remarks != null) {
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

    // Proses Post Data
    if (kondisi == true) {
        const date = moment().format('YYYY-MM-DD');
        for (let i = 0; i < list.length; i++) {
            // const verify = form.find(item => item.tanggal == list[i].tanggal)
            const cond = date == list[i].tanggal ? 'update' : 'add'
            console.log(cond, list[i].tanggal, date)
            if (cond == 'update') {
                await update_StockBulkyController(list[i].id, list[i])
            } else {
                list[i].tanggal = date
                await add_StockBulkyController(list[i])
            }
        }
        msg = { severity: 'success', content: 'Data berhasil di simpan' };
    }

    return msg
}

export const loadTable_StockBulkyController = async() => {
    const response = await loadLatest_StockBulkyController()
    const grand_total = response == null ? null : response.GrandTotal == null ? null : response.GrandTotal;
    const stock = response == null ? null : response.bulkyStock == null ? null : response.bulkyStock;
    const list = [];
    const list_summary = [];
    if (stock != null) {
        for (let i = 0; i < stock.length; i++) {
            const items = stock[i].items == null || stock[i].items.length < 1 ? null : stock[i].items
            if (items != null) {
                for (let j = 0; j < items.length; j++) {
                    const product = await productableType(items[j].productable_type)
                    let nama_produk;
                    if (product == 'product') {
                        nama_produk = `${items[j].extended_productable.productable.name} ${items[j].extended_productable.nama}`
                    } else if (product == 'subproduct') {
                        nama_produk = `${items[j].extended_productable.product.productable.name} ${items[j].extended_productable.product.nama} (${items[j].extended_productable.nama})`
                    } else {
                        nama_produk = `${items[j].extended_productable.name}`;
                    }
                    list.push({
                        id: items[j].id,
                        category: stock[i].name,
                        capacity: formatCurrency(Number(items[j].tank.capacity).toFixed(0)),
                        stok_mt: Number(items[j].stok_mt),
                        stok_exc_btm_mt: Number(items[j].stok_exc_btm_mt),
                        umur: Number(items[j].umur),
                        space: Number(items[j].space),
                        tank_name: items[j].tank.name,
                        tank_id: items[j].tank_id,
                        location: items[j].tank.location.name,
                        tanggal: items[j].tanggal,
                        productable_type: await productableType(items[j].productable_type) == 'bulky' ? 'bulk' : await productableType(items[j].productable_type),
                        productable_id: items[j].productable_id,
                        remarks: items[j].remarks,
                        nama_produk: nama_produk,
                    })
                }
            }
            list.push({
                id: null,
                category: stock[i].name,
                capacity: formatCurrency(Number(stock[i].totalKapasitas).toFixed(0)),
                stok_mt: Number(stock[i].totalStockMt),
                stok_exc_btm_mt: Number(stock[i].totalStockExcBtm),
                umur: null,
                space: Number(stock[i].totalSpace),
                tank_name: 'Total',
                tank_id: null,
                tanggal: null,
                location: null,
                productable_type: null,
                productable_id: null,
                remarks: null,
                nama_produk: null,
            })
        }

        const result = list.reduce((acc, item) => {
            const tank = item.tank_name.includes('SBY') ? 'SBY' : 'NON-SBY';
            const key = `${item.category}_${tank}`;
          
            if (!acc[key]) {
              acc[key] = { category: item.category, tank, stok_mt: 0, stok_exc_btm_mt: 0 };
            }
          
            acc[key].stok_mt += item.stok_mt;
            acc[key].stok_exc_btm_mt += item.stok_exc_btm_mt;
          
            return acc;
          }, {});
          
          const summedData = Object.values(result);
    }
    return list;
}