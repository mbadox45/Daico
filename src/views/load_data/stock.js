import {loadTank, loadProduct, loadLocation} from '@/views/load_data/master_config.js'
import {list_type} from '@/api/DummyData.js'
import stockRetail from '@/api/accounting/stockRetail.js';
import stockBulky from '@/api/accounting/stockBulky.js';

const formulaMt = [
    {sub: '1L', formula: (12 * 1) * 0.905 / 1000},
    {sub: '2L', formula: (6 * 2) * 0.905 / 1000},
    {sub: '250 ML', formula: (48 * 0.25) * 0.905 / 1000},
    {sub: '450 ML', formula: (24 * 0.45) * 0.905 / 1000},
    {sub: '900 ML', formula: (12 * 0.9) * 0.905 / 1000},
    {sub: '1800 ML', formula: (6 * 1.8) * 0.905 / 1000},
]

const productBulky = [
    {productable_id: 9, productable_type: 'bulk', name:'CPO', category_id: 9},
    {productable_id: 2, productable_type: 'bulk', name:'PFAD', category_id: 2},
    {productable_id: 10, productable_type: 'bulk', name:'RBDPS', category_id: 10},
    {productable_id: 3, productable_type: 'bulk', name:'RBDPO', category_id: 3},
    {productable_id: 3, productable_type: 'bulk', name:'RBDPO', category_id: 4},
]

export const dataRetail = async() => {
    try {
        const response = await stockRetail.getLatest()
        const load = response.data;
        const data = load.data;
        return data;
    } catch (error) {
        return null;
    }
}

export const dataBulky = async() => {
    try {
        const response = await stockBulky.getLatest()
        const load = response.data;
        const data = load.data;
        return data;
    } catch (error) {
        return null;
    }
}

export const loadDataBulky = async () => {
    const tank = await loadTank();
    const bulky = await dataBulky()
    const data = []
    const type = list_type
    if (bulky != null) {
        for (let i = 0; i < bulky.length; i++) {
            const filter_tank = tank.find(item => item.id == bulky[i].tank_id)
            const filter_type = type.find(item => item.id == bulky[i].productable_type)
            data.push({
                id: bulky[i].id,
                tank_id: bulky[i].tank_id,
                name: filter_tank.name,
                location: filter_tank.location.name,
                location_id: filter_tank.location_id,
                product: bulky[i].extended_productable.name,
                productable_type : filter_type.name,
                productable_id: bulky[i].extended_productable.id,
                stok_mt: Number(bulky[i].stok_mt),
                stok_exc_btm_mt: Number(bulky[i].stok_exc_btm_mt),
                umur: Number(bulky[i].umur),
                space: Number(bulky[i].space),
                tanggal: (bulky[i].tanggal),
                remarks: bulky[i].remarks,
                capacity: filter_tank.capacity,
            })
        }
        // console.log(bulky)
    }
    // for (let i = 0; i < tank.length; i++) {
    //     data.push({
    //         location: tank[i].location.name,
    //         location_id: tank[i].location_id,
    //         capacity: tank[i].capacity,
    //         name: tank[i].name,
    //         tank_id: tank[i].tank_id,
    //         stok_mt: null,
    //         stok_exc_btm_mt: null,
    //         umur: null, 
    //         remarks: null,
    //     })
    // }
    return data;
}

const loadStock = async() => {
    const produk = await loadProduct()
    const lokasi = await loadLocation()
}

export const loadRetail = async() => {
    const produk = await loadProduct()
    const lokasi = await loadLocation()
    const retail = produk.filter(item => item.productable_type == "App\\Models\\MasterRetail");
    const site = lokasi.filter(item => item.id >= 4)
    const stock = await dataRetail()
    stock.sort((a, b) => b.id - a.id)
    const items = []
    for (let i = 0; i < retail.length; i++) {
        const sub = retail[i].sub_product
        for (let j = 0; j < sub.length; j++) {
            const formula = formulaMt.find(item => item.sub == sub[j].nama)
            items.push({
                id: null, 
                produk: `${retail[i].nama} ${retail[i].productable.name} ${sub[j].nama}`,
                productable_id: sub[j].id,
                productable_type: retail[i].productable_type,
                tanggal: null,
                sub_product: sub[j].nama,
                product_type: 'subproduct',
                location_id: null,
                ctn: null,
                mt: formula.formula || null,
                formula: formula.formula || null,
                pallet: null,
            })
        }
    }
    const data = []
    for (let i = 0; i < site.length; i++) {
        const item = []
        for (let j = 0; j < items.length; j++) {
            // console.log(site[i].id, items[j].productable_id)
            const data_stock = stock.find(item => item.location_id == site[i].id && item.productable_id == items[j].productable_id)
            const ctn = data_stock == null ? 0 : data_stock.ctn
            const mt = ctn * items[j].formula
            item.push({
                id: data_stock == null ? null : data_stock.id, 
                produk: `${items[j].produk}`,
                productable_id: items[j].productable_id,
                productable_type: items[j].productable_type,
                tanggal: data_stock == null ? null : data_stock.tanggal,
                sub_product: items[j].sub_product,
                product_type: items[j].product_type,
                location_id: site[i].id,
                ctn: ctn,
                mt: ctn == 0 ? null : mt,
                pallet: ctn == 0 ? null : ctn/mt,
            })
        }
        data.push({
            location_id: site[i].id,
            lokasi: site[i].name,
            items: item
        })
    }

    return data;
}

export const addStockRetail = async(data) => {
    try {
        const response = await stockRetail.addPost(data);
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

export const updateStockRetail = async(id, data) => {
    try {
        const response = await stockRetail.updatePost(id, data);
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

export const addStockBulky = async(data) => {
    try {
        const response = await stockBulky.addPost(data);
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

export const updateStockBulky = async(id, data) => {
    try {
        const response = await stockBulky.updatePost(id, data);
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