import CategoryProdMaster from '@/api/master/CategoryProdMaster.js';
import PlantMaster from '@/api/master/PlantMaster.js';
import BulkyMaster from '@/api/master/BulkyMaster.js';
import ProductMaster from '@/api/master/ProductMaster.js';
import SubProductMaster from '@/api/master/SubProductMaster.js';
import TypeRekeningMaster from '@/api/master/TypeRekeningMaster.js';
import TankMaster from '@/api/master/TankMaster.js';
import LocationMaster from '@/api/master/LocationMaster.js';


export const loadCategory = async() => {
    try {
        const response = await CategoryProdMaster.getAll();
        const load = response.data;
        const data = load.data;
        return data;
    } catch (error) {
        return null;
    }
}

export const loadPlant = async() => {
    try {
        const response = await PlantMaster.getAll();
        const load = response.data;
        const data = load.Plant;
        return data;
    } catch (error) {
        return null;
    }
}

export const loadBulky = async() => {
    try {
        const list = []
        const response = await BulkyMaster.getAll()
        const load = response.data;
        const data = load.mBulky;
        for (let a = 0; a < data.length; a++) {
            list.push({
                id:data[a].id,
                name:data[a].name,
            })
        }
        return list;
    } catch (error) {
        return null;
    }
}

export const loadProduct = async() => {
    try {
        const response = await ProductMaster.getAll()
        const load = response.data;
        const data = load.data;
        return data;
    } catch (error) {
        return null;
    }
}

export const loadSubProduct = async() => {
    try {
        const response = await SubProductMaster.getAll()
        const load = response.data;
        const data = load.data;
        return data;
    } catch (error) {
        return null;
    }
}

export const loadTypeRekening = async() => {
    try {
        const response = await TypeRekeningMaster.getAll()
        const load = response.data;
        const data = load.data;
        return data;
    } catch (error) {
        return null;
    }
}

// Lokasi Master
export const loadLocation = async() => {
    try {
        const response = await LocationMaster.getAll()
        const load = response.data;
        const data = load.data;
        return data;
    } catch (error) {
        return null;
    }
}
export const addLocation = async(data) => {
    try {
        const response = await LocationMaster.addPost(data);
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

export const updateLocation = async(id, data) => {
    try {
        const response = await LocationMaster.updatePost(id, data);
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

// Tanki Master
export const loadTank = async() => {
    try {
        const response = await TankMaster.getAll()
        const load = response.data;
        const data = load.data;
        return data;
    } catch (error) {
        return null;
    }
}

export const addTank = async(data) => {
    try {
        const response = await TankMaster.addPost(data);
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

export const updateTank = async(id, data) => {
    try {
        const response = await TankMaster.updatePost(id, data);
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