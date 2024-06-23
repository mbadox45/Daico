import {loadTank, loadProduct, loadLocation} from '@/views/load_data/master_config.js'

const formulaMt = [
    {sub: '1L', formula: (12 * 1) * 0.905 / 1000},
    {sub: '2L', formula: (6 * 2) * 0.905 / 1000},
    {sub: '250 ML', formula: (48 * 0.25) * 0.905 / 1000},
    {sub: '450 ML', formula: (24 * 0.45) * 0.905 / 1000},
    {sub: '900 ML', formula: (12 * 0.9) * 0.905 / 1000},
    {sub: '1800 ML', formula: (6 * 1.8) * 0.905 / 1000},
]

export const loadRetail = async() => {
    const produk = await loadProduct()
    const lokasi = await loadLocation()
    const retail = produk.filter(item => item.productable_type == "App\\Models\\MasterRetail");
    const site = lokasi.filter(item => item.id >= 4)
    const items = []
    for (let i = 0; i < retail.length; i++) {
        const sub = retail[i].sub_product
        for (let j = 0; j < sub.length; j++) {
            const formula = formulaMt.find(item => item.sub == sub[j].nama)
            items.push({
                produk: `${retail[i].nama} ${retail[i].productable.name} ${sub[j].nama}`,
                productable_id: sub[j].id,
                productable_type: retail[i].productable_type,
                tanggal: null,
                sub_product: sub[j].nama,
                product_type: 'produk',
                location_id: null,
                ctn: null,
                mt: formula.formula || null,
                pallet: null,
            })
        }
    }
    const data = []
    for (let i = 0; i < site.length; i++) {
        data.push({
            location_id: site[i].id,
            lokasi: site[i].name,
            items: items
        })
    }

    return data;
}