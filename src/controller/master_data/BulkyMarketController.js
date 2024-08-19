import BulkyMaster from '@/api/master/BulkyMaster.js';
import {msg_success, msg_warning, msg_error} from '@/controller/dummy/func_dummy.js';

export const loadAll_BulkyMarketMaster = async() => {
    try {
        const response = await BulkyMaster.getAll();
        const load = response.data;
        const data = load.mBulky;
        return data;
    } catch (error) {
        return null;
    }
}

export const add_BulkyMarketMaster = async(form) => {
    try {
        const response = await BulkyMaster.addPost(form);
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

export const update_BulkyMarketMaster = async(id,form) => {
    try {
        const response = await BulkyMaster.updatePost(id,form);
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