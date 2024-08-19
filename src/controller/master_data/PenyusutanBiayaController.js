import PenyusutanBiayaMaster from '@/api/master/PenyusutanBiayaMaster.js';
import {msg_success, msg_warning, msg_error} from '@/controller/dummy/func_dummy.js';

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
