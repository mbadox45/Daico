import CategoryProdMaster from '@/api/master/CategoryProdMaster.js';
import {msg_success, msg_warning, msg_error} from '@/controller/dummy/func_dummy.js';

export const loadAll_CategoryProdMaster = async() => {
    try {
        const response = await CategoryProdMaster.getAll();
        const load = response.data;
        const data = load.data;
        return data;
    } catch (error) {
        return null;
    }
}

export const add_CategoryProdMaster = async(form) => {
    try {
        const response = await CategoryProdMaster.addPost(form);
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

export const update_CategoryProdMaster = async(id,form) => {
    try {
        const response = await CategoryProdMaster.updatePost(id,form);
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