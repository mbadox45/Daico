import ReportMaster from '@/api/master/ReportMaster.js';
import {msg_success, msg_warning, msg_error} from '@/controller/dummy/func_dummy.js';

export const loadAll_MReportMaster = async() => {
    try {
        const response = await ReportMaster.getAll();
        const load = response.data;
        const data = load.mReport;
        return data;
    } catch (error) {
        return null;
    }
}

export const add_MReportMaster = async(form) => {
    try {
        const response = await ReportMaster.addPost(form);
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

export const update_MReportMaster = async(id,form) => {
    try {
        const response = await ReportMaster.updatePost(id,form);
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