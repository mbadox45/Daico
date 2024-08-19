
import { loadLatest_KursMandiri } from "@/controller/accounting/KursMandiriController.js";
import {loadAllByPeriod_ProCostController} from '@/controller/retail/ProCostController.js';
import moment from "moment";

export const loadAllComponentKurs_DashKursController = async(tgl) => {
    let days;
    if (moment(tgl).format('YYYY-MM') == moment().format('YYYY-MM') ) {
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

    const kurs_mandiri = await loadLatest_KursMandiri()
    const jisdor = await avgJisdor_DashKursController(tgl)

    return {
        kurs_mandiri: kurs_mandiri == null ? 0 : kurs_mandiri.value,
        avg_jisdor : Number(jisdor.avg_jisdor),
        latest_jisdor : Number(jisdor.latest_jisdor),
    }

}

export const avgJisdor_DashKursController = async(tgl) => {
    const response = await loadAllByPeriod_ProCostController(tgl)
    const jisdor = response == null ? null : response.currencyRates;

    const latestData = jisdor == null ? null : jisdor.reduce((latest, entry) => {
        return new Date(entry.name) > new Date(latest.name) ? entry : latest;
    });

    return {
        avg_jisdor: response != null ? response.averageCurrencyRate : 0,
        latest_jisdor: latestData != null ? latestData.rate : 0,
    }
}