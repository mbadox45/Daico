import GlConfig from '@/api/configuration/GlConfig.js';

export const loadAllByDate_GlConfigController = async(tgl) => {
    try {
        const response = await GlConfig.getByDate({tanggal:tgl});
        const load = response.data;
        // const data = load.data;
        return load;
    } catch (error) {
        return null;
    }
}

export const loadByCoa_GlConfigController = async(gl, coa) => {
    const response = gl;
    const coa_setting = coa.split(',').map(value => value.trim())

    // Calculate Processing from COA
    // if (response != null) {
    //     for (let i = 0; i < coa_setting.length; i++) {
    //         const element = array[i];
            
    //     }
    // } else {
        
    // }

    return coa_setting;
}