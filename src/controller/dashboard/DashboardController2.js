import DashService from '@/api/dashboard/DashService.js';
import {loadAllByPeriod_ProCostController, loadAllMarket_ProCostController} from '@/controller/retail/ProCostController.js';
import { formatCurrency } from "@/controller/dummy/func_dummy.js";
import {dummy} from '@/controller/production/TestDummy.js'
// import { moment } from 'moment';

export const loadDashByDate_DashboardController = async(tgl) => {
    try {
        const response = await DashService.getByDate({tanggal:tgl});
        const load = response.data;
        // const data = load.data;
        return load;
    } catch (error) {
        return null;
    }
}

export const rekapRekeningSaldoCash = async(data) => {
    const dataTipeRekening = data == null ? null : data.dataTipeRekening == null ? null : data.dataTipeRekening;
    const dataCash = data == null ? null : data.dataCash == null ? null : data.dataCash;
    const lastDayJisdor = data == null ? null : data.lastDayJisdor == null ? null : data.lastDayJisdor;

    const listCash = [];
    let totCash = 0;
    if (dataCash != null) {
        for (let i = 0; i < dataCash.length; i++) {
            let value = 0
            if (dataCash[i].rekening.matauang.name == 'IDR') {
                value = Number(dataCash[i].value);
            } else {
                value = Number(dataCash[i].value) * Number(lastDayJisdor);
            }

            totCash += value;
            listCash.push({
                id: dataCash[i].rekening_id,
                id_type: dataCash[i].rekening.tipe_id,
                value: value,
                matauang: dataCash[i].rekening.matauang.name,
            })
        }
    }

    // Rekening Cash on Hand
    const list = []
    let totOnHand = 0;
    if (dataTipeRekening != null) {
        for (let i = 0; i < dataTipeRekening.length; i++) {
            const filter = listCash.filter(item => item.id_type == dataTipeRekening[i].id)

            let values = 0
            // Get Value in Cash on Hand
            if (filter != null) {
                for (let j = 0; j < filter.length; j++) {
                    values += filter[j].value * 1;
                }
            }

            totOnHand += values
            // List Tipe Rekening
            list.push({
                id: dataTipeRekening[i].id,
                nama: dataTipeRekening[i].nama,
                value: values,
            })
        }
    }

    return{
        list_on_hand: list,
        total_on_hand: totOnHand,
        total_cash: totCash,
    }
}

