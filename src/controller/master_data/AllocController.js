import AllocMaster from "@/api/master/AllocMaster.js";

export const loadAll_AllocMaster = async() => {
    try {
        const response = await AllocMaster.getAll();
        const load = response.data;
        const data = load.allocation;
        return data;
    } catch (error) {
        return null;
    }
}

export const add_AllocMaster = async(form) => {
    try {
        const response = await AllocMaster.addAlloc(form);
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

export const update_AllocMaster = async(id,form) => {
    try {
        const response = await AllocMaster.updateAlloc(id,form);
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