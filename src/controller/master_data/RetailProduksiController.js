import RetailProdMaster from '@/api/master/RetailProdMaster.js';
import {msg_success, msg_warning, msg_error} from '@/controller/dummy/func_dummy.js';

export const loadAll_RetailProdMaster = async() => {
    try {
        const response = await RetailProdMaster.getAll();
        const load = response.data;
        const data = load.data;
        return data;
    } catch (error) {
        return null;
    }
}

export const add_RetailProdMaster = async(form) => {
    try {
        const response = await RetailProdMaster.addPost(form);
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

export const update_RetailProdMaster = async(id,form) => {
    try {
        const response = await RetailProdMaster.updatePost(id,form);
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