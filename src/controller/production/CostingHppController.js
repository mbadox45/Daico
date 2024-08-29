import CostingHpp from '@/api/costing_hpp/CostingHpp.js';
import { formatCurrency } from "@/controller/dummy/func_dummy.js";
import { dummy } from "@/controller/production/TestDummy.js";

export const loadByDate_CostingHppController = async(post) => {
    try {
        const response = await CostingHpp.getByDate(post);
        const load = response.data;
        const data = load.data;
        return data;
    } catch (error) {
        return null;
    }
}

export const loadCostingHpp_CostingHppController = async(tgl) => {
    const response = await loadByDate_CostingHppController({tanggal:tgl});
    // const result = {};
    // return result;
    return response;
}

export const loadFrakIV57_CostingHppController = async(data) => {
    const response = data == null ? null : data['costingHppFraksinasiIv57'] == null ? null : data['costingHppFraksinasiIv57'];
    const list_direct = []
    const list_indirect = []
    const list_packaging = []
    const list_main = []
    const list_allocation = []
    const total_frak = {
        total_value: 0,
        rp_kg: 0,
    }
    const total_pack = {
        total_value: 0,
        rp_kg: 0,
    }
    // console.log(response)

    if (response != null) {
        // Main Data Table
        list_main.push(
            { 
                name: 'RBDPO Consume', 
                proportion: '', 
                proportion2: '', 
                qty: formatCurrency(Number(response.rbdpoConsume).toFixed(0)),
                rendement: ''
            },
            { 
                name: 'RBD Olein IV-57', 
                proportion: '', 
                proportion2: '', 
                qty: formatCurrency(Number(response.rbdOleinIv57Qty).toFixed(0)), 
                rendement: response.rbdOleinIv57RendementPercentage == 0 ? '' : `${formatCurrency(Number(response.rbdOleinIv57RendementPercentage).toFixed(2))}%`
            },
            { 
                name: 'RBD Stearin', 
                proportion: '', 
                proportion2: '', 
                qty: formatCurrency(Number(response.rbdStearinQty).toFixed(0)), 
                rendement: response.rbdStearinRendementPercentage == 0 ? '' : `${formatCurrency(Number(response.rbdStearinRendementPercentage).toFixed(2))}%`
            },
            { 
                name: 'INL 250ml', 
                proportion: formatCurrency(Number(response.inl250mL.proportion).toFixed(2)), 
                proportion2: formatCurrency(Number(response.inl250mL.proportionPercentage).toFixed(2)) + '%', 
                qty: formatCurrency(Number(response.inl250mL.totalQty).toFixed(0)), 
                rendement: response.inl250mL.rendementPercentage == 0 ? '' : `${formatCurrency(Number(response.inl250mL.rendementPercentage).toFixed(2))}%`
            },
            { 
                name: 'INL 450ml', 
                proportion: formatCurrency(Number(response.inl450mL.proportion).toFixed(2)), 
                proportion2: formatCurrency(Number(response.inl450mL.proportionPercentage).toFixed(2)) + '%', 
                qty: formatCurrency(Number(response.inl450mL.totalQty).toFixed(0)), 
                rendement: response.inl450mL.rendementPercentage == 0 ? '' : `${formatCurrency(Number(response.inl450mL.rendementPercentage).toFixed(2))}%`
            },
            { 
                name: 'INL 900ml', 
                proportion: formatCurrency(Number(response.inl900mL.proportion).toFixed(2)), 
                proportion2: formatCurrency(Number(response.inl900mL.proportionPercentage).toFixed(2)) + '%', 
                qty: formatCurrency(Number(response.inl900mL.totalQty).toFixed(0)), 
                rendement: response.inl900mL.rendementPercentage == 0 ? '' : `${formatCurrency(Number(response.inl900mL.rendementPercentage).toFixed(2))}%`
            },
            { 
                name: 'INL 1800ml', 
                proportion: formatCurrency(Number(response.inl1800mL.proportion).toFixed(2)), 
                proportion2: formatCurrency(Number(response.inl1800mL.proportionPercentage).toFixed(2)) + '%', 
                qty: formatCurrency(Number(response.inl1800mL.totalQty).toFixed(0)), 
                rendement: response.inl1800mL.rendementPercentage == 0 ? '' : `${formatCurrency(Number(response.inl1800mL.rendementPercentage).toFixed(2))}%`
            },
            { 
                name: 'Additional -->', 
                proportion: '', 
                proportion2: '', 
                qty: formatCurrency(Number(response.additional).toFixed(0)), 
                rendement: ''
            },
        );

        // Direct Cost Data table
        const direct = response.dataDirect == null ? null : response.dataDirect.cost == null ? null : response.dataDirect.cost;
        const ref = direct == null ? null : direct.find(item => item.name == 'Fraksinasi IV-57') == null ? null : direct.find(item => item.name == 'Fraksinasi IV-57')
        const item_direct = ref == null ? null : ref.item == null || ref.item.length < 1 ? null : ref.item;
        if (item_direct != null) {
            for (let i = 0; i < item_direct.length; i++) {
                list_direct.push({
                    name: item_direct[i].name,
                    proportion: formatCurrency(Number(item_direct[i].proportion).toFixed(2))+'%',
                    proportion2: item_direct[i].proportion2 == null ? null : item_direct[i].proportion2 == 0 ? null : item_direct[i].proportion2 == 1 ? null : formatCurrency(Number(item_direct[i].proportion2).toFixed(2))+'%',
                    value: item_direct[i].value,
                    total_value: formatCurrency(Number(item_direct[i].totalValue).toFixed(0)),
                    rp_kg: formatCurrency(Number(item_direct[i].rpPerKg).toFixed(2)),
                })
            }
        }

        // In Direct Cost Data table
        const indirect = response.dataInDirect == null ? null : response.dataInDirect.cost == null ? null : response.dataInDirect.cost;
        const ref_in = indirect == null ? null : indirect.find(item => item.name == 'Fraksinasi IV-57') == null ? null : indirect.find(item => item.name == 'Fraksinasi IV-57')
        const item_indirect = ref_in == null ? null : ref_in.item == null || ref_in.item.length < 1 ? null : ref_in.item;
        if (item_indirect != null) {
            for (let i = 0; i < item_indirect.length; i++) {
                list_indirect.push({
                    name: item_indirect[i].name,
                    proportion: formatCurrency(Number(item_indirect[i].proportion).toFixed(2))+'%',
                    proportion2: item_indirect[i].proportion2 == null ? null : item_indirect[i].proportion2 == 0 ? null : item_indirect[i].proportion2 == 1 ? null : formatCurrency(Number(item_indirect[i].proportion2).toFixed(2))+'%',
                    value: item_indirect[i].value,
                    total_value: formatCurrency(Number(item_indirect[i].totalValue).toFixed(0)),
                    rp_kg: formatCurrency(Number(item_indirect[i].rpPerKg).toFixed(2)),
                })
            }
        }

        // Packaging Cost Data table
        const packaging = response.dataPackaging == null ? null : response.dataPackaging.cost == null ? null : response.dataPackaging.cost;
        const pack = packaging == null ? null : packaging.find(item => item.name == 'Fraksinasi IV-57') == null ? null : packaging.find(item => item.name == 'Fraksinasi IV-57')
        const item_pack = pack == null ? null : pack.item == null || pack.item.length < 1 ? null : pack.item;
        if (item_pack != null) {
            for (let i = 0; i < item_pack.length; i++) {
                list_packaging.push({
                    name: item_pack[i].name,
                    proportion: formatCurrency(Number(item_pack[i].proportion).toFixed(2))+'%',
                    proportion2: item_pack[i].proportion2 == null ? null : item_pack[i].proportion2 == 0 ? null : item_pack[i].proportion2 == 1 ? null : formatCurrency(Number(item_pack[i].proportion2).toFixed(2))+'%',
                    value: item_pack[i].value,
                    total_value: formatCurrency(Number(item_pack[i].totalValue).toFixed(0)),
                    rp_kg: formatCurrency(Number(item_pack[i].rpPerKg).toFixed(2)),
                })
            }
        }

        // Total
        total_frak.total_value = response.totalCostFraksinasiIv57 == null ? 0 : formatCurrency(Number(response.totalCostFraksinasiIv57).toFixed(0)),
        total_frak.rp_kg = response.totalRpPerKgFraksinasiIv57 == null ? 0 : formatCurrency(Number(response.totalRpPerKgFraksinasiIv57).toFixed(2));
        total_pack.total_value = response.totalCostFraksinasiIv57PlusPackaging == null ? 0 : formatCurrency(Number(response.totalCostFraksinasiIv57PlusPackaging).toFixed(0)),
        total_pack.rp_kg = response.totalRpPerKgFraksinasiIv57PlusPackaging == null ? 0 : formatCurrency(Number(response.totalRpPerKgFraksinasiIv57PlusPackaging).toFixed(2));

        // Allocation Cost Data table
        const alloc = response.allocationCostFraksinasiIv57 == null ? null : response.allocationCostFraksinasiIv57;
        if (alloc != null) {
            for (let i = 0; i < alloc.length; i++) {
                const nama = alloc[i].name == 'palingBawah' ? '-' : alloc[i].name
                list_allocation.push({
                    name: nama,
                    proportion: alloc[i].proportion == null ? null : alloc[i].proportion == 0 ? null : formatCurrency(Number(alloc[i].proportion).toFixed(2))+'%',
                    total_value: alloc[i].totalValue == null ? null : alloc[i].totalValue == 0 ? null : alloc[i].totalValue < 1 ? `(${formatCurrency(Number(alloc[i].totalValue).toFixed(2) * -1)})` : formatCurrency(Number(alloc[i].totalValue).toFixed(2)),
                    rp_kg: alloc[i].rpPerKg == null ? null : alloc[i].rpPerKg == 0 ? null : alloc[i].rpPerKg < 1 ? `(${(formatCurrency(Number(alloc[i].rpPerKg).toFixed(2) * -1))})` : formatCurrency(Number(alloc[i].rpPerKg).toFixed(2)),
                })
            }
        }
    }

    const result = {
        main: list_main,
        direct: list_direct,
        indirect: list_indirect,
        packaging: list_packaging,
        total_frak: total_frak,
        total_pack: total_pack,
        allocation: list_allocation,
    }
    return result;
}

