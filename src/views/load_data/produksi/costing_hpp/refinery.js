import { totalByUraian } from '@/views/load_data/produksi/costing_hpp.js'
import { CoaValue } from '@/views/load_data/produksi/costing_hpp/all_point.js'
import { dataAllocation, AllocUtility, AllocProd } from '@/views/load_data/produksi/allocation_cost.js'
// import { CoaValue } from '@/views/load_data/general_leager.js'

export const loadDataRefinery = async(data_produksi, data_gl) => {
    let ref_cpo_olah = 0, ref_rbdpo = 0, ref_pfad = 0 ;

    // Proportion 1
    let prop_1_bahan_bakar = 0, prop_1_other = 0, prop_1_analisa = 0, prop_1_listrik = 0, prop_1_air = 0, prop_1_depresiasi = 0;
    // Proportion 2
    let prop_2 = 0; // For all direct & in-direct cost
    // Proportion Packing
    let prop_pack = 0, prop_pack_depresiasi = 0;

    if (data_produksi != null) {
        const refinery = data_produksi.find(item => item.name == 'Refinery');
        const ref_items = refinery.items
        ref_cpo_olah = totalByUraian(ref_items,1);
        ref_rbdpo = totalByUraian(ref_items,2);
        ref_pfad = totalByUraian(ref_items,3);

        // From Allocation
        const allocation = await dataAllocation(data_produksi)
        const alloc_prod = await AllocProd(data_produksi)
        const alloc_utility = await AllocUtility(allocation)
        prop_1_bahan_bakar = Number(alloc_utility[0].ref.persen) * 100
        prop_2 = (Number(alloc_prod.ref_all_prod) / Number(alloc_prod.ref_all_prod))*100
        prop_1_other = Number(alloc_prod.ref_prod) // For all in-direct cost kecuali Depresiasi
        prop_1_analisa = prop_1_other
        prop_1_listrik = Number(alloc_utility[2].ref.persen) * 100
        prop_1_air = Number(alloc_utility[1].ref.persen) * 100

        prop_pack = ((Number(alloc_prod.pack_rbd_iv56) / Number(alloc_prod.pack_all_prod)) * 100) <= 0 ? (100/3) : (Number(alloc_prod.pack_rbd_iv56) / Number(alloc_prod.pack_all_prod)) * 100
    }

    let get_bahan_baku = 0, val_bahan_baku= 0, rp_kg_bahan_baku = 0, get_bahan_bakar = 0, val_bahan_bakar = 0, rp_kg_bahan_bakar = 0, get_listrik = 0, val_listrik = 0, rp_kg_listrik = 0, get_air = 0, val_air = 0, rp_kg_air = 0, get_analisa_lab = 0, val_analisa_lab = 0, rp_kg_analisa_lab = 0 ;
    let get_pa = 0, get_be = 0, get_gaji_pimpinan = 0, get_gaji_pelaksana = 0, get_asuransi = 0, get_limbah = 0, get_bengkel = 0, get_depresiasi = 0;
    let val_pa = 0, val_be = 0, val_gaji_pimpinan = 0, val_gaji_pelaksana = 0, val_asuransi = 0, val_limbah = 0, val_bengkel = 0, val_depresiasi = 0, val_others = 0;
    let rp_kg_be = 0, rp_kg_pa = 0, rp_kg_gaji_pimpinan = 0, rp_kg_gaji_pelaksana = 0, rp_kg_asuransi = 0, rp_kg_limbah = 0, rp_kg_bengkel = 0, rp_kg_depresiasi = 0, rp_kg_others = 0, total_cost = 0;

    if (data_gl != null) {
        // direct
        get_bahan_baku = await CoaValue(data_gl, 'coa_bahan_baku');
        val_bahan_baku = get_bahan_baku === null ? 0 : get_bahan_baku ;
        get_bahan_bakar = await CoaValue(data_gl, 'coa_bahan_bakar');
        val_bahan_bakar = get_bahan_bakar === null ? 0 : get_bahan_bakar * prop_1_bahan_bakar ;
        get_listrik = await CoaValue(data_gl, 'coa_listrik');
        val_listrik = get_listrik === null ? 0 : get_listrik * prop_1_listrik;
        get_air = await CoaValue(data_gl, 'coa_air');
        val_air = get_air === null ? 0 : get_air  * prop_1_air;
        get_analisa_lab = await CoaValue(data_gl, 'coa_analisa_lab');
        val_analisa_lab = get_analisa_lab === null ? 0 : get_analisa_lab * prop_1_analisa;
        get_be = await CoaValue(data_gl, 'coa_bleaching_earth');
        val_be = get_be === null ? 0 : get_be ;
        get_pa = await CoaValue(data_gl, 'coa_phosporic_acid');
        val_pa = get_pa === null ? 0 : get_pa ;
        const get_others = await CoaValue(data_gl, 'coa_others');
        val_others = get_others === null ? 0 : get_others ;
    
        // in-direct
        get_gaji_pimpinan = await CoaValue(data_gl, 'coa_gaji_tunjangan_sosial_pimpinan');
        val_gaji_pimpinan = get_gaji_pimpinan === null ? 0 : get_gaji_pimpinan * prop_1_other;
        get_gaji_pelaksana = await CoaValue(data_gl, 'coa_gaji_tunjangan_sosial_pelaksana');
        val_gaji_pelaksana = get_gaji_pelaksana === null ? 0 : get_gaji_pelaksana * prop_1_other;
        get_asuransi = await CoaValue(data_gl, 'coa_asuransi_pabrik');
        val_asuransi = get_asuransi === null ? 0 : get_asuransi * prop_1_other;
        get_limbah = await CoaValue(data_gl, 'coa_limbah_pihak3');
        val_limbah = get_limbah === null ? 0 : get_limbah ;
        get_bengkel = await CoaValue(data_gl, 'coa_bengkel_pemeliharaan');
        val_bengkel = get_bengkel === null ? 0 : get_bengkel * prop_1_other;
        get_depresiasi = await CoaValue(data_gl, 'coa_depresiasi');
        val_depresiasi = get_depresiasi === null ? 0 : get_depresiasi ;
        
        // direct
        rp_kg_bahan_baku = Number(val_bahan_baku)/Number(ref_cpo_olah);
        rp_kg_bahan_bakar = Number(val_bahan_bakar)/Number(ref_cpo_olah);
        rp_kg_listrik = Number(val_listrik)/Number(ref_cpo_olah);
        rp_kg_air = Number(val_air)/Number(ref_cpo_olah);
        rp_kg_analisa_lab = Number(val_analisa_lab)/Number(ref_cpo_olah);
        rp_kg_be = Number(val_be)/Number(ref_cpo_olah);
        rp_kg_pa = Number(val_pa)/Number(ref_cpo_olah);
        rp_kg_others = Number(val_others)/Number(ref_cpo_olah);
    
        // in-direct
        rp_kg_gaji_pimpinan = Number(val_gaji_pimpinan)/Number(ref_cpo_olah);
        rp_kg_gaji_pelaksana = Number(val_gaji_pelaksana)/Number(ref_cpo_olah);
        rp_kg_asuransi = Number(val_asuransi)/Number(ref_cpo_olah);
        rp_kg_limbah = Number(val_limbah)/Number(ref_cpo_olah);
        rp_kg_bengkel = Number(val_bengkel)/Number(ref_cpo_olah);
        rp_kg_depresiasi = Number(val_depresiasi)/Number(ref_cpo_olah);
        total_cost = Number(val_bahan_baku) + Number(val_bahan_bakar) + Number(val_listrik) + Number(val_air) + Number(val_analisa_lab) + Number(val_be) + Number(val_pa) + Number(val_gaji_pimpinan) + Number(val_gaji_pelaksana) + Number(val_asuransi) + Number(val_limbah) + Number(val_bengkel) + Number(val_depresiasi)
        
    }
    return { 
        name: 'Refinery',
        produk: { qty_cpo_olah: ref_cpo_olah, qty_rbdpo: ref_rbdpo, qty_pfad: ref_pfad, rend_rbdpo: (ref_rbdpo/ref_cpo_olah)*100, rend_pfad: (ref_pfad/ref_cpo_olah)*100, },
        proportion1: {prop_2: prop_2, bahan_bakar: prop_1_bahan_bakar, other: prop_1_other, analisa: prop_1_analisa, listrik: prop_1_listrik, air: prop_1_air},
        proportion_packing: {prop_pack: prop_pack, prop_pack_depresiasi: prop_pack_depresiasi},
        direct: [
            {id:1, name: 'Bahan Baku', prop_1: null, prop_2: null, value: val_bahan_baku, harga: rp_kg_bahan_baku},
            {id:2, name: 'Bahan Bakar', prop_1: prop_1_bahan_bakar, prop_2: prop_2, value: val_bahan_bakar, harga: rp_kg_bahan_bakar},
            {id:3, name: 'Bleaching Earth (BE)', prop_1: null, prop_2: null, value: val_be, harga: rp_kg_be},
            {id:4, name: 'Phosporic Acid (PA)', prop_1: null, prop_2: null, value: val_pa, harga: rp_kg_pa},
            {id:5, name: 'Others', prop_1: prop_1_other, prop_2: prop_2, value: val_others, harga: rp_kg_others},
            {id:6, name: 'Biaya Analisa & Laboratorium', prop_1: prop_1_analisa, prop_2: prop_2, value: val_analisa_lab, harga: rp_kg_analisa_lab},
            {id:7, name: 'Biaya Listrik', prop_1: prop_1_listrik, prop_2: prop_2, value: val_listrik, harga: rp_kg_listrik},
            {id:8, name: 'Biaya Air', prop_1: prop_1_air, prop_2: prop_2, value: val_air, harga: rp_kg_air},
        ],
        in_direct: [
            {id:1, name: 'Gaji, Tunjangan & Biaya Sosial Karyawan Pimpinan', prop_1: prop_1_other, prop_2: prop_2, value: val_gaji_pimpinan, harga: rp_kg_gaji_pimpinan},
            {id:2, name: 'Gaji, Tunjangan & Biaya Sosial Karyawan Pelaksana', prop_1: prop_1_other, prop_2: prop_2, value: val_gaji_pelaksana, harga: rp_kg_gaji_pelaksana},
            {id:3, name: 'Biaya Asuransi Pabrik', prop_1: prop_1_other, prop_2: prop_2, value: val_asuransi, harga: rp_kg_asuransi},
            {id:4, name: 'Pengelolaan Limbah Pabrik Oleh Pihak Ketiga', prop_1: null, prop_2: null, value: val_limbah, harga: rp_kg_limbah},
            {id:5, name: 'Biaya Bengkel & Pemeliharaan', prop_1: prop_1_other, prop_2: prop_2, value: val_bengkel, harga: rp_kg_bengkel},
            {id:6, name: 'Depresiasi', prop_1: 0, prop_2: prop_1_other, value: val_depresiasi, harga: rp_kg_depresiasi},
        ],
        // direct: {
        //     bahan_baku: {
        //         value: val_bahan_baku,
        //         rp_kg: rp_kg_bahan_baku,
        //     },
        //     bahan_bakar: {
        //         value: val_bahan_bakar,
        //         rp_kg: rp_kg_bahan_bakar,
        //     },
        //     listrik: {
        //         value: val_listrik,
        //         rp_kg: rp_kg_listrik,
        //     },
        //     air: {
        //         value: val_air,
        //         rp_kg: rp_kg_air,
        //     },
        //     analisa_lab: {
        //         value: val_analisa_lab,
        //         rp_kg: rp_kg_analisa_lab,
        //     },
        //     others: {
        //         value: val_others,
        //         rp_kg: rp_kg_others,
        //     },
        //     be: {
        //         value: val_be,
        //         rp_kg: rp_kg_be,
        //     },
        //     pa: {
        //         value: val_pa,
        //         rp_kg: rp_kg_pa,
        //     },
        // },
        // in_direct: {
        //     gaji_pimpinan: {
        //         value: val_gaji_pimpinan,
        //         rp_kg: rp_kg_gaji_pimpinan,
        //     },
        //     gaji_pelaksana: {
        //         value: val_gaji_pelaksana,
        //         rp_kg: rp_kg_gaji_pelaksana,
        //     },
        //     asuransi: {
        //         value: val_asuransi,
        //         rp_kg: rp_kg_asuransi,
        //     },
        //     limbah: {
        //         value: val_limbah,
        //         rp_kg: rp_kg_limbah,
        //     },
        //     bengkel: {
        //         value: val_bengkel,
        //         rp_kg: rp_kg_bengkel,
        //     },
        //     depresiasi: {
        //         value: val_depresiasi,
        //         rp_kg: rp_kg_depresiasi,
        //     },
        // },
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