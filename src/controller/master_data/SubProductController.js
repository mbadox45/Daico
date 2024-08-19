import SubProductMaster from '@/api/master/SubProductMaster.js';
import {msg_success, msg_warning, msg_error} from '@/controller/dummy/func_dummy.js';

export const loadAll_SubProductMaster = async() => {
    try {
        const response = await SubProductMaster.getAll();
        const load = response.data;
        const data = load.data;
        return data;
    } catch (error) {
        return null;
    }
}

export const add_SubProductMaster = async(form) => {
    try {
        const response = await SubProductMaster.addPost(form);
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

export const update_SubProductMaster = async(id,form) => {
    try {
        const response = await SubProductMaster.updatePost(id,form);
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