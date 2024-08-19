import moment from 'moment';
import ProCost from "@/api/market_value/ProCost.js";
import {add_MarketRouters, update_MarketRouters } from "@/controller/retail/MarketRoutersController.js";
import {add_LevyDuty, update_LevyDuty } from "@/controller/retail/LevyDutyController.js";

export const loadAllByPeriod_ProCostController = async(tgl) => {
    try {
        const response = await ProCost.getByDate({tanggal: tgl});
        const load = response.data;
        const data = load.data;
        return data
    } catch (error) {
        return null;
    }
}

export const loadAllPropCost_ProCostController = async(post) => {
    const refinery = post == null ? null : post.produksiRefineryData.data == null ? null : post.produksiRefineryData.data;
    const frakiv56 = post == null ? null : post.produksiFraksinasiIV56Data.data == null ? null : post.produksiFraksinasiIV56Data.data;
    const frakiv57 = post == null ? null : post.produksiFraksinasiIV57Data.data == null ? null : post.produksiFraksinasiIV57Data.data;
    const frakiv58 = post == null ? null : post.produksiFraksinasiIV58Data.data == null ? null : post.produksiFraksinasiIV58Data.data;
    const frakiv60 = post == null ? null : post.produksiFraksinasiIV60Data.data == null ? null : post.produksiFraksinasiIV60Data.data;

    // Refinery
    const prodref = refinery == null ? null : refinery.find(item => item.nama == 'Produksi Refinery').item;
    const redref = refinery == null ? null : refinery.find(item => item.nama == 'Rendement Refinery').item;
    const rpref = refinery == null ? null : refinery.find(item => item.nama == 'Proporsi biaya (Rp\/Kg)').item;
    const persenref = refinery == null ? null : refinery.find(item => item.nama == 'Proporsi biaya (%)').item;

    // Fraksinasi IV 56
    const prodfrakiv56 = frakiv56 == null ? null : frakiv56.find(item => item.nama == 'Produksi Fraksinasi IV-56').item;
    const redfrakiv56 = frakiv56 == null ? null : frakiv56.find(item => item.nama == 'Rendement Fraksinasi IV-56').item;
    const rpfrakiv56 = frakiv56 == null ? null : frakiv56.find(item => item.nama == 'Proporsi biaya (Rp\/Kg)').item;
    const persenfrakiv56 = frakiv56 == null ? null : frakiv56.find(item => item.nama == 'Proporsi biaya (%)').item;

    // Fraksinasi IV 57
    const prodfrakiv57 = frakiv57 == null ? null : frakiv57.find(item => item.nama == 'Produksi Fraksinasi IV-57').item;
    const redfrakiv57 = frakiv57 == null ? null : frakiv57.find(item => item.nama == 'Rendement Fraksinasi IV-57').item;
    const rpfrakiv57 = frakiv57 == null ? null : frakiv57.find(item => item.nama == 'Proporsi biaya (Rp\/Kg)').item;
    const persenfrakiv57 = frakiv57 == null ? null : frakiv57.find(item => item.nama == 'Proporsi biaya (%)').item;

    // Fraksinasi IV 58
    const prodfrakiv58 = frakiv58 == null ? null : frakiv58.find(item => item.nama == 'Produksi Fraksinasi IV-58').item;
    const redfrakiv58 = frakiv58 == null ? null : frakiv58.find(item => item.nama == 'Rendement Fraksinasi IV-58').item;
    const rpfrakiv58 = frakiv58 == null ? null : frakiv58.find(item => item.nama == 'Proporsi biaya (Rp\/Kg)').item;
    const persenfrakiv58 = frakiv58 == null ? null : frakiv58.find(item => item.nama == 'Proporsi biaya (%)').item;

    // Fraksinasi IV 60
    const prodfrakiv60 = frakiv60 == null ? null : frakiv60.find(item => item.nama == 'Produksi Fraksinasi IV-60').item;
    const redfrakiv60 = frakiv60 == null ? null : frakiv60.find(item => item.nama == 'Rendement Fraksinasi IV-60').item;
    const rpfrakiv60 = frakiv60 == null ? null : frakiv60.find(item => item.nama == 'Proporsi biaya (Rp\/Kg)').item;
    const persenfrakiv60 = frakiv60 == null ? null : frakiv60.find(item => item.nama == 'Proporsi biaya (%)').item;

    const list = [
        {
            id:1, nama:'market', 
            jisdor: post != null ? post.averageCurrencyRate != null ? post.averageCurrencyRate : 0 : 0,
            cpokpbn: post != null ? post.averageCpoKpbn != null ? post.averageCpoKpbn: 0 : 0,
            usd: [
                {name:'PFAD', value: post != null ? post.marketUSD_or_AverageMarketExcludedLevyDutyPerBulky != null ? post.marketUSD_or_AverageMarketExcludedLevyDutyPerBulky.find(item => item.id == 2).average || 0 : 0 : 0},
                {name:'RBD Stearin', value: post != null ? post.marketUSD_or_AverageMarketExcludedLevyDutyPerBulky != null ? post.marketUSD_or_AverageMarketExcludedLevyDutyPerBulky.find(item => item.id == 5).average || 0 : 0 : 0},
                {name:'RBD Olein', value: post != null ? post.marketUSD_or_AverageMarketExcludedLevyDutyPerBulky != null ? post.marketUSD_or_AverageMarketExcludedLevyDutyPerBulky.find(item => item.id == 4).average || 0 : 0 : 0},
                {name:'RBDPO', value: post != null ? post.marketUSD_or_AverageMarketExcludedLevyDutyPerBulky != null ? post.marketUSD_or_AverageMarketExcludedLevyDutyPerBulky.find(item => item.id == 3).average || 0 : 0 : 0},
            ],
            idr: [
                {name:'PFAD', value: post != null ? post.averageMarketValueIDR != null ? post.averageMarketValueIDR.find(item => item.id == 2).average || 0 : 0 : 0},
                {name:'RBD Stearin', value: post != null ? post.averageMarketValueIDR != null ? post.averageMarketValueIDR.find(item => item.id == 5).average || 0 : 0 : 0},
                {name:'RBD Olein', value: post != null ? post.averageMarketValueIDR != null ? post.averageMarketValueIDR.find(item => item.id == 4).average || 0 : 0 : 0},
                {name:'RBDPO', value: post != null ? post.averageMarketValueIDR != null ? post.averageMarketValueIDR.find(item => item.id == 3).average || 0 : 0 : 0},
            ],
        },
        {name: 'produksi', items:[
            { id:1, name: 'Refinery', tipe: null, olah1: prodref == null ? null : prodref[0].value, name1:'CPO Olah', olah2:prodref == null ? null : prodref[1].value, name2:'RBDPO', olah3:prodref == null ? null : prodref[2].value, name3:'PFAD', rend1:redref == null ? null : redref[0].value, rend2:redref == null ? null : redref[1].value, rp1:rpref == null ? null : rpref[0].value, rp2:rpref == null ? null : rpref[1].value, persen1:persenref == null ? null : persenref[0].value, persen2:persenref == null ? null : persenref[1].value, total:persenref == null ? null : persenref[2].value },
            { id:2, name: 'Fraksinasi (IV-56)', tipe:'IV-56', name1:'RBDPO Olah', name2:'RBD Olein', name3:'RBD Stearin', olah1: prodfrakiv56 == null ? null : prodfrakiv56[0].value, olah2:prodfrakiv56 == null ? null : prodfrakiv56[1].value, olah3:prodfrakiv56 == null ? null : prodfrakiv56[2].value, rend1:redfrakiv56 == null ? null : redfrakiv56[0].value, rend2:redfrakiv56 == null ? null : redfrakiv56[1].value, rp1:rpfrakiv56 == null ? null : rpfrakiv56[0].value, rp2:rpfrakiv56 == null ? null : rpfrakiv56[1].value, persen1:persenfrakiv56 == null ? null : persenfrakiv56[0].value, persen2:persenfrakiv56 == null ? null : persenfrakiv56[1].value, total:persenfrakiv56 == null ? null : persenfrakiv56[2].value },
            { id:3, name: 'Fraksinasi (IV-57)', tipe:'IV-57', name1:'RBDPO Olah', name2:'RBD Olein', name3:'RBD Stearin', olah1: prodfrakiv57 == null ? null : prodfrakiv57[0].value, olah2:prodfrakiv57 == null ? null : prodfrakiv57[1].value, olah3:prodfrakiv57 == null ? null : prodfrakiv57[2].value, rend1:redfrakiv57 == null ? null : redfrakiv57[0].value, rend2:redfrakiv57 == null ? null : redfrakiv57[1].value, rp1:rpfrakiv57 == null ? null : rpfrakiv57[0].value, rp2:rpfrakiv57 == null ? null : rpfrakiv57[1].value, persen1:persenfrakiv57 == null ? null : persenfrakiv57[0].value, persen2:persenfrakiv57 == null ? null : persenfrakiv57[1].value, total:persenfrakiv57 == null ? null : persenfrakiv57[2].value },
            { id:4, name: 'Fraksinasi (IV-58)', tipe:'IV-58', name1:'RBDPO Olah', name2:'RBD Olein', name3:'RBD Stearin', olah1: prodfrakiv58 == null ? null : prodfrakiv58[0].value, olah2:prodfrakiv58 == null ? null : prodfrakiv58[1].value, olah3:prodfrakiv58 == null ? null : prodfrakiv58[2].value, rend1:redfrakiv58 == null ? null : redfrakiv58[0].value, rend2:redfrakiv58 == null ? null : redfrakiv58[1].value, rp1:rpfrakiv58 == null ? null : rpfrakiv58[0].value, rp2:rpfrakiv58 == null ? null : rpfrakiv58[1].value, persen1:persenfrakiv58 == null ? null : persenfrakiv58[0].value, persen2:persenfrakiv58 == null ? null : persenfrakiv58[1].value, total:persenfrakiv58 == null ? null : persenfrakiv58[2].value },
            { id:5, name: 'Fraksinasi (IV-60)', tipe:'IV-60', name1:'RBDPO Olah', name2:'RBD Olein', name3:'RBD Stearin', olah1: prodfrakiv60 == null ? null : prodfrakiv60[0].value, olah2:prodfrakiv60 == null ? null : prodfrakiv60[1].value, olah3:prodfrakiv60 == null ? null : prodfrakiv60[2].value, rend1:redfrakiv60 == null ? null : redfrakiv60[0].value, rend2:redfrakiv60 == null ? null : redfrakiv60[1].value, rp1:rpfrakiv60 == null ? null : rpfrakiv60[0].value, rp2:rpfrakiv60 == null ? null : rpfrakiv60[1].value, persen1:persenfrakiv60 == null ? null : persenfrakiv60[0].value, persen2:persenfrakiv60 == null ? null : persenfrakiv60[1].value, total:persenfrakiv60 == null ? null : persenfrakiv60[2].value },
        ]}
    ]
    return list;
}

