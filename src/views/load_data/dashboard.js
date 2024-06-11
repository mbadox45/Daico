import RateOdoo from '@/api/odoo_api/currency/RateOdoo.js';
import {loadMainTarget} from '@/views/load_data/target.js';
import {loadMarketValue} from '@/views/load_data/market_routers.js';

export const loadJisdor = async(tgl) => {
    try {
        const respose = await RateOdoo.postRate({tanggal: tgl, mata_uang:'USD'});
        const load = respose.data;
        const data = load.data
        return data;
    } catch (error) {
        return null;
    }
}

export const loadForChartTarget = async(tgl) => {
    const load = await loadMainTarget(tgl)
    const qty = load.qty_penjualan;
    let total_bulk_real = 0, total_bulk_rkap = 0, total_retail_real = 0, total_retail_rkap = 0;
    if (qty != null) {
        for (let i = 0; i < qty.length; i++) {
            if (qty[i].type == 'bulk') {
                total_bulk_real += qty[i].real
                total_bulk_rkap += qty[i].rkap
            } else if (qty[i].type == 'retail') {
                total_retail_real += qty[i].real
                total_retail_rkap += qty[i].rkap
            } else {
                continue;
            }
        }
    }
    const data_sales = [
        {real: total_bulk_real, rkap: total_bulk_rkap, jenis:'Bulk', name_real:'Real', name_rkap:'RKAP PMG-1'},
        {real: total_retail_real, rkap: total_retail_rkap, jenis:"Retail", name_real:'Real', name_rkap:'RKAP PMG-1'},
        {real: load.dmo.real, rkap: load.dmo.rkap, jenis:"DMO", name_real:'Real', name_rkap:'RKAP PMG-1'},
    ]
    const data_produksi = [
        {real: load.cpo_olah_vs_rkap[0].real, rkap: load.cpo_olah_vs_rkap[0].rkap, jenis:"Real vs RKAP", name_real:'Real', name_rkap:'RKAP PMG-1'},
        {real: load.cpo_olah_vs_utility[0].real, rkap: load.cpo_olah_vs_utility[0].rkap, jenis:"Real vs Utility", name_real:'Real', name_rkap:'RKAP Utility'},
    ]

    return {
        sales:data_sales,
        produksi:data_produksi,
    }
}

export const loadUpdateOutstandingCPO = async(tgl) => {
    const data = await loadMarketValue(tgl);
    const load = data.find(item => item.tanggal == tgl)
    let rbdpo_levy = 0
    let rbdpo_routers = 0
    let pfad_levy = 0
    let pfad_routers = 0
    let rbdo_levy = 0
    let rbdo_routers = 0
    let rbds_levy = 0
    let rbds_routers = 0
    if (load != null) {
        rbdpo_levy = load.rbdpo.levy.nilai == null ? 0 : Number(load.rbdpo.levy.nilai)
        rbdpo_routers = load.rbdpo.routers.nilai == null ? 0 : Number(load.rbdpo.routers.nilai)
        pfad_levy = load.pfad.levy.nilai == null ? 0 : Number(load.pfad.levy.nilai)
        pfad_routers = load.pfad.routers.nilai == null ? 0 : Number(load.pfad.routers.nilai)
        rbdo_levy = load.rbdo.levy.nilai == null ? 0 : Number(load.rbdo.levy.nilai)
        rbdo_routers = load.rbdo.routers.nilai == null ? 0 : Number(load.rbdo.routers.nilai)
        rbds_levy = load.rbds.levy.nilai == null ? 0 : Number(load.rbds.levy.nilai)
        rbds_routers = load.rbds.routers.nilai == null ? 0 : Number(load.rbds.routers.nilai)
    }
    const result = [
        {name: 'RBDPO', levy: rbdpo_levy, routers: rbdpo_routers, excid: rbdpo_routers - rbdpo_levy},
        {name: 'PFAD', levy: pfad_levy, routers: pfad_routers, excid: pfad_routers - pfad_levy},
        {name: 'RBD Olein', levy: rbdo_levy, routers: rbdo_routers, excid: rbdo_routers - rbdo_levy},
        {name: 'RBD Stearin', levy: rbds_levy, routers: rbds_routers, excid: rbds_routers - rbds_levy},
    ]
    return result;
}