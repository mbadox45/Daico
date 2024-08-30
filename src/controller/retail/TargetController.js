import TargetRkap from '@/api/target/TargetRkap.js';
import TargetRekap from '@/api/target/TargetRekap.js';
import TargetReal from '@/api/target/TargetReal.js';
import MonthlyDmo from '@/api/target/MonthlyDmo.js';
import DailyDmo from '@/api/target/DailyDmo.js';
import {msg_success, msg_warning, msg_error} from '@/controller/dummy/func_dummy.js';
import { formatCurrency } from "@/controller/dummy/func_dummy.js";
import moment from 'moment';

// Rekap
export const loadRekapByDate_TargetController = async(tgl) => {
    try {
        const response = await TargetRekap.getByDate({tanggal:tgl});
        const load = response.data;
        const data = load.data;
        return data;
    } catch (error) {
        return null;
    }
}

// Target RKAP
export const loadRkapByDate_TargetController = async(tgl) => {
    try {
        const response = await TargetRkap.getByDate({tanggal:tgl});
        const load = response.data;
        const data = load.data;
        return data;
    } catch (error) {
        return null;
    }
}
export const addRkap_TargetController = async(form) => {
    try {
        const response = await TargetRkap.addPost(form);
        const load = response.data;
        if (load.success == true) {
            return msg_success;
        } else {
            return msg_warning
        }
    } catch (error) {
        return msg_error
    }
}
export const updateRkap_TargetController = async(id,form) => {
    try {
        const response = await TargetRkap.updatePost(id,form);
        const load = response.data;
        if (load.success == true) {
            return msg_success;
        } else {
            return msg_warning
        }
    } catch (error) {
        return msg_error
    }
}

// Target Real
export const loadRealByDate_TargetController = async(tgl) => {
    try {
        const response = await TargetReal.getByDate({tanggal:tgl});
        const load = response.data;
        const data = load.data;
        return data;
    } catch (error) {
        return null;
    }
}
export const addReal_TargetController = async(form) => {
    try {
        const response = await TargetReal.addPost(form);
        const load = response.data;
        if (load.success == true) {
            return msg_success;
        } else {
            return msg_warning
        }
    } catch (error) {
        return msg_error
    }
}
export const updateReal_TargetController = async(id,form) => {
    try {
        const response = await TargetReal.updatePost(id,form);
        const load = response.data;
        if (load.success == true) {
            return msg_success;
        } else {
            return msg_warning
        }
    } catch (error) {
        return msg_error
    }
}

export const postTarget_TargetController = async(form, tanggal) => {
    let msg = {severity: '', content: ''}
    const list = []
    for (let i = 0; i < form.length; i++) {
        list.push({
            id: null,
            tanggal: moment(tanggal).format('YYYY-MM-DD'),
            value: form[i].value,
            product_type: form[i].product_type,
            productable_id: form[i].productable_id,
            type: form[i].type,
        })
    }

    // Proses List
    let kondisi;
    for (let i = 0; i < list.length; i++) {
        if (list[i].value != null && list[i].product_type != null && list[i].productable_id != null) {
            if (i < (list.length - 1)) {
                continue;
            }
            kondisi = true
        } else {
            msg = {severity:'warn', content:`Mohon data diisi value pada bagian ${list[i].product_type} ${list[i].productable_id}`};
            kondisi = false
            break;
        }
    }

    // Proses Post Data
    if (kondisi == true) {
        for (let i = 0; i < list.length; i++) {
            if (list[i].type == 'real') {
                await addReal_TargetController(list[i])
            } else {
                await addRkap_TargetController(list[i])
            }
        }
        msg = { severity: 'success', content: 'Data berhasil di simpan' };
    }

    return msg
}

