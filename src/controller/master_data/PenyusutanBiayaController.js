import PenyusutanBiayaMaster from '@/api/master/PenyusutanBiayaMaster.js';
import {msg_success, msg_warning, msg_error} from '@/controller/dummy/func_dummy.js';
import moment from 'moment';

export const loadLatest_PenyusutanBiayaController = async() => {
    try {
        const response = await PenyusutanBiayaMaster.getLatest()
        const load = response.data
        const data = load.data
        return data
    } catch (error) {
        return null
    }
}

export const add_PenyusutanBiayaController = async(data) => {
    try {
        const response = await PenyusutanBiayaMaster.addPost(data);
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

export const update_PenyusutanBiayaController = async(id, data) => {
    try {
        const response = await PenyusutanBiayaMaster.updatePost(id, data);
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

export const postData_PenyusutanBiayaController = async(form,tgl) => {
    let msg = {severity: '', content: ''}
    const list = []

    for (let i = 0; i < form.length; i++) {
        list.push({
            id: form[i].id,
            alokasi_id: form[i].alokasi_id,
            alokasi_name: form[i].alokasi_name,
            tanggal: tgl,
            value: form[i].value,
        })
    }

    let kondisi;
    for (let i = 0; i < list.length; i++) {
        if (list[i].value != null && list[i].tanggal != null && list[i].alokasi_id != null) {
            if (i < (list.length - 1)) {
                continue;
            }
            kondisi = true
        } else {
            msg = {severity:'warn', content:`Mohon data diisi value pada bagian ${list[i].alokasi_name}`};
            kondisi = false
            break;
        }
    }

    // Proses Post Data
    if (kondisi == true) {
        const date = moment().format('YYYY-MM-DD');
        for (let i = 0; i < list.length; i++) {
            // const verify = form.find(item => item.tanggal == list[i].tanggal)
            if (list[i].id != null) {
                await update_PenyusutanBiayaController(list[i].id, list[i])
            } else {
                list[i].tanggal = date
                await add_PenyusutanBiayaController(list[i])
            }
        }
        msg = { severity: 'success', content: 'Data berhasil di simpan' };
    }
    return msg
}