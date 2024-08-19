import {loadAllByPeriod_ProCostController, loadAllMarket_ProCostController} from '@/controller/retail/ProCostController.js';
import {loadLatest_KursMandiri} from "@/controller/accounting/KursMandiriController.js";
import {loadBebanProduksi_CostProdController} from "@/controller/production/CostProdController.js";
import {loadCpoKpbnAll_CpoController} from "@/controller/retail/CpoController.js";
import {RekeningUnitKerja} from '@/controller/accounting/RekeningUnitController.js'
import {loadCpoOutstandingAll_CpoController} from '@/controller/retail/CpoController.js'
import moment from "moment";

export const loadAllData_DashboardController = async (tgl) => {

    // Load Data API
    // tgl = '2024-05-01'
    const procost = await loadAllByPeriod_ProCostController(tgl);
    const costprod = await loadBebanProduksi_CostProdController(tgl);
    const cpo_kpbn = await loadCpoKpbnAll_CpoController()
    const rekening = await RekeningUnitKerja()
    const cpo_outstanding = await loadCpoOutstandingAll_CpoController()

    // Kurs
    const kurs = await loadAllComponentKurs_DashboardController(procost)

    // CPO
    const cpo = await loadAllCpo_DashboardController(tgl, procost, costprod, cpo_kpbn)
    const outstanding = await loadOutstandingCpo_DashboardController(cpo_outstanding)

    // Market
    const market = await loadUpdateMarket_DashboardController(procost, tgl)
    // console.log(market)

    // Minimum Selling
    const bulk = [
        {name: 'RBDPO', items: [
            {name:'Loco', value_idr: 0, value_usd: 0},
            {name:'FOB', value_idr: 0, value_usd: 0},
        ]},
        {name: 'PFAD', items: [
            {name:'Loco', value_idr: 0, value_usd: 0},
            {name:'FOB', value_idr: 0, value_usd: 0},
        ]},
        {name: 'RBD Olein IV-56', items: [
            {name:'Loco', value_idr: 0, value_usd: 0},
            {name:'FOB', value_idr: 0, value_usd: 0},
        ]},
        {name: 'RBD Olein IV-57', items: [
            {name:'Loco', value_idr: 0, value_usd: 0},
            {name:'FOB', value_idr: 0, value_usd: 0},
        ]},
        {name: 'RBD Olein IV-58', items: [
            {name:'Loco', value_idr: 0, value_usd: 0},
            {name:'FOB', value_idr: 0, value_usd: 0},
        ]},
        {name: 'RBD Olein IV-60', items: [
            {name:'Loco', value_idr: 0, value_usd: 0},
            {name:'FOB', value_idr: 0, value_usd: 0},
        ]},
        {name: 'RBD Stearin', items: [
            {name:'Loco', value_idr: 0, value_usd: 0},
            {name:'FOB', value_idr: 0, value_usd: 0},
        ]},
    ]
    const retail = []

    return{
        kurs: kurs,
        cpo: cpo,
        rekening: rekening,
        outstanding: outstanding,
        market: market,
        selling_bulk: bulk,
        selling_retail: retail,
    }
}

