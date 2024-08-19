import AllocMaster from "@/api/master/AllocMaster.js";
import {msg_success, msg_warning, msg_error} from '@/controller/dummy/func_dummy.js';

export const loadAll_AllocMaster = async() => {
    try {
        const response = await AllocMaster.getAll();
        const load = response.data;
        const data = load.allocation;
        return data;
    } catch (error) {
        return null;
    }
}

export const add_AllocMaster = async(form) => {
    try {
        const response = await AllocMaster.addAlloc(form);
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

export const update_AllocMaster = async(id,form) => {
    try {
        const response = await AllocMaster.updateAlloc(id,form);
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