import BulkyMaster from '@/api/master/BulkyMaster.js';

export const loadAll_BulkyMarketMaster = async() => {
    try {
        const response = await BulkyMaster.getAll();
        const load = response.data;
        const data = load.mBulky;
        return data;
    } catch (error) {
        return null;
    }
}

export const add_BulkyMarketMaster = async(form) => {
    try {
        const response = await BulkyMaster.addPost(form);
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

export const update_BulkyMarketMaster = async(id,form) => {
    try {
        const response = await BulkyMaster.updatePost(id,form);
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