export const loadAllMarket_ProCostController = async(data, tgl) => {
    const load = data;

    // Pengaturan Jumlah tanggal untuk mendapatkan nilai length pada for(Looping)
    let days;
    if (moment(tgl).format('YYYY-MM') == moment().format('YYYY-MM') ) {
    //     const dates = Number(moment(tgl).format('D'));
    //     if (dates == 1) {
    //         const months = Number(moment(tgl).format('M'));
    //         if (months == 1) {
    //             const years = Number(moment(tgl).format('YYYY')) - 1;
    //             const tanggalan =  moment(`${years}-${(Number(months)-1).toString().padStart(2, '0')}-01`).endOf('month').format('DD')
    //             tgl = `${years}-${(Number(months)-1).toString().padStart(2, '0')}-${tanggalan}`
    //             days = Number(tanggalan);
                
    //         } else {
    //             const tahun = Number(moment(tgl).format('YYYY'))
    //             const tanggalan = moment(`${tahun}-${(Number(months)-1).toString().padStart(2, '0')}-01`).endOf('month').format('DD');
    //             tgl = `${tahun}-${(Number(months)-1).toString().padStart(2, '0')}-${tanggalan}`;
    //             days = Number(moment(tgl).format('D'));
    //         }
    //     } else {
            const tahun = Number(moment(tgl).format('YYYY'))
            const bulan = Number(moment(tgl).format('M'))
            const tgls = Number(moment().format('DD'))
            tgl = `${tahun}-${bulan.toString().padStart(2, '0')}-${(Number(tgls)).toString().padStart(2, '0')}`;
            days = Number(moment(tgl).format('D'));
        // }
    } else {
        const tahun = Number(moment(tgl).format('YYYY'))
        const bulan = Number(moment(tgl).format('M'))
        const tanggalan =  moment(`${tahun}-${bulan.toString().padStart(2, '0')}-01`).endOf('month').format('DD')
        tgl = `${tahun}-${bulan.toString().padStart(2, '0')}-${tanggalan}`;
        days = Number(tanggalan);
    }

    // Mengambil nilai dari parameter MRouters
    const mRouters = load == null ? null : load.dataMRouters;
    const mR_pfad = mRouters == null ? null : mRouters.find(item => item.id == 2);
    const mR_rbds = mRouters == null ? null : mRouters.find(item => item.id == 5);
    const mR_rbdo = mRouters == null ? null : mRouters.find(item => item.id == 4);
    const mR_rbdpo = mRouters == null ? null : mRouters.find(item => item.id == 3);

    // Mengambil nilai dari parameter LevyDuty
    const LDuty = load == null ? null : load.dataLDuty;
    const lD_pfad = LDuty == null ? null : LDuty.find(item => item.id == 2);
    const lD_rbds = LDuty == null ? null : LDuty.find(item => item.id == 5);
    const lD_rbdo = LDuty == null ? null : LDuty.find(item => item.id == 4);
    const lD_rbdpo = LDuty == null ? null : LDuty.find(item => item.id == 3);

    // Mengambil nilai dari parameter Jisdor Rate
    const jisdor = load == null ? null : load.currencyRates;

    // Mengambil nilai dari parameter Market (IDR)
    const mValue = load == null ? null : load.marketValueIDR;
    const mV_pfad = mValue == null ? null : mValue.find(item => item.id == 2);
    const mV_rbds = mValue == null ? null : mValue.find(item => item.id == 5);
    const mV_rbdo = mValue == null ? null : mValue.find(item => item.id == 4);
    const mV_rbdpo = mValue == null ? null : mValue.find(item => item.id == 3);

    // Mengambil nilai dari parameter Market Exclude Levy Duty
    const mXclude = load == null ? null : load.marketExcludedLevyDuty;
    const mX_pfad = mXclude == null ? null : mXclude.find(item => item.id == 2);
    const mX_rbds = mXclude == null ? null : mXclude.find(item => item.id == 5);
    const mX_rbdo = mXclude == null ? null : mXclude.find(item => item.id == 4);
    const mX_rbdpo = mXclude == null ? null : mXclude.find(item => item.id == 3);

    // Mengambil nilai dari parameter CPO KPBN
    const cpoKpbn = load == null ? null : load.dataCpoKpbn;

    // Proses Pengisian Nilai untuk di tampilkan ke table
    const list = [];
    for (let i = 0; i < days; i++) {
        const date = `${moment(tgl).format('YYYY-MM')}-${(i+1) > 9 ? (i+1) : '0'+ (i+1)}`
        
        // Jisdor
        const Jisdor = jisdor != null ? jisdor.find(item => item.name == date) : null;
        
        // CPO KPBN
        const CPOkpbn = cpoKpbn != null ? cpoKpbn.find(item => item.tanggal == date) : null;

        // Market Routers
        const Mr_pfad = mR_pfad != null ? mR_pfad.item.find(item => item.tanggal == date) : null
        const Mr_rbds = mR_rbds != null ? mR_rbds.item.find(item => item.tanggal == date) : null
        const Mr_rbdo = mR_rbdo != null ? mR_rbdo.item.find(item => item.tanggal == date) : null
        const Mr_rbdpo = mR_rbdpo != null ? mR_rbdpo.item.find(item => item.tanggal == date) : null

        // Levy & Duty
        const Ld_pfad = lD_pfad != null ? lD_pfad.item.find(item => item.tanggal == date) : null
        const Ld_rbds = lD_rbds != null ? lD_rbds.item.find(item => item.tanggal == date) : null
        const Ld_rbdo = lD_rbdo != null ? lD_rbdo.item.find(item => item.tanggal == date) : null
        const Ld_rbdpo = lD_rbdpo != null ? lD_rbdpo.item.find(item => item.tanggal == date) : null

        // Market Values
        const Mv_pfad = mV_pfad != null ? mV_pfad.item.find(item => item.tanggal == date) : null
        const Mv_rbds = mV_rbds != null ? mV_rbds.item.find(item => item.tanggal == date) : null
        const Mv_rbdo = mV_rbdo != null ? mV_rbdo.item.find(item => item.tanggal == date) : null
        const Mv_rbdpo = mV_rbdpo != null ? mV_rbdpo.item.find(item => item.tanggal == date) : null

        // Market Exclude Levy Duty
        const Mx_pfad = mX_pfad != null ? mX_pfad.item.find(item => item.tanggal == date) : null
        const Mx_rbds = mX_rbds != null ? mX_rbds.item.find(item => item.tanggal == date) : null
        const Mx_rbdo = mX_rbdo != null ? mX_rbdo.item.find(item => item.tanggal == date) : null
        const Mx_rbdpo = mX_rbdpo != null ? mX_rbdpo.item.find(item => item.tanggal == date) : null

        list.push({
            date: `${(i+1) > 9 ? (i+1) : '0' + (i+1)}-${moment(tgl).format('MMM YYYY')}`,
            tanggal: `${moment(tgl).format('YYYY-MM')}-${(i+1) > 9 ? (i+1) : '0'+(i+1)}`,
            jisdor: Jisdor != null ? Jisdor.rate : null,
            cpo_kpbn: CPOkpbn != null ? CPOkpbn.avg : null,
            pfad: {
                routers: {
                    id: Mr_pfad == null ? null : Mr_pfad.id,
                    id_bulky: Mr_pfad == null ? null : Mr_pfad.id_bulky,
                    nilai: Mr_pfad == null ? null : Mr_pfad.nilai,
                    tanggal: Mr_pfad == null ? null : Mr_pfad.tanggal,
                    currency_id: Mr_pfad == null ? null : Mr_pfad.currency_id,
                    created_at: Mr_pfad == null ? null : Mr_pfad.created_at,
                    updated_at: Mr_pfad == null ? null : Mr_pfad.updated_at,
                },
                levy: {
                    id: Ld_pfad == null ? null : Ld_pfad.id,
                    id_bulky: Ld_pfad == null ? null : Ld_pfad.id_bulky,
                    nilai: Ld_pfad == null ? null : Ld_pfad.nilai,
                    tanggal: Ld_pfad == null ? null : Ld_pfad.tanggal,
                    currency_id: Ld_pfad == null ? null : Ld_pfad.currency_id,
                    created_at: Ld_pfad == null ? null : Ld_pfad.created_at,
                    updated_at: Ld_pfad == null ? null : Ld_pfad.updated_at,
                },
                eXclude: Mx_pfad == null ? null : Mx_pfad.nilai,
                market: Mv_pfad == null ? null : Mv_pfad.value,
            },
            rbdpo: {
                routers: {
                    id: Mr_rbdpo == null ? null : Mr_rbdpo.id,
                    id_bulky: Mr_rbdpo == null ? null : Mr_rbdpo.id_bulky,
                    nilai: Mr_rbdpo == null ? null : Mr_rbdpo.nilai,
                    tanggal: Mr_rbdpo == null ? null : Mr_rbdpo.tanggal,
                    currency_id: Mr_rbdpo == null ? null : Mr_rbdpo.currency_id,
                    created_at: Mr_rbdpo == null ? null : Mr_rbdpo.created_at,
                    updated_at: Mr_rbdpo == null ? null : Mr_rbdpo.updated_at,
                },
                levy: {
                    id: Ld_rbdpo == null ? null : Ld_rbdpo.id,
                    id_bulky: Ld_rbdpo == null ? null : Ld_rbdpo.id_bulky,
                    nilai: Ld_rbdpo == null ? null : Ld_rbdpo.nilai,
                    tanggal: Ld_rbdpo == null ? null : Ld_rbdpo.tanggal,
                    currency_id: Ld_rbdpo == null ? null : Ld_rbdpo.currency_id,
                    created_at: Ld_rbdpo == null ? null : Ld_rbdpo.created_at,
                    updated_at: Ld_rbdpo == null ? null : Ld_rbdpo.updated_at,
                },
                eXclude: Mx_rbdpo == null ? null : Mx_rbdpo.nilai,
                market: Mv_rbdpo == null ? null : Mv_rbdpo.value,
            },
            rbdo: {
                routers: {
                    id: Mr_rbdo == null ? null : Mr_rbdo.id,
                    id_bulky: Mr_rbdo == null ? null : Mr_rbdo.id_bulky,
                    nilai: Mr_rbdo == null ? null : Mr_rbdo.nilai,
                    tanggal: Mr_rbdo == null ? null : Mr_rbdo.tanggal,
                    currency_id: Mr_rbdo == null ? null : Mr_rbdo.currency_id,
                    created_at: Mr_rbdo == null ? null : Mr_rbdo.created_at,
                    updated_at: Mr_rbdo == null ? null : Mr_rbdo.updated_at,
                },
                levy: {
                    id: Ld_rbdo == null ? null : Ld_rbdo.id,
                    id_bulky: Ld_rbdo == null ? null : Ld_rbdo.id_bulky,
                    nilai: Ld_rbdo == null ? null : Ld_rbdo.nilai,
                    tanggal: Ld_rbdo == null ? null : Ld_rbdo.tanggal,
                    currency_id: Ld_rbdo == null ? null : Ld_rbdo.currency_id,
                    created_at: Ld_rbdo == null ? null : Ld_rbdo.created_at,
                    updated_at: Ld_rbdo == null ? null : Ld_rbdo.updated_at,
                },
                eXclude: Mx_rbdo == null ? null : Mx_rbdo.nilai,
                market: Mv_rbdo == null ? null : Mv_rbdo.value,
            },
            rbds: {
                routers: {
                    id: Mr_rbds == null ? null : Mr_rbds.id,
                    id_bulky: Mr_rbds == null ? null : Mr_rbds.id_bulky,
                    nilai: Mr_rbds == null ? null : Mr_rbds.nilai,
                    tanggal: Mr_rbds == null ? null : Mr_rbds.tanggal,
                    currency_id: Mr_rbds == null ? null : Mr_rbds.currency_id,
                    created_at: Mr_rbds == null ? null : Mr_rbds.created_at,
                    updated_at: Mr_rbds == null ? null : Mr_rbds.updated_at,
                },
                levy: {
                    id: Ld_rbds == null ? null : Ld_rbds.id,
                    id_bulky: Ld_rbds == null ? null : Ld_rbds.id_bulky,
                    nilai: Ld_rbds == null ? null : Ld_rbds.nilai,
                    tanggal: Ld_rbds == null ? null : Ld_rbds.tanggal,
                    currency_id: Ld_rbds == null ? null : Ld_rbds.currency_id,
                    created_at: Ld_rbds == null ? null : Ld_rbds.created_at,
                    updated_at: Ld_rbds == null ? null : Ld_rbds.updated_at,
                },
                eXclude: Mx_rbds == null ? null : Mx_rbds.nilai,
                market: Mv_rbds == null ? null : Mv_rbds.value,
            },
        })
    }
    return list;
}

