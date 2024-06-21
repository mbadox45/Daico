import { loadDataProd } from '@/views/finance/accounting/target/components/list/data/data_cost_prod.js';
import { loadSetting, totalDifference, loadGL } from '@/views/load_data/general_leager.js'
import { dataAllocation } from '@/views/load_data/produksi/allocation_cost.js'
import { loadDataRefinery } from '@/views/load_data/produksi/costing_hpp/refinery.js'
import { loadFrakIv56 } from '@/views/load_data/produksi/costing_hpp/frak_iv56.js'
import { loadFrakIv57 } from '@/views/load_data/produksi/costing_hpp/frak_iv57.js'
import { loadFrakIv58 } from '@/views/load_data/produksi/costing_hpp/frak_iv58.js'
import { loadFrakIv60 } from '@/views/load_data/produksi/costing_hpp/frak_iv60.js'
import { loadControl } from '@/views/load_data/produksi/costing_hpp/control.js'
import { AllComponentGL } from '@/views/load_data/produksi/costing_hpp/all_point.js'

export const totalByUraian = (data,uraian) => {
    let total = 0;
    for (let i = 0; i < data.length; i++) {
        if (data[i].id_uraian == uraian) {
            total += Number(data[i].value);
        } else {
            continue;
        }
    }
    return total;
}

export const loadDataCostHpp = async(tgl) => {
    const response = await loadDataProd(tgl);
    // const data = await loadGL(tgl);
    const data = await AllComponentGL(tgl);
    // console.log(gl)
    // const data = null
    // REFINERY
    const refinery = await loadDataRefinery(response, data);
    const frak_iv_56 = await loadFrakIv56(response, data);
    const frak_iv_57 = await loadFrakIv57(response, data);
    const frak_iv_58 = await loadFrakIv58(response, data);
    const frak_iv_60 = await loadFrakIv60(response, data);
    const control = await loadControl(response, data);
    const allocation_cost = await dataAllocation(response)
    return [ allocation_cost, refinery, frak_iv_56, frak_iv_57, frak_iv_58, frak_iv_60, control]
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