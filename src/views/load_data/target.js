import { loadDataProd, loadDailyDmo, loadMonthlyDmo, loadMasterBulkProd, loadMasterRetailProd } from '@/views/finance/accounting/target/components/list/data/data_cost_prod.js';
import TargetReal from '@/api/target/TargetReal.js';
import TargetRkap from '@/api/target/TargetRkap.js';

export const loadMainTarget = async(tgl) => {
    const month_dmo = await loadMonthlyDmo(tgl);

    // Hasil Akhir
    const qty_penjualan = await loadQtyPenjualan(tgl);
    const dmo = await loadDmo(tgl, month_dmo);
    const cpo_olah_vs_rkap = await loadQtyProduksiRkap(tgl, month_dmo);
    const cpo_olah_vs_utility = await loadQtyProduksiUtility(tgl, month_dmo);

    return {
        qty_penjualan: qty_penjualan,
        dmo: dmo,
        cpo_olah_vs_rkap: cpo_olah_vs_rkap,
        cpo_olah_vs_utility: cpo_olah_vs_utility,
    }
}

const loadQtyPenjualan = async(tgl) => {
    const list_product = []
    const bulk_master = await loadMasterBulkProd();
    for (let i = 0; i < bulk_master.length; i++) {
        list_product.push({
            product: bulk_master[i].name,
            product_id: bulk_master[i].id,
            type: 'bulk',
            real: 0,
            rkap: 0,
            diff: 0,
        })
    }
    const retail_master = await loadMasterRetailProd();
    for (let i = 0; i < retail_master.length; i++) {
        list_product.push({
            product: retail_master[i].name,
            product_id: retail_master[i].id,
            type: 'retail',
            real: 0,
            rkap: 0,
            diff: 0,
        })
    }

    const data_target_real = await loadSumTargetReal(tgl);
    const data_target_rkap = await loadSumTargetRkap(tgl);
    if (data_target_real == null && data_target_rkap == null) {
        return list_product;
    } else {
        const list = []
        for (let i = 0; i < list_product.length; i++) {
            const real = data_target_real.find(item => item.productable == list_product[i].product && item.productable_type == list_product[i].type);
            const nilai_real = real != null ? real.totalValue : 0;
            const rkap = data_target_rkap.find(item => item.productable == list_product[i].product && item.productable_type == list_product[i].type)
            const nilai_rkap = rkap != null ? rkap.totalValue : 0;
            list[i] = {
                product: list_product[i].product,
                product_id: list_product[i].product_id,
                type: list_product[i].type,
                real: nilai_real,
                rkap: nilai_rkap,
                diff: 0,
            }
        }
        return list;
    }
}

const loadQtyProduksiRkap = async(tgl, month_dmo) => {
    const monthly = month_dmo;
    const nilai_monthly = monthly == null ? 0 : Number(monthly[0].cpo_olah_rkap);
    const real = await loadDataProd(tgl);
    if (real != null) {
        const list = real.find(item => item.name == 'Refinery')
        const items = list.items;
        let total = 0;
        for (let i = 0; i < items.length; i++) {
            if (items[i].id_uraian == 1) {
                total += Number(items[i].value);
            } else {
                continue;
            }
        }
        const data = [
            {
                name: 'CPO Olah',
                real: total,
                rkap: nilai_monthly,
                diff: total - nilai_monthly,
                real_persen: (total / nilai_monthly)*100,
                sisa_target: (total / nilai_monthly)*100 >= 100 ? 0 : (100-((total / nilai_monthly)*100)),
            }
        ]
        return data;
    } else {
        const data = [
            {
                name: 'CPO Olah',
                real: 0,
                rkap: 0,
                diff: 0,
                real_persen: 0,
                sisa_target: 0,
            }
        ]
        return data;
    }
}