export const postDataMarketValue_ProCostController = async(post_market, post_levyduty, load) => {
    let msg = {severity: '', content: ''}
    const routers = post_market;
    const levy = post_levyduty;
    // console.log(routers, levy)
    const list = [];
    for (let i = 0; i < routers.length; i++) {
        list.push({
            cond: routers[i].cond,
            currency_id: routers[i].currency_id,
            id: routers[i].id,
            id_bulky: routers[i].id_bulky,
            name_bulk: routers[i].name_bulk,
            nilai: routers[i].nilai,
            tanggal: routers[i].tanggal,
            tipe: 'Market Router',
        })
    }
    for (let i = 0; i < levy.length; i++) {
        list.push({
            cond: levy[i].cond,
            currency_id: levy[i].currency_id,
            id: levy[i].id,
            id_bulky: levy[i].id_bulky,
            name_bulk: levy[i].name_bulk,
            nilai: levy[i].nilai,
            tanggal: levy[i].tanggal,
            tipe: 'Levy Duty',
        })
    }
    let kondisi;
    for (let i = 0; i < list.length; i++) {
        if (list[i].nilai != null) {
            if (i < (list.length - 1)) {
                continue;
            }
            kondisi = true
        } else {
            msg = {severity:'warn', content:`Mohon data diisi value pada bagian ${list[i].tipe} ${list[i].name_bulk}`};
            kondisi = false
            break;
        }
    }
    if (kondisi == true) {
        for (let i = 0; i < list.length; i++) {
            const verify = load.find(item => item.tanggal == list[i].tanggal)
            console.log(verify)
            if (list[i].tipe == 'Market Router') {
                if (list[i].cond == 'add') {
                    await add_MarketRouters(list[i])
                } else {
                    await update_MarketRouters(list[i])
                }
            } else {
                if (list[i].cond == 'add') {
                    await add_LevyDuty(list[i])
                } else {
                    await update_LevyDuty(list[i])
                }
            }
        }
        msg = { severity: 'success', content: 'Data berhasil di simpan' };
    }

    return msg
}