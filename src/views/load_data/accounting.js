import KursMandiri from '@/api/accounting/kurs_mandiri.js';

export const loadLatestKursMandiri = async() => {
    try {
        const response = await KursMandiri.getAll()
        const load = response.data
        const data = load.data
        return data
    } catch (error) {
        return null
    }
}

export const addKursMandiri = async(data) => {
    try {
        const response = await KursMandiri.addPost(data);
        const load = response.data;
        return {
            success: load.success,
            message: load.message
        }
    } catch (error) {
        return {
            success: error.response.data.success,
            message: error.response.data.message
        };
    }
}

export const updateKursMandiri = async(id, data) => {
    try {
        const response = await KursMandiri.updatePost(id, data);
        const load = response.data;
        return {
            success: load.success,
            message: load.message
        }
    } catch (error) {
        return {
            success: error.response.data.success,
            message: error.response.data.message
        };
    }
}