// Monthly DMO
export const loadMonthlyDmoByDate_TargetController = async(tgl) => {
    try {
        const response = await MonthlyDmo.getByDate({tanggal:tgl});
        const load = response.data;
        const data = load.data;
        return data;
    } catch (error) {
        return null;
    }
}
export const addMonthlyDmo_TargetController = async(form) => {
    try {
        const response = await MonthlyDmo.addPost(form);
        const load = response.data;
        if (load.success == true) {
            return msg_success;
        } else {
            return msg_warning
        }
    } catch (error) {
        return msg_error
    }
}
export const updateMonthlyDmo_TargetController = async(id,form) => {
    try {
        const response = await MonthlyDmo.updatePost(id,form);
        const load = response.data;
        if (load.success == true) {
            return msg_success;
        } else {
            return msg_warning
        }
    } catch (error) {
        return msg_error
    }
}

// Daily DMO
export const loadDailyDmoByDate_TargetController = async(tgl) => {
    try {
        const response = await DailyDmo.getByDate({tanggal:tgl});
        const load = response.data;
        const data = load.data;
        return data;
    } catch (error) {
        return null;
    }
}
export const addDailyDmo_TargetController = async(form) => {
    try {
        const response = await DailyDmo.addPost(form);
        const load = response.data;
        if (load.success == true) {
            return msg_success;
        } else {
            return msg_warning
        }
    } catch (error) {
        return msg_error
    }
}
export const updateDailyDmo_TargetController = async(id,form) => {
    try {
        const response = await DailyDmo.updatePost(id,form);
        const load = response.data;
        if (load.success == true) {
            return msg_success;
        } else {
            return msg_warning
        }
    } catch (error) {
        return msg_error
    }
}


