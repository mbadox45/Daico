import InitialSupply from '@/api/avg_price/InitialSupply.js';
import { loadDataProd } from '@/views/finance/accounting/target/components/list/data/data_cost_prod.js';
import { totalByUraian } from '@/views/load_data/produksi/costing_hpp.js'

export const loadAvgPriceByDate = async(tgl) => {
    try {
        const response = await InitialSupply.getByDate({tanggal:tgl});
        const load = response.data;
        const data = load.data;
        return data
    } catch (error) {
        return null;
    }
}

const QtyBebanProduksi = async(data_produksi) => {
    const refinery = data_produksi.find(item => item.name == 'Refinery');
    const packing_minyakita = data_produksi.find(item => item.name == 'Packaging (Minyakita)');
    const packing_inl = data_produksi.find(item => item.name == 'Packaging (INL)');
    const packing_nusakita = data_produksi.find(item => item.name == 'Packaging (Nusakita)');
    const packing_salvaco = data_produksi.find(item => item.name == 'Packaging (Salvaco)');
    const frak_iv56 = data_produksi.find(item => item.name == 'Fraksinasi (IV-56)');
    const frak_iv57 = data_produksi.find(item => item.name == 'Fraksinasi (IV-57)');
    const frak_iv58 = data_produksi.find(item => item.name == 'Fraksinasi (IV-58)');
    const frak_iv60 = data_produksi.find(item => item.name == 'Fraksinasi (IV-60)');
    let qty_tot = 0, qty_rbdpo = 0, qty_pfad = 0, qty_bulk_iv56 = 0, qty_kem_iv56 = 0, qty_bulk_iv57 = 0, qty_kem_iv57 = 0, qty_bulk_iv58 = 0, qty_kem_iv58 = 0, qty_bulk_iv60 = 0, qty_kem_iv60 = 0, qty_kem2_iv60 = 0 , qty_rbds = 0
    if (data_produksi != null) {
        const item_ref = refinery.items
        const item_pack_minyakita = packing_minyakita.items
        const item_pack_inl = packing_inl.items
        const item_pack_salvaco = packing_salvaco.items
        const item_pack_nusakita = packing_nusakita.items
        const item_frak_iv56 = frak_iv56.items
        const item_frak_iv57 = frak_iv57.items
        const item_frak_iv58 = frak_iv58.items
        const item_frak_iv60 = frak_iv60.items
        // QTY
        qty_rbdpo = Number(totalByUraian(item_ref,2));
        qty_pfad = Number(totalByUraian(item_ref,3));
        qty_kem_iv56 = Number(totalByUraian(item_pack_minyakita,42));
        qty_bulk_iv56 = Number(totalByUraian(item_frak_iv56,6)) - Number(qty_kem_iv56);
        qty_kem_iv57 = totalByUraian(item_pack_inl,35);
        qty_bulk_iv57 = Number(totalByUraian(item_frak_iv57,14)) - Number(qty_kem_iv57);
        qty_kem_iv58 = 0;
        qty_bulk_iv58 = Number(totalByUraian(item_frak_iv58,10)) - Number(qty_kem_iv58);
        qty_kem_iv60 = totalByUraian(item_pack_salvaco,26);
        qty_kem2_iv60 = totalByUraian(item_pack_nusakita,30);
        qty_bulk_iv60 = Number(totalByUraian(item_frak_iv60,18)) - Number(qty_kem_iv60) + Number(qty_kem2_iv60);
        qty_tot = qty_rbdpo + qty_pfad + qty_kem_iv56 + qty_bulk_iv56 + qty_kem_iv57 + qty_bulk_iv57 + qty_kem_iv58 + qty_bulk_iv58 + qty_kem_iv60 + qty_kem2_iv60 + qty_bulk_iv60;
    }

    return {
        total:{
            qty: qty_tot,

        },
        items:[
            {category_id: 0, id: 0, category: 'RBDPO', product:'RBDPO', qty:qty_rbdpo, harga:0, jumlah:0},
            {category_id: 1, id: 0, category: 'PFAD', product:'PFAD', qty:qty_pfad, harga:0, jumlah:0},
            {category_id: 3, id: 0, category: 'RBD Olein IV 56', product:'Bulk', qty:qty_bulk_iv56, harga:0, jumlah:0},
            {category_id: 3, id: 1, category: 'RBD Olein IV 56', product:'Kemasan (Minyakita)', qty:qty_kem_iv56, harga:0, jumlah:0},
            {category_id: 4, id: 0, category: 'RBD Olein IV 57', product:'Bulk', qty:qty_bulk_iv57, harga:0, jumlah:0},
            {category_id: 4, id: 1, category: 'RBD Olein IV 57', product:'Kemasan (INL)', qty:qty_kem_iv57, harga:0, jumlah:0},
            {category_id: 5, id: 0, category: 'RBD Olein IV 58', product:'Bulk', qty:qty_bulk_iv58, harga:0, jumlah:0},
            {category_id: 5, id: 1, category: 'RBD Olein IV 58', product:'Kemasan', qty:qty_kem_iv58, harga:0, jumlah:0},
            {category_id: 6, id: 0, category: 'RBD Olein IV 60', product:'Bulk', qty:qty_bulk_iv60, harga:0, jumlah:0},
            {category_id: 6, id: 1, category: 'RBD Olein IV 60', product:'Kemasan (Salvaco)', qty:qty_kem_iv60, harga:0, jumlah:0},
            {category_id: 6, id: 2, category: 'RBD Olein IV 60', product:'Kemasan (Nusakita)', qty:qty_kem2_iv60, harga:0, jumlah:0},
            {category_id: 7, id: 0, category: 'RBD Stearin', product:'RBD Stearin', qty:qty_rbds, harga:0, jumlah:0},
        ]
    }
}

