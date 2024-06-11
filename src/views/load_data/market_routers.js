import moment from 'moment';
import MarketRouters from '@/api/market_value/MarketRouters.js';
import LevyDuty from '@/api/market_value/LevyDuty.js';
import {loadRate} from '@/views/load_data/from_odoo.js';
import {loadAvgCPO} from '@/views/load_data/cpo.js';

export const loadMarketValue = async(tgl) => {
    let dateString = tgl;
    const tahun = Number(moment(tgl).format('YYYY'))
    const bulan = Number(moment(tgl).format('M'))
    const tgls = moment(tgl).format('M');
    let days;
    if (moment(dateString).format('YYYY-MM') == moment().format('YYYY-MM') ) {
        const dates = Number(moment(dateString).format('D'));
        if (dates == 1) {
            const months = Number(moment(dateString).format('M'));
            if (months == 1) {
                const years = Number(moment(dateString).format('YYYY')) - 1;
                const tanggalan =  moment(`${years}-${(Number(months)-1).toString().padStart(2, '0')}-01`).endOf('month').format('DD')
                dateString = `${years}-${(Number(months)-1).toString().padStart(2, '0')}-${tanggalan}`
                days = Number(tanggalan);
                
            } else {
                dateString = `${tahun}-${months.toString().padStart(2, '0')}-${(dates - 1).toString().padStart(2, '0')}`;
                days = Number(moment(dateString).format('D'));
            }
        } else {
            // dateString = `${tahun.value}-${bulan.value.toString().padStart(2, '0')}-${tgls.value}`;
            dateString = `${tahun}-${bulan.toString().padStart(2, '0')}-${(Number(tgls)).toString().padStart(2, '0')}`;
            days = Number(moment(dateString).format('D'));
        }
    } else {
        const tanggalan =  moment(`${tahun}-${bulan.toString().padStart(2, '0')}-01`).endOf('month').format('DD')
        dateString = `${tahun}-${bulan.toString().padStart(2, '0')}-${tanggalan}`;
        days = Number(tanggalan);
    }

    const data_jisdor = await loadRate();
    // routers
    const data_routers = await loadM_Router(dateString);
    // levy+duty
    const data_levy = await loadLevyDuty(dateString);
    // cpo kpbn
    const cpo = await loadAvgCPO(dateString);

    const list = []
    for (let i = 0; i < days; i++) {

        // cpo
        const cpo_kpbn = cpo == null ? null : cpo.find(item => item.tanggal == `${moment(dateString).format('YYYY-MM')}-${(i+1) > 9 ? (i+1) : '0'+ (i+1)}`)

        // Jisdor
        const jisdor = data_jisdor == null ? null : data_jisdor.find(item => item.name == `${moment(dateString).format('YYYY-MM')}-${(i+1) > 9 ? (i+1) : '0'+ (i+1)}`)

        // Filter Data By Date & Bulk ID
        // market routers
        const rm_pfad = data_routers == null ? null : data_routers.find(item => item.tanggal == `${moment(dateString).format('YYYY-MM')}-${(i+1) > 9 ? (i+1) : '0'+ (i+1)}` && item.id_bulky == 2)
        const rm_rbdpo = data_routers == null ? null : data_routers.find(item => item.tanggal == `${moment(dateString).format('YYYY-MM')}-${(i+1) > 9 ? (i+1) : '0'+ (i+1)}` && item.id_bulky == 3)
        const rm_rbdo = data_routers == null ? null : data_routers.find(item => item.tanggal == `${moment(dateString).format('YYYY-MM')}-${(i+1) > 9 ? (i+1) : '0'+ (i+1)}` && item.id_bulky == 4)
        const rm_rbds = data_routers == null ? null : data_routers.find(item => item.tanggal == `${moment(dateString).format('YYYY-MM')}-${(i+1) > 9 ? (i+1) : '0'+ (i+1)}` && item.id_bulky == 5)
        // levy duty
        const ld_pfad = data_levy == null ? null : data_levy.find(item => item.tanggal == `${moment(dateString).format('YYYY-MM')}-${(i+1) > 9 ? (i+1) : '0'+(i+1)}` && item.id_bulky == 2)
        const ld_rbdpo = data_levy == null ? null : data_levy.find(item => item.tanggal == `${moment(dateString).format('YYYY-MM')}-${(i+1) > 9 ? (i+1) : '0'+(i+1)}` && item.id_bulky == 3)
        const ld_rbdo = data_levy == null ? null : data_levy.find(item => item.tanggal == `${moment(dateString).format('YYYY-MM')}-${(i+1) > 9 ? (i+1) : '0'+(i+1)}` && item.id_bulky == 4)
        const ld_rbds = data_levy == null ? null : data_levy.find(item => item.tanggal == `${moment(dateString).format('YYYY-MM')}-${(i+1) > 9 ? (i+1) : '0'+(i+1)}` && item.id_bulky == 5)

        // console.log(dr, dl)
        list[i] = {
            date: `${(i+1) > 9 ? (i+1) : '0' + (i+1)}-${moment(dateString).format('MMM YYYY')}`,
            tanggal: `${moment(dateString).format('YYYY-MM')}-${(i+1) > 9 ? (i+1) : '0'+(i+1)}`,
            jisdor: jisdor == null ? null : jisdor.rate,
            cpo_kpbn: cpo_kpbn == null ? null : cpo_kpbn.avg,
            pfad: {
                routers: {
                    id: rm_pfad == null ? null : rm_pfad.id,
                    id_bulky: rm_pfad == null ? null : rm_pfad.id_bulky,
                    nilai: rm_pfad == null ? null : rm_pfad.nilai,
                    tanggal: rm_pfad == null ? null : rm_pfad.tanggal,
                    currency_id: rm_pfad == null ? null : rm_pfad.currency_id,
                    created_at: rm_pfad == null ? null : rm_pfad.created_at,
                    updated_at: rm_pfad == null ? null : rm_pfad.updated_at,
                },
                levy: {
                    id: ld_pfad == null ? null : ld_pfad.id,
                    id_bulky: ld_pfad == null ? null : ld_pfad.id_bulky,
                    nilai: ld_pfad == null ? null : ld_pfad.nilai,
                    tanggal: ld_pfad == null ? null : ld_pfad.tanggal,
                    currency_id: ld_pfad == null ? null : ld_pfad.currency_id,
                    created_at: ld_pfad == null ? null : ld_pfad.created_at,
                    updated_at: ld_pfad == null ? null : ld_pfad.updated_at,
                }
            },
            rbdpo: {
                routers: {
                    id: rm_rbdpo == null ? null : rm_rbdpo.id,
                    id_bulky: rm_rbdpo == null ? null : rm_rbdpo.id_bulky,
                    nilai: rm_rbdpo == null ? null : rm_rbdpo.nilai,
                    tanggal: rm_rbdpo == null ? null : rm_rbdpo.tanggal,
                    currency_id: rm_rbdpo == null ? null : rm_rbdpo.currency_id,
                    created_at: rm_rbdpo == null ? null : rm_rbdpo.created_at,
                    updated_at: rm_rbdpo == null ? null : rm_rbdpo.updated_at,
                },
                levy: {
                    id: ld_rbdpo == null ? null : ld_rbdpo.id,
                    id_bulky: ld_rbdpo == null ? null : ld_rbdpo.id_bulky,
                    nilai: ld_rbdpo == null ? null : ld_rbdpo.nilai,
                    tanggal: ld_rbdpo == null ? null : ld_rbdpo.tanggal,
                    currency_id: ld_rbdpo == null ? null : ld_rbdpo.currency_id,
                    created_at: ld_rbdpo == null ? null : ld_rbdpo.created_at,
                    updated_at: ld_rbdpo == null ? null : ld_rbdpo.updated_at,
                }
            },
            rbdo: {
                routers: {
                    id: rm_rbdo == null ? null : rm_rbdo.id,
                    id_bulky: rm_rbdo == null ? null : rm_rbdo.id_bulky,
                    nilai: rm_rbdo == null ? null : rm_rbdo.nilai,
                    tanggal: ld_rbdo == null ? null : ld_rbdo.tanggal,
                    currency_id: rm_rbdo == null ? null : rm_rbdo.currency_id,
                    created_at: rm_rbdo == null ? null : rm_rbdo.created_at,
                    updated_at: rm_rbdo == null ? null : rm_rbdo.updated_at,
                },
                levy: {
                    id: ld_rbdo == null ? null : ld_rbdo.id,
                    id_bulky: ld_rbdo == null ? null : ld_rbdo.id_bulky,
                    nilai: ld_rbdo == null ? null : ld_rbdo.nilai,
                    tanggal: ld_rbdo == null ? null : ld_rbdo.tanggal,
                    currency_id: ld_rbdo == null ? null : ld_rbdo.currency_id,
                    created_at: ld_rbdo == null ? null : ld_rbdo.created_at,
                    updated_at: ld_rbdo == null ? null : ld_rbdo.updated_at,
                }
            },
            rbds: {
                routers: {
                    id: rm_rbds == null ? null : rm_rbds.id,
                    id_bulky: rm_rbds == null ? null : rm_rbds.id_bulky,
                    nilai: rm_rbds == null ? null : rm_rbds.nilai,
                    tanggal: rm_rbds == null ? null : rm_rbds.tanggal,
                    currency_id: rm_rbds == null ? null : rm_rbds.currency_id,
                    created_at: rm_rbds == null ? null : rm_rbds.created_at,
                    updated_at: rm_rbds == null ? null : rm_rbds.updated_at,
                },
                levy: {
                    id: ld_rbds == null ? null : ld_rbds.id,
                    id_bulky: ld_rbds == null ? null : ld_rbds.id_bulky,
                    nilai: ld_rbds == null ? null : ld_rbds.nilai,
                    tanggal: rm_rbds == null ? null : rm_rbds.tanggal,
                    currency_id: ld_rbds == null ? null : ld_rbds.currency_id,
                    created_at: ld_rbds == null ? null : ld_rbds.created_at,
                    updated_at: ld_rbds == null ? null : ld_rbds.updated_at,
                }
            },
        }
    }

    return list;
}

export const loadM_Router = async(tgl) => {
    try {
        const res_routers = await MarketRouters.getByDate({tanggal:tgl})
        const load_routers = res_routers.data;
        const data_routers = load_routers.data;
        return data_routers
    } catch (error) {
        return null;
    }
}

export const loadLevyDuty = async(tgl) => {
    try {
        const res_levy = await LevyDuty.getByDate({tanggal:tgl})
        const load_levy = res_levy.data;
        const data_levy = load_levy.data;
        return data_levy
    } catch (error) {
        return null
    }
}