import TargetRkap from '@/api/target/TargetRkap.js';
import TargetReal from '@/api/target/TargetReal.js';
import MonthlyDmo from '@/api/target/MonthlyDmo.js';
import DailyDmo from '@/api/target/DailyDmo.js';
import {msg_success, msg_warning, msg_error} from '@/controller/dummy/func_dummy.js';

// Target RKAP
export const loadRkapByDate_TargetController = async(tgl) => {
    try {
        const response = await TargetRkap.getByDate({tanggal:tgl});
        const load = response.data;
        const data = load.data;
        return data;
    } catch (error) {
        return null;
    }
}
export const addRkap_TargetController = async(form) => {
    try {
        const response = await TargetRkap.addPost(form);
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
export const updateRkap_TargetController = async(id,form) => {
    try {
        const response = await TargetRkap.updatePost(id,form);
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

// Target Real
export const loadRealByDate_TargetController = async(tgl) => {
    try {
        const response = await TargetReal.getByDate({tanggal:tgl});
        const load = response.data;
        const data = load.data;
        return data;
    } catch (error) {
        return null;
    }
}
export const addReal_TargetController = async(form) => {
    try {
        const response = await TargetReal.addPost(form);
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
export const updateReal_TargetController = async(id,form) => {
    try {
        const response = await TargetReal.updatePost(id,form);
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

// Monthly DMO
export const loadMonthlyDmoByDate_TargetController = async(tgl) => {
    try {
        const response = await MonthlyDmo.getByDate({tanggal:tgl});
        const load = response.data;
        const data = load.data;
        return data;
    } catch (error) {
        return null;
    }
}
export const addMonthlyDmo_TargetController = async(form) => {
    try {
        const response = await MonthlyDmo.addPost(form);
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
export const updateMonthlyDmo_TargetController = async(id,form) => {
    try {
        const response = await MonthlyDmo.updatePost(id,form);
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

// Daily DMO
export const loadDailyDmoByDate_TargetController = async(tgl) => {
    try {
        const response = await DailyDmo.getByDate({tanggal:tgl});
        const load = response.data;
        const data = load.data;
        return data;
    } catch (error) {
        return null;
    }
}
export const addDailyDmo_TargetController = async(form) => {
    try {
        const response = await DailyDmo.addPost(form);
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
export const updateDailyDmo_TargetController = async(id,form) => {
    try {
        const response = await DailyDmo.updatePost(id,form);
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