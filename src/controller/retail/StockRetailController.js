import stockRetail from '@/api/accounting/stockRetail.js';
import { formatCurrency, productableType } from "@/controller/dummy/func_dummy.js";

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

export const loadTable_StockRetailController = async() => {
    const response = await loadLatest_StockRetailController()
    const location = response == null ? null : response.location == null || response.location.length < 1 ? null : response.location
    const totalStock = response == null ? null : response.totalStock == null || response.totalStock.length < 1 ? null : response.totalStock
    const list = []
    const list_stock = []

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

    if (location != null) {
        for (let i = 0; i < location.length; i++) {
            let total_mt = 0, total_pallet = 0;
            const items = location[i].items;
            const list_item = []
            for (let j = 0; j < items.length; j++) {
                const seleksi = items[j].extended_productable.nama.includes('900') ? 10.8 : 
                                items[j].extended_productable.nama.includes('1800') ? 10.8 : 
                                items[j].extended_productable.nama.includes('450') ? 10.8 : 12

                const mt = Number(items[j].ctn) == null || Number(items[j].ctn) == 0 ? 0 : Number(items[j].ctn) * seleksi * (0.905/1000)
                total_mt += mt
                const pallet = Number(items[j].ctn) == null || Number(items[j].ctn) == 0 ? 0 : Number(items[j].ctn) / 55
                total_pallet += pallet
                list_item.push({
                    location_id: items[j].location.id,
                    location_name: items[j].location.name,
                    ctn: items[j].ctn,
                    mt: mt,
                    pallet: pallet,
                    produk: `${items[j].extended_productable.product.nama} ${items[j].extended_productable.product.productable.name} ${items[j].extended_productable.nama}`
                })
            }
            list.push({
                lokasi: location[i].name,
                tot_ctn : location[i].totalCtn,
                tot_mt : total_mt,
                tot_pallet : total_pallet,
                items: list_item
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