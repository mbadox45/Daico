import CostProd from '@/api/cost_prod/cost_prod.js';
import GlConfig from '@/api/configuration/GlConfig.js';
import {uraianBebanProduksi} from '@/api/DummyData.js';

export const loadDataAll = async(tgl)=> {
    const data = [];
    for (let i = 0; i < uraianBebanProduksi.length; i++) {
        data[i] = {
            uraian: uraianBebanProduksi[i].name,
            setting_name: uraianBebanProduksi[i].set_name,
            biaya_produksi: uraianBebanProduksi[i].set_name == 'coa' ? 0 : await loadCostProd(tgl, uraianBebanProduksi[i].set_name),
            cpo_olah: 0,
        }
    }
    return data;
}

const loadCostProd = async(tgl,name) => {
    try {
        const response = await CostProd.getAll({tanggal: tgl, setting_name: name});
        const load = response.data;
        const data = load.totalDifference;
        return data
    } catch (error) {
        return null;
    }
}