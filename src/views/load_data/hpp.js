import {formatCurrency} from '@/views/load_data/func_dummy.js'

export const loadFrakIv56 = async(refi) => {
    const data = {
        // qty
        rbdpo: formatCurrency(Number(refi.qty.qty_rbdpo).toFixed(0)),
        rbdo: formatCurrency(Number(refi.qty.qty_rbdo).toFixed(0)),
        rbds: formatCurrency(Number(refi.qty.qty_rbds).toFixed(0)),
        qty_1L: formatCurrency(Number(refi.qty.qty_carton_1L).toFixed(0)),
        qty_2L: formatCurrency(Number(refi.qty.qty_carton_2L).toFixed(0)),
        // rendement
        rend_rbdo: formatCurrency(Number(refi.rendement.rend_rbdo).toFixed(0)),
        rend_rbds:formatCurrency(Number(refi.rendement.rend_rbds).toFixed(0)),
        rend_1L: formatCurrency(Number(refi.rendement.rend_1L).toFixed(0)),
        rend_2L:formatCurrency(Number(refi.rendement.rend_2L).toFixed(0)),
        additional:formatCurrency(Number(refi.rendement.additional).toFixed(0)),
        // proportion
        prop1: formatCurrency(Number(refi.proportion.prop1).toFixed(2)),
        prop1L: formatCurrency(Number(refi.proportion.prop1L * 100).toFixed(0)),
        prop2L: formatCurrency(Number(refi.proportion.prop2L * 100).toFixed(0)),
    }
    return data;
}

export const loadFrakIv57 = async(refi) => {
    const data = {
        // qty
        rbdpo: formatCurrency(Number(refi.qty.qty_rbdpo).toFixed(0)),
        rbdo: formatCurrency(Number(refi.qty.qty_rbdo).toFixed(0)),
        rbds: formatCurrency(Number(refi.qty.qty_rbds).toFixed(0)),
        qty_250L: formatCurrency(Number(refi.qty.qty_carton_250ml).toFixed(0)),
        qty_450L: formatCurrency(Number(refi.qty.qty_carton_450ml).toFixed(0)),
        qty_900L: formatCurrency(Number(refi.qty.qty_carton_900ml).toFixed(0)),
        qty_1800L: formatCurrency(Number(refi.qty.qty_carton_1800ml).toFixed(0)),
        // rendement
        rend_rbdo: formatCurrency(Number(refi.rendement.rend_rbdo).toFixed(0)),
        rend_rbds:formatCurrency(Number(refi.rendement.rend_rbds).toFixed(0)),
        rend_250: formatCurrency(Number(refi.rendement.rend_250).toFixed(0)),
        rend_450: formatCurrency(Number(refi.rendement.rend_450).toFixed(0)),
        rend_900: formatCurrency(Number(refi.rendement.rend_900).toFixed(0)),
        rend_1800: formatCurrency(Number(refi.rendement.rend_1800).toFixed(0)),
        additional:formatCurrency(Number(refi.rendement.additional).toFixed(0)),
        // proportion
        prop1: formatCurrency(Number(refi.proportion.prop1).toFixed(2)),
        prop250: formatCurrency(Number(refi.proportion.prop250 * 100).toFixed(0)),
        prop450: formatCurrency(Number(refi.proportion.prop450 * 100).toFixed(0)),
        prop900: formatCurrency(Number(refi.proportion.prop900 * 100).toFixed(0)),
        prop1800: formatCurrency(Number(refi.proportion.prop1800 * 100).toFixed(0)),
    }
    return data;
}

export const loadFrakIv58 = async(refi) => {
    const data = {
        // qty
        rbdpo: formatCurrency(Number(refi.qty.qty_rbdpo).toFixed(0)),
        rbdo: formatCurrency(Number(refi.qty.qty_rbdo).toFixed(0)),
        rbds: formatCurrency(Number(refi.qty.qty_rbds).toFixed(0)),
        // rendement
        rend_rbdo: formatCurrency(Number(refi.rendement.rend_rbdo).toFixed(0)),
        rend_rbds:formatCurrency(Number(refi.rendement.rend_rbds).toFixed(0)),
    }
    return data;
}