export const reportTarget = async(tgl) => {
    const response = await loadRekapByDate_TargetController(tgl);

    const list = [];

    const qty_penjualan = []
    const qty_vs_rkap = []
    const qty_vs_utility = []
    if (response != null) {
        const target_real = response.targetReal == null ? null : response.targetReal;
        const target_rkap = response.targetRkap == null ? null : response.targetRkap;
        const difference = response.difference == null ? null : response.difference;
        const persen_target = response.percentageToTarget == null ? null : response.percentageToTarget;
        const vs_rkap = response.qtyProduksiVsRkap == null ? null : response.qtyProduksiVsRkap;
        const vs_utility = response.qtyProduksiVsUtility == null ? null : response.qtyProduksiVsUtility;

        // Proses Merger
        if (target_real != null && target_rkap != null && difference != null && persen_target != null) {
            const marge = await mergeTargets(target_real, target_rkap, difference)
            for (let i = 0; i < marge.length; i++) {
                const persen = persen_target.find(item => item.name == marge[i].name)
                qty_penjualan.push({
                    name: marge[i].name,
                    nama: marge[i].name.replace("Total ", ""),
                    persen_real: persen.real == 0 || persen.real == null ? '-' : persen.real < 0 ? `(${formatCurrency(Number(persen.real).toFixed(2)* -1)})%` : formatCurrency(Number(persen.real).toFixed(2))+'%',
                    persen_remaining: persen.remaining == 0 || persen.remaining == null ? '-' : persen.remaining < 0 ? `(${formatCurrency(Number(persen.remaining).toFixed(2)* -1)})%` : formatCurrency(Number(persen.remaining).toFixed(2))+'%',
                    total_diff: marge[i].total_diff == 0 ? '-' : marge[i].total_diff < 0 ? `(${formatCurrency(Number(marge[i].total_diff).toFixed(0)* -1)})` : formatCurrency(Number(marge[i].total_diff).toFixed(0)),
                    total_real: marge[i].total_real == 0 ? '-' : marge[i].total_real < 0 ? `(${formatCurrency(Number(marge[i].total_real).toFixed(0)* -1)})` : formatCurrency(Number(marge[i].total_real).toFixed(0)),
                    total_rkap: marge[i].total_rkap == 0 ? '-' : marge[i].total_rkap < 0 ? `(${formatCurrency(Number(marge[i].total_rkap).toFixed(0)* -1)})` : formatCurrency(Number(marge[i].total_rkap).toFixed(0)),
                    items: marge[i].items,
                })
            }
        }

        if (vs_rkap != null) {
            const value_real = vs_rkap.find(item => item.name == 'Total Real') == null ? '-' : vs_rkap.find(item => item.name == 'Total Real').value == null || vs_rkap.find(item => item.name == 'Total Real').value == 0 ? '-' : formatCurrency(Number(vs_rkap.find(item => item.name == 'Total Real').value).toFixed(0))
            const value_rkap = vs_rkap.find(item => item.name == 'Total RKAP') == null ? '-' : vs_rkap.find(item => item.name == 'Total RKAP').value == null || vs_rkap.find(item => item.name == 'Total RKAP').value == 0 ? '-' : formatCurrency(Number(vs_rkap.find(item => item.name == 'Total RKAP').value).toFixed(0))
            const value_diff = vs_rkap.find(item => item.name == 'Difference') == null ? '-' : vs_rkap.find(item => item.name == 'Difference').value == null || vs_rkap.find(item => item.name == 'Difference').value == 0 ? '-' : formatCurrency(Number(vs_rkap.find(item => item.name == 'Difference').value).toFixed(0))
            const persen = vs_rkap.find(item => item.name == 'Percentage To Target') == null ? null : vs_rkap.find(item => item.name == 'Percentage To Target')
            qty_vs_rkap.push({
                name: 'CPO Olah',
                nama: null,
                persen_real: persen == null ? '-' : persen.value == 0 ? '-' : persen.value < 0 ? `(${formatCurrency(Number(persen.value).toFixed(2)*-1)})%` : formatCurrency(Number(persen.value).toFixed(2))+'%',
                persen_remaining: persen == null ? '-' : persen.remaining == 0 ? '-' : persen.remaining < 0 ? `(${formatCurrency(Number(persen.remaining).toFixed(2)*-1)})%` : formatCurrency(Number(persen.remaining).toFixed(2))+'%',
                total_diff: value_diff,
                total_real: value_real,
                total_rkap: value_rkap,
                items: [],
            })
        }

        if (vs_utility != null) {
            const value_real = vs_utility.find(item => item.name == 'Total Real') == null ? '-' : vs_utility.find(item => item.name == 'Total Real').value == null || vs_utility.find(item => item.name == 'Total Real').value == 0 ? '-' : formatCurrency(Number(vs_utility.find(item => item.name == 'Total Real').value).toFixed(0))
            const value_rkap = vs_utility.find(item => item.name == 'Total RKAP') == null ? '-' : vs_utility.find(item => item.name == 'Total RKAP').value == null || vs_utility.find(item => item.name == 'Total RKAP').value == 0 ? '-' : formatCurrency(Number(vs_utility.find(item => item.name == 'Total RKAP').value).toFixed(0))
            const value_diff = vs_utility.find(item => item.name == 'Difference') == null ? '-' : vs_utility.find(item => item.name == 'Difference').value == null || vs_utility.find(item => item.name == 'Difference').value == 0 ? '-' : formatCurrency(Number(vs_utility.find(item => item.name == 'Difference').value).toFixed(0))
            const persen = vs_utility.find(item => item.name == 'Percentage To Target') == null ? null : vs_utility.find(item => item.name == 'Percentage To Target')
            qty_vs_utility.push({
                name: 'CPO Olah',
                nama: null,
                persen_real: persen == null ? '-' : persen.value == 0 ? '-' : persen.value < 0 ? `(${formatCurrency(Number(persen.value).toFixed(2)*-1)})%` : formatCurrency(Number(persen.value).toFixed(2))+'%',
                persen_remaining: persen == null ? '-' : persen.remaining == 0 ? '-' : persen.remaining < 0 ? `(${formatCurrency(Number(persen.remaining).toFixed(2)*-1)})%` : formatCurrency(Number(persen.remaining).toFixed(2))+'%',
                total_diff: value_diff,
                total_real: value_real,
                total_rkap: value_rkap,
                items: [],
            })
        }
    }

    // Result
    list.push({
        nama: 'Qty Penjualan',
        items: qty_penjualan
    },{
        nama: 'Qty Produksi (VS RKAP)',
        items: qty_vs_rkap
    },{
        nama: 'Qty Produksi (VS Utility)',
        items: qty_vs_utility
    })
    return list
    // return response
}

