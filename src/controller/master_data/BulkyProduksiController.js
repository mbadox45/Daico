import BulkyProdMaster from '@/api/master/BulkyProdMaster.js';
import {msg_success, msg_warning, msg_error} from '@/controller/dummy/func_dummy.js';

export const loadAll_BulkyProduksiMaster = async() => {
    try {
        const response = await BulkyProdMaster.getAll();
        const load = response.data;
        const data = load.data;
        return data;
    } catch (error) {
        return null;
    }
}

export const add_BulkyProduksiMaster = async(form) => {
    try {
        const response = await BulkyProdMaster.addPost(form);
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

export const update_BulkyProduksiMaster = async(id,form) => {
    try {
        const response = await BulkyProdMaster.updatePost(id,form);
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