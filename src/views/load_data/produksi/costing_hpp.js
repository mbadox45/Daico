import { loadDataProd } from '@/views/finance/accounting/target/components/list/data/data_cost_prod.js';
import { loadSetting, totalDifference, loadGL } from '@/views/load_data/general_leager.js'
import { dataAllocation } from '@/views/load_data/produksi/allocation_cost.js'

const totalByUraian = (data,uraian) => {
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
    const data = await loadGL(tgl);
    // REFINERY
    const refinery = await loadDataRefinery(response, data);
    const frak_iv_56 = await loadFrakIv56(response, data);
    const frak_iv_57 = await loadFrakIv57(response, data);
    const frak_iv_58 = await loadFrakIv58(response, data);
    const frak_iv_60 = await loadFrakIv60(response, data);
    const allocation_cost = await dataAllocation(response)
    return [ allocation_cost, refinery, frak_iv_56, frak_iv_57, frak_iv_58, frak_iv_60 ]
}

const loadFrakIv56 = async(data_produksi, data_gl) => {
    let rbdpo = 0, rbdo_iv56 = 0, rbds = 0, additional = 0, jum_qty_carton = 0 ;
    let qty_carton_1L = 0, qty_carton_2L = 0;
    let prop1 = 10.86, prop1L = 100/100, prop2L = 0/100;
    if (data_produksi != null) {
        const frak_iv_56 = data_produksi.find(item => item.name == 'Fraksinasi (IV-56)');
        const frak_item = frak_iv_56.items;
        rbdpo = totalByUraian(frak_item,5);
        rbdo_iv56 = totalByUraian(frak_item,6);
        rbds = totalByUraian(frak_item,7);
        const jum_carton_1L = totalByUraian(frak_item,43); 
        const jum_carton_2L = totalByUraian(frak_item,44);
        const jumlah_finished_product = (jum_carton_1L + jum_carton_2L)*prop1
        additional = totalByUraian(frak_item,42) - jumlah_finished_product;
        qty_carton_1L = (jum_carton_1L * prop1) + (additional * prop1L)
        qty_carton_2L = (jum_carton_2L * prop1) + (additional * prop2L)
        jum_qty_carton = qty_carton_1L + qty_carton_2L;
    }

    return {
        name: 'Fraksinasi (IV-56)',
        qty: { qty_rbdpo: rbdpo, qty_rbdo: rbdo_iv56, qty_rbds: rbds, qty_carton_1L: qty_carton_1L, qty_carton_2L: qty_carton_2L },
        proportion: {prop1: prop1, prop1L: prop1L, prop2L: prop2L},
        rendement: {additional: additional, rend_rbdo: (rbdo_iv56/rbdpo)*100, rend_rbds: (rbds/rbdpo)*100, rend_1L:jum_qty_carton == 0 ? 0 : (qty_carton_1L/jum_qty_carton)*100, rend_2L: jum_qty_carton == 0 ? 0 : (qty_carton_2L/jum_qty_carton)*100},
    }
}

const loadFrakIv57 = async(data_produksi, data_gl) => {
    let rbdpo = 0, rbdo_iv57 = 0, rbds = 0, additional = 0, jum_qty_carton = 0 ;
    let qty_carton_250ml = 0, qty_carton_450ml = 0, qty_carton_900ml = 0, qty_carton_1800ml = 0; 
    let prop1 = 0.905*0.9*12, prop250 = 0.551627716886285/100, prop450 = 2.0388287636945/100, prop900 = 80.986204994845/100, prop1800 = 16.4233385245742/100;
    if (data_produksi != null) {
        const frak_iv_57 = data_produksi.find(item => item.name == 'Fraksinasi (IV-57)');
        const frak_item = frak_iv_57.items;
        rbdpo = totalByUraian(frak_item,13);
        rbdo_iv57 = totalByUraian(frak_item,14);
        rbds = totalByUraian(frak_item,15);
        const jum_carton_250ml = totalByUraian(frak_item,36); 
        const jum_carton_450ml = totalByUraian(frak_item,37)
        const jum_carton_900ml = totalByUraian(frak_item,38)
        const jum_carton_1800ml = totalByUraian(frak_item,39)
        const jumlah_finished_product = (jum_carton_250ml + jum_carton_450ml + jum_carton_900ml + jum_carton_1800ml)*prop1
        additional = totalByUraian(frak_item,35) - jumlah_finished_product;
        qty_carton_250ml = (jum_carton_250ml * prop1) + (additional * prop250)
        qty_carton_450ml = (jum_carton_450ml * prop1) + (additional * prop450)
        qty_carton_900ml = (jum_carton_900ml * prop1) + (additional * prop900)
        qty_carton_1800ml = (jum_carton_1800ml * prop1) + (additional * prop1800)
        jum_qty_carton = qty_carton_250ml + qty_carton_450ml + qty_carton_900ml + qty_carton_1800ml;
    }

    return {
        name: 'Fraksinasi (IV-57)',
        qty: { qty_rbdpo: rbdpo, qty_rbdo: rbdo_iv57, qty_rbds: rbds, qty_carton_250ml: qty_carton_250ml, qty_carton_450ml: qty_carton_450ml, qty_carton_900ml: qty_carton_900ml, qty_carton_1800ml: qty_carton_1800ml },
        proportion: {prop1: prop1, prop250: prop250, prop450: prop450, prop900: prop900, prop1800: prop1800},
        rendement: {additional: additional, rend_rbdo: (rbdo_iv57/rbdpo)*100, rend_rbds: (rbds/rbdpo)*100, rend_250:jum_qty_carton == 0 ? 0 : (qty_carton_250ml/jum_qty_carton)*100, rend_450: jum_qty_carton == 0 ? 0 : (qty_carton_450ml/jum_qty_carton)*100, rend_900: jum_qty_carton == 0 ? 0 : (qty_carton_900ml/jum_qty_carton)*100, rend_1800: jum_qty_carton == 0 ? 0 : (qty_carton_1800ml/jum_qty_carton)*100 },
    }
}