export const loadFrakIv60 = async(refi) => {
    const data = {
        // qty
        rbdpo: formatCurrency(Number(refi.qty.qty_rbdpo).toFixed(0)),
        rbdo: formatCurrency(Number(refi.qty.qty_rbdo).toFixed(0)),
        rbds: formatCurrency(Number(refi.qty.qty_rbds).toFixed(0)),
        qty_carton_salvaco_1L: formatCurrency(Number(refi.qty.qty_carton_salvaco_1L).toFixed(0)),
        qty_carton_salvaco_2L: formatCurrency(Number(refi.qty.qty_carton_salvaco_2L).toFixed(0)),
        qty_carton_nusakita_1L: formatCurrency(Number(refi.qty.qty_carton_nusakita_1L).toFixed(0)),
        qty_carton_nusakita_2L: formatCurrency(Number(refi.qty.qty_carton_nusakita_2L).toFixed(0)),
        // rendement
        rend_rbdo: formatCurrency(Number(refi.rendement.rend_rbdo).toFixed(0)),
        rend_rbds:formatCurrency(Number(refi.rendement.rend_rbds).toFixed(0)),
        rend_salvaco_1L: formatCurrency(Number(refi.rendement.rend_salvaco_1L).toFixed(0)),
        rend_salvaco_2L: formatCurrency(Number(refi.rendement.rend_salvaco_2L).toFixed(0)),
        rend_nusakita_1L: formatCurrency(Number(refi.rendement.rend_nusakita_1L).toFixed(0)),
        rend_nusakita_2L: formatCurrency(Number(refi.rendement.rend_nusakita_2L).toFixed(0)),
        additional:formatCurrency(Number(refi.rendement.additional).toFixed(0)),
        // proportion
        prop1: formatCurrency(Number(refi.proportion.prop1).toFixed(2)),
        propS1L: formatCurrency(Number(refi.proportion.propS1L * 100).toFixed(0)),
        propS2L: formatCurrency(Number(refi.proportion.propS2L * 100).toFixed(0)),
        propN1L: formatCurrency(Number(refi.proportion.propN1L * 100).toFixed(0)),
        propN2L: formatCurrency(Number(refi.proportion.propN2L * 100).toFixed(0)),
    }
    return data;
}

export const loadRefinery = async(refi) => {
    const data = {
        // Produk
        cpo: Number(refi.produk.qty_cpo_olah),
        rbdpo: Number(refi.produk.qty_rbdpo),
        pfad: Number(refi.produk.qty_pfad),
        rend_rbdpo: Number(refi.produk.rend_rbdpo),
        rend_pfad:Number(refi.produk.rend_pfad),
        // Direct
        bahan_baku_value: refi.direct.bahan_baku.value,
        bahan_baku_rp_kg: refi.direct.bahan_baku.rp_kg,
        bahan_bakar_value: refi.direct.bahan_bakar.value,
        bahan_bakar_rp_kg: refi.direct.bahan_bakar.rp_kg,
        be_value: refi.direct.be.value,
        be_rp_kg: refi.direct.be.rp_kg,
        pa_value: refi.direct.pa.value,
        pa_rp_kg: refi.direct.pa.rp_kg,
        analisa_lab_value: refi.direct.analisa_lab.value,
        analisa_lab_rp_kg: refi.direct.analisa_lab.rp_kg,
        listrik_value: refi.direct.listrik.value,
        listrik_rp_kg: refi.direct.listrik.rp_kg,
        air_value: refi.direct.air.value,
        air_rp_kg: refi.direct.air.rp_kg,
        // In-Direct
        gaji_pimpinan_value: refi.in_direct.gaji_pimpinan.value,
        gaji_pimpinan_rp_kg: refi.in_direct.gaji_pimpinan.rp_kg,
        gaji_pelaksana_value: refi.in_direct.gaji_pelaksana.value,
        gaji_pelaksana_rp_kg: refi.in_direct.gaji_pelaksana.rp_kg,
        asuransi_value: refi.in_direct.asuransi.value,
        asuransi_rp_kg: refi.in_direct.asuransi.rp_kg,
        limbah_value: refi.in_direct.limbah.value,
        limbah_rp_kg: refi.in_direct.limbah.rp_kg,
        bengkel_value: refi.in_direct.bengkel.value,
        bengkel_rp_kg: refi.in_direct.bengkel.rp_kg,
        depresiasi_value: refi.in_direct.depresiasi.value,
        depresiasi_rp_kg: refi.in_direct.depresiasi.rp_kg,
        total_cont_refinery_value: refi.total_cont_refinery.value,
        total_cont_refinery_rp_kg: refi.total_cont_refinery.rp_kg,
        alloc_cost_rbdpo: refi.alloc_cost.prop_rbdpo,
        alloc_cost_pfad: refi.alloc_cost.prop_pfad,
    }
    return data;
}