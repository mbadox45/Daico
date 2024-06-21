import { totalByUraian } from '@/views/load_data/produksi/costing_hpp.js'
import { dataAllocation, AllocUtility, AllocProd } from '@/views/load_data/produksi/allocation_cost.js'
// import { CoaValue } from '@/views/load_data/general_leager.js'
import { CoaValue } from '@/views/load_data/produksi/costing_hpp/all_point.js'

export const loadFrakIv60 = async(data_produksi, data_gl) => {
    let rbdpo = 0, rbdo_iv60 = 0, rbds = 0, additional = 0, jum_qty_carton_salvaco = 0, jum_qty_carton_nusakita = 0 ;
    let qty_carton_salvaco_1L = 0, qty_carton_salvaco_2L = 0, qty_carton_nusakita_1L = 0, qty_carton_nusakita_2L = 0;
    let prop1 = 10.86, propS1L = 57.4581754439343/100, propS2L = 42.5418245560657/100, propN1L = 0/100, propN2L = 100/100;

    // Proportion 1
    let prop_1_bahan_bakar = 0, prop_1_other = 0, prop_1_analisa = 0, prop_1_listrik = 0, prop_1_air = 0, prop_1_depresiasi = 0;
    // Proportion 2
    let prop_2 = 0; // For all direct & in-direct cost
    // Proportion Packing
    let prop_pack = 0, prop_pack_depresiasi = 0;

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

        // From Allocation
        const allocation = await dataAllocation(data_produksi)
        const alloc_prod = await AllocProd(data_produksi)
        const alloc_utility = await AllocUtility(allocation)
        prop_1_bahan_bakar = Number(alloc_utility[0].frak.persen) * 100
        prop_2 = (Number(alloc_prod.frak_rbd_iv60) / Number(alloc_prod.frak_all_prod))*100
        prop_1_other = Number(alloc_prod.frak_prod) // For all in-direct cost kecuali Depresiasi
        prop_1_analisa = prop_1_other
        prop_1_listrik = Number(alloc_utility[2].frak.persen) * 100
        prop_1_air = Number(alloc_utility[1].frak.persen) * 100

        prop_pack = ((Number(alloc_prod.pack_rbd_iv60) / Number(alloc_prod.pack_all_prod)) * 100) <= 0 ? (100/3) : (Number(alloc_prod.pack_rbd_iv60) / Number(alloc_prod.pack_all_prod)) * 100
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
    let val_gaji_tunjangan = 0, val_bahan_kimia = 0, val_pengangkutan = 0, val_bahan_pengepakan = 0, val_biaya_asuransi = 0, val_salvaco_1l = 0, val_salvaco_2l = 0, val_nusakita_1l = 0, val_nusakita_2l = 0;
    // Harga
    let rp_kg_gaji_tunjangan = 0, rp_kg_bahan_kimia = 0, rp_kg_pengangkutan = 0, rp_kg_bahan_pengepakan = 0, rp_kg_biaya_asuransi = 0, rp_kg_salvaco_1l = 0, rp_kg_salvaco_2l = 0, rp_kg_nusakita_1l = 0, rp_kg_nusakita_2l = 0;

    // Allocation
    let alloc_prop_rbdo = 0, alloc_prop_rbds = 0, alloc_prop_sal_1l = 0, alloc_prop_sal_2l = 0, alloc_prop_nus_1l = 0, alloc_prop_nus_2l = 0;
    let alloc_qty_rbdo = 0, alloc_qty_rbds = 0, alloc_qty_sal_1l = 0, alloc_qty_sal_2l = 0, alloc_qty_nus_1l = 0, alloc_qty_nus_2l = 0;
    let alloc_rend_rbdo = 0, alloc_rend_rbds = 0, alloc_rend_sal_1l = 0, alloc_rend_sal_2l = 0, alloc_rend_nus_1l = 0, alloc_rend_nus_2l = 0;

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
        val_gaji_tunjangan = get_gaji_tunjangan === null ? 0 : get_gaji_tunjangan * prop_1_other;
        const get_bahan_kimia = await CoaValue(data_gl, 'coa_bahan_kimia');
        val_bahan_kimia = get_bahan_kimia === null ? 0 : get_bahan_kimia * prop_1_other;
        const get_pengangkutan = await CoaValue(data_gl, 'coa_pengangkutan_langsir');
        val_pengangkutan = get_pengangkutan === null ? 0 : get_pengangkutan * prop_1_other;
        const get_bahan_pengepakan = await CoaValue(data_gl, 'coa_pengepakan_lain');
        val_bahan_pengepakan = get_bahan_pengepakan === null ? 0 : get_bahan_pengepakan * prop_1_other;
        const get_biaya_asuransi = await CoaValue(data_gl, 'coa_asuransi_gudang_filling');
        val_biaya_asuransi = get_biaya_asuransi === null ? 0 : get_biaya_asuransi * prop_1_other;
        const get_salvaco_1l = await CoaValue(data_gl, 'coa_salvaco_1l');
        val_salvaco_1l = get_salvaco_1l === null ? 0 : get_salvaco_1l;
        const get_salvaco_2l = await CoaValue(data_gl, 'coa_salvaco_2l');
        val_salvaco_2l = get_salvaco_2l === null ? 0 : get_salvaco_2l;
        const get_nusakita_1l = await CoaValue(data_gl, 'coa_nusakita_1l');
        val_nusakita_1l = get_nusakita_1l === null ? 0 : get_nusakita_1l;
        const get_nusakita_2l = await CoaValue(data_gl, 'coa_nusakita_2l');
        val_nusakita_2l = get_nusakita_2l === null ? 0 : get_nusakita_2l;

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
        rp_kg_salvaco_1l = Number(val_salvaco_1l)/Number(rbdpo);
        rp_kg_salvaco_2l = Number(val_salvaco_2l)/Number(rbdpo);
        rp_kg_nusakita_1l = Number(val_nusakita_1l)/Number(rbdpo);
        rp_kg_nusakita_2l = Number(val_nusakita_2l)/Number(rbdpo);

        // allocation
        alloc_prop_rbdo = (rbdo_iv60/rbdpo)*100
        alloc_prop_rbds = (rbds/rbdpo)*100
        alloc_qty_rbdo = total_cost * alloc_prop_rbdo / 100
        alloc_qty_rbds = total_cost * alloc_prop_rbds / 100
        alloc_rend_rbdo = alloc_qty_rbdo / rbdo_iv60
        alloc_rend_rbds = alloc_qty_rbds / rbds
        alloc_prop_sal_1l = (qty_carton_salvaco_1L / (jum_qty_carton_salvaco + jum_qty_carton_nusakita)) * 100 || 0
        alloc_prop_sal_2l = (qty_carton_salvaco_2L / (jum_qty_carton_salvaco + jum_qty_carton_nusakita)) * 100 || 0
        alloc_prop_nus_1l = (qty_carton_nusakita_1L / (jum_qty_carton_salvaco + jum_qty_carton_nusakita)) * 100 || 0
        alloc_prop_nus_2l = (qty_carton_nusakita_2L / (jum_qty_carton_salvaco + jum_qty_carton_nusakita)) * 100 || 0
        alloc_qty_sal_1l = (alloc_rend_rbdo * qty_carton_salvaco_1L) + ((val_gaji_tunjangan + val_bahan_kimia + val_pengangkutan + val_bahan_pengepakan + val_biaya_asuransi + 0) * alloc_prop_sal_1l) + qty_carton_salvaco_1L
        alloc_qty_sal_2l = (alloc_rend_rbdo * qty_carton_salvaco_2L) + ((val_gaji_tunjangan + val_bahan_kimia + val_pengangkutan + val_bahan_pengepakan + val_biaya_asuransi + 0) * alloc_prop_sal_2l) + qty_carton_salvaco_2L
        alloc_qty_nus_1l = (alloc_rend_rbdo * qty_carton_nusakita_1L) + ((val_gaji_tunjangan + val_bahan_kimia + val_pengangkutan + val_bahan_pengepakan + val_biaya_asuransi + 0) * alloc_prop_nus_1l) + qty_carton_nusakita_1L
        alloc_qty_nus_2l = (alloc_rend_rbdo * qty_carton_nusakita_2L) + ((val_gaji_tunjangan + val_bahan_kimia + val_pengangkutan + val_bahan_pengepakan + val_biaya_asuransi + 0) * alloc_prop_nus_2l) + qty_carton_nusakita_2L
        alloc_rend_sal_1l = alloc_qty_sal_1l / qty_carton_salvaco_1L || 0
        alloc_rend_sal_2l = alloc_qty_sal_2l / qty_carton_salvaco_2L || 0
        alloc_rend_nus_1l = alloc_qty_nus_1l / qty_carton_nusakita_1L || 0
        alloc_rend_nus_2l = alloc_qty_nus_2l / qty_carton_nusakita_2L || 0
    }

    return {
        name: 'Fraksinasi (IV-60)',
        qty: { qty_rbdpo: rbdpo, qty_rbdo: rbdo_iv60, qty_rbds: rbds, qty_carton_salvaco_1L: qty_carton_salvaco_1L, qty_carton_salvaco_2L: qty_carton_salvaco_2L, qty_carton_nusakita_1L: qty_carton_nusakita_1L, qty_carton_nusakita_2L: qty_carton_nusakita_2L },
        proportion: {prop1: prop1, propS1L: propS1L, propS2L: propS2L, propN1L: propN1L, propN2L: propN2L},
        proportion1: {prop_2: prop_2, bahan_bakar: prop_1_bahan_bakar, other: prop_1_other, analisa: prop_1_analisa, listrik: prop_1_listrik, air: prop_1_air},
        proportion_packing: {prop_pack: prop_pack, prop_pack_depresiasi: prop_pack_depresiasi},
        rendement: {additional: additional, rend_rbdo: (rbdo_iv60/rbdpo)*100, rend_rbds: (rbds/rbdpo)*100, rend_salvaco_1L:jum_qty_carton_salvaco == 0 ? 0 : (qty_carton_salvaco_1L/jum_qty_carton_salvaco)*100, rend_salvaco_2L: jum_qty_carton_salvaco == 0 ? 0 : (qty_carton_salvaco_2L/jum_qty_carton_salvaco)*100, rend_nusakita_1L: jum_qty_carton_nusakita == 0 ? 0 : (qty_carton_nusakita_1L/jum_qty_carton_nusakita)*100, rend_nusakita_2L: jum_qty_carton_nusakita == 0 ? 0 : (qty_carton_nusakita_2L/jum_qty_carton_nusakita)*100},
        direct: [
            {id:1, name: 'Bahan Baku', prop_1: null, prop_2: null, value: val_bahan_baku, harga: rp_kg_bahan_baku},
            {id:2, name: 'Bahan Bakar', prop_1: prop_1_bahan_bakar, prop_2: prop_2, value: val_bahan_bakar, harga: rp_kg_bahan_bakar},
            {id:3, name: 'Others', prop_1: prop_1_other, prop_2: prop_2, value: val_others, harga: rp_kg_others},
            {id:4, name: 'Biaya Analisa & Laboratorium', prop_1: prop_1_analisa, prop_2: prop_2, value: val_analisa_lab, harga: rp_kg_analisa_lab},
            {id:5, name: 'Biaya Listrik', prop_1: prop_1_listrik, prop_2: prop_2, value: val_listrik, harga: rp_kg_listrik},
            {id:6, name: 'Biaya Air', prop_1: prop_1_air, prop_2: prop_2, value: val_air, harga: rp_kg_air},
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
            {id:2, name: 'Salvaco - 1L', prop_1: null, prop_2: null, value: val_salvaco_1l, harga: rp_kg_salvaco_1l},
            {id:3, name: 'Salvaco - 2L', prop_1: null, prop_2: null, value: val_salvaco_2l, harga: rp_kg_salvaco_2l},
            {id:4, name: 'Nusakita - 1L', prop_1: null, prop_2: null, value: val_nusakita_1l, harga: rp_kg_nusakita_1l},
            {id:5, name: 'Nusakita - 2L', prop_1: null, prop_2: null, value: val_nusakita_2l, harga: rp_kg_nusakita_2l},
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
            cost: total_cost + (val_gaji_tunjangan + val_salvaco_1l + val_salvaco_2l + val_nusakita_1l + val_nusakita_2l + val_bahan_kimia + val_pengangkutan + val_bahan_pengepakan + val_biaya_asuransi + 0),
            harga: (total_cost + (val_gaji_tunjangan + val_salvaco_1l + val_salvaco_2l + val_nusakita_1l + val_nusakita_2l + val_bahan_kimia + val_pengangkutan + val_bahan_pengepakan + val_biaya_asuransi + 0)) / rbdpo
        }, 
        allocation: [
            {id:1, name: 'RBD Olein IV-60', prop_1: null, prop_2: alloc_prop_rbdo, value: alloc_qty_rbdo, harga: alloc_rend_rbdo},
            {id:2, name: 'RBD Stearin', prop_1: null, prop_2: alloc_prop_rbds, value: alloc_qty_rbds, harga: alloc_rend_rbds},
            {id:3, name: 'Salvaco - 1L', prop_1: null, prop_2: alloc_prop_sal_1l, value: alloc_qty_sal_1l, harga: alloc_rend_sal_1l},
            {id:4, name: 'Salvaco - 2L', prop_1: null, prop_2: alloc_prop_sal_2l, value: alloc_qty_sal_2l, harga: alloc_rend_sal_2l},
            {id:5, name: 'Nusakita - 1L', prop_1: null, prop_2: alloc_prop_nus_1l, value: alloc_qty_nus_1l, harga: alloc_rend_nus_1l},
            {id:6, name: 'Nusakita - 2L', prop_1: null, prop_2: alloc_prop_nus_2l, value: alloc_qty_nus_2l, harga: alloc_rend_nus_2l},
        ]
    }
}