export const forViewAvgPrice = async(tgl) => {
    const response = await loadAvgPriceByDate(tgl)
    const response_prod = await loadDataProd(tgl);
    const stok_1 = await QtyBebanProduksi(response_prod)
    const list = [
        {category_id: 0, id: 0, category: 'RBDPO', product:'RBDPO', qty:0, harga:0, jumlah:0},
        {category_id: 1, id: 0, category: 'PFAD', product:'PFAD', qty:0, harga:0, jumlah:0},
        {category_id: 3, id: 0, category: 'RBD Olein IV 56', product:'Bulk', qty:0, harga:0, jumlah:0},
        {category_id: 3, id: 1, category: 'RBD Olein IV 56', product:'Kemasan (Minyakita)', qty:0, harga:0, jumlah:0},
        {category_id: 4, id: 0, category: 'RBD Olein IV 57', product:'Bulk', qty:0, harga:0, jumlah:0},
        {category_id: 4, id: 1, category: 'RBD Olein IV 57', product:'Kemasan (INL)', qty:0, harga:0, jumlah:0},
        {category_id: 5, id: 0, category: 'RBD Olein IV 58', product:'Bulk', qty:0, harga:0, jumlah:0},
        {category_id: 5, id: 1, category: 'RBD Olein IV 58', product:'Kemasan', qty:0, harga:0, jumlah:0},
        {category_id: 6, id: 0, category: 'RBD Olein IV 60', product:'Bulk', qty:0, harga:0, jumlah:0},
        {category_id: 6, id: 1, category: 'RBD Olein IV 60', product:'Kemasan (Salvaco)', qty:0, harga:0, jumlah:0},
        {category_id: 6, id: 2, category: 'RBD Olein IV 60', product:'Kemasan (Nusakita)', qty:0, harga:0, jumlah:0},
        {category_id: 7, id: 0, category: 'RBD Stearin', product:'RBD Stearin', qty:0, harga:0, jumlah:0},
    ]
    if (response != null) {
        const data = []
        let total_qty = 0, total_harga = 0;
        for (let i = 0; i < response.length; i++) {
            const product = response[i].productable_type == 'App\\Models\\MasterSubProduct' ? response[i].extended_productable.nama : response[i].extended_productable.name
            const type = response[i].productable_type == 'App\\Models\\MasterSubProduct' ? 'subproduct' : response[i].productable_type == 'App\\Models\\MasterBulky' ? 'bulk' : 'product';
            const category = response[i].productable_type == 'App\\Models\\MasterSubProduct' ? `${response[i].extended_productable.product.productable.name} ${response[i].extended_productable.product.nama}` : response[i].extended_productable.name
            const category_id = list.find(item => item.category == category)
            data.push({
                category_id: category_id.category_id, 
                id: response[i].id, 
                category: category, 
                product: product,
                tanggal: response[i].tanggal,
                productable_id: response[i].productable_id,
                productable_type: type,
                qty: Number(response[i].qty), 
                harga: Number(response[i].harga), 
                jumlah: Number(response[i].qty) * Number(response[i].harga),
            })
            total_qty += Number(response[i].qty);
            total_harga += (Number(response[i].qty) * Number(response[i].harga));
        }
        return {
            total_qty: total_qty,
            total_harga: total_harga,
            data: data,
            stok_1: stok_1
        };
    } else {
        return {
            total_qty: 0,
            total_harga: 0,
            data: list
        };
    }
}

export const addAvgPrice = async(data) => {
    try {
        const response = await InitialSupply.addPost(data);
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

export const updateAvgPrice = async(id,data) => {
    try {
        const response = await InitialSupply.updatePost(id,data);
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