export const statistikKinerja__DashboardController = async(data) => {
    const persentage = data == null ? null : data.dataTarget == null ? null : data.dataTarget.percentageToTarget == null ? null : data.dataTarget.percentageToTarget
    const real = data == null ? null : data.dataTarget == null ? null : data.dataTarget.targetReal == null ? null : data.dataTarget.targetReal
    const rkap = data == null ? null : data.dataTarget == null ? null : data.dataTarget.targetRkap == null ? null : data.dataTarget.targetRkap
    
    const prodvsrkap = data == null ? null : data.dataTarget == null ? null : data.dataTarget.qtyProduksiVsRkap == null ? null : data.dataTarget.qtyProduksiVsRkap
    const prodvsutil = data == null ? null : data.dataTarget == null ? null : data.dataTarget.qtyProduksiVsUtility == null ? null : data.dataTarget.qtyProduksiVsUtility
    console.log(prodvsutil)
    const kinerja_sales = []
    const kinerja_produksi = []
    
    // Proses Kinerja Sales
    if (persentage != null && real != null && rkap != null) {
        for (let i = 0; i < persentage.length; i++) {
            const newName = persentage[i].name.replace('Total', '');
            const bracketedName = newName.replace(/(\w+)/, '$1');
            const nilai_real = real.find(item => item.name.toLowerCase().includes(bracketedName.toLowerCase())) == null ? 0 : real.find(item => item.name.toLowerCase().includes(bracketedName.toLowerCase()))
            const nilai_rkap = rkap.find(item => item.name.toLowerCase().includes(bracketedName.toLowerCase())) == null ? 0 : rkap.find(item => item.name.toLowerCase().includes(bracketedName.toLowerCase()))
            kinerja_sales.push({
                name: bracketedName,
                persen: Number(persentage[i].real),
                real: Number(nilai_real.total),
                rkap: Number(nilai_rkap.total),
            })
        }
    }

    // Proses Kinerja Produksi
    if (prodvsrkap != null) {
        const nilai_real = prodvsrkap.find(item => item.name.toLowerCase().includes('real'));
        const nilai_rkap = prodvsrkap.find(item => item.name.toLowerCase().includes('rkap'));
        const nilai_persen = prodvsrkap.find(item => item.name.toLowerCase().includes('target'));
        kinerja_produksi.push({
            name: 'Real vs RKAP',
            persen: Number(nilai_persen.value),
            real: Number(nilai_real.value),
            rkap: Number(nilai_rkap.value),
            name_real: 'Real',
            name_rkap: 'RKAP',
        })
    }
    if (prodvsutil != null) {
        const nilai_real = prodvsutil.find(item => item.name.toLowerCase().includes('real'));
        const nilai_rkap = prodvsutil.find(item => item.name.toLowerCase().includes('utility'));
        const nilai_persen = prodvsutil.find(item => item.name.toLowerCase().includes('target'));
        kinerja_produksi.push({
            name: 'Real vs Capacity',
            persen: Number(nilai_persen.value),
            real: Number(nilai_real.value),
            rkap: Number(nilai_rkap.value),
            name_real: 'Real',
            name_rkap: 'Cap',
        })
    }

    return {
        kinerja_sales: kinerja_sales,
        kinerja_produksi: kinerja_produksi,
    }
}

export const nilaiStockKemasan_DashboardController = async(data) => {
    const avg_price = data == null ? null : data.dataAvgPrice == null ? null : data.dataAvgPrice.stockTersedia == null ? null : data.dataAvgPrice.stockTersedia.items == null ? null : data.dataAvgPrice.stockTersedia.items;
    // const nilai_retail = data == null ? null : data.dataStokRetail == null ? null : data.dataStokRetail.totalStock == null ? null : data.dataStokBulky.totalStock.item == null ? null : data.dataStokBulky.totalStock.item;
    const nilai_retail = data == null ? null : data.dataStokRetail == null ? null : data.dataStokRetail
    const kemasan = nilai_retail == null ? null : nilai_retail.totalStock == null ? null : nilai_retail.totalStock.item == null ? null : nilai_retail.totalStock.item
    
    const list_kemasan = []
    let total_kemasan = {qty: 0, harga:0, value:0}
    const price_kemasan = avg_price == null ? null : avg_price.filter(item => item.name.toLowerCase().includes('kemasan') && !item.name.toLowerCase().includes('kemasan58')) == null ? null : avg_price.filter(item => item.name.toLowerCase().includes('kemasan') && !item.name.toLowerCase().includes('kemasan58'))
    
    const list_price_kemasan = []
    if (price_kemasan != null) {
        for (let i = 0; i < price_kemasan.length; i++) {
            const newName = price_kemasan[i].name.replace('kemasan', '');
            const bracketedName = newName.replace(/(\w+)/, '$1');
            list_price_kemasan.push({
                name: bracketedName,
                qty: price_kemasan[i].qty,
                rpPerKg: price_kemasan[i].rpPerKg,
                jumlah: price_kemasan[i].jumlah,
            })
        }
    }
    
    if (kemasan != null) {
        const list = []
        for (let i = 0; i < kemasan.length; i++) {
            let kalkulasi = 0
            if (kemasan[i].name.includes('1L') || kemasan[i].name.includes('2L')) {
                kalkulasi = 12 * 0.905
            } else if (kemasan[i].name.includes('900')) {
                kalkulasi = 12 * 0.9 * 0.905
            } else if (kemasan[i].name.includes('1800')) {
                kalkulasi = 6 * 1.8 * 0.905
            } else if (kemasan[i].name.includes('450')) {
                kalkulasi = 24 * 0.45 * 0.905
            } else {
                kalkulasi = 48 * 0.25 * 0.905
            }
            const qty = Number(kemasan[i].total) * kalkulasi
            const harga = 0;
            const value = qty * harga;
            list.push({
                name: kemasan[i].name,
                qty: qty,
                harga: harga,
                value: value,
            })
            total_kemasan.qty += qty;
        }

        for (let i = 0; i < list_price_kemasan.length; i++) {
            const retails = list.filter(item => item.name.toLowerCase().includes(list_price_kemasan[i].name.toLowerCase()))
            if (retails.length > 0 || retails != null) {
                for (let j = 0; j < retails.length; j++) {
                    const value = Number(retails[j].qty) * Number(list_price_kemasan[i].rpPerKg)
                    list_kemasan.push({
                        name: retails[j].name,
                        qty: retails[j].qty,
                        harga: list_price_kemasan[i].rpPerKg,
                        value: value,
                    })
                    total_kemasan.value += value;
                }
            }
        }

        total_kemasan.harga = Number(total_kemasan.value) / Number(total_kemasan.qty)
    }

    const result = {
        list_kemasan: list_kemasan,
        total_kemasan: total_kemasan,
    }

    return result
}

