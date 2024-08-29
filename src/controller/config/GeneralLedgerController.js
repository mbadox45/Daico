import GlConfig from '@/api/configuration/GlConfig.js';
import { loadAll_CategoryManMaster } from "@/controller/master_data/CategoryManagementController.js";
import moment from 'moment';
import { formatCurrency } from "@/controller/dummy/func_dummy.js";

export const loadByDate_GeneralLedgerController = async(tgl) => {
    try {
        const response = await GlConfig.getByDate({tanggal:tgl});
        const load = response.data;
        return load;
    } catch (error) {
        return null;
    }
}

const changeCategory = async() => {
    const category = await loadAll_CategoryManMaster();
    const list = []
    if (category != null) {
        for (let i = 0; i < category.length; i++) {
            const cat2 = category[i].cat2;
            for (let j = 0; j < cat2.length; j++) {
                const cat3 = cat2[j].cat3;
                for (let k = 0; k < cat3.length; k++) {
                    list.push({
                        id3:cat3[k].id,
                        id2:cat2[j].id,
                        id1:category[i].id,
                        name3:cat3[k].nama,
                        name2:cat2[j].nama,
                        name1:category[i].nama,
                    })
                }
            }
        }
    }
    return list;
}

export const loadTable_GeneralLedgerController = async(tgl) => {
    const response = await loadByDate_GeneralLedgerController(tgl);
    const category = await changeCategory();
    const data = response == null ? null : response.data == null || response.data.length < 1 ? null : response.data
    const credit = response == null ? 0 : response.totalCredit == null ? 0 : response.totalCredit < 0 ? `Rp. (${formatCurrency(Number(response.totalCredit).toFixed(2)*-1)})` : 'Rp. '+formatCurrency(Number(response.totalCredit).toFixed(2));
    const debit = response == null ? 0 : response.totalDebit == null ? 0 : response.totalDebit < 0 ? `Rp. (${formatCurrency(Number(response.totalDebit).toFixed(2)*-1)})` : 'Rp. '+formatCurrency(Number(response.totalDebit).toFixed(2));
    const diff = response == null ? 0 : response.totalDifference == null ? 0 : response.totalDifference < 0 ? `Rp. (${formatCurrency(Number(response.totalDifference).toFixed(2)*-1)})` : 'Rp. '+formatCurrency(Number(response.totalDifference).toFixed(2));
    console.log(credit)

    const list = []
    // let credit = 0, debit = 0, diff = 0;

    // Load GL
    if (data != null) {
        for (let i = 0; i < data.length; i++) {
            const category2 = data[i].debe == null ? null :  data[i].debe.cat3 == null ? null : category.length < 1 ? null : category.find(item => item.id3 == data[i].debe.cat3.id && item.id2 == data[i].debe.cat3.id_category2)
            const jurnal = data[i].move_name == null ? null : `${data[i].move_name} ${data[i].ref == null ? null : '(' +data[i].ref +')'}`;
            const uraian = data[i].name == null ? null : data[i].name.length <= 20 ? data[i].name : `${data[i].name.substring(0, 20)} ...`;
            const ref = data[i].ref == null ? null : data[i].ref.length <= 20 ? data[i].ref.length : `${data[i].ref.substring(0, 20)}...`;
            const account = data[i].account_account == null ? null : data[i].account_account.code + ' ' + data[i].account_account.name;
            list.push({
                coa: data[i].account_account == null ? null : data[i].account_account.code == null ? null : data[i].account_account.code,
                no_transaksi: data[i].move_name,
                uraian: uraian,
                uraian2: data[i].name,
                debet: Number(data[i].debit) == 0 ? '-' : Number(data[i].debit) < 0 ? `(${formatCurrency(Number(data[i].debit).toFixed(2)*-1)})` : formatCurrency(Number(data[i].debit).toFixed(2)),
                kredit: Number(data[i].credit) == 0 ? '-' : Number(data[i].credit) < 0 ? `(${formatCurrency(Number(data[i].credit).toFixed(2)*-1)})` : formatCurrency(Number(data[i].credit).toFixed(2)),
                date: moment(data[i].date).format('DD MMM YYYY'),
                cat1: category2 == null ? '-': category2.name1,
                cat2: category2 == null ? '-': category2.name2,
                cat3: data[i].debe == null ? '-' : data[i].debe.cat3 == null ? '-' : data[i].debe.cat3.nama == null ? '-' : data[i].debe.cat3.nama,
                laporan_management: data[i].debe == null ? '-' : data[i].debe.m_report == null ? '-' : data[i].debe.m_report.nama == null ? null : data[i].debe.m_report.nama,
                cost_centre: data[i].debe == null ? '-' : data[i].debe.c_centre == null ? '-' : data[i].debe.c_centre.nama == null ? null : data[i].debe.c_centre.nama,
                plan: data[i].debe == null ? '-' : data[i].debe.plant == null ? '-' : data[i].debe.plant.nama == null ? null : data[i].debe.plant.nama,
                allocation: data[i].debe == null ? '-' : data[i].debe.allocation == null ? '-' : data[i].debe.allocation.nama == null ? null : data[i].debe.allocation.nama,
                journal: jurnal == null ? null : jurnal.length <= 20 ? jurnal : `${jurnal.substring(0, 20)}...`,
                journal2: jurnal,
                account: account == null ? null : account.length <= 20 ? account : `${account.substring(0, 20)}...`,
                account2: account,
                reference: ref,
                reference2: data[i].ref,
            })
        }
    }
    console.log(list)

    const result = {
        list: list,
        credit: credit,
        debit: debit,
        diff: diff,
    }
    return result;
}