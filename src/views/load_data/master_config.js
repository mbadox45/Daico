import CategoryProdMaster from '@/api/master/CategoryProdMaster.js';
import PlantMaster from '@/api/master/PlantMaster.js';


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