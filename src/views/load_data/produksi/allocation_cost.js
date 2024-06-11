import { loadDataProd } from '@/views/finance/accounting/target/components/list/data/data_cost_prod.js';
import {loadJisdor} from '@/views/load_data/dashboard.js';

const totalByUraian = (data,uraian) => {
    let total = 0;
    for (let i = 0; i < data.length; i++) {
        if (data[i].id_uraian == uraian) {
            total += Number(data[i].value);
        } else {
            continue;
        }
    }
    return total;
}

export const loadAllocationCost = async (tgl) => {
    const response = await loadDataProd(tgl);
    const allocation = await dataAllocation(response);
    const alloc_prod = await AllocProd(response)
    const alloc_gas = await allocGas(response, tgl)
    const alloc_gas_penalti = await allocGasPenalty(response, tgl)
    const allocation_utility = [
        {name: 'Utility - Steam / Gas', ref:{qty:allocation[1].tot_ref, persen: allocation[1].tot_alloc == 0 ? 0 : allocation[1].tot_ref / allocation[1].tot_alloc}, frak:{qty:allocation[1].tot_rak, persen: allocation[1].tot_alloc == 0 ? 0 : allocation[1].tot_rak / allocation[1].tot_alloc}},
        {name: 'Utility - Air', ref:{qty:allocation[0].tot_ref, persen: allocation[0].tot_alloc == 0 ? 0 : allocation[0].tot_ref / allocation[0].tot_alloc}, frak:{qty:allocation[0].tot_rak, persen: allocation[0].tot_alloc == 0 ? 0 : allocation[0].tot_rak / allocation[0].tot_alloc}},
        {name: 'Utility - Listrik', ref:{qty:allocation[2].tot_ref, persen: allocation[2].tot_alloc == 0 ? 0 : allocation[2].tot_ref / allocation[2].tot_alloc}, frak:{qty:allocation[2].tot_rak, persen: allocation[2].tot_alloc == 0 ? 0 : allocation[2].tot_rak / allocation[2].tot_alloc}},
    ];
    return [
        {name: 'Allocation', items: allocation},
        {name: 'Allocation Utility', items: allocation_utility},
        {name: 'Allocation Produksi', items: alloc_prod},
        {name: 'Allocation Gas', items: alloc_gas},
        {name: 'Allocation Gas Pinalty', items: alloc_gas_penalti},
    ]
}

