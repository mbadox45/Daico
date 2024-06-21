import { totalByUraian } from '@/views/load_data/produksi/costing_hpp.js'
import { dataAllocation, AllocUtility, AllocProd } from '@/views/load_data/produksi/allocation_cost.js'
// import { CoaValue } from '@/views/load_data/general_leager.js'
import { CoaValue } from '@/views/load_data/produksi/costing_hpp/all_point.js'

export const loadFrakIv57 = async(data_produksi, data_gl) => {
    let rbdpo = 0, rbdo_iv57 = 0, rbds = 0, additional = 0, jum_qty_carton = 0 ;
    let qty_carton_250ml = 0, qty_carton_450ml = 0, qty_carton_900ml = 0, qty_carton_1800ml = 0; 
    let prop1 = 0.905*0.9*12, prop250 = 0.551627716886285/100, prop450 = 2.0388287636945/100, prop900 = 80.986204994845/100, prop1800 = 16.4233385245742/100;

    // Proportion 1
    let prop_1_bahan_bakar = 0, prop_1_other = 0, prop_1_analisa = 0, prop_1_listrik = 0, prop_1_air = 0, prop_1_depresiasi = 0;
    // Proportion 2
    let prop_2 = 0; // For all direct & in-direct cost
    // Proportion Packing
    let prop_pack = 0, prop_pack_depresiasi = 0;

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

        // From Allocation
        const allocation = await dataAllocation(data_produksi)
        const alloc_prod = await AllocProd(data_produksi)
        const alloc_utility = await AllocUtility(allocation)
        prop_1_bahan_bakar = Number(alloc_utility[0].frak.persen) * 100
        prop_2 = (Number(alloc_prod.frak_rbd_iv57) / Number(alloc_prod.frak_all_prod))*100
        prop_1_other = Number(alloc_prod.frak_prod) // For all in-direct cost kecuali Depresiasi
        prop_1_analisa = prop_1_other
        prop_1_listrik = Number(alloc_utility[2].frak.persen) * 100
        prop_1_air = Number(alloc_utility[1].frak.persen) * 100

        prop_pack = ((Number(alloc_prod.pack_rbd_iv57) / Number(alloc_prod.pack_all_prod)) * 100) <= 0 ? (100/3) : (Number(alloc_prod.pack_rbd_iv57) / Number(alloc_prod.pack_all_prod)) * 100
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

    // Packaging Cost
    // Value
    let val_gaji_tunjangan = 0, val_bahan_kimia = 0, val_pengangkutan = 0, val_bahan_pengepakan = 0, val_biaya_asuransi = 0, val_inl_250 = 0, val_inl_450 = 0, val_inl_900 = 0, val_inl_1800 = 0;
    // Harga
    let rp_kg_gaji_tunjangan = 0, rp_kg_bahan_kimia = 0, rp_kg_pengangkutan = 0, rp_kg_bahan_pengepakan = 0, rp_kg_biaya_asuransi = 0, rp_kg_inl_250 = 0, rp_kg_inl_450 = 0, rp_kg_inl_900 = 0, rp_kg_inl_1800 = 0;

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

        // packaging
        const get_gaji_tunjangan = await CoaValue(data_gl, 'coa_gaji_tunjangan');
        val_gaji_tunjangan = get_gaji_tunjangan === null ? 0 : get_gaji_tunjangan * prop_1_other / 100;
        const get_bahan_kimia = await CoaValue(data_gl, 'coa_bahan_kimia');
        val_bahan_kimia = get_bahan_kimia === null ? 0 : get_bahan_kimia * prop_1_other / 100;
        const get_pengangkutan = await CoaValue(data_gl, 'coa_pengangkutan_langsir');
        val_pengangkutan = get_pengangkutan === null ? 0 : get_pengangkutan * prop_1_other / 100;
        const get_bahan_pengepakan = await CoaValue(data_gl, 'coa_pengepakan_lain');
        val_bahan_pengepakan = get_bahan_pengepakan === null ? 0 : get_bahan_pengepakan * prop_1_other / 100;
        const get_biaya_asuransi = await CoaValue(data_gl, 'coa_asuransi_gudang_filling');
        val_biaya_asuransi = get_biaya_asuransi === null ? 0 : get_biaya_asuransi * prop_1_other / 100;
        const get_inl_250 = await CoaValue(data_gl, 'coa_inl_250');
        val_inl_250 = get_inl_250 === null ? 0 : get_inl_250;
        const get_inl_450 = await CoaValue(data_gl, 'coa_inl_450');
        val_inl_450 = get_inl_450 === null ? 0 : get_inl_450;
        const get_inl_900 = await CoaValue(data_gl, 'coa_inl_900');
        val_inl_900 = get_inl_900 === null ? 0 : get_inl_900;
        const get_inl_1800 = await CoaValue(data_gl, 'coa_inl_1800');
        val_inl_1800 = get_inl_1800 === null ? 0 : get_inl_1800;

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

        // packaging
        rp_kg_gaji_tunjangan = Number(val_gaji_tunjangan)/Number(rbdpo);
        rp_kg_bahan_kimia = Number(val_bahan_kimia)/Number(rbdpo);
        rp_kg_pengangkutan = Number(val_pengangkutan)/Number(rbdpo);
        rp_kg_bahan_pengepakan = Number(val_bahan_pengepakan)/Number(rbdpo);
        rp_kg_biaya_asuransi = Number(val_biaya_asuransi)/Number(rbdpo);
        rp_kg_inl_250 = Number(val_inl_250)/Number(rbdpo);
        rp_kg_inl_450 = Number(val_inl_450)/Number(rbdpo);
        rp_kg_inl_900 = Number(val_inl_900)/Number(rbdpo);
        rp_kg_inl_1800 = Number(val_inl_1800)/Number(rbdpo);
    }

    return {
        name: 'Fraksinasi (IV-57)',
        qty: { qty_rbdpo: rbdpo, qty_rbdo: rbdo_iv57, qty_rbds: rbds, qty_carton_250ml: qty_carton_250ml, qty_carton_450ml: qty_carton_450ml, qty_carton_900ml: qty_carton_900ml, qty_carton_1800ml: qty_carton_1800ml },
        proportion: {prop1: prop1, prop250: prop250, prop450: prop450, prop900: prop900, prop1800: prop1800},
        proportion1: {prop_2: prop_2, bahan_bakar: prop_1_bahan_bakar, other: prop_1_other, analisa: prop_1_analisa, listrik: prop_1_listrik, air: prop_1_air},
        proportion_packing: {prop_pack: prop_pack, prop_pack_depresiasi: prop_pack_depresiasi},
        rendement: {additional: additional, rend_rbdo: (rbdo_iv57/rbdpo)*100, rend_rbds: (rbds/rbdpo)*100, rend_250:jum_qty_carton == 0 ? 0 : (qty_carton_250ml/jum_qty_carton)*100, rend_450: jum_qty_carton == 0 ? 0 : (qty_carton_450ml/jum_qty_carton)*100, rend_900: jum_qty_carton == 0 ? 0 : (qty_carton_900ml/jum_qty_carton)*100, rend_1800: jum_qty_carton == 0 ? 0 : (qty_carton_1800ml/jum_qty_carton)*100 },
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
            {id:4, name: 'Biaya Bengkel & Pemeliharaan', prop_1: prop_1_other, prop_2: prop_2, value: val_bengkel, harga: rp_kg_bengkel},
            {id:5, name: 'Depresiasi', prop_1: 0, prop_2: prop_1_other, value: val_depresiasi, harga: rp_kg_depresiasi},
        ],
        packaging: [
            {id:1, name: 'Gaji & Tunjangan', prop_1: prop_pack, prop_2: null, value: val_gaji_tunjangan, harga: rp_kg_gaji_tunjangan},
            {id:2, name: 'INL - 250ml', prop_1: null, prop_2: null, value: val_inl_250, harga: rp_kg_inl_250},
            {id:3, name: 'INL - 450ml', prop_1: null, prop_2: null, value: val_inl_450, harga: rp_kg_inl_450},
            {id:4, name: 'INL - 900ml', prop_1: null, prop_2: null, value: val_inl_900, harga: rp_kg_inl_900},
            {id:5, name: 'INL - 1800ml', prop_1: null, prop_2: null, value: val_inl_1800, harga: rp_kg_inl_1800},
            {id:6, name: 'Bahan Kimia', prop_1: prop_pack, prop_2: null, value: val_bahan_kimia, harga: rp_kg_bahan_kimia},
            {id:7, name: 'Pengangkutan / Langsir', prop_1: prop_pack, prop_2: null, value: val_pengangkutan, harga: rp_kg_pengangkutan},
            {id:8, name: 'Bahan Pengepakan Lainnya', prop_1: prop_pack, prop_2: null, value: val_bahan_pengepakan, harga: rp_kg_bahan_pengepakan},
            {id:9, name: 'Biaya Asuransi Gudang & Filling', prop_1: prop_pack, prop_2: null, value: val_biaya_asuransi, harga: rp_kg_biaya_asuransi},
            {id:10, name: 'Depresiasi (Packaging)', prop_1: 0, prop_2: prop_pack, value: 0, harga: 0},
        ],
        total:{
            cost: total_cost,
            harga: total_cost / rbdpo
        },
        total_packaging:{
            cost: total_cost + (val_gaji_tunjangan + val_inl_250 + val_inl_450 + val_inl_900 + val_inl_1800 + val_bahan_kimia + val_pengangkutan + val_bahan_pengepakan + val_biaya_asuransi + 0),
            harga: (total_cost + (val_gaji_tunjangan + val_inl_250 + val_inl_450 + val_inl_900 + val_inl_1800 + val_bahan_kimia + val_pengangkutan + val_bahan_pengepakan + val_biaya_asuransi + 0)) / rbdpo
        }, 
        allocation: [
            {id:1, name: 'RBD Olein IV-57', prop_1: null, prop_2: (rbdo_iv57/rbdpo)*100, value: ((rbdo_iv57/rbdpo)) * total_cost, harga: (((rbdo_iv57/rbdpo)) * total_cost)/rbdo_iv57},
            {id:2, name: 'RBD Stearin', prop_1: null, prop_2: (rbds/rbdpo)*100, value: ((rbds/rbdpo)) * total_cost, harga: (((rbds/rbdpo)) * total_cost)/rbds},
            {id:3, name: 'INL - 250ml', prop_1: null, prop_2: (rbds/rbdpo)*100, value: qty_carton_250ml, harga: (((rbds/rbdpo)) * total_cost)/rbds},
            {id:4, name: 'INL - 450ml', prop_1: null, prop_2: (rbds/rbdpo)*100, value: qty_carton_450ml, harga: (((rbds/rbdpo)) * total_cost)/rbds},
            {id:5, name: 'INL - 900ml', prop_1: null, prop_2: (rbds/rbdpo)*100, value: qty_carton_900ml, harga: (((rbds/rbdpo)) * total_cost)/rbds},
            {id:6, name: 'INL - 1800ml', prop_1: null, prop_2: (rbds/rbdpo)*100, value: qty_carton_1800ml, harga: (((rbds/rbdpo)) * total_cost)/rbds},
        ]
    }
}