export const loadControl_CostingHppController = async(data) => {
    const response = data == null ? null : data['costingHppControll'] == null ? null : data['costingHppControll'];
    const list_control = []
    const total = {
        total_value: 0,
        rp_kg: 0,
    }

    if (response != null) {
        // Main Data Table
        const details = response.details == null || response.details.length < 1 ? null : response.details;
        if (details != null) {
            for (let i = 0; i < details.length; i++) {
                list_control.push({
                    name: details[i].name,
                    costing: details[i].qty == 0 ? '': details[i].qty < 0 ? `(${formatCurrency(Number(details[i].qty).toFixed(2) * -1)})`: formatCurrency(Number(details[i].qty).toFixed(2)),
                    actual: details[i].costProd == 0 ? '': details[i].costProd < 0 ? `(${formatCurrency(Number(details[i].costProd).toFixed(2) * -1)})`: formatCurrency(Number(details[i].costProd).toFixed(2)),
                    selisih: details[i].selisih == 0 ? '': details[i].selisih < 0 ? `(${formatCurrency(Number(details[i].selisih).toFixed(2) * -1)})`: formatCurrency(Number(details[i].selisih).toFixed(2)),
                })
            }
        }

        const total_control = response.totals == null ? null : response.totals

        // Total
        total.costing = total_control == null ? null : total_control.totalQty == 0 ? null: total_control.totalQty < 0 ? `(${formatCurrency(Number(total_control.totalQty).toFixed(2) * -1)})`: formatCurrency(Number(total_control.totalQty).toFixed(2));
        total.actual = total_control == null ? null : total_control.totalCostProd == 0 ? null: total_control.totalCostProd < 0 ? `(${formatCurrency(Number(total_control.totalCostProd).toFixed(2) * -1)})`: formatCurrency(Number(total_control.totalCostProd).toFixed(2));
        total.selisih = total_control == null ? null : total_control.totalSelisih == 0 ? null: total_control.totalSelisih < 0 ? `(${formatCurrency(Number(total_control.totalSelisih).toFixed(2) * -1)})`: formatCurrency(Number(total_control.totalSelisih).toFixed(2));
    }

    const result = {
        control: list_control,
        total: total
    }
    return result;
}