export const AllocProd = async(response) => {
    let ref_prod = 0, ref_all_prod = 0, ref_rbd_iv56 = 0, ref_rbd_iv57 = 0, ref_rbd_iv58 = 0, ref_rbd_iv60 = 0;
    let frak_prod = 0, frak_all_prod = 0, frak_rbd_iv56 = 0, frak_rbd_iv57 = 0, frak_rbd_iv58 = 0, frak_rbd_iv60 = 0;
    let pack_prod = 0, pack_all_prod = 0, pack_rbd_iv56 = 0, pack_rbd_iv57 = 0, pack_rbd_iv58 = 0, pack_rbd_iv60 = 0;
    let tot_prod = 0, tot_all_prod = 0;
    if (response != null) {
        // Refinery
        const refinery = response.find(item => item.name == 'Refinery');
        const ref_items = refinery.items
        const ref_rbdpo = totalByUraian(ref_items,2);
        const ref_pfad = totalByUraian(ref_items,3);
        ref_all_prod = Number(ref_rbdpo) + Number(ref_pfad);
        // Fraksinasi IV 56
        const frak_iv_56 = response.find(item => item.name == 'Fraksinasi (IV-56)');
        const frak_item_iv_56 = frak_iv_56.items;
        const frak_rbdpo_iv_56 = totalByUraian(frak_item_iv_56,5);
        frak_rbd_iv56 = Number(frak_rbdpo_iv_56)
        const pack_minyakita = response.find(item => item.name == 'Packaging (Minyakita)');
        const pack_minyakita_item = pack_minyakita.items;
        const olein_consume_iv_56 = totalByUraian(pack_minyakita_item,42);
        pack_rbd_iv56 = Number(olein_consume_iv_56)
        // Fraksinasi IV 57
        const frak_iv_57 = response.find(item => item.name == 'Fraksinasi (IV-57)');
        const frak_item_iv_57 = frak_iv_57.items;
        const frak_rbdpo_iv_57 = totalByUraian(frak_item_iv_57,13);
        frak_rbd_iv57 = Number(frak_rbdpo_iv_57)
        const pack_inl = response.find(item => item.name == 'Packaging (INL)');
        const pack_inl_item = pack_inl.items;
        const olein_consume_iv_57 = totalByUraian(pack_inl_item,35);
        pack_rbd_iv57 = Number(olein_consume_iv_57)
        // Fraksinasi IV 58
        const frak_iv_58 = response.find(item => item.name == 'Fraksinasi (IV-58)');
        const frak_item_iv_58 = frak_iv_58.items;
        const frak_rbdpo_iv_58 = totalByUraian(frak_item_iv_58,9);
        frak_rbd_iv58 = Number(frak_rbdpo_iv_58)
        const frak_olein_consume_iv_58 = 0;
        pack_rbd_iv58 = Number(frak_olein_consume_iv_58)
        // Fraksinasi IV 60
        const frak_iv_60 = response.find(item => item.name == 'Fraksinasi (IV-60)');
        const frak_item_iv_60 = frak_iv_60.items;
        const frak_rbdpo_iv_60 = totalByUraian(frak_item_iv_60,17);
        frak_rbd_iv60 = Number(frak_rbdpo_iv_60);
        const pack_salvaco = response.find(item => item.name == 'Packaging (Salvaco)');
        const pack_nusakita = response.find(item => item.name == 'Packaging (Nusakita)');
        const pack_salvaco_item = pack_salvaco.items;
        const pack_nusakita_item = pack_nusakita.items;
        const olein_consume_salvaco = totalByUraian(pack_salvaco_item,25);
        const olein_consume_nusakita = totalByUraian(pack_nusakita_item,30);
        pack_rbd_iv60 = Number(olein_consume_salvaco) + Number(olein_consume_nusakita)
        pack_all_prod = pack_rbd_iv56 + pack_rbd_iv57 + pack_rbd_iv58 + pack_rbd_iv60;
        frak_all_prod = frak_rbd_iv56 + frak_rbd_iv57 + frak_rbd_iv58 + frak_rbd_iv60 - pack_all_prod;
        tot_all_prod = frak_all_prod + pack_all_prod + ref_all_prod;
        ref_prod = (ref_all_prod / tot_all_prod) * 100
        frak_prod = (frak_all_prod / tot_all_prod) * 100
        pack_prod = (pack_all_prod / tot_all_prod) * 100
        tot_prod = (tot_all_prod / tot_all_prod) * 100
    }

    return {
        ref_prod: ref_prod, ref_all_prod: ref_all_prod, ref_rbd_iv56: ref_rbd_iv56, ref_rbd_iv57: ref_rbd_iv57, ref_rbd_iv58: ref_rbd_iv58, ref_rbd_iv60: ref_rbd_iv60,
        frak_prod: frak_prod, frak_all_prod: frak_all_prod, frak_rbd_iv56: frak_rbd_iv56, frak_rbd_iv57: frak_rbd_iv57, frak_rbd_iv58: frak_rbd_iv58, frak_rbd_iv60: frak_rbd_iv60,
        pack_prod: pack_prod, pack_all_prod: pack_all_prod, pack_rbd_iv56: pack_rbd_iv56, pack_rbd_iv57: pack_rbd_iv57, pack_rbd_iv58: pack_rbd_iv58, pack_rbd_iv60: frak_rbd_iv60,
        tot_prod: tot_prod, tot_all_prod: tot_all_prod
    }
}

