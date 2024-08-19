import CostProd from '@/api/cost_prod/cost_prod.js';
import {loadAllByDate_GlConfigController, loadByCoa_GlConfigController} from '@/controller/master_data/GlConfigController.js'
import {loadAll_SettingMaster} from '@/controller/master_data/SettingController.js'

export const loadAll_CostProdController = async(data) => {
    try {
        const response = await CostProd.getAll(data);
        const load = response.data;
        // const data = load.data;
        return load;
    } catch (error) {
        return null;
    }
}

export const loadBebanProduksi_CostProdController = async(tgl) => {
    try {
        const response = await CostProd.getBebanProd({tanggal:tgl});
        const load = response.data;
        const data = load.data;
        const datas = data.data;
        return datas;
    } catch (error) {
        return null;
    }
}

export const laporanBebanProduksi_CostProdController = async (data) => {
    const coa_bahan_baku = data == null ? null : data.find(item => item.setting == 'coa_bahan_baku_mr');
    const coa_gaji_tunjangan_sosial_pimpinan = data == null ? null : data.find(item => item.setting == 'coa_gaji_tunjangan_sosial_pimpinan_mr');
    const coa_gaji_tunjangan_sosial_pelaksana = data == null ? null : data.find(item => item.setting == 'coa_gaji_tunjangan_sosial_pelaksana_mr');
    const coa_bahan_bakar = data == null ? null : data.find(item => item.setting == 'coa_bahan_bakar_mr');
    const coa_bahan_kimia_pendukung_produksi = data == null ? null : data.find(item => item.setting == 'coa_bahan_kimia_pendukung_produksi_mr');
    const coa_analisa_lab = data == null ? null : data.find(item => item.setting == 'coa_analisa_lab_mr');
    const coa_listrik = data == null ? null : data.find(item => item.setting == 'coa_listrik_mr');
    const coa_air = data == null ? null : data.find(item => item.setting == 'coa_air_mr');
    const coa_asuransi_pabrik = data == null ? null : data.find(item => item.setting == 'coa_asuransi_pabrik_mr');
    const coa_limbah_pihak3 = data == null ? null : data.find(item => item.setting == 'coa_limbah_pihak3_mr');
    const coa_bengkel_pemeliharaan = data == null ? null : data.find(item => item.setting == 'coa_bengkel_pemeliharaan_mr');
    const coa_gaji_tunjangan = data == null ? null : data.find(item => item.setting == 'coa_gaji_tunjangan_mr');
    const coa_salvaco = data == null ? null : data.find(item => item.setting == 'coa_salvaco_mr');
    const coa_nusakita = data == null ? null : data.find(item => item.setting == 'coa_nusakita_mr');
    const coa_inl = data == null ? null : data.find(item => item.setting == 'coa_inl_mr');
    const coa_minyakita = data == null ? null : data.find(item => item.setting == 'coa_minyakita_mr');
    const coa_bahan_kimia = data == null ? null : data.find(item => item.setting == 'coa_bahan_kimia_mr');
    const coa_pengangkutan_langsir = data == null ? null : data.find(item => item.setting == 'coa_pengangkutan_langsir_mr');
    const coa_pengepakan_lain = data == null ? null : data.find(item => item.setting == 'coa_pengepakan_lain_mr');
    const coa_asuransi_gudang_filling = data == null ? null : data.find(item => item.setting == 'coa_asuransi_gudang_filling_mr');
    const coa_depresiasi = data == null ? null : data.find(item => item.setting == 'coa_depresiasi_mr');

    const list = [
        {id:1, name:'Bahan Baku', biaya: coa_bahan_baku != null ? coa_bahan_baku.result : null, cpo_olah: coa_bahan_baku != null ? coa_bahan_baku.rp_per_kg_cpo_olah : null, items:[]},
        {id:2, name:'Gaji, Tunjangan & Biaya Sosial Karyawan Pimpinan', biaya:coa_gaji_tunjangan_sosial_pimpinan != null ? coa_gaji_tunjangan_sosial_pimpinan.result : null, cpo_olah:coa_gaji_tunjangan_sosial_pimpinan != null ? coa_gaji_tunjangan_sosial_pimpinan.rp_per_kg_cpo_olah : null, items:[]},
        {id:3, name:'Gaji, Tunjangan & Biaya Sosial Karyawan Pelaksana', biaya:coa_gaji_tunjangan_sosial_pelaksana != null ? coa_gaji_tunjangan_sosial_pelaksana.result : null, cpo_olah:coa_gaji_tunjangan_sosial_pelaksana != null ? coa_gaji_tunjangan_sosial_pelaksana.rp_per_kg_cpo_olah : null, items:[]},
        {id:4, name:'Bahan Bakar', biaya:coa_bahan_bakar != null ? coa_bahan_bakar.result : null, cpo_olah:coa_bahan_bakar != null ? coa_bahan_bakar.rp_per_kg_cpo_olah : null, items:[]},
        {id:5, name:'Bahan Kimia & Bahan Pendukung Produksi', biaya:coa_bahan_kimia_pendukung_produksi != null ? coa_bahan_kimia_pendukung_produksi.result : null, cpo_olah:coa_bahan_kimia_pendukung_produksi != null ? coa_bahan_kimia_pendukung_produksi.rp_per_kg_cpo_olah : null, items:[]},
        {id:6, name:'Biaya Analisa & Laboratorium', biaya:coa_analisa_lab != null ? coa_analisa_lab.result : null, cpo_olah:coa_analisa_lab != null ? coa_analisa_lab.rp_per_kg_cpo_olah : null, items:[]},
        {id:7, name:'Biaya Listrik', biaya:coa_listrik != null ? coa_listrik.result : null, cpo_olah:coa_listrik != null ? coa_listrik.rp_per_kg_cpo_olah : null, items:[]},
        {id:8, name:'Biaya Air', biaya:coa_air != null ? coa_air.result : null, cpo_olah:coa_air != null ? coa_air.rp_per_kg_cpo_olah : null, items:[]},
        {id:9, name:'Biaya Assuransi Pabrik', biaya:coa_asuransi_pabrik != null ? coa_asuransi_pabrik.result : null, cpo_olah:coa_asuransi_pabrik != null ? coa_asuransi_pabrik.rp_per_kg_cpo_olah : null, items:[]},
        {id:10, name:'Pengelolaan Limbah Pabrik Oleh Pihak Ketiga', biaya:coa_limbah_pihak3 != null ? coa_limbah_pihak3.result : null, cpo_olah:coa_limbah_pihak3 != null ? coa_limbah_pihak3.rp_per_kg_cpo_olah : null, items:[]},
        {id:11, name:'Biaya Bengkel & Pemeliharaan', biaya:coa_bengkel_pemeliharaan != null ? coa_bengkel_pemeliharaan.result : null, cpo_olah:coa_bengkel_pemeliharaan != null ? coa_bengkel_pemeliharaan.rp_per_kg_cpo_olah : null, items:[]},
        {id:12, name:'Biaya Pengepakan Retail :', biaya:null, cpo_olah:null, items:[]},
        {id:13, name:'- Gaji & Tunjangan', biaya:coa_gaji_tunjangan != null ? coa_gaji_tunjangan.result : null, cpo_olah:coa_gaji_tunjangan != null ? coa_gaji_tunjangan.rp_per_kg_cpo_olah : null},
        {id:14, name:'- Salvaco', biaya:coa_salvaco != null ? coa_salvaco.result : null, cpo_olah:coa_salvaco != null ? coa_salvaco.rp_per_kg_cpo_olah : null},
        {id:15, name:'- Nusakita', biaya:coa_nusakita != null ? coa_nusakita.result : null, cpo_olah:coa_nusakita != null ? coa_nusakita.rp_per_kg_cpo_olah : null},
        {id:16, name:'- INL', biaya:coa_inl != null ? coa_inl.result : null, cpo_olah:coa_inl != null ? coa_inl.rp_per_kg_cpo_olah : null},
        {id:17, name:'- Minyakita', biaya:coa_minyakita != null ? coa_minyakita.result : null, cpo_olah:coa_minyakita != null ? coa_minyakita.rp_per_kg_cpo_olah : null},
        {id:18, name:'- Bahan Kimia', biaya:coa_bahan_kimia != null ? coa_bahan_kimia.result : null, cpo_olah:coa_bahan_kimia != null ? coa_bahan_kimia.rp_per_kg_cpo_olah : null},
        {id:19, name:'- Pengangkutan / Langsir', biaya:coa_pengangkutan_langsir != null ? coa_pengangkutan_langsir.result : null, cpo_olah:coa_pengangkutan_langsir != null ? coa_pengangkutan_langsir.rp_per_kg_cpo_olah : null},
        {id:20, name:'- Bahan Pengepakan Lainnya', biaya:coa_pengepakan_lain != null ? coa_pengepakan_lain.result : null, cpo_olah:coa_pengepakan_lain != null ? coa_pengepakan_lain.rp_per_kg_cpo_olah : null},
        {id:21, name:'- Biaya Asuransi Gudang & Filling', biaya:coa_asuransi_gudang_filling != null ? coa_asuransi_gudang_filling.result : null, cpo_olah:coa_asuransi_gudang_filling != null ? coa_asuransi_gudang_filling.rp_per_kg_cpo_olah : null},
        {id:22, name:'Depresiasi', biaya:coa_depresiasi != null ? coa_depresiasi.result : null, cpo_olah:coa_depresiasi != null ? coa_depresiasi.rp_per_kg_cpo_olah : null, items:[]},
    ]
    return list;
}