const mergeTargets = async (targetReal, targetRkap, difference) => {
    const mergedData = [];

    targetReal.forEach(realItem => {
        const correspondingRkapItem = targetRkap.find(rkapItem => rkapItem.name === realItem.name);
        const correspondingDiffItem = difference.find(diffItem => diffItem.name === realItem.name);

        const mergedItem = {
            name: realItem.name,
            total_real: realItem.total,
            total_rkap: correspondingRkapItem ? correspondingRkapItem.total : null,
            total_diff: correspondingDiffItem ? correspondingDiffItem.total : null,
            items: []
        };

        if (realItem.items) {
            mergedItem.items = realItem.items.map(realSubItem => {
                const correspondingRkapSubItem = correspondingRkapItem?.items?.find(rkapSubItem => rkapSubItem.productable_id === realSubItem.productable_id);
                const correspondingDiffSubItem = correspondingDiffItem?.items?.find(diffSubItem => diffSubItem.productable_id === realSubItem.productable_id);

                return {
                    ...realSubItem,
                    total_real: formatCurrency(Number(realSubItem.total).toFixed(0)),
                    total_rkap: correspondingRkapSubItem ? formatCurrency(Number(correspondingRkapSubItem.total).toFixed(0)) : null,
                    total_diff: correspondingDiffSubItem ? formatCurrency(Number(correspondingDiffSubItem.total).toFixed(0)) : null
                };
            });
        }

        mergedData.push(mergedItem);
    });

    targetRkap.forEach(rkapItem => {
        if (!mergedData.find(item => item.name === rkapItem.name)) {
            const correspondingDiffItem = difference.find(diffItem => diffItem.name === rkapItem.name);

            mergedData.push({
                name: rkapItem.name,
                total_real: null,
                total_rkap: rkapItem.total,
                total_diff: correspondingDiffItem ? correspondingDiffItem.total : null,
                items: rkapItem.items || []
            });
        }
    });

    difference.forEach(diffItem => {
        if (!mergedData.find(item => item.name === diffItem.name)) {
            mergedData.push({
                name: diffItem.name,
                total_real: null,
                total_rkap: null,
                total_diff: diffItem.total,
                items: diffItem.items || []
            });
        }
    });

    return mergedData;
};

const mergeArrays = async (targetReal, targetRkap, difference) => {
    const mergedArray = [];

    // Helper function to find and rename totals
    function findAndRenameTotal(array, nameKey, totalKey) {
        const found = array.find(item => item.name === nameKey);
        return found ? { [totalKey]: found.total, items: found.items || [] } : { [totalKey]: null };
    }

    // Get unique names from all arrays
    const uniqueNames = [...new Set([...targetReal, ...targetRkap, ...difference].map(item => item.name))];

    uniqueNames.forEach(name => {
        const realData = findAndRenameTotal(targetReal, name, 'total_real');
        const rkapData = findAndRenameTotal(targetRkap, name, 'total_rkap');
        const diffData = findAndRenameTotal(difference, name, 'total_diff');

        mergedArray.push({
            name: name,
            total_real: realData.total_real,
            total_rkap: rkapData.total_rkap,
            total_diff: diffData.total_diff,
            items: realData.items // You can decide how to handle items if needed
        });
    });

    return mergedArray;
}