export const dataAllocation = async(response) => {
    let air_refinery = 0, air_fraksinasi = 0, air_ro = 0, air_waste = 0, air_others = 0;
    let gas_refinery = 0, gas_fraksinasi = 0, steam_refinery = 0, steam_fraksinasi = 0;
    let listrik = 0 , listrik_refinery = 0, listrik_fraksinasi = 0;
    if (response != null) {
        // water
        const frak_iv_56 = response.find(item => item.name == 'Water Consumption');
        const frak_item = frak_iv_56.items;
        air_refinery = totalByUraian(frak_item,56);
        air_fraksinasi = totalByUraian(frak_item,57);
        air_ro = totalByUraian(frak_item,58);
        air_waste = totalByUraian(frak_item,59);
        air_others = totalByUraian(frak_item,60);

        // gas
        const gas = response.find(item => item.name == 'Gas Consumption');
        const gas_item = gas.items;
        gas_refinery = totalByUraian(gas_item,49);
        gas_fraksinasi = totalByUraian(gas_item,50);
        const steam = response.find(item => item.name == 'Steam Consumption');
        const steam_item = steam.items;
        const ref_steam = totalByUraian(steam_item,52);
        const frak_steam = totalByUraian(steam_item,53);
        const incoming_steam = totalByUraian(steam_item,51);
        const other_steam = totalByUraian(steam_item,54);
        steam_refinery = (((ref_steam/incoming_steam)+((other_steam/incoming_steam) * 50/100))*gas_fraksinasi) + gas_refinery;
        steam_fraksinasi = (((frak_steam/incoming_steam)+((other_steam/incoming_steam) * 50/100))*gas_fraksinasi);

        // listrik
        const power = response.find(item => item.name == 'Power Consumption');
        const power_item = power.items;
        listrik = totalByUraian(power_item,61);
        const p_ref = totalByUraian(power_item,62);
        const p_frak = totalByUraian(power_item,63);
        const p_other = totalByUraian(power_item,64);
        const tot_pemakaian = p_ref + p_frak + p_other
        const selisih = listrik - tot_pemakaian
        listrik_refinery = p_ref + ((selisih + p_other) * (p_ref / (p_ref + p_frak)))
        listrik_fraksinasi = p_frak + ((selisih + p_other) * (p_frak / (p_ref + p_frak)))
    }
    return [
        {
            id:0, name:'Pemakaian Air (m3)', items: [
                {id: 0, name: 'Refinery', value:air_refinery},
                {id: 1, name: 'Fractionation', value:air_fraksinasi},
                {id: 2, name: 'RO', value:air_ro},
                {id: 3, name: 'Waste', value:air_waste},
                {id: 4, name: 'Others', value:air_others},
            ], 
            total: air_refinery + air_fraksinasi + air_ro + air_waste + air_others, 
            tot_ref: air_refinery + ((air_ro + air_waste + air_others)*30/100), 
            tot_rak: air_fraksinasi + ((air_ro + air_waste + air_others)*70/100),
            tot_alloc: (air_refinery + ((air_ro + air_waste + air_others)*30/100)) + (air_fraksinasi + ((air_ro + air_waste + air_others)*70/100))
        },
        {
            id:1, name:'Pemakaian Gas (mmbtu)', items: [
                {id: 0, name: 'HP Boiler Refinery', value:gas_refinery},
                {id: 1, name: 'MP Boiler 1, 2', value:gas_fraksinasi},
            ],
            total: gas_refinery + gas_fraksinasi, 
            tot_ref: steam_refinery, 
            tot_rak: steam_fraksinasi,
            tot_alloc: steam_refinery + steam_fraksinasi,
        },
        {
            id:2, name:'Pemakaian Listrik (kwh)', items: [
                {id: 0, name: 'Listrik', value:listrik},
            ],
            total: listrik, 
            tot_ref: listrik_refinery, 
            tot_rak: listrik_fraksinasi,
            tot_alloc: listrik_refinery + listrik_fraksinasi,
        },
    ]
}

export const allocGas = async(response, tgl) => {
    let incoming_on_pertagas = 0, harga_gas = 298774.34/23450.7548, tagihan_usd = 0, kurs = 0, tagihan_rp = 0;
    const jisdor = await loadJisdor(tgl);
    if (jisdor != null) {
        let avg_jisdor = 0;
        for (let i = 0; i < jisdor.length; i++) {
            avg_jisdor += Number(jisdor[i].rate);
        }
        kurs = avg_jisdor / jisdor.length;
    }
    if (response != null) {
        const gas = response.find(item => item.name == 'Gas Consumption');
        const gas_item = gas.items;
        const pertagas = totalByUraian(gas_item,48);
        incoming_on_pertagas = Number(pertagas)
        tagihan_usd = incoming_on_pertagas * harga_gas
        tagihan_rp = tagihan_usd * kurs
    }
    return{
        incoming_on_pertagas: incoming_on_pertagas, harga_gas: harga_gas, tagihan_usd: tagihan_usd, kurs: kurs, tagihan_rp: tagihan_rp
    }
}

export const allocGasPenalty = async(response, tgl) => {
    let incoming_on_pertagas = 0, minimum_pakai = 438000/12/30*26, pemakaian_gas = 0, harga_gas = 298774.34/23450.7548, tagihan_pinalty_usd = 0, kurs = 0, tagihan_pinalty_rp = 0;
    const jisdor = await loadJisdor(tgl);
    if (jisdor != null) {
        let avg_jisdor = 0;
        for (let i = 0; i < jisdor.length; i++) {
            avg_jisdor += Number(jisdor[i].rate);
        }
        kurs = avg_jisdor / jisdor.length;
    }
    if (response != null) {
        const gas = response.find(item => item.name == 'Gas Consumption');
        const gas_item = gas.items;
        const pertagas = totalByUraian(gas_item,48);
        incoming_on_pertagas = Number(pertagas)
        pemakaian_gas = incoming_on_pertagas - minimum_pakai
        tagihan_pinalty_usd = pemakaian_gas * harga_gas
        tagihan_pinalty_rp = tagihan_pinalty_usd * kurs
    }
    return{
        incoming_on_pertagas: incoming_on_pertagas, minimum_pakai: minimum_pakai, pemakaian_gas: pemakaian_gas, harga_gas: harga_gas, tagihan_pinalty_usd: tagihan_pinalty_usd, kurs: kurs, tagihan_pinalty_rp: tagihan_pinalty_rp
    }
}