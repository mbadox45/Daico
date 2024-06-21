import { totalByUraian } from '@/views/load_data/produksi/costing_hpp.js'
import { dataAllocation, AllocUtility, AllocProd } from '@/views/load_data/produksi/allocation_cost.js'
// import { CoaValue } from '@/views/load_data/general_leager.js'
import { CoaValue } from '@/views/load_data/produksi/costing_hpp/all_point.js'

export const loadFrakIv58 = async(data_produksi, data_gl) => {
    let rbdpo = 0, rbdo_iv58 = 0, rbds = 0;

    // Proportion 1
    let prop_1_bahan_bakar = 0, prop_1_other = 0, prop_1_analisa = 0, prop_1_listrik = 0, prop_1_air = 0, prop_1_depresiasi = 0;
    // Proportion 2
    let prop_2 = 0; // For all direct & in-direct cost
    // Proportion Packing
    let prop_pack = 0, prop_pack_depresiasi = 0;

    if (data_produksi != null) {
        const frak_iv_58 = data_produksi.find(item => item.name == 'Fraksinasi (IV-58)');
        const frak_item = frak_iv_58.items;
        rbdpo = totalByUraian(frak_item,9);
        rbdo_iv58 = totalByUraian(frak_item,10);
        rbds = totalByUraian(frak_item,11);

        // From Allocation
        const allocation = await dataAllocation(data_produksi)
        const alloc_prod = await AllocProd(data_produksi)
        const alloc_utility = await AllocUtility(allocation)
        prop_1_bahan_bakar = Number(alloc_utility[0].frak.persen) * 100
        prop_2 = (Number(alloc_prod.frak_rbd_iv58) / Number(alloc_prod.frak_all_prod))*100
        prop_1_other = Number(alloc_prod.frak_prod) // For all in-direct cost kecuali Depresiasi
        prop_1_analisa = prop_1_other
        prop_1_listrik = Number(alloc_utility[2].frak.persen) * 100
        prop_1_air = Number(alloc_utility[1].frak.persen) * 100

        prop_pack = ((Number(alloc_prod.pack_rbd_iv58) / Number(alloc_prod.pack_all_prod)) * 100) <= 0 ? (100/3) : (Number(alloc_prod.pack_rbd_iv58) / Number(alloc_prod.pack_all_prod)) * 100
    }

    // Direct Cost
    // Value
    let val_bahan_baku = 0, val_bahan_bakar = 0, val_listrik = 0, val_air = 0, val_analisa_lab = 0, val_others = 0;
    // Harga
    let rp_kg_bahan_baku = 0, rp_kg_bahan_bakar = 0, rp_kg_listrik = 0, rp_kg_air = 0, rp_kg_analisa_lab = 0, rp_kg_others = 0;

    // In Direct Cost
    // Value
    let val_gaji_pimpinan = 0, val_gaji_pelaksana = 0, val_asuransi = 0, val_bengkel = 0, val_depresiasi = 0;
    // Harga
    let rp_kg_gaji_pimpinan = 0, rp_kg_gaji_pelaksana = 0, rp_kg_asuransi = 0, rp_kg_bengkel = 0, rp_kg_depresiasi = 0, total_cost = 0;

    if (data_gl != null) {
        // direct
        const get_bahan_bakar = await CoaValue(data_gl, 'coa_bahan_bakar');
        val_bahan_bakar = get_bahan_bakar === null ? 0 : get_bahan_bakar * prop_1_bahan_bakar * prop_2 / 100;
        const get_listrik = await CoaValue(data_gl, 'coa_listrik');
        val_listrik = get_listrik === null ? 0 : get_listrik * prop_1_listrik * prop_2 / 100;
        const get_air = await CoaValue(data_gl, 'coa_air');
        val_air = get_air === null ? 0 : get_air  * prop_1_air *prop_2 / 100;
        const get_analisa_lab = await CoaValue(data_gl, 'coa_analisa_lab');
        val_analisa_lab = get_analisa_lab === null ? 0 : get_analisa_lab * prop_1_analisa *prop_2 / 100;
        const get_others = await CoaValue(data_gl, 'coa_others');
        val_others = get_others === null ? 0 : get_others * prop_1_analisa * prop_2 / 100;

        // in-direct
        const get_gaji_pimpinan = await CoaValue(data_gl, 'coa_gaji_tunjangan_sosial_pimpinan');
        val_gaji_pimpinan = get_gaji_pimpinan === null ? 0 : get_gaji_pimpinan * prop_1_other / 100;
        const get_gaji_pelaksana = await CoaValue(data_gl, 'coa_gaji_tunjangan_sosial_pelaksana');
        val_gaji_pelaksana = get_gaji_pelaksana === null ? 0 : get_gaji_pelaksana * prop_1_other / 100;
        const get_asuransi = await CoaValue(data_gl, 'coa_asuransi_pabrik');
        val_asuransi = get_asuransi === null ? 0 : get_asuransi * prop_1_other / 100;
        const get_bengkel = await CoaValue(data_gl, 'coa_bengkel_pemeliharaan');
        val_bengkel = get_bengkel === null ? 0 : get_bengkel * prop_1_other / 100;
        const get_depresiasi = await CoaValue(data_gl, 'coa_depresiasi');
        val_depresiasi = get_depresiasi === null ? 0 : get_depresiasi ;

        // direct
        rp_kg_bahan_baku = Number(val_bahan_baku)/Number(rbdpo);
        rp_kg_bahan_bakar = Number(val_bahan_bakar)/Number(rbdpo);
        rp_kg_listrik = Number(val_listrik)/Number(rbdpo);
        rp_kg_air = Number(val_air)/Number(rbdpo);
        rp_kg_analisa_lab = Number(val_analisa_lab)/Number(rbdpo);
        rp_kg_others = Number(val_others)/Number(rbdpo);

        // in-direct
        rp_kg_gaji_pimpinan = Number(val_gaji_pimpinan)/Number(rbdpo);
        rp_kg_gaji_pelaksana = Number(val_gaji_pelaksana)/Number(rbdpo);
        rp_kg_asuransi = Number(val_asuransi)/Number(rbdpo);
        rp_kg_bengkel = Number(val_bengkel)/Number(rbdpo);
        rp_kg_depresiasi = Number(val_depresiasi)/Number(rbdpo);
        total_cost = Number(val_bahan_baku) + Number(val_bahan_bakar) + Number(val_listrik) + Number(val_air) + Number(val_analisa_lab) + Number(val_gaji_pimpinan) + Number(val_gaji_pelaksana) + Number(val_asuransi) + Number(val_bengkel) + Number(val_depresiasi)
    }

    return {
        name: 'Fraksinasi (IV-58)',
        qty: { qty_rbdpo: rbdpo, qty_rbdo: rbdo_iv58, qty_rbds: rbds,},
        // proportion: {prop1: prop1, prop1L: prop1L, prop2L: prop2L},
        proportion1: {prop_2: prop_2, bahan_bakar: prop_1_bahan_bakar, other: prop_1_other, analisa: prop_1_analisa, listrik: prop_1_listrik, air: prop_1_air},
        proportion_packing: {prop_pack: prop_pack, prop_pack_depresiasi: prop_pack_depresiasi},
        rendement: {rend_rbdo: (rbdo_iv58/rbdpo)*100, rend_rbds: (rbds/rbdpo)*100},
        direct: [
            {id:1, name: 'Bahan Baku', prop_1: null, prop_2: null, value: val_bahan_baku, harga: rp_kg_bahan_baku},
            {id:2, name: 'Bahan Bakar', prop_1: prop_1_bahan_bakar, prop_2: prop_2, value: val_bahan_bakar, harga: rp_kg_bahan_bakar},
            {id:3, name: 'Others', prop_1: prop_1_other, prop_2: prop_2, value: val_others, harga: rp_kg_bahan_bakar},
            {id:4, name: 'Biaya Analisa & Laboratorium', prop_1: prop_1_analisa, prop_2: prop_2, value: val_analisa_lab, harga: rp_kg_bahan_bakar},
            {id:5, name: 'Biaya Listrik', prop_1: prop_1_listrik, prop_2: prop_2, value: val_listrik, harga: rp_kg_bahan_bakar},
            {id:6, name: 'Biaya Air', prop_1: prop_1_air, prop_2: prop_2, value: val_bahan_bakar, harga: rp_kg_bahan_bakar},
        ],
        in_direct: [
            {id:1, name: 'Gaji, Tunjangan & Biaya Sosial Karyawan Pimpinan', prop_1: prop_1_other, prop_2: prop_2, value: val_gaji_pimpinan, harga: rp_kg_gaji_pimpinan},
            {id:2, name: 'Gaji, Tunjangan & Biaya Sosial Karyawan Pelaksana', prop_1: prop_1_other, prop_2: prop_2, value: val_gaji_pelaksana, harga: rp_kg_gaji_pelaksana},
            {id:3, name: 'Biaya Asuransi Pabrik', prop_1: prop_1_other, prop_2: prop_2, value: val_asuransi, harga: rp_kg_asuransi},
            {id:4, name: 'Biaya Bengkel & cost: Pemeliharaan', prop_1: prop_1_other, prop_2: prop_2, value: val_bengkel, harga: rp_kg_bengkel},
            {id:5, name: 'Depresiasi', prop_1: 0, prop_2: prop_1_other, value: val_depresiasi, harga: rp_kg_depresiasi},
        ],
        total:{
            cost: total_cost,
            harga: total_cost / rbdpo
        }, 
        allocation: [
            {id:1, name: 'RBD Olein IV-58', prop_1: null, prop_2: (rbdo_iv58/rbdpo)*100, value: ((rbdo_iv58/rbdpo)) * total_cost, harga: (((rbdo_iv58/rbdpo)) * total_cost)/rbdo_iv58},
            {id:2, name: 'RBD Stearin', prop_1: null, prop_2: (rbds/rbdpo)*100, value: ((rbds/rbdpo)) * total_cost, harga: (((rbds/rbdpo)) * total_cost)/rbds},
        ]
    }
}