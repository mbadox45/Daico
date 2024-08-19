import RetailMarketMaster from '@/api/master/RetailMarketMaster.js';
import {msg_success, msg_warning, msg_error} from '@/controller/dummy/func_dummy.js';

export const loadAll_RetailMarketMaster = async() => {
    try {
        const response = await RetailMarketMaster.getAll();
        const load = response.data;
        const data = load.data;
        return data;
    } catch (error) {
        return null;
    }
}

export const add_RetailMarketMaster = async(form) => {
    try {
        const response = await RetailMarketMaster.addPost(form);
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

export const update_RetailMarketMaster = async(id,form) => {
    try {
        const response = await RetailMarketMaster.updatePost(id,form);
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