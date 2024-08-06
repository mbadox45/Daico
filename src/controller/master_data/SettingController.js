import SettingMaster from '@/api/master/SettingMaster.js';

export const loadAll_SettingMaster = async() => {
    try {
        const response = await SettingMaster.getAll();
        const load = response.data;
        const data = load.data;
        return data;
    } catch (error) {
        return null;
    }
}

export const loadByName_SettingMaster = async(name) => {
    try {
        const response = await SettingMaster.getByName(name);
        const load = response.data;
        const data = load.data;
        return data;
    } catch (error) {
        return null;
    }
}

export const add_SettingMaster = async(form) => {
    try {
        const response = await SettingMaster.addPost(form);
        const load = response.data;
        if (load.success == true) {
            return {
                status: true,
                code: 200,
                msg: 'Data berhasil di Tambahkan.'
            }
        } else {
            return {
                status: false,
                code: 400,
                msg: 'Proses Gagal, silahkan dicoba beberapa saat lagi.'
            }
        }
    } catch (error) {
        return {
            status: false,
            code: 404,
            msg: 'Proses Gagal, silahkan hubungi tim IT.'
        };
    }
}

export const update_SettingMaster = async(id,form) => {
    try {
        const response = await SettingMaster.updatePost(id,form);
        const load = response.data;
        if (load.success == true) {
            return {
                status: true,
                code: 200,
                msg: 'Data berhasil di Update.'
            }
        } else {
            return {
                status: false,
                code: 400,
                msg: 'Proses Gagal, silahkan dicoba beberapa saat lagi.'
            }
        }
    } catch (error) {
        return {
            status: false,
            code: 404,
            msg: 'Proses Gagal, silahkan hubungi tim IT.'
        };
    }
}