import ReportMaster from '@/api/master/ReportMaster.js';

export const loadAll_MReportMaster = async() => {
    try {
        const response = await ReportMaster.getAll();
        const load = response.data;
        const data = load.mReport;
        return data;
    } catch (error) {
        return null;
    }
}

export const add_MReportMaster = async(form) => {
    try {
        const response = await ReportMaster.addPost(form);
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

export const update_MReportMaster = async(id,form) => {
    try {
        const response = await ReportMaster.updatePost(id,form);
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