export const loadFrakIV60_CostingHppController = async(data) => {
    // const response = data == null ? null : data.costingHppFraksinasiIv56 == null ? null : data.costingHppFraksinasiIv56;
    const response = data == null ? null : data['costingHppFraksinasiIv60'] == null ? null : data['costingHppFraksinasiIv60'];
    const stearin = data == null ? null : data['rbdStearinTotal'] == null ? null : data['rbdStearinTotal'];
    const list_direct = []
    const list_indirect = []
    const list_packaging = []
    const list_main = []
    const list_allocation = []
    const total_frak = {
        total_value: 0,
        rp_kg: 0,
    }
    const total_pack = {
        total_value: 0,
        rp_kg: 0,
    }
    // console.log(response)

    if (response != null) {
        // Main Data Table
        list_main.push(
            { 
                name: 'RBDPO Consume', 
                proportion: '', 
                proportion2: '', 
                qty: formatCurrency(Number(response.rbdpoConsume).toFixed(0)),
                rendement: ''
            },
            { 
                name: 'RBD Olein IV-60', 
                proportion: '', 
                proportion2: '', 
                qty: formatCurrency(Number(response.rbdOleinIv60Qty).toFixed(0)), 
                rendement: response.rbdOleinIv60RendementPercentage == 0 ? '' : `${formatCurrency(Number(response.rbdOleinIv60RendementPercentage).toFixed(2))}%`
            },
            { 
                name: 'RBD Stearin', 
                proportion: '', 
                proportion2: '', 
                qty: formatCurrency(Number(response.rbdStearinQty).toFixed(0)), 
                rendement: response.rbdStearinRendementPercentage == 0 ? '' : `${formatCurrency(Number(response.rbdStearinRendementPercentage).toFixed(2))}%`
            },
            { 
                name: 'Salvaco 1 Liter', 
                proportion: formatCurrency(Number(response.salvaco1L.proportion).toFixed(2)), 
                proportion2: formatCurrency(Number(response.salvaco1L.proportionPercentage).toFixed(2)) + '%', 
                qty: formatCurrency(Number(response.salvaco1L.totalQty).toFixed(0)), 
                rendement: response.salvaco1L.rendementPercentage == 0 ? '' : `${formatCurrency(Number(response.salvaco1L.rendementPercentage).toFixed(2))}%`
            },
            { 
                name: 'Salvaco 2 Liter', 
                proportion: formatCurrency(Number(response.salvaco2L.proportion).toFixed(2)), 
                proportion2: formatCurrency(Number(response.salvaco2L.proportionPercentage).toFixed(2)) + '%', 
                qty: formatCurrency(Number(response.salvaco2L.totalQty).toFixed(0)), 
                rendement: response.salvaco2L.rendementPercentage == 0 ? '' : `${formatCurrency(Number(response.salvaco2L.rendementPercentage).toFixed(2))}%`
            },
            { 
                name: 'Nusakita 1 Liter', 
                proportion: formatCurrency(Number(response.nusakita1L.proportion).toFixed(2)), 
                proportion2: formatCurrency(Number(response.nusakita1L.proportionPercentage).toFixed(2)) + '%', 
                qty: formatCurrency(Number(response.nusakita1L.totalQty).toFixed(0)), 
                rendement: response.nusakita1L.rendementPercentage == 0 ? '' : `${formatCurrency(Number(response.nusakita1L.rendementPercentage).toFixed(2))}%`
            },
            { 
                name: 'Nusakita 2 Liter', 
                proportion: formatCurrency(Number(response.nusakita2L.proportion).toFixed(2)), 
                proportion2: formatCurrency(Number(response.nusakita2L.proportionPercentage).toFixed(2)) + '%', 
                qty: formatCurrency(Number(response.nusakita2L.totalQty).toFixed(0)), 
                rendement: response.nusakita2L.rendementPercentage == 0 ? '' : `${formatCurrency(Number(response.nusakita2L.rendementPercentage).toFixed(2))}%`
            },
            { 
                name: 'Additional (Salvaco)', 
                proportion: '', 
                proportion2: '', 
                qty: formatCurrency(Number(response.additionalSalvaco).toFixed(0)), 
                rendement: ''
            },
            { 
                name: 'Additional (Nusakita)', 
                proportion: '', 
                proportion2: '', 
                qty: formatCurrency(Number(response.additionalNusakita).toFixed(0)), 
                rendement: ''
            },
        );

        // Direct Cost Data table
        const direct = response.dataDirect == null ? null : response.dataDirect.cost == null ? null : response.dataDirect.cost;
        const ref = direct == null ? null : direct.find(item => item.nama == 'Fraksinasi IV-60') == null ? null : direct.find(item => item.nama == 'Fraksinasi IV-60')
        const item_direct = ref == null ? null : ref.item == null || ref.item.length < 1 ? null : ref.item;
        if (item_direct != null) {
            for (let i = 0; i < item_direct.length; i++) {
                list_direct.push({
                    name: item_direct[i].name,
                    proportion: formatCurrency(Number(item_direct[i].proportion).toFixed(2))+'%',
                    proportion2: item_direct[i].proportion2 == null ? null : item_direct[i].proportion2 == 0 ? null : item_direct[i].proportion2 == 1 ? null : formatCurrency(Number(item_direct[i].proportion2).toFixed(2))+'%',
                    value: item_direct[i].value,
                    total_value: formatCurrency(Number(item_direct[i].totalValue).toFixed(0)),
                    rp_kg: formatCurrency(Number(item_direct[i].rpPerKg).toFixed(2)),
                })
            }
        }

        // In Direct Cost Data table
        const indirect = response.dataInDirect == null ? null : response.dataInDirect.cost == null ? null : response.dataInDirect.cost;
        const ref_in = indirect == null ? null : indirect.find(item => item.nama == 'Fraksinasi IV-60') == null ? null : indirect.find(item => item.nama == 'Fraksinasi IV-60')
        const item_indirect = ref_in == null ? null : ref_in.item == null || ref_in.item.length < 1 ? null : ref_in.item;
        if (item_indirect != null) {
            for (let i = 0; i < item_indirect.length; i++) {
                list_indirect.push({
                    name: item_indirect[i].name,
                    proportion: formatCurrency(Number(item_indirect[i].proportion).toFixed(2))+'%',
                    proportion2: item_indirect[i].proportion2 == null ? null : item_indirect[i].proportion2 == 0 ? null : item_indirect[i].proportion2 == 1 ? null : formatCurrency(Number(item_indirect[i].proportion2).toFixed(2))+'%',
                    value: item_indirect[i].value,
                    total_value: formatCurrency(Number(item_indirect[i].totalValue).toFixed(0)),
                    rp_kg: formatCurrency(Number(item_indirect[i].rpPerKg).toFixed(2)),
                })
            }
        }

        // Packaging Cost Data table
        const packaging = response.dataPackaging == null ? null : response.dataPackaging.cost == null ? null : response.dataPackaging.cost;
        const pack = packaging == null ? null : packaging.find(item => item.nama == 'Fraksinasi IV-60') == null ? null : packaging.find(item => item.nama == 'Fraksinasi IV-60')
        const item_pack = pack == null ? null : pack.item == null || pack.item.length < 1 ? null : pack.item;
        if (item_pack != null) {
            for (let i = 0; i < item_pack.length; i++) {
                list_packaging.push({
                    name: item_pack[i].name,
                    proportion: formatCurrency(Number(item_pack[i].proportion).toFixed(2))+'%',
                    proportion2: item_pack[i].proportion2 == null ? null : item_pack[i].proportion2 == 0 ? null : item_pack[i].proportion2 == 1 ? null : formatCurrency(Number(item_pack[i].proportion2).toFixed(2))+'%',
                    value: item_pack[i].value,
                    total_value: formatCurrency(Number(item_pack[i].totalValue).toFixed(0)),
                    rp_kg: formatCurrency(Number(item_pack[i].rpPerKg).toFixed(2)),
                })
            }
        }

        // Total
        total_frak.total_value = response.totalCostFraksinasiIv60 == null ? 0 : formatCurrency(Number(response.totalCostFraksinasiIv60).toFixed(0)),
        total_frak.rp_kg = response.totalRpPerKgFraksinasiIv60 == null ? 0 : formatCurrency(Number(response.totalRpPerKgFraksinasiIv60).toFixed(2));
        total_pack.total_value = response.totalCostFraksinasiIv60PlusPackaging == null ? 0 : formatCurrency(Number(response.totalCostFraksinasiIv60PlusPackaging).toFixed(0)),
        total_pack.rp_kg = response.totalRpPerKgFraksinasiIv60PlusPackaging == null ? 0 : formatCurrency(Number(response.totalRpPerKgFraksinasiIv60PlusPackaging).toFixed(2));

        // Allocation Cost Data table
        const alloc = response.allocationCostFraksinasiIv60 == null ? null : response.allocationCostFraksinasiIv60;
        if (alloc != null) {
            for (let i = 0; i < alloc.length; i++) {
                const nama = alloc[i].nama == 'palingBawah' ? '-' : alloc[i].nama
                list_allocation.push({
                    name: nama,
                    proportion: alloc[i].proportion == null ? null : formatCurrency(Number(alloc[i].proportion).toFixed(2))+'%',
                    total_value: formatCurrency(Number(alloc[i].totalValue).toFixed(0)),
                    rp_kg: alloc[i].rpPerKg == null ? null : formatCurrency(Number(alloc[i].rpPerKg).toFixed(2)),
                })
            }
        }
    }

    const result = {
        main: list_main,
        direct: list_direct,
        indirect: list_indirect,
        packaging: list_packaging,
        total_frak: total_frak,
        total_pack: total_pack,
        allocation: list_allocation,
        stearin: stearin == null ? { nama: "RBD Stearin Total", total_value: null, rp_kg: null } : { nama: "RBD Stearin Total", total_value: formatCurrency(Number(stearin.totalValue).toFixed(0)), rp_kg: formatCurrency(Number(stearin.RpPerKg).toFixed(2)) }
    }
    return result;
}

