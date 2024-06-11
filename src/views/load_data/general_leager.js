import GlConfig from '@/api/configuration/GlConfig.js';
import SettingMaster from '@/api/master/SettingMaster.js';

export const loadGL = async(tgl) => {
    try {
        const response = await GlConfig.getByDate({tanggal:tgl})
        const load = response.data;
        const data = load.data
        return data ;
    } catch (error) {
        return null ;
    }
}

export const loadSetting = async(name) => {
    try {
        const response = await SettingMaster.getByName(name)
        const load = response.data;
        const data = load.data
        return data ;
    } catch (error) {
        return null ;
    }
}

export const totalDifference = async(datas, ket) => {
    const response = await loadSetting(ket);
    if (response != null) {
        const settingValue = response.setting_value;
        const data = settingValue.split(', ').map(item => item.trim());
        
        let debit = 0, kredit = 0;
        for (let i = 0; i < data.length; i++) {
            const coa = datas.filter(item => item.account_account.code == data[i])
            // console.log(coa)
            for (let j = 0; j < coa.length; j++) {
                debit += Number(coa[j].debit);
                kredit += Number(coa[j].credit);
            }
        }
        const total = debit - kredit
        return total;
    } else {
        return null;
    }
}