export const nilaiStock_DashboardController = async(data) => {
    const avg_price = data == null ? null : data.dataAvgPrice == null ? null : data.dataAvgPrice.stockTersedia == null ? null : data.dataAvgPrice.stockTersedia.items == null ? null : data.dataAvgPrice.stockTersedia.items;
    const nilai_stock = data == null ? null : data.dataStokBulky == null ? null : data.dataStokBulky.bulkyStock == null ? null : data.dataStokBulky.bulkyStock;
    const dataStockAwal = data == null ? 0 : data.dataStockAwalCpo == null ? 0 : data.dataStockAwalCpo.stokTersedia == null ? 0 : data.dataStockAwalCpo.stokTersedia.totalHarga == null ? 0 : data.dataStockAwalCpo.stokTersedia.totalHarga;
    // Stock Bulky
    const list_bulk = []
    let total_bulk = {qty: 0, harga:0, value:0}
    if (nilai_stock != null) {
        const rbdo = nilai_stock.find(item => item.name.toLowerCase().includes('olein'));
        const item_rbdo = rbdo.items;
        const non_rbdo = nilai_stock.filter(item => !item.name.toLowerCase().includes('olein'));

        // Non RBD Olein
        for (let i = 0; i < non_rbdo.length; i++) {
            let name = non_rbdo[i].name;
            if (non_rbdo[i].name.toLowerCase().includes('rbdps')) {
                name = 'RBD Stearin';
            }
            let get_harga = 0
            if (non_rbdo[i].name.toLowerCase().includes('rbdps')) {
                const price = avg_price == null ? null : avg_price.find(item => item.name.toLowerCase().includes('stearin')) == null ? null : avg_price.find(item => item.name.toLowerCase().includes('stearin'))
                get_harga = price == null ? 0 : price.rpPerKg
            } else if (non_rbdo[i].name.toLowerCase().includes('cpo')) {
                get_harga = dataStockAwal
            } else {
                const price = avg_price == null ? 0 : avg_price.find(item => item.name.toLowerCase().includes(non_rbdo[i].name.toLowerCase())) == null ? 0 : avg_price.find(item => item.name.toLowerCase().includes(non_rbdo[i].name.toLowerCase()));
                get_harga = price == null ? 0 : price.rpPerKg
            }
            const qty = Number(non_rbdo[i].totalStockMt) * 1000
            const value = qty * get_harga;
            list_bulk.push({
                name: name,
                qty: qty,
                harga: Number(get_harga),
                value: value,
            })
        }

        // RBD Olein
        const list_olein = []
        const price_olein = avg_price == null ? null : avg_price.filter(item => item.name.toLowerCase().includes('bulk')) == null ? null : avg_price.filter(item => item.name.toLowerCase().includes('bulk'))
        const list_price_olein = []
        if (price_olein != null) {
            for (let i = 0; i < price_olein.length; i++) {
                const newName = price_olein[i].name.replace('bulk', 'RBD Olein IV ');
                const bracketedName = newName.replace(/RBD Olein IV (\w+)/, 'RBD Olein IV $1');
                list_price_olein.push({
                    name: bracketedName,
                    qty: price_olein[i].qty,
                    rpPerKg: price_olein[i].rpPerKg,
                    jumlah: price_olein[i].jumlah,
                })
            }
        }
        for (let i = 0; i < item_rbdo.length; i++) {
            let name 
            if (item_rbdo[i].productable_type.toLowerCase().includes('masterproduct')) {
                name = `${item_rbdo[i].extended_productable.productable.name} ${item_rbdo[i].extended_productable.nama}`
            } else {
                name = `${item_rbdo[i].extended_productable.product.productable.name} ${item_rbdo[i].extended_productable.product.nama}`
            }
            // Price
            const price = list_price_olein.length < 1 ? 0 : list_price_olein.find(item => item.name.includes(name)) == null ? 0 : list_price_olein.find(item => item.name.includes(name)).rpPerKg == null ? 0 : list_price_olein.find(item => item.name.includes(name)).rpPerKg;
            const qty = Number(item_rbdo[i].stok_mt) * 1000
            const value = qty * Number(price);
            list_olein.push({
                name: name,
                qty: qty,
                harga: Number(price),
                value: value,
            })
        }
        const result = list_olein.reduce((acc, item) => {
            if (!acc[item.name]) {
                acc[item.name] = { name: item.name, qty: 0, harga: 0, value: 0 };
            }
            acc[item.name].qty += item.qty;
            acc[item.name].harga = item.harga;
            acc[item.name].value += item.value;
            return acc;
        }, {});
        const summedData = Object.values(result);
        
        for (let i = 0; i < summedData.length; i++) {
            list_bulk.push({
                name: summedData[i].name,
                qty: summedData[i].qty,
                harga: summedData[i].harga,
                value: summedData[i].value,
            })
        }

        // get Total
        for (let i = 0; i < list_bulk.length; i++) {
            total_bulk.qty += list_bulk[i].qty
            total_bulk.value += list_bulk[i].value
        }
        total_bulk.harga = Number(total_bulk.value) / Number(total_bulk.qty)
    }

    const result = {
        list_bulk: list_bulk,
        total_bulk: total_bulk,
    }

    return result
}