// Market 
const loadUpdateMarket_DashboardController = async(data, tgl)=> {
    const response = await loadAllMarket_ProCostController(data, tgl)
    const list = []
    if (response != null) {
        for (let i = 0; i < response.length; i++) {
            const rbdpo_levy = response[i].rbdpo.levy.nilai == null ? 0 : Number(response[i].rbdpo.levy.nilai)
            const rbdpo_routers = response[i].rbdpo.routers.nilai == null ? 0 : Number(response[i].rbdpo.routers.nilai)
            const pfad_levy = response[i].pfad.levy.nilai == null ? 0 : Number(response[i].pfad.levy.nilai)
            const pfad_routers = response[i].pfad.routers.nilai == null ? 0 : Number(response[i].pfad.routers.nilai)
            const rbdo_levy = response[i].rbdo.levy.nilai == null ? 0 : Number(response[i].rbdo.levy.nilai)
            const rbdo_routers = response[i].rbdo.routers.nilai == null ? 0 : Number(response[i].rbdo.routers.nilai)
            const rbds_levy = response[i].rbds.levy.nilai == null ? 0 : Number(response[i].rbds.levy.nilai)
            const rbds_routers = response[i].rbds.routers.nilai == null ? 0 : Number(response[i].rbds.routers.nilai)

            list.push({
                tanggal: response[i].tanggal,
                rbdpo: {
                    levy: rbdpo_levy,
                    routers: rbdpo_routers,
                    excld: rbdpo_routers - rbdpo_levy,
                },
                pfad: {
                    levy: pfad_levy,
                    routers: pfad_routers,
                    excld: pfad_routers - pfad_levy,
                },
                rbdo: {
                    levy: rbdo_levy,
                    routers: rbdo_routers,
                    excld: rbdo_routers - rbdo_levy,
                },
                rbds: {
                    levy: rbds_levy,
                    routers: rbds_routers,
                    excld: rbds_routers - rbds_levy,
                },
            })
            
        }
    }
    return list;
}

// CPO
export const loadAllCpo_DashboardController = async(tgl, data, costprod, cpo_kpbn) => {
    const avg_act_price = costprod == null ? 0 : costprod.find(item => item.setting == 'coa_bahan_baku').rp_per_kg_cpo_olah == null ? 0 : costprod.find(item => item.setting == 'coa_bahan_baku').rp_per_kg_cpo_olah;
    const this_month = data == null ? 0 : data.averageCpoKpbn == null ? 0 : data.averageCpoKpbn;
    
    // CPO KPBN
    let mtd = 0
    const response = cpo_kpbn.filter(item => item.tanggal.startsWith(moment(tgl).format('YYYY')));
    if (response.length > 0) {
        const avgValues = response.map(item => parseFloat(item.avg));
        const sumOfAvg = avgValues.reduce((acc, value) => acc + value, 0);
        mtd = sumOfAvg / avgValues.length; 
    }

    return [
        {name: 'Average Actual Price', exp: 'CPO Olah INL', value: avg_act_price},
        {name: 'This Month', exp: 'Average CPO KPBN', value: this_month},
        {name: 'MTD', exp: 'Average CPO KPBN', value: mtd},
    ]
}

// Outstanding
export const loadOutstandingCpo_DashboardController = async (data) => {
    let harga = 0, qty = 0,  value = 0;
    if (data != null) {
        for (let i = 0; i < data.length; i++) {
            // harga += Number(data[i].harga);
            qty += Number(data[i].qty);
            value += Number(data[i].value);
        }
    }
    return {
        tot_harga: value / qty,
        tot_qty: qty,
        tot_value: value,
        list: data,
    }
}

// Calculate Kurs Data
const loadAllComponentKurs_DashboardController = async(data) => {

    const kurs_mandiri = await loadLatest_KursMandiri()
    const jisdor = await avgJisdor_DashboardController(data)

    return [
        {name:'kurs_mandiri', value: kurs_mandiri == null ? 0 : Number(kurs_mandiri.value)},
        {name:'avg_jisdor', value: Number(jisdor.avg_jisdor)},
        {name:'latest_jisdor', value: Number(jisdor.latest_jisdor)},
    ]
}
const avgJisdor_DashboardController = async(response) => {
    const jisdor = response == null ? null : response.currencyRates;

    const latestData = jisdor == null ? null : jisdor.reduce((latest, entry) => {
        return new Date(entry.name) > new Date(latest.name) ? entry : latest;
    });

    return {
        avg_jisdor: response != null ? response.averageCurrencyRate : 0,
        latest_jisdor: latestData != null ? latestData.rate : 0,
    }
}