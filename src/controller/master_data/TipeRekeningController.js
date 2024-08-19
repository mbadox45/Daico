import TipeRekeningMaster from '@/api/master/TipeRekeningMaster.js';
import {msg_success, msg_warning, msg_error} from '@/controller/dummy/func_dummy.js';

export const loadAll_TipeRekeningMaster = async() => {
    try {
        const response = await TipeRekeningMaster.getAll();
        const load = response.data;
        const data = load.data;
        return data;
    } catch (error) {
        return null;
    }
}

export const add_TipeRekeningMaster = async(form) => {
    try {
        const response = await TipeRekeningMaster.addPost(form);
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

export const update_TipeRekeningMaster = async(id,form) => {
    try {
        const response = await TipeRekeningMaster.updatePost(id,form);
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