export const loadUpdateMarket_DashboardController = async(data, tgl) => {
    const list = []
    const load = data == null ? null : data.dataProCost == null ? null : data.dataProCost
    if (load != null) {
        const response = await loadAllMarket_ProCostController(load, tgl)
        if (response != null) {
            for (let i = 0; i < response.length; i++) {
                const rbdpo_levy = response[i].rbdpo.levy.nilai == null ? 0 : Number(response[i].rbdpo.levy.nilai)
                const rbdpo_routers = response[i].rbdpo.routers.nilai == null ? 0 : Number(response[i].rbdpo.routers.nilai)
                const pfad_levy = response[i].pfad.levy.nilai == null ? 0 : Number(response[i].pfad.levy.nilai)
                const pfad_routers = response[i].pfad.routers.nilai == null ? 0 : Number(response[i].pfad.routers.nilai)
                const rbdo_levy = response[i].rbdo.levy.nilai == null ? 0 : Number(response[i].rbdo.levy.nilai)
                const rbdo_routers = response[i].rbdo.routers.nilai == null ? 0 : Number(response[i].rbdo.routers.nilai)
                const rbds_levy = response[i].rbds.levy.nilai == null ? 0 : Number(response[i].rbds.levy.nilai)
                const rbds_routers = response[i].rbds.routers.nilai == null ? 0 : Number(response[i].rbds.routers.nilai)
    
                list.push({
                    tanggal: response[i].tanggal,
                    rbdpo: {
                        levy: rbdpo_levy,
                        routers: rbdpo_routers,
                        excld: rbdpo_routers - rbdpo_levy,
                    },
                    pfad: {
                        levy: pfad_levy,
                        routers: pfad_routers,
                        excld: pfad_routers - pfad_levy,
                    },
                    rbdo: {
                        levy: rbdo_levy,
                        routers: rbdo_routers,
                        excld: rbdo_routers - rbdo_levy,
                    },
                    rbds: {
                        levy: rbds_levy,
                        routers: rbds_routers,
                        excld: rbds_routers - rbds_levy,
                    },
                })
                
            }
        }
    }
    return list;
}

