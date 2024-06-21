import CategoryProdMaster from '@/api/master/CategoryProdMaster.js';
import PlantMaster from '@/api/master/PlantMaster.js';
import BulkyMaster from '@/api/master/BulkyMaster.js';
import ProductMaster from '@/api/master/ProductMaster.js';
import SubProductMaster from '@/api/master/SubProductMaster.js';
import TypeRekeningMaster from '@/api/master/TypeRekeningMaster.js';
import TankMaster from '@/api/master/TankMaster.js';


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