const loadQtyProduksiUtility = async(tgl, month_dmo) => {
    const monthly = month_dmo;
    const nilai_monthly = monthly == null ? 0 : (Number(monthly[0].kapasitas_utility) * Number(monthly[0].pengali_kapasitas_utility));
    const real = await loadDataProd(tgl);
    if (real != null) {
        const list = real.find(item => item.name == 'Refinery')
        const items = list.items;
        let total = 0;
        for (let i = 0; i < items.length; i++) {
            if (items[i].id_uraian == 1) {
                total += Number(items[i].value);
            } else {
                continue;
            }
        }
        const data = [
            {
                name: 'CPO Olah',
                real: total,
                rkap: nilai_monthly,
                diff: total - nilai_monthly,
                real_persen: (total / nilai_monthly)*100,
                sisa_target: (total / nilai_monthly)*100 >= 100 ? 0 : (100-((total / nilai_monthly)*100)),
            }
        ]
        return data;
    } else {
        const data = [
            {
                name: 'CPO Olah',
                real: 0,
                rkap: 0,
                diff: 0,
                real_persen: 0,
                sisa_target: 0,
            }
        ]
        return data;
    }
} 

const loadDmo = async(tgl, month_dmo) => {
    const monthly = month_dmo;
    const nilai_monthly = monthly == null ? 0 : Number(monthly[0].dmo);
    const daily = await loadDailyDmo(tgl);
    const nilai_daily = daily == null ? 0 : Number(daily);
    const total_dmo = {
        real: nilai_daily,
        rkap: nilai_monthly,
        diff: (nilai_daily - nilai_monthly),
        real_persen: ((nilai_daily/nilai_monthly)*100),
        sisa_target: (nilai_daily/nilai_monthly)*100 >= 100 ? 0 : ((1-(nilai_daily/nilai_monthly))*100),
    }
    return total_dmo;
}

const loadSumTargetReal = async(tgl) => {
    const real = await loadDataTargetReal(tgl);
    let data;
    if (real == null) {
        data = null;
    } else {
        const result = real.reduce((acc, curr) => {
            const key = `${curr.productable_id}-${curr.productable_type}`;
            if (!acc[key]) {
                acc[key] = {
                    productable_id: curr.productable_id,
                    productable_type: curr.productable_type,
                    productable: curr.productable, // Storing the name for convenience
                    totalValue: 0
                };
            }
            acc[key].totalValue += parseFloat(curr.value);
            return acc;
        }, {});

        data = Object.values(result);
    }

    return data;
}

const loadSumTargetRkap = async(tgl) => {
    const real = await loadDataTargetRkap(tgl);
    let data;
    if (real == null) {
        data = null;
    } else {
        const result = real.reduce((acc, curr) => {
            const key = `${curr.productable_id}-${curr.productable_type}`;
            if (!acc[key]) {
                acc[key] = {
                    productable_id: curr.productable_id,
                    productable_type: curr.productable_type,
                    productable: curr.productable, // Storing the name for convenience
                    totalValue: 0
                };
            }
            acc[key].totalValue += parseFloat(curr.value);
            return acc;
        }, {});

        data = Object.values(result);
    }

    return data;
}

const loadDataTargetReal = async(tgl) => {
    try {
        const response = await TargetReal.getByDate({tanggal: tgl});
        const load = response.data;
        const data = load.data;
        const list = [];
        for (let a = 0; a < data.length; a++) {
            const type = data[a].productable_type.split('\\').pop();

            list[a] = {
                id:data[a].id,
                tanggal:data[a].tanggal,
                value:data[a].value,
                productable_id:data[a].productable_id,
                productable_type:type == 'MasterBulkProduksi' ? 'bulk' : 'retail',
                productable:data[a].productable != null ? data[a].productable.name : null,
            };
        }
        return list;
    } catch (error) {
        return null;
    }
}

const loadDataTargetRkap = async(tgl) => {
    try {
        const response = await TargetRkap.getByDate({tanggal: tgl});
        const load = response.data;
        const data = load.data;
        const list = [];
        for (let a = 0; a < data.length; a++) {
            const type = data[a].productable_type.split('\\').pop();

            list[a] = {
                id:data[a].id,
                tanggal:data[a].tanggal,
                value:data[a].value,
                productable_id:data[a].productable_id,
                productable_type:type == 'MasterBulkProduksi' ? 'bulk' : 'retail',
                productable:data[a].productable != null ? data[a].productable.name : null,
            };
        }
        return list;
    } catch (error) {
        return null;
    }
}