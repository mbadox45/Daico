import InitialSupply from '@/api/avg_price/InitialSupply.js';

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

export const forViewAvgPrice = async(tgl) => {
    const response = await loadAvgPriceByDate(tgl)
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
            data: data
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