export const nilaiKurs_DashboardController = async(data) => {
    // data = dummy;
    const avg_jisdor = data == null ? 0 : data.avgJisdor == null ? 0 : Number(data.avgJisdor)
    const last_jisdor = data == null ? 0 : data.lastDayJisdor == null ? 0 : Number(data.lastDayJisdor)
    const mandiri = data == null ? 0 : data.mandiriJisdor == null ? 0 : data.mandiriJisdor.value == null ? 0 : Number(data.mandiriJisdor.value)
    const result = {
        avg_jisdor : avg_jisdor,
        last_jisdor : last_jisdor,
        mandiri : mandiri,
    }
    return result;
}

export const nilaiCpo_DashboardController = async(data) => {
    // data = dummy;
    const cpo_olah = data == null ? 0 : data.cpoOlahINL == null ? 0 : formatCurrency(Number(data.cpoOlahINL).toFixed(0))
    const this_month = data == null ? 0 : data.avgCpoKpbn == null ? 0 : formatCurrency(Number(data.avgCpoKpbn).toFixed(0))
    const mtd = data == null ? 0 : data.avgCpoKpbnMtd == null ? 0 : formatCurrency(Number(data.avgCpoKpbnMtd).toFixed(0))
    const result = [
        {name: 'Average Actual Price', exp: 'CPO Olah INL', value: cpo_olah},
        {name: 'This Month', exp: 'Average CPO KPBN', value: this_month},
        {name: 'MTD', exp: 'Average CPO KPBN', value: mtd},
    ]
    return result;
}

export const nilaiCpoOutstanding_DashboardController = async(data) => {
    // data = dummy;
    const response = data == null ? 0 : data.dataOutstanding == null || data.dataOutstanding < 1 ? null : data.dataOutstanding;
    const list = []

    let qty = 0, value = 0, harga = 0;
    if (response != null) {
        for (let i = 0; i < response.length; i++) {
            qty += Number(response[i].qty)
            const nilai = Number(response[i].qty) * Number(response[i].harga)
            value += nilai
            list.push({
                id: response[i].id,
                kontrak: response[i].kontrak,
                supplier: response[i].supplier,
                qty: formatCurrency(Number(response[i].qty).toFixed(2)),
                harga: formatCurrency(Number(response[i].harga).toFixed(2)),
                created_at: response[i].created_at,
                updated_at: response[i].updated_at,
                qty_out: formatCurrency(Number(response[i].qty_out).toFixed(2)),
                value: formatCurrency(Number(nilai).toFixed(2)),
            })
        }
    }
    harga = qty == 0 ? 0 : value / qty;
    const result = {
        tot_harga: formatCurrency(Number(harga).toFixed(0)),
        tot_qty: formatCurrency(Number(qty).toFixed(0)),
        tot_value: formatCurrency(Number(value).toFixed(0)),
        list: list,
    }
    return result;
}

export const cpoKpbYear = async (data) => {
    if (!data || !data.cpoKpbnByMonth) {
        return [];
    }

    const response = data.cpoKpbnByMonth;
    const list = response.map(item => ({
        month: item.month,
        avg: item.avg,
        records: item.records
    }));

    return list;
};

