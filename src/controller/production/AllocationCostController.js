import { loadLatest_PenyusutanBiayaController } from '@/controller/master_data/PenyusutanBiayaController.js'
import { loadAllByPeriodRekap_DetAllocController } from '@/controller/production/DetAllocController.js'


export const loadAllocation_AllocationCostController = async(tgl) => {
    // const penyusutan = await loadLatest_PenyusutanBiayaController();
    const response = await loadAllByPeriodRekap_DetAllocController(tgl);
    const det_alloc = response == null ? null : response.recap == null ? null : response.recap

    // Pemakaian Gas
    const gas = det_alloc == null ? null : det_alloc.biayaPemakaianGas;
    const incomming_pemakaian_gas = gas == null ? null : gas.incomingBasedOnPertagas
    const harga_pemakaian_gas = gas == null ? null : gas.hargaGas
    const pemakaian_tagihan_usd = gas == null ? null : gas.nilaiBiayaTagihanUSD
    const pemakaian_tagihan_idr = gas == null ? null : gas.nilaiBiayaTagihanIDR
    const pemakaian_kurs = gas == null ? null : gas.Kurs
    const list_pemakaian_gas = [
        {name:'Incoming *based on Pertagas', satuan: incomming_pemakaian_gas == null ? null : incomming_pemakaian_gas.satuan, value: incomming_pemakaian_gas == null ? null : incomming_pemakaian_gas.value},
        {name:'Harga Gas', satuan: harga_pemakaian_gas == null ? null : harga_pemakaian_gas.satuan, value: harga_pemakaian_gas == null ? null : harga_pemakaian_gas.value},
        {name:'Nilai Biaya Tagihan USD', satuan: pemakaian_tagihan_usd == null ? null : pemakaian_tagihan_usd.satuan, value: pemakaian_tagihan_usd == null ? null : pemakaian_tagihan_usd.value},
        {name:'Kurs', satuan: pemakaian_kurs == null ? null : pemakaian_kurs.satuan, value: pemakaian_kurs == null ? null : pemakaian_kurs.value},
        {name:'Nilai Biaya Tagihan IDR', satuan: pemakaian_tagihan_idr == null ? null : pemakaian_tagihan_idr.satuan, value: pemakaian_tagihan_idr == null ? null : pemakaian_tagihan_idr.value},
    ]

    // Penalty Gas
    const penalty_gas = det_alloc == null ? null : det_alloc.perhitunganPenaltyGas;
    const incomming_penalty_gas = penalty_gas == null ? null : penalty_gas.incomingBasedOnPertagas
    const harga_penalty_gas = penalty_gas == null ? null : penalty_gas.hargaGas
    const penalty_tagihan_usd = penalty_gas == null ? null : penalty_gas.nilaiBiayaPenaltyUSD
    const penalty_tagihan_idr = penalty_gas == null ? null : penalty_gas.nilaiBiayaPenaltyIDR
    const penalty_kurs = penalty_gas == null ? null : penalty_gas.Kurs
    const minimum_penalty_kurs = penalty_gas == null ? null : penalty_gas.minimumPemakaian
    const plus_minus_penalty_kurs = penalty_gas == null ? null : penalty_gas.plusMinusPemakaianGas
    const list_penalty_gas = [
        {name:'Incoming *based on Pertagas', satuan: incomming_penalty_gas == null ? null : incomming_penalty_gas.satuan, value: incomming_penalty_gas == null ? null : incomming_penalty_gas.value},
        {name:'Harga Gas', satuan: harga_penalty_gas == null ? null : harga_penalty_gas.satuan, value: harga_penalty_gas == null ? null : harga_penalty_gas.value},
        {name:'Minimum Pemakaian', satuan: minimum_penalty_kurs == null ? null : minimum_penalty_kurs.satuan, value: minimum_penalty_kurs == null ? null : minimum_penalty_kurs.value},
        {name:'+/(-) Pamakaian Gas', satuan: plus_minus_penalty_kurs == null ? null : plus_minus_penalty_kurs.satuan, value: plus_minus_penalty_kurs == null ? null : plus_minus_penalty_kurs.value},
        {name:'Nilai Biaya Tagihan USD', satuan: penalty_tagihan_usd == null ? null : penalty_tagihan_usd.satuan, value: penalty_tagihan_usd == null ? null : penalty_tagihan_usd.value},
        {name:'Kurs', satuan: penalty_kurs == null ? null : penalty_kurs.satuan, value: penalty_kurs == null ? null : penalty_kurs.value},
        {name:'Nilai Biaya Tagihan IDR', satuan: penalty_tagihan_idr == null ? null : penalty_tagihan_idr.satuan, value: penalty_tagihan_idr == null ? null : penalty_tagihan_idr.value},
    ]

    // Alokasi Beban
    const alokasi = det_alloc == null ? null : det_alloc.Allocation;
    const alokasi_air = alokasi == null ? null : alokasi.Air;
    const alokasi_gas = alokasi == null ? null : alokasi.Gas;
    const alokasi_listrik = alokasi == null ? null : alokasi.Listrik;
    const list_alokasi = [
        {name: 'Air (m3)', items:[
            {name: 'Pemakaian', value: alokasi_air == null ? null : alokasi_air.totalPemakaianAir_m3, items:[
                {name: 'Refinery', value: alokasi_air == null ? null : alokasi_air.refinery_m3},
                {name: 'Fraksinasi', value: alokasi_air == null ? null : alokasi_air.fraksinasi_m3},
                {name: 'RO', value: alokasi_air == null ? null : alokasi_air.ro},
                {name: 'Waste', value: alokasi_air == null ? null : alokasi_air.other},
                {name: 'Other', value: alokasi_air == null ? null : alokasi_air.waste},
            ]},
            {name: 'Allocation Cost', value: null, items:[
                {name: 'Refinery', value: alokasi_air == null ? null : alokasi_air.refinery_allocation},
                {name: 'Fraksinasi', value: alokasi_air == null ? null : alokasi_air.fraksinasi_allocation},
            ]},
            {name: 'Total Pemakaian Air (Allocation)', value: alokasi_air == null ? null : alokasi_air.totalPemakaianAir_allocation, items:[]},
            {name: '', value: alokasi_air == null ? null : alokasi_air.result, items:[]}
        ]},
        {name: 'Gas (mmbtu)', items:[
            {name: 'Pemakaian', value: alokasi_gas == null ? null : alokasi_gas.totalPemakaianGas_mmbtu, items:[
                {name: 'HP Boiler Refinery', value: alokasi_gas == null ? null : alokasi_gas.hpBoilerRefinery},
                {name: 'MP Boiler 1, 2', value: alokasi_gas == null ? null : alokasi_gas.mpBoiler12},
            ]},
            {name: 'Allocation Cost', value: null, items:[
                {name: 'Refinery', value: alokasi_gas == null ? null : alokasi_gas.refinery_allocation},
                {name: 'Fraksinasi', value: alokasi_gas == null ? null : alokasi_gas.fraksinasi_allocation},
            ]},
            {name: 'Total Pemakaian Gas (Allocation)', value: alokasi_gas == null ? null : alokasi_gas.totalPemakaianGas_allocation, items:[]},
            {name: '', value: alokasi_gas == null ? null : alokasi_gas.result, items:[]}
        ]},
        {name: 'Listrik (kwh)', items:[
            {name: 'Pemakaian', value: alokasi_listrik == null ? null : alokasi_listrik.totalListrik_kwh, items:[
                {name: 'Listrik', value: alokasi_listrik == null ? null : alokasi_listrik.listrik},
            ]},
            {name: 'Allocation Cost', value: null, items:[
                {name: 'Refinery', value: alokasi_listrik == null ? null : alokasi_listrik.refinery_allocation},
                {name: 'Fraksinasi', value: alokasi_listrik == null ? null : alokasi_listrik.fraksinasi_allocation},
            ]},
            {name: 'Total Pemakaian Listrik (Allocation)', value: alokasi_listrik == null ? null : alokasi_listrik.totalPemakaianListrik_allocation, items:[]},
            {name: '', value: alokasi_listrik == null ? null : alokasi_listrik.result, items:[]}
        ]},
    ]

    // Allocation Biaya
    const alokasi_biaya = det_alloc == null ? null : det_alloc.alokasiBiaya.allocation == null ? null : det_alloc.alokasiBiaya.allocation;
    const alloc_biaya_ref = alokasi_biaya == null ? null : alokasi_biaya.find(item => item.nama == 'Refinery').item == null ? null : alokasi_biaya.find(item => item.nama == 'Refinery').item
    const alloc_biaya_frak = alokasi_biaya == null ? null : alokasi_biaya.find(item => item.nama == 'Fraksinasi').item == null ? null : alokasi_biaya.find(item => item.nama == 'Fraksinasi').item
    const all_ref_gas = alloc_biaya_ref == null || alloc_biaya_ref.length == 0 ? null : alloc_biaya_ref.find(item => item.name == 'Steam / Gas') == null ? null : alloc_biaya_ref.find(item => item.name == 'Steam / Gas')
    const all_ref_air = alloc_biaya_ref == null || alloc_biaya_ref.length == 0 ? null : alloc_biaya_ref.find(item => item.name == 'Air') == null ? null : alloc_biaya_ref.find(item => item.name == 'Air')
    const all_ref_listrik = alloc_biaya_ref == null || alloc_biaya_ref.length == 0 ? null : alloc_biaya_ref.find(item => item.name == 'Listrik') == null ? null : alloc_biaya_ref.find(item => item.name == 'Listrik')
    const all_frak_gas = alloc_biaya_frak == null || alloc_biaya_frak.length == 0 ? null : alloc_biaya_frak.find(item => item.name == 'Steam / Gas') == null ? null : alloc_biaya_frak.find(item => item.name == 'Steam / Gas')
    const all_frak_air = alloc_biaya_frak == null || alloc_biaya_frak.length == 0 ? null : alloc_biaya_frak.find(item => item.name == 'Air') == null ? null : alloc_biaya_frak.find(item => item.name == 'Air')
    const all_frak_listrik = alloc_biaya_frak == null || alloc_biaya_frak.length == 0 ? null : alloc_biaya_frak.find(item => item.name == 'Listrik') == null ? null : alloc_biaya_frak.find(item => item.name == 'Listrik')
    const list_allocation_biaya = [
        {name: "Steam / Gas", ref_qty: all_ref_gas == null ? 0 : all_ref_gas.qty, ref_persen: all_ref_gas == null ? 0 : all_ref_gas.percentage, frak_qty: all_frak_gas == null ? 0 : all_frak_gas.qty, frak_persen: all_frak_gas == null ? 0 : all_frak_gas.percentage},
        {name: "Air", ref_qty: all_ref_air == null ? 0 : all_ref_air.qty, ref_persen: all_ref_air == null ? 0 : all_ref_air.percentage, frak_qty: all_frak_air == null ? 0 : all_frak_air.qty, frak_persen: all_frak_air == null ? 0 : all_frak_air.percentage},
        {name: "Listrik", ref_qty: all_ref_listrik == null ? 0 : all_ref_listrik.qty, ref_persen: all_ref_listrik == null ? 0 : all_ref_listrik.percentage, frak_qty: all_frak_listrik == null ? 0 : all_frak_listrik.qty, frak_persen: all_frak_listrik == null ? 0 : all_frak_listrik.percentage},
    ]

    // Allocation Biaya Penyusutan
    const penyusutan_unit = response == null ? null : response.biayaPenyusutanUnit == null ? null : response.biayaPenyusutanUnit
    const unit = penyusutan_unit == null ? null : penyusutan_unit.columns == null || penyusutan_unit.columns.length < 1 ? null : penyusutan_unit.columns
    const unit_qty = unit == null ? null : unit.find(item => item.name == "Qty") == null ? null : unit.find(item => item.name == "Qty");
    const unit_persen = unit == null ? null : unit.find(item => item.name == "%") == null ? null : unit.find(item => item.name == "%");
    
    const penyusutan_aux = response == null ? null : response.biayaPenyusutanAuxiliary == null ? null : response.biayaPenyusutanAuxiliary
    const aux = penyusutan_aux == null ? null : penyusutan_aux.columns == null || penyusutan_aux.columns.length < 1 ? null : penyusutan_aux.columns
    const aux_qty = aux == null ? null : aux.find(item => item.name == "Qty") == null ? null : aux.find(item => item.name == "Qty");
    const aux_persen = aux == null ? null : aux.find(item => item.name == "%") == null ? null : aux.find(item => item.name == "%");
    
    const penyusutan_alloc = response == null ? null : response.biayaPenyusutanAllocation == null ? null : response.biayaPenyusutanAllocation
    const alloc = penyusutan_alloc == null ? null : penyusutan_alloc.columns == null || penyusutan_alloc.columns.length < 1 ? null : penyusutan_alloc.columns
    const alloc_qty = alloc == null ? null : alloc.find(item => item.name == "Qty") == null ? null : alloc.find(item => item.name == "Qty");
    const alloc_persen = alloc == null ? null : alloc.find(item => item.name == "%") == null ? null : alloc.find(item => item.name == "%");
    const total = {unit_qty: unit_qty == null ? 0 : unit_qty.total, unit_persen: unit_persen == null ? 0 : unit_persen.total, aux_qty: aux_qty == null ? 0 : aux_qty.total, aux_persen: aux_persen == null ? 0 : aux_persen.total, alloc_qty: alloc_qty == null ? 0 : alloc_qty.total, alloc_persen: alloc_persen == null ? 0 : alloc_persen.total}
    let list_biaya_peyusutan = [
        {name:'Refinery', unit_qty: 0, unit_persen: 0, aux_qty: 0, aux_persen: 0, alloc_qty: 0, alloc_persen: 0},
        {name:'Fraksinasi', unit_qty: 0, unit_persen: 0, aux_qty: 0, aux_persen: 0, alloc_qty: 0, alloc_persen: 0},
        {name:'Packaging', unit_qty: 0, unit_persen: 0, aux_qty: 0, aux_persen: 0, alloc_qty: 0, alloc_persen: 0},
        {name:'Auxiliary', unit_qty: 0, unit_persen: 0, aux_qty: 0, aux_persen: 0, alloc_qty: 0, alloc_persen: 0},
    ]
    // for unit
    if (unit_qty != null ) {
        const unit_qty_list = unit_qty.alokasi
        for (let i = 0; i < list_biaya_peyusutan.length; i++) {
            const result = unit_qty_list.find(item => item.name == list_biaya_peyusutan[i].name)
            list_biaya_peyusutan[i].unit_qty = Number(result.value)
        }
    }
    if (unit_persen != null ) {
        const unit_persen_list = unit_persen.alokasi
        for (let i = 0; i < list_biaya_peyusutan.length; i++) {
            const result = unit_persen_list.find(item => item.name == list_biaya_peyusutan[i].name)
            list_biaya_peyusutan[i].unit_persen = Number(result.value)
        }
    }
    // for auxiliary
    if (aux_qty != null ) {
        const aux_qty_list = aux_qty.alokasi
        for (let i = 0; i < list_biaya_peyusutan.length; i++) {
            const result = aux_qty_list.find(item => item.name == list_biaya_peyusutan[i].name)
            list_biaya_peyusutan[i].aux_qty = Number(result.value)
        }
    }
    if (aux_persen != null ) {
        const aux_persen_list = aux_persen.alokasi
        for (let i = 0; i < list_biaya_peyusutan.length; i++) {
            const result = aux_persen_list.find(item => item.name == list_biaya_peyusutan[i].name)
            list_biaya_peyusutan[i].aux_persen = Number(result.value)
        }
    }
    // for allocation
    if (alloc_qty != null ) {
        const alloc_qty_list = alloc_qty.alokasi
        for (let i = 0; i < list_biaya_peyusutan.length; i++) {
            const result = alloc_qty_list.find(item => item.name == list_biaya_peyusutan[i].name)
            list_biaya_peyusutan[i].alloc_qty = Number(result.value)
        }
    }
    if (alloc_persen != null ) {
        const alloc_persen_list = alloc_persen.alokasi
        for (let i = 0; i < list_biaya_peyusutan.length; i++) {
            const result = alloc_persen_list.find(item => item.name == list_biaya_peyusutan[i].name)
            list_biaya_peyusutan[i].alloc_persen = Number(result.value)
        }
    }

    // Allocation Production
    const production = response == null ? null : response.totalProduction == null ? null : response.totalProduction;
    const list_prod = production == null ? null : production.production == null || production.production.length < 1 ? null : production.production;
    const total_alloc_produksi = {total: production == null ? null : production.totalAllProductionPercentage, persen:  production == null ? null : production.totalAllProduction};
    let list_alokasi_produksi = [
        {name: 'Refinery', prod: 0, prod_all: 0, iv_56: 0, iv_57: 0, iv_58: 0, iv_60: 0},
        {name: 'Fraksinasi', prod: 0, prod_all: 0, iv_56: 0, iv_57: 0, iv_58: 0, iv_60: 0},
        {name: 'Packaging', prod: 0, prod_all: 0, iv_56: 0, iv_57: 0, iv_58: 0, iv_60: 0},
    ]
    // for Total & Percentage
    if (list_prod != null) {
        for (let i = 0; i < list_alokasi_produksi.length; i++) {
            const produks = list_prod.find(item => item.name == list_alokasi_produksi[i].name);
            const prod_iv_56 = produks.items == null ? null : produks.items.find(item => item.name.toLowerCase().includes('iv-56'))
            const prod_iv_57 = produks.items == null ? null : produks.items.find(item => item.name.toLowerCase().includes('iv-57'))
            const prod_iv_58 = produks.items == null ? null : produks.items.find(item => item.name.toLowerCase().includes('iv-58'))
            const prod_iv_60 = produks.items == null ? null : produks.items.find(item => item.name.toLowerCase().includes('iv-60'))
            list_alokasi_produksi[i].prod = produks.percentage;
            list_alokasi_produksi[i].prod_all = produks.total;
            list_alokasi_produksi[i].iv_56 = prod_iv_56 == null ? 0 : prod_iv_56.value;
            list_alokasi_produksi[i].iv_57 = prod_iv_57 == null ? 0 : prod_iv_57.value;
            list_alokasi_produksi[i].iv_58 = prod_iv_58 == null ? 0 : prod_iv_58.value;
            list_alokasi_produksi[i].iv_60 = prod_iv_60 == null ? 0 : prod_iv_60.value;
        }
    }

    // Result
    const list_all = [
        {name:'list_pemakaian_gas', item:list_pemakaian_gas},
        {name:'list_penalty_gas', item:list_penalty_gas},
        {name:'list_alokasi', item:list_alokasi},
        {name:'list_allocation_biaya', item:list_allocation_biaya},
        {name:'list_biaya_peyusutan', item:list_biaya_peyusutan, total:total},
        {name:'list_alokasi_produksi', item:list_alokasi_produksi, total: total_alloc_produksi},
    ]

    return list_all
}