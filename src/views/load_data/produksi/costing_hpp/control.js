import { loadDataRefinery } from '@/views/load_data/produksi/costing_hpp/refinery.js'
import { loadFrakIv56 } from '@/views/load_data/produksi/costing_hpp/frak_iv56.js'
import { loadFrakIv57 } from '@/views/load_data/produksi/costing_hpp/frak_iv57.js'
import { loadFrakIv58 } from '@/views/load_data/produksi/costing_hpp/frak_iv58.js'
import { loadFrakIv60 } from '@/views/load_data/produksi/costing_hpp/frak_iv60.js'

const loadValue = async(data, ket) => {
    const value = data.find(item => item.name == ket);
    if (value != null) {
        return value.value
    } else {
        return 0
    }
}

const list = [
    {id: 1, name: 'Bahan Baku', coa: 'coa_bahan_baku'},
    {id: 2, name: 'Bahan Bakar', coa: 'coa_bahan_bakar'},
    {id: 3, name: 'Bleaching Earth (BE)', coa: 'coa_bleaching_earth'},
    {id: 4, name: 'Phosporic Acid (PA)', coa: 'coa_phosporic_acid'},
    {id: 5, name: 'Others', coa: 'coa_others'},
    {id: 6, name: 'Biaya Analisa & Laboratorium', coa: 'coa_analisa_lab'},
    {id: 7, name: 'Biaya Listrik', coa: 'coa_listrik'},
    {id: 8, name: 'Biaya Air', coa: 'coa_air'},
    {id: 9, name: 'Pengelolaan Limbah Pabrik Oleh Pihak Ketiga', coa: 'coa_limbah_pihak3'},
    {id: 10, name: 'Gaji, Tunjangan & Biaya Sosial Karyawan Pimpinan', coa: 'coa_gaji_tunjangan_sosial_pimpinan'},
    {id: 11, name: 'Gaji, Tunjangan & Biaya Sosial Karyawan Pelaksana', coa: 'coa_gaji_tunjangan_sosial_pelaksana'},
    {id: 12, name: 'Biaya Asuransi Pabrik', coa: 'coa_asuransi_pabrik'},
    {id: 13, name: 'Biaya Bengkel & Pemeliharaan', coa: 'coa_bengkel_pemeliharaan'},
    {id: 14, name: 'Depresiasi', coa: 'coa_depresiasi'},
    {id: 15, name: 'Gaji & Tunjangan', coa: 'coa_gaji_tunjangan'},
    {id: 16, name: 'Bahan Kimia', coa: 'coa_bahan_kimia'},
    {id: 17, name: 'Pengangkutan / Langsir', coa: 'coa_pengangkutan_langsir'},
    {id: 18, name: 'Bahan Pengepakan Lainnya', coa: 'coa_pengepakan_lain'},
    {id: 19, name: 'Biaya Asuransi Gudang & Filling', coa: 'coa_asuransi_gudang_filling'},
    {id: 20, name: 'Minyakita - 1L', coa: 'coa_minyakita_1L'},
    {id: 21, name: 'Minyakita - 2L', coa: 'coa_minyakita_2L'},
    {id: 22, name: 'INL - 250ml', coa: 'coa_inl_250'},
    {id: 23, name: 'INL - 450ml', coa: 'coa_inl_450'},
    {id: 24, name: 'INL - 900ml', coa: 'coa_inl_900'},
    {id: 25, name: 'INL - 1800ml', coa: 'coa_inl_1800'},
    {id: 26, name: 'Others', coa: 'coa_others'},
    {id: 27, name: 'Salvaco - 1L', coa: 'coa_salvaco_1l'},
    {id: 28, name: 'Salvaco - 2L', coa: 'coa_salvaco_2l'},
    {id: 29, name: 'Nusakita - 1L', coa: 'coa_nusakita_1l'},
    {id: 30, name: 'Nusakita - 2L', coa: 'coa_nusakita_2l'},
]

export const loadControl = async(data_produksi, data_gl) => {
    const refinery = await loadDataRefinery(data_produksi, data_gl);
    const frak_iv_56 = await loadFrakIv56(data_produksi, data_gl);
    const frak_iv_57 = await loadFrakIv57(data_produksi, data_gl);
    const frak_iv_58 = await loadFrakIv58(data_produksi, data_gl);
    const frak_iv_60 = await loadFrakIv60(data_produksi, data_gl);

    const data = list

    const items = []
    let total1 = 0, total2= 0;
    for (let i = 0; i < data.length; i++) {
        const total = Number(await loadValue(refinery.direct, data[i].name)) + Number(await loadValue(frak_iv_56.direct, data[i].name)) + Number(await loadValue(frak_iv_57.direct, data[i].name)) + Number(await loadValue(frak_iv_58.direct, data[i].name)) + Number(await loadValue(frak_iv_60.direct, data[i].name)) 
        + Number(await loadValue(refinery.in_direct, data[i].name)) + Number(await loadValue(frak_iv_56.in_direct, data[i].name)) + Number(await loadValue(frak_iv_57.in_direct, data[i].name)) + Number(await loadValue(frak_iv_58.in_direct, data[i].name)) + Number(await loadValue(frak_iv_60.in_direct, data[i].name))
        + Number(await loadValue(frak_iv_56.packaging, data[i].name)) + Number(await loadValue(frak_iv_57.packaging, data[i].name)) + Number(await loadValue(frak_iv_60.packaging, data[i].name));
        const value = data_gl.find(item => item.name == data[i].coa)
        const nilai = value == null ? 0 : value.value
        const harga = Number(total) - Number(nilai)
        items.push({
            id: data[i].id,
            name: data[i].name,
            value1: total,
            value2: nilai,
            harga: harga,
        })
        total1 += total;
        total2 += nilai;
    }

    return{
        name: 'Control',
        items: items,
        total: {
            costing: total1,
            actual: total2,
            selisih: total1 - total2
        }
    }
}