export const minimumSellingPrice_DashboardController = async(data) => {
    const retail = []
    const bulky = []

    const response = data == null ? null : data.dataAvgPrice == null ? null : data.dataAvgPrice.stockTersedia == null ? null : data.dataAvgPrice.stockTersedia;

    if (response != null) {
        const items = response.items == null ? null : response.items;
        if (items != null) {

            // Bulky
            const load = items.filter(item => item.name.includes('bulk') || !item.name.includes('kemasan'))
            for (let i = 0; i < load.length; i++) {
                const name = await renameMapping(load[i].name)
                bulky.push({
                    name: name,
                    rp_kg : load[i].rpPerKg,
                })
            }

            // Retail
            const produk = items.filter(item => item.name.includes('kemasan') && !item.name.includes('kemasan58'))
            const kemasan = [
                {kategori : 'kemasanINL', nama: 'INL 250ml', value:0.25},
                {kategori : 'kemasanINL', nama: 'INL 450ml', value:0.45},
                {kategori : 'kemasanINL', nama: 'INL 900ml - PP', value:0.9},
                {kategori : 'kemasanINL', nama: 'INL 900ml - SP', value:0.9},
                {kategori : 'kemasanINL', nama: 'INL 1800ml', value:1.8},
                {kategori : '1 Ltr', nama: '1 Ltr', value:1},
                {kategori : '2 Ltr', nama: '2 Ltr', value:2},
            ]
            const nilai = 0.905
            const ppn = 1.11
            for (let i = 0; i < produk.length; i++) {
                const name = await renameMappingRetail(produk[i].name)
                if (produk[i].name.toLowerCase().includes('kemasaninl')) {
                    const filter = kemasan.filter(item => item.kategori.toLowerCase().includes('kemasaninl'))
                    for (let j = 0; j < filter.length; j++) {
                        const rp_kg = produk[i].rpPerKg * filter[j].value * nilai
                        let rp_box = 0;
                        if (filter[j].nama.includes('250')) {
                            rp_box = rp_kg * 48
                        } else if (filter[j].nama.includes('450')) {
                            rp_box = rp_kg * 24
                        } else if (filter[j].nama.includes('900')) {
                            rp_box = rp_kg * 12
                        } else {
                            rp_box = rp_kg * 6
                        }
                        const rp_ppn = rp_box * ppn
                        retail.push({
                            name: filter[j].nama,
                            rp_kg : rp_kg,
                            rp_box : rp_box,
                            rp_ppn : rp_ppn,
                        })
                    }
                } else {
                    const filter = kemasan.filter(item => !item.kategori.toLowerCase().includes('kemasaninl'))
                    for (let j = 0; j < filter.length; j++) {
                        const rp_kg = produk[i].rpPerKg * filter[j].value * nilai
                        let rp_box = 0;
                        if (filter[j].kategori.includes('1')) {
                            rp_box = rp_kg * 12
                        } else {
                            rp_box = rp_kg * 6
                        }
                        const rp_ppn = rp_box * ppn
                        retail.push({
                            name: `${name} ${filter[j].nama}`,
                            rp_kg : rp_kg,
                            rp_box : rp_box,
                            rp_ppn : rp_ppn,
                        })
                    }
                }
            }
        }
    }
    const result = {
        bulky: bulky,
        retail: retail,
    }
    return result;
}

const renameMapping = (name) => {
    if (name.startsWith('bulk')) {
        const newName = name.replace('bulk', 'RBD Olein IV-');
        const bracketedName = newName.replace(/RBD Olein IV-(\w+)/, 'RBD Olein IV-$1');
        return bracketedName;
    } else if (name.startsWith('rbdStearin')) {
        const newName = name.replace('rbdStearin', 'RBD Stearin');
        return newName;
    } else {
        return name.toUpperCase();
    }
};

const renameMappingRetail = (name) => {
    const newName = name.replace('kemasan', '');
    const bracketedName = newName.replace(/(\w+)/, '$1');
    return bracketedName;
};

