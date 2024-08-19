import SettingMaster from '@/api/master/SettingMaster.js';
import {msg_success, msg_warning, msg_error} from '@/controller/dummy/func_dummy.js';

export const loadAll_SettingMaster = async() => {
    try {
        const response = await SettingMaster.getAll();
        const load = response.data;
        const data = load.data;
        return data;
    } catch (error) {
        return null;
    }
}

export const loadByName_SettingMaster = async(name) => {
    try {
        const response = await SettingMaster.getByName(name);
        const load = response.data;
        const data = load.data;
        return data;
    } catch (error) {
        return null;
    }
}

export const add_SettingMaster = async(form) => {
    try {
        const response = await SettingMaster.addPost(form);
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

export const update_SettingMaster = async(id,form) => {
    try {
        const response = await SettingMaster.updatePost(id,form);
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