const loadFrakIv58 = async(data_produksi, data_gl) => {
    let rbdpo = 0, rbdo_iv58 = 0, rbds = 0;
    if (data_produksi != null) {
        const frak_iv_58 = data_produksi.find(item => item.name == 'Fraksinasi (IV-58)');
        const frak_item = frak_iv_58.items;
        rbdpo = totalByUraian(frak_item,9);
        rbdo_iv58 = totalByUraian(frak_item,10);
        rbds = totalByUraian(frak_item,11);
    }

    return {
        name: 'Fraksinasi (IV-58)',
        qty: { qty_rbdpo: rbdpo, qty_rbdo: rbdo_iv58, qty_rbds: rbds,},
        // proportion: {prop1: prop1, prop1L: prop1L, prop2L: prop2L},
        rendement: {rend_rbdo: (rbdo_iv58/rbdpo)*100, rend_rbds: (rbds/rbdpo)*100},
    }
}

const loadFrakIv60 = async(data_produksi, data_gl) => {
    let rbdpo = 0, rbdo_iv60 = 0, rbds = 0, additional = 0, jum_qty_carton_salvaco = 0, jum_qty_carton_nusakita = 0 ;
    let qty_carton_salvaco_1L = 0, qty_carton_salvaco_2L = 0, qty_carton_nusakita_1L = 0, qty_carton_nusakita_2L = 0;
    let prop1 = 10.86, propS1L = 57.4581754439343/100, propS2L = 42.5418245560657/100, propN1L = 0/100, propN2L = 100/100;
    if (data_produksi != null) {
        const frak_iv_60 = data_produksi.find(item => item.name == 'Fraksinasi (IV-60)');
        const frak_item = frak_iv_60.items;
        rbdpo = totalByUraian(frak_item,17);
        rbdo_iv60 = totalByUraian(frak_item,18);
        rbds = totalByUraian(frak_item,19);
        const jum_carton_salvaco_1L = totalByUraian(frak_item,26); 
        const jum_carton_salvaco_2L = totalByUraian(frak_item,27);
        const jum_carton_nusakita_1L = totalByUraian(frak_item,31); 
        const jum_carton_nusakita_2L = totalByUraian(frak_item,32);
        const jumlah_finished_product = (jum_carton_salvaco_1L + jum_carton_salvaco_2L + jum_carton_nusakita_1L + jum_carton_nusakita_2L)*prop1
        additional = totalByUraian(frak_item,30) - jumlah_finished_product;
        qty_carton_salvaco_1L = (jum_carton_salvaco_1L * prop1) + (additional * propS1L)
        qty_carton_salvaco_2L = (jum_carton_salvaco_2L * prop1) + (additional * propS2L)
        qty_carton_nusakita_1L = (jum_carton_nusakita_1L * prop1) + (additional * propN1L)
        qty_carton_nusakita_2L = (jum_carton_nusakita_2L * prop1) + (additional * propN2L)
        jum_qty_carton_salvaco = qty_carton_salvaco_1L + qty_carton_salvaco_2L;
        jum_qty_carton_nusakita = qty_carton_nusakita_1L + qty_carton_nusakita_2L;
    }

    return {
        name: 'Fraksinasi (IV-60)',
        qty: { qty_rbdpo: rbdpo, qty_rbdo: rbdo_iv60, qty_rbds: rbds, qty_carton_salvaco_1L: qty_carton_salvaco_1L, qty_carton_salvaco_2L: qty_carton_salvaco_2L, qty_carton_nusakita_1L: qty_carton_nusakita_1L, qty_carton_nusakita_2L: qty_carton_nusakita_2L },
        proportion: {prop1: prop1, propS1L: propS1L, propS2L: propS2L, propN1L: propN1L, propN2L: propN2L},
        rendement: {additional: additional, rend_rbdo: (rbdo_iv60/rbdpo)*100, rend_rbds: (rbds/rbdpo)*100, rend_salvaco_1L:jum_qty_carton_salvaco == 0 ? 0 : (qty_carton_salvaco_1L/jum_qty_carton_salvaco)*100, rend_salvaco_2L: jum_qty_carton_salvaco == 0 ? 0 : (qty_carton_salvaco_2L/jum_qty_carton_salvaco)*100, rend_nusakita_1L: jum_qty_carton_nusakita == 0 ? 0 : (qty_carton_nusakita_1L/jum_qty_carton_nusakita)*100, rend_nusakita_2L: jum_qty_carton_nusakita == 0 ? 0 : (qty_carton_nusakita_2L/jum_qty_carton_nusakita)*100},
    }
}

const loadDataRefinery = async(data_produksi, data_gl) => {
    let ref_cpo_olah = 0, ref_rbdpo = 0, ref_pfad = 0 ;
    if (data_produksi != null) {
        const refinery = data_produksi.find(item => item.name == 'Refinery');
        const ref_items = refinery.items
        ref_cpo_olah = totalByUraian(ref_items,1);
        ref_rbdpo = totalByUraian(ref_items,2);
        ref_pfad = totalByUraian(ref_items,3);
    }

    let get_bahan_baku = 0, val_bahan_baku= 0, rp_kg_bahan_baku = 0, get_bahan_bakar = 0, val_bahan_bakar = 0, rp_kg_bahan_bakar = 0, get_listrik = 0, val_listrik = 0, rp_kg_listrik = 0, get_air = 0, val_air = 0, rp_kg_air = 0, get_analisa_lab = 0, val_analisa_lab = 0, rp_kg_analisa_lab = 0 ;
    let get_pa = 0, get_be = 0, get_gaji_pimpinan = 0, get_gaji_pelaksana = 0, get_asuransi = 0, get_limbah = 0, get_bengkel = 0, get_depresiasi = 0;
    let val_pa = 0, val_be = 0, val_gaji_pimpinan = 0, val_gaji_pelaksana = 0, val_asuransi = 0, val_limbah = 0, val_bengkel = 0, val_depresiasi = 0;
    let rp_kg_be = 0, rp_kg_pa = 0, rp_kg_gaji_pimpinan = 0, rp_kg_gaji_pelaksana = 0, rp_kg_asuransi = 0, rp_kg_limbah = 0, rp_kg_bengkel = 0, rp_kg_depresiasi = 0;
    // direct
    get_bahan_baku = await totalDifference(data_gl, 'coa_bahan_baku');
    val_bahan_baku = get_bahan_baku === null ? 0 : get_bahan_baku ;
    get_bahan_bakar = await totalDifference(data_gl, 'coa_bahan_bakar');
    val_bahan_bakar = get_bahan_bakar === null ? 0 : get_bahan_bakar ;
    get_listrik = await totalDifference(data_gl, 'coa_listrik');
    val_listrik = get_listrik === null ? 0 : get_listrik ;
    get_air = await totalDifference(data_gl, 'coa_air');
    val_air = get_air === null ? 0 : get_air ;
    get_analisa_lab = await totalDifference(data_gl, 'coa_analisa_lab');
    val_analisa_lab = get_analisa_lab === null ? 0 : get_analisa_lab ;
    get_be = await totalDifference(data_gl, 'coa_bleaching_earth');
    val_be = get_be === null ? 0 : get_be ;
    get_pa = await totalDifference(data_gl, 'coa_phosporic_acid');
    val_pa = get_pa === null ? 0 : get_pa ;

    // in-direct
    get_gaji_pimpinan = await totalDifference(data_gl, 'coa_gaji_tunjangan_sosial_pimpinan');
    val_gaji_pimpinan = get_gaji_pimpinan === null ? 0 : get_gaji_pimpinan ;
    get_gaji_pelaksana = await totalDifference(data_gl, 'coa_gaji_tunjangan_sosial_pelaksana');
    val_gaji_pelaksana = get_gaji_pelaksana === null ? 0 : get_gaji_pelaksana ;
    get_asuransi = await totalDifference(data_gl, 'coa_asuransi_pabrik');
    val_asuransi = get_asuransi === null ? 0 : get_asuransi ;
    get_limbah = await totalDifference(data_gl, 'coa_limbah_pihak3');
    val_limbah = get_limbah === null ? 0 : get_limbah ;
    get_bengkel = await totalDifference(data_gl, 'coa_bengkel_pemeliharaan');
    val_bengkel = get_bengkel === null ? 0 : get_bengkel ;
    get_depresiasi = await totalDifference(data_gl, 'coa_depresiasi');
    val_depresiasi = get_depresiasi === null ? 0 : get_depresiasi ;
    
    // direct
    rp_kg_bahan_baku = Number(val_bahan_baku)/Number(ref_cpo_olah);
    rp_kg_bahan_bakar = Number(val_bahan_bakar)/Number(ref_cpo_olah);
    rp_kg_listrik = Number(val_listrik)/Number(ref_cpo_olah);
    rp_kg_air = Number(val_air)/Number(ref_cpo_olah);
    rp_kg_analisa_lab = Number(val_analisa_lab)/Number(ref_cpo_olah);
    rp_kg_be = Number(val_be)/Number(ref_cpo_olah);
    rp_kg_pa = Number(val_pa)/Number(ref_cpo_olah);

    // in-direct
    rp_kg_gaji_pimpinan = Number(val_gaji_pimpinan)/Number(ref_cpo_olah);
    rp_kg_gaji_pelaksana = Number(val_gaji_pelaksana)/Number(ref_cpo_olah);
    rp_kg_asuransi = Number(val_asuransi)/Number(ref_cpo_olah);
    rp_kg_limbah = Number(val_limbah)/Number(ref_cpo_olah);
    rp_kg_bengkel = Number(val_bengkel)/Number(ref_cpo_olah);
    rp_kg_depresiasi = Number(val_depresiasi)/Number(ref_cpo_olah);
    const total_cost = Number(val_bahan_baku) + Number(val_bahan_bakar) + Number(val_listrik) + Number(val_air) + Number(val_analisa_lab) + Number(val_be) + Number(val_pa) + Number(val_gaji_pimpinan) + Number(val_gaji_pelaksana) + Number(val_asuransi) + Number(val_limbah) + Number(val_bengkel) + Number(val_depresiasi)
    return { 
        name: 'Refinery',
        produk: { qty_cpo_olah: ref_cpo_olah, qty_rbdpo: ref_rbdpo, qty_pfad: ref_pfad, rend_rbdpo: (ref_rbdpo/ref_cpo_olah)*100, rend_pfad: (ref_pfad/ref_cpo_olah)*100, },
        direct: {
            bahan_baku: {
                value: val_bahan_baku,
                rp_kg: rp_kg_bahan_baku,
            },
            bahan_bakar: {
                value: val_bahan_bakar,
                rp_kg: rp_kg_bahan_bakar,
            },
            listrik: {
                value: val_listrik,
                rp_kg: rp_kg_listrik,
            },
            air: {
                value: val_air,
                rp_kg: rp_kg_air,
            },
            analisa_lab: {
                value: val_analisa_lab,
                rp_kg: rp_kg_analisa_lab,
            },
            be: {
                value: val_be,
                rp_kg: rp_kg_be,
            },
            pa: {
                value: val_pa,
                rp_kg: rp_kg_pa,
            },
        },
        in_direct: {
            gaji_pimpinan: {
                value: val_gaji_pimpinan,
                rp_kg: rp_kg_gaji_pimpinan,
            },
            gaji_pelaksana: {
                value: val_gaji_pelaksana,
                rp_kg: rp_kg_gaji_pelaksana,
            },
            asuransi: {
                value: val_asuransi,
                rp_kg: rp_kg_asuransi,
            },
            limbah: {
                value: val_limbah,
                rp_kg: rp_kg_limbah,
            },
            bengkel: {
                value: val_bengkel,
                rp_kg: rp_kg_bengkel,
            },
            depresiasi: {
                value: val_depresiasi,
                rp_kg: rp_kg_depresiasi,
            },
        },
        total_cont_refinery: {
            value: total_cost,
            rp_kg: total_cost / Number(ref_cpo_olah),
        },
        alloc_cost: {
            prop_rbdpo: 95.5, 
            prop_pfad: 4.5,
        }
    }
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