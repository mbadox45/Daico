import JenisRekeningMaster from '@/api/master/JenisRekeningMaster.js';
import {msg_success, msg_warning, msg_error} from '@/controller/dummy/func_dummy.js';

export const loadAll_JenisRekeningMaster = async() => {
    try {
        const response = await JenisRekeningMaster.getAll();
        const load = response.data;
        const data = load.data;
        return data;
    } catch (error) {
        return null;
    }
}

export const add_JenisRekeningMaster = async(form) => {
    try {
        const response = await JenisRekeningMaster.addPost(form);
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

export const update_JenisRekeningMaster = async(id,form) => {
    try {
        const response = await JenisRekeningMaster.updatePost(id,form);
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