export const loadFrakIV58_CostingHppController = async(data) => {
    // const response = data == null ? null : data.costingHppFraksinasiIv56 == null ? null : data.costingHppFraksinasiIv56;
    const response = data == null ? null : data['costingHppFraksinasiIv58'] == null ? null : data['costingHppFraksinasiIv58'];
    const list_direct = []
    const list_indirect = []
    const list_packaging = []
    const list_main = []
    const list_allocation = []
    const total_frak = {
        total_value: 0,
        rp_kg: 0,
    }
    // console.log(response)

    if (response != null) {
        // Main Data Table
        list_main.push(
            { 
                name: 'RBDPO Consume', 
                proportion: '', 
                proportion2: '', 
                qty: formatCurrency(Number(response.rbdpoConsume).toFixed(0)),
                rendement: ''
            },
            { 
                name: 'RBD Olein IV-58', 
                proportion: '', 
                proportion2: '', 
                qty: formatCurrency(Number(response.rbdOleinIv58Qty).toFixed(0)), 
                rendement: response.rbdOleinIv58RendementPercentage == 0 ? '' : `${formatCurrency(Number(response.rbdOleinIv58RendementPercentage).toFixed(2))}%`
            },
            { 
                name: 'RBD Stearin', 
                proportion: '', 
                proportion2: '', 
                qty: formatCurrency(Number(response.rbdStearinQty).toFixed(0)), 
                rendement: response.rbdStearinRendementPercentage == 0 ? '' : `${formatCurrency(Number(response.rbdStearinRendementPercentage).toFixed(2))}%`
            },
        );

        // Direct Cost Data table
        const direct = response.dataDirect == null ? null : response.dataDirect.cost == null ? null : response.dataDirect.cost;
        const ref = direct == null ? null : direct.find(item => item.nama == 'Fraksinasi IV-58') == null ? null : direct.find(item => item.nama == 'Fraksinasi IV-58')
        const item_direct = ref == null ? null : ref.item == null || ref.item.length < 1 ? null : ref.item;
        if (item_direct != null) {
            for (let i = 0; i < item_direct.length; i++) {
                list_direct.push({
                    name: item_direct[i].name,
                    proportion: formatCurrency(Number(item_direct[i].proportion).toFixed(2))+'%',
                    proportion2: item_direct[i].proportion2 == null ? null : formatCurrency(Number(item_direct[i].proportion2).toFixed(2))+'%',
                    value: item_direct[i].value,
                    total_value: formatCurrency(Number(item_direct[i].totalValue).toFixed(0)),
                    rp_kg: formatCurrency(Number(item_direct[i].rpPerKg).toFixed(2)),
                })
            }
        }

        // In Direct Cost Data table
        const indirect = response.dataInDirect == null ? null : response.dataInDirect.cost == null ? null : response.dataInDirect.cost;
        const ref_in = indirect == null ? null : indirect.find(item => item.nama == 'Fraksinasi IV-58') == null ? null : indirect.find(item => item.nama == 'Fraksinasi IV-58')
        const item_indirect = ref_in == null ? null : ref_in.item == null || ref_in.item.length < 1 ? null : ref_in.item;
        if (item_indirect != null) {
            for (let i = 0; i < item_indirect.length; i++) {
                list_indirect.push({
                    name: item_indirect[i].name,
                    proportion: formatCurrency(Number(item_indirect[i].proportion).toFixed(2))+'%',
                    proportion2: formatCurrency(Number(item_indirect[i].proportion2).toFixed(2))+'%',
                    value: item_indirect[i].value,
                    total_value: formatCurrency(Number(item_indirect[i].totalValue).toFixed(0)),
                    rp_kg: formatCurrency(Number(item_indirect[i].rpPerKg).toFixed(2)),
                })
            }
        }

        // Packaging Cost Data table
        const packaging = response.dataPackaging == null ? null : response.dataPackaging.cost == null ? null : response.dataPackaging.cost;
        const pack = packaging == null ? null : packaging.find(item => item.nama == 'Fraksinasi IV-58') == null ? null : packaging.find(item => item.nama == 'Fraksinasi IV-58')
        const item_pack = pack == null ? null : pack.item == null || pack.item.length < 1 ? null : pack.item;
        if (item_pack != null) {
            for (let i = 0; i < item_pack.length; i++) {
                list_packaging.push({
                    name: item_pack[i].name,
                    proportion: formatCurrency(Number(item_pack[i].proportion).toFixed(2))+'%',
                    proportion2: formatCurrency(Number(item_pack[i].proportion2).toFixed(2))+'%',
                    value: item_pack[i].value,
                    total_value: formatCurrency(Number(item_pack[i].totalValue).toFixed(0)),
                    rp_kg: formatCurrency(Number(item_pack[i].rpPerKg).toFixed(2)),
                })
            }
        }

        // Total
        total_frak.total_value = response.totalCostFraksinasiIv58 == null ? 0 : formatCurrency(Number(response.totalCostFraksinasiIv58).toFixed(0)),
        total_frak.rp_kg = response.totalRpPerKgFraksinasiIv58 == null ? 0 : formatCurrency(Number(response.totalRpPerKgFraksinasiIv58).toFixed(2));

        // Allocation Cost Data table
        const alloc = response.allocationCostFraksinasiIv58 == null ? null : response.allocationCostFraksinasiIv58;
        if (alloc != null) {
            for (let i = 0; i < alloc.length; i++) {
                const nama = alloc[i].nama == 'palingBawah' ? '-' : alloc[i].nama
                list_allocation.push({
                    name: nama,
                    proportion: alloc[i].proportion == null ? null : formatCurrency(Number(alloc[i].proportion).toFixed(2))+'%',
                    total_value: formatCurrency(Number(alloc[i].totalValue).toFixed(0)),
                    rp_kg: alloc[i].rpPerKg == null ? null : formatCurrency(Number(alloc[i].rpPerKg).toFixed(2)),
                })
            }
        }
    }

    const result = {
        main: list_main,
        direct: list_direct,
        indirect: list_indirect,
        packaging: list_packaging,
        total_frak: total_frak,
        allocation: list_allocation,
    }
    return result;
}

export const loadFrakIV56_CostingHppController = async(data) => {
    // const response = data == null ? null : data.costingHppFraksinasiIv56 == null ? null : data.costingHppFraksinasiIv56;
    const response = data == null ? null : data['costingHppFraksinasiIv56'] == null ? null : data['costingHppFraksinasiIv56'];
    const list_direct = []
    const list_indirect = []
    const list_packaging = []
    const list_main = []
    const list_allocation = []
    const total_frak = {
        total_value: 0,
        rp_kg: 0,
    }
    const total_pack = {
        total_value: 0,
        rp_kg: 0,
    }
    // console.log(response)

    if (response != null) {
        // Main Data Table
        list_main.push(
            { 
                name: 'RBDPO Consume', 
                proportion: '', 
                proportion2: '', 
                qty: formatCurrency(Number(response.rbdpoConsume).toFixed(0)),
                rendement: ''
            },
            { 
                name: 'RBD Olein IV-56', 
                proportion: '', 
                proportion2: '', 
                qty: formatCurrency(Number(response.rbdOleinIv56Qty).toFixed(0)), 
                rendement: response.rbdOleinIv56RendementPercentage == 0 ? '' : `${formatCurrency(Number(response.rbdOleinIv56RendementPercentage).toFixed(2))}%`
            },
            { 
                name: 'RBD Stearin', 
                proportion: '', 
                proportion2: '', 
                qty: formatCurrency(Number(response.rbdStearinQty).toFixed(0)), 
                rendement: response.rbdStearinRendementPercentage == 0 ? '' : `${formatCurrency(Number(response.rbdStearinRendementPercentage).toFixed(2))}%`
            },
            { 
                name: 'Minyakita 1 Liter', 
                proportion: formatCurrency(Number(response.minyakita1Liter.proportion).toFixed(2)), 
                proportion2: formatCurrency(Number(response.minyakita1Liter.proportionPercentage).toFixed(2))+'%', 
                qty: formatCurrency(Number(response.minyakita1Liter.totalQty).toFixed(0)), 
                rendement: response.minyakita1Liter.rendementPercentage == 0 ? '' : `${formatCurrency(Number(response.minyakita1Liter.rendementPercentage).toFixed(2))}%`
            },
            { 
                name: 'Minyakita 2 Liter', 
                proportion: formatCurrency(Number(response.minyakita2Liter.proportion).toFixed(2)), 
                proportion2: formatCurrency(Number(response.minyakita2Liter.proportionPercentage).toFixed(2))+'%', 
                qty: formatCurrency(Number(response.minyakita2Liter.totalQty).toFixed(0)), 
                rendement: response.minyakita2Liter.rendementPercentage == 0 ? '' : `${formatCurrency(Number(response.minyakita2Liter.rendementPercentage).toFixed(2))}%`
            },
            { 
                name: 'Additional -->', 
                proportion: '', 
                proportion2: '', 
                qty: formatCurrency(Number(response.additional).toFixed(0)), 
                rendement: ''
            },
        );

        // Direct Cost Data table
        const direct = response.dataDirect == null ? null : response.dataDirect.cost == null ? null : response.dataDirect.cost;
        const ref = direct == null ? null : direct.find(item => item.nama == 'Fraksinasi IV-56') == null ? null : direct.find(item => item.nama == 'Fraksinasi IV-56')
        const item_direct = ref == null ? null : ref.item == null || ref.item.length < 1 ? null : ref.item;
        if (item_direct != null) {
            for (let i = 0; i < item_direct.length; i++) {
                list_direct.push({
                    name: item_direct[i].name,
                    proportion: formatCurrency(Number(item_direct[i].proportion).toFixed(2))+'%',
                    proportion2: item_direct[i].proportion2 == null ? null : item_direct[i].proportion2 == 0 ? null : item_direct[i].proportion2 == 1 ? null : formatCurrency(Number(item_direct[i].proportion2).toFixed(2))+'%',
                    value: item_direct[i].value,
                    total_value: formatCurrency(Number(item_direct[i].totalValue).toFixed(0)),
                    rp_kg: formatCurrency(Number(item_direct[i].rpPerKg).toFixed(2)),
                })
            }
        }

        // In Direct Cost Data table
        const indirect = response.dataInDirect == null ? null : response.dataInDirect.cost == null ? null : response.dataInDirect.cost;
        const ref_in = indirect == null ? null : indirect.find(item => item.nama == 'Fraksinasi IV-56') == null ? null : indirect.find(item => item.nama == 'Fraksinasi IV-56')
        const item_indirect = ref_in == null ? null : ref_in.item == null || ref_in.item.length < 1 ? null : ref_in.item;
        if (item_indirect != null) {
            for (let i = 0; i < item_indirect.length; i++) {
                list_indirect.push({
                    name: item_indirect[i].name,
                    proportion: formatCurrency(Number(item_indirect[i].proportion).toFixed(2))+'%',
                    proportion2: item_indirect[i].proportion2 == null ? null : item_indirect[i].proportion2 == 0 ? null : item_indirect[i].proportion2 == 1 ? null : formatCurrency(Number(item_indirect[i].proportion2).toFixed(2))+'%',
                    value: item_indirect[i].value,
                    total_value: formatCurrency(Number(item_indirect[i].totalValue).toFixed(0)),
                    rp_kg: formatCurrency(Number(item_indirect[i].rpPerKg).toFixed(2)),
                })
            }
        }

        // Packaging Cost Data table
        const packaging = response.dataPackaging == null ? null : response.dataPackaging.cost == null ? null : response.dataPackaging.cost;
        const pack = packaging == null ? null : packaging.find(item => item.nama == 'Fraksinasi IV-56') == null ? null : packaging.find(item => item.nama == 'Fraksinasi IV-56')
        const item_pack = pack == null ? null : pack.item == null || pack.item.length < 1 ? null : pack.item;
        if (item_pack != null) {
            for (let i = 0; i < item_pack.length; i++) {
                list_packaging.push({
                    name: item_pack[i].name,
                    proportion: formatCurrency(Number(item_pack[i].proportion).toFixed(2))+'%',
                    proportion2: item_pack[i].proportion2 == null ? null : item_pack[i].proportion2 == 0 ? null : item_pack[i].proportion2 == 1 ? null : formatCurrency(Number(item_pack[i].proportion2).toFixed(2))+'%',
                    value: item_pack[i].value,
                    total_value: formatCurrency(Number(item_pack[i].totalValue).toFixed(0)),
                    rp_kg: formatCurrency(Number(item_pack[i].rpPerKg).toFixed(2)),
                })
            }
        }

        // Total
        total_frak.total_value = response.totalCostFraksinasiIv56 == null ? 0 : formatCurrency(Number(response.totalCostFraksinasiIv56).toFixed(0)),
        total_frak.rp_kg = response.totalRpPerKgFraksinasiIv56 == null ? 0 : formatCurrency(Number(response.totalRpPerKgFraksinasiIv56).toFixed(2));
        total_pack.total_value = response.totalCostFraksinasiIv56PlusPackaging == null ? 0 : formatCurrency(Number(response.totalCostFraksinasiIv56PlusPackaging).toFixed(0)),
        total_pack.rp_kg = response.totalRpPerKgFraksinasiIv56PlusPackaging == null ? 0 : formatCurrency(Number(response.totalRpPerKgFraksinasiIv56PlusPackaging).toFixed(2));

        // Allocation Cost Data table
        const alloc = response.allocationCostFraksinasiIv56 == null ? null : response.allocationCostFraksinasiIv56;
        if (alloc != null) {
            for (let i = 0; i < alloc.length; i++) {
                const nama = alloc[i].nama == 'palingBawah' ? '-' : alloc[i].nama
                list_allocation.push({
                    name: nama,
                    proportion: alloc[i].proportion == null ? null : formatCurrency(Number(alloc[i].proportion).toFixed(2))+'%',
                    total_value: alloc[i].totalValue == null ? null : alloc[i].totalValue == 0 ? null : alloc[i].totalValue < 1 ? `(${formatCurrency(Number(alloc[i].totalValue).toFixed(2) * -1)})` : formatCurrency(Number(alloc[i].totalValue).toFixed(2)),
                    rp_kg: alloc[i].rpPerKg == null ? null : alloc[i].rpPerKg == 0 ? null : alloc[i].rpPerKg < 1 ? `(${(formatCurrency(Number(alloc[i].rpPerKg).toFixed(2) * -1))})` : formatCurrency(Number(alloc[i].rpPerKg).toFixed(2)),
                })
            }
        }
    }

    const result = {
        main: list_main,
        direct: list_direct,
        indirect: list_indirect,
        packaging: list_packaging,
        total_frak: total_frak,
        total_pack: total_pack,
        allocation: list_allocation,
    }
    return result;
}

export const loadRefinery_CostingHppController = async(data) => {
    const response = data == null ? null : data.costingHppRefinery == null ? null : data.costingHppRefinery;
    const list_direct = []
    const list_indirect = []
    const list_main = []
    const list_allocation = []
    const total = {
        total_value: 0,
        rp_kg: 0,
    }
    if (response != null) {
        // Main Data Table
        const convertToArray = (obj) => {
            const renamedKeys = {
                cpoConsume: "CPO Consume",
                rbdpo: "RBDPO",
                pfad: "PFAD",
                rbdpoRendementPercentage: "RBDPO Rendement Percentage",
                pfadRendementPercentage: "PFAD Rendement Percentage"
            };
        
            return Object.keys(obj).map(key => ({
                name: renamedKeys[key] || key,
                value: obj[key]
            }));
        };
        const convertedArray = convertToArray(response);

        const main = convertedArray.filter(item => item.name.toLowerCase().includes('cpo') || item.name.toLowerCase().includes('pfad') || item.name.toLowerCase().includes('rbdpo'))   
        const transformedData = main.reduce((acc, item) => {
            if (item.name.includes('Rendement Percentage')) {
                const name = item.name.replace(' Rendement Percentage', '');
                const foundItem = acc.find(obj => obj.name === name);
                if (foundItem) {
                    foundItem.rendement = item.value;
                }
            } else {
                acc.push({
                    name: item.name,
                    qty: item.value,
                    rendement: 0
                });
            }
            return acc;
        }, []);

        for (let i = 0; i < transformedData.length; i++) {
            list_main.push({
                name: transformedData[i].name,
                qty: formatCurrency(Number(transformedData[i].qty).toFixed(0)),
                rendement: transformedData[i].rendement == 0 ? '' : formatCurrency(Number(transformedData[i].rendement).toFixed(2))+'%',
            })
        }

        // Direct Cost Data table
        const direct = response.dataDirect == null ? null : response.dataDirect.cost == null ? null : response.dataDirect.cost;
        const ref = direct == null ? null : direct.find(item => item.nama == 'Refinery') == null ? null : direct.find(item => item.nama == 'Refinery')
        const item_direct = ref == null ? null : ref.item == null || ref.item.length < 1 ? null : ref.item;
        if (item_direct != null) {
            for (let i = 0; i < item_direct.length; i++) {
                list_direct.push({
                    name: item_direct[i].name,
                    proportion: formatCurrency(Number(item_direct[i].proportion).toFixed(2))+'%',
                    proportion2: item_direct[i].proportion2 == 0 ? null : item_direct[i].proportion2 == 1 ? null : formatCurrency(Number(item_direct[i].proportion2).toFixed(2))+'%',
                    value: item_direct[i].value,
                    total_value: formatCurrency(Number(item_direct[i].totalValue).toFixed(0)),
                    rp_kg: formatCurrency(Number(item_direct[i].rpPerKg).toFixed(2)),
                })
            }
        }

        // In Direct Cost Data table
        const indirect = response.dataInDirect == null ? null : response.dataInDirect.cost == null ? null : response.dataInDirect.cost;
        const ref_in = indirect == null ? null : indirect.find(item => item.nama == 'Refinery') == null ? null : indirect.find(item => item.nama == 'Refinery')
        const item_indirect = ref_in == null ? null : ref_in.item == null || ref_in.item.length < 1 ? null : ref_in.item;
        if (item_indirect != null) {
            for (let i = 0; i < item_indirect.length; i++) {
                list_indirect.push({
                    name: item_indirect[i].name,
                    proportion: formatCurrency(Number(item_indirect[i].proportion).toFixed(2))+'%',
                    proportion2: item_indirect[i].proportion2 == 0 ? null : item_indirect[i].proportion2 == 1 ? null : formatCurrency(Number(item_indirect[i].proportion2).toFixed(2))+'%',
                    value: item_indirect[i].value,
                    total_value: formatCurrency(Number(item_indirect[i].totalValue).toFixed(0)),
                    rp_kg: formatCurrency(Number(item_indirect[i].rpPerKg).toFixed(2)),
                })
            }
        }

        // Total
        total.total_value = response.totalCostRefinery == null ? 0 : formatCurrency(Number(response.totalCostRefinery).toFixed(0)),
        total.rp_kg = response.totalRpPerKgRefinery == null ? 0 : formatCurrency(Number(response.totalRpPerKgRefinery).toFixed(2));

        // Allocation Cost Data table
        const alloc = response.allocationCostRefinery == null ? null : response.allocationCostRefinery;
        if (alloc != null) {
            for (let i = 0; i < alloc.length; i++) {
                list_allocation.push({
                    name: alloc[i].name,
                    proportion: formatCurrency(Number(alloc[i].proportion).toFixed(2))+'%',
                    total_value: formatCurrency(Number(alloc[i].totalValue).toFixed(0)),
                    rp_kg: formatCurrency(Number(alloc[i].rpPerKg).toFixed(2)),
                })
            }
        }
    }

    const result = {
        main: list_main,
        direct: list_direct,
        indirect: list_indirect,
        total: total,
        allocation: list_allocation,
    }
    return result;
}

