import LocationMaster from '@/api/master/LocationMaster.js';

export const loadAll_LocationMaster = async() => {
    try {
        const response = await LocationMaster.getAll();
        const load = response.data;
        const data = load.data;
        return data;
    } catch (error) {
        return null;
    }
}

export const add_LocationMaster = async(form) => {
    try {
        const response = await LocationMaster.addPost(form);
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

export const update_LocationMaster = async(id,form) => {
    try {
        const response = await LocationMaster.updatePost(id,form);
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