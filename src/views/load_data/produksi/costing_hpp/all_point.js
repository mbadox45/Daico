import { loadGL, totalDifference } from '@/views/load_data/general_leager.js'

export const CoaValue = async(data, ket) => {
    const get_value = data.find(item => item.name == ket)
    // console.log(get_value)
    if (get_value != null) {
        return get_value.value;
    } else {
        return 0;
    }
}

export const AllComponentGL = async(tgl) => {
    const data = await loadGL(tgl);

    return[
        {name: 'coa_bahan_baku', value: Number(await totalDifference(data, 'coa_bahan_baku'))},
        {name: 'coa_bahan_bakar', value: Number(await totalDifference(data, 'coa_bahan_bakar'))},
        {name: 'coa_listrik', value: Number(await totalDifference(data, 'coa_listrik'))},
        {name: 'coa_air', value: Number(await totalDifference(data, 'coa_air'))},
        {name: 'coa_analisa_lab', value: Number(await totalDifference(data, 'coa_analisa_lab'))},
        {name: 'coa_limbah_pihak3', value: Number(await totalDifference(data, 'coa_limbah_pihak3'))},
        {name: 'coa_others', value: Number(await totalDifference(data, 'coa_others'))},
        {name: 'coa_gaji_tunjangan_sosial_pimpinan', value: Number(await totalDifference(data, 'coa_gaji_tunjangan_sosial_pimpinan'))},
        {name: 'coa_gaji_tunjangan_sosial_pelaksana', value: Number(await totalDifference(data, 'coa_gaji_tunjangan_sosial_pelaksana'))},
        {name: 'coa_asuransi_pabrik', value: Number(await totalDifference(data, 'coa_asuransi_pabrik'))},
        {name: 'coa_bengkel_pemeliharaan', value: Number(await totalDifference(data, 'coa_bengkel_pemeliharaan'))},
        {name: 'coa_depresiasi', value: Number(await totalDifference(data, 'coa_depresiasi'))},
        {name: 'coa_gaji_tunjangan', value: Number(await totalDifference(data, 'coa_gaji_tunjangan'))},
        {name: 'coa_bahan_kimia', value: Number(await totalDifference(data, 'coa_bahan_kimia'))},
        {name: 'coa_pengangkutan_langsir', value: Number(await totalDifference(data, 'coa_pengangkutan_langsir'))},
        {name: 'coa_pengepakan_lain', value: Number(await totalDifference(data, 'coa_pengepakan_lain'))},
        {name: 'coa_asuransi_gudang_filling', value: Number(await totalDifference(data, 'coa_asuransi_gudang_filling'))},
        {name: 'coa_salvaco_1l', value: Number(await totalDifference(data, 'coa_salvaco_1l'))},
        {name: 'coa_salvaco_2l', value: Number(await totalDifference(data, 'coa_salvaco_2l'))},
        {name: 'coa_nusakita_1l', value: Number(await totalDifference(data, 'coa_nusakita_1l'))},
        {name: 'coa_nusakita_2l', value: Number(await totalDifference(data, 'coa_nusakita_2l'))},
        {name: 'coa_inl_250', value: Number(await totalDifference(data, 'coa_inl_250'))},
        {name: 'coa_inl_450', value: Number(await totalDifference(data, 'coa_inl_450'))},
        {name: 'coa_inl_900', value: Number(await totalDifference(data, 'coa_inl_900'))},
        {name: 'coa_inl_1800', value: Number(await totalDifference(data, 'coa_inl_1800'))},
        {name: 'coa_minyakita_1L', value: Number(await totalDifference(data, 'coa_minyakita_1L'))},
        {name: 'coa_minyakita_2L', value: Number(await totalDifference(data, 'coa_minyakita_2L'))},
        {name: 'coa_bleaching_earth', value: Number(await totalDifference(data, 'coa_bleaching_earth'))},
        {name: 'coa_phosporic_acid', value: Number(await totalDifference(data, 'coa_phosporic_acid'))},
    ]
}