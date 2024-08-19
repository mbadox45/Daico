import OutstandingCpo from '@/api/cpo/OutstandingCpo.js';
import ActualCpo from '@/api/cpo/ActualCpo.js';
import KpbnCpo from '@/api/cpo/KpbnCpo.js';

import {msg_success, msg_warning, msg_error} from '@/controller/dummy/func_dummy.js';


// CPO KPBN
export const loadCpoKpbnAll_CpoController = async() => {
    try {
        const response = await KpbnCpo.getAll();
        const load = response.data;
        const data = load.data;
        return data;
    } catch (error) {
        return null;
    }
}
export const loadCpoKpbnByDate_CpoController = async(tgl) => {
    try {
        const response = await KpbnCpo.getByDate({tanggal:tgl});
        const load = response.data;
        const data = load.data;
        return data;
    } catch (error) {
        return null;
    }
}
export const addCpoKpbn_CpoController = async(form) => {
    try {
        const response = await KpbnCpo.addKpbn(form);
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
export const updateCpoKpbn_CpoController = async(id,form) => {
    try {
        const response = await KpbnCpo.updateKpbn(id,form);
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

// CPO Incomming
export const loadCpoIncommingAll_CpoController = async() => {
    try {
        const response = await ActualCpo.getAll();
        const load = response.data;
        const data = load.data;
        return data;
    } catch (error) {
        return null;
    }
}
export const loadCpoIncommingByDate_CpoController = async(tgl) => {
    try {
        const response = await ActualCpo.getByDate({tanggal:tgl});
        const load = response.data;
        const data = load.data;
        return data;
    } catch (error) {
        return null;
    }
}
export const addCpoIncomming_CpoController = async(form) => {
    try {
        const response = await ActualCpo.addActual(form);
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
export const updateCpoIncomming_CpoController = async(id,form) => {
    try {
        const response = await ActualCpo.updateActual(id,form);
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

// CPO Outstanding
export const loadCpoOutstandingAll_CpoController = async() => {
    try {
        const response = await OutstandingCpo.getAll();
        const load = response.data;
        const data = load.data;
        return data;
    } catch (error) {
        return null;
    }
}
export const addCpoOutstanding_CpoController = async(form) => {
    try {
        const response = await OutstandingCpo.addOutstanding(form);
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
export const updateCpoOutstanding_CpoController = async(id,form) => {
    try {
        const response = await OutstandingCpo.updateOutstanding(id,form);
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