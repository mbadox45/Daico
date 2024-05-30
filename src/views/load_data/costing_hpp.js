import { loadDataProd } from '@/views/finance/accounting/target/components/list/data/data_cost_prod.js';

export const loadDataCostHpp = async(tgl) => {
    const response = await loadDataProd(tgl);
    console.log(response);
}