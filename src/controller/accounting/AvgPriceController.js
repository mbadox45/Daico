import InitialSupply from "@/api/avg_price/InitialSupply.js";

export const loadByPeriodRekap_DetAllocController = async(tgl) => {
    try {
        const response = await InitialSupply.getByDateRecap({tanggal: tgl});
        const load = response.data;
        const data = load.data
        return data;
    } catch (error) {
        return null;
    }
}

export const loadByPeriod_AvgPriceController = async(tgl) => {
    try {
        const response = await InitialSupply.getByDate({tanggal: tgl});
        const load = response.data;
        const data = load.data
        return data;
    } catch (error) {
        return null;
    }
}

export const loadPersediaanAwal = async(data) => {
    const list = []
    const persediaan = data == null ? null : data.persediaanAwal == null ? null : data.persediaanAwal;
    const items = persediaan == null ? null : persediaan.items == null || persediaan.items.length < 0 ? null : persediaan.items;
    if (items != null) {
        for (let i = 0; i < items.length; i++) {
            const product = items[i].product_id == null ? null : items[i].product;
            const productable_id = product == null ? null : product.id;
            const type = product == null ? null : product.productable_type.split('Master')[1];
            const product_type = type == null ? null : type == 'Bulky' ? 'bulk' : type == 'Product' ? 'product' : 'subproduct';
            const category = product == null ? null : `${product.productable.name} (${product.nama})`
            list.push({
                id: items[i].id,
                product_id: items[i].product_id,
                nama: items[i].nama,
                tanggal: items[i].tanggal,
                productable_id: productable_id,
                product_type: product_type,
                category: product == null ? items[i].nama : category,
                harga: items[i].harga,
                jumlah: items[i].jumlah,
                qty: items[i].qty,
            })
        }
    }
    const result = {
        tot_qty: persediaan == null ? 0 : persediaan.totalQty,
        tot_harga: persediaan == null ? 0 : persediaan.totalHarga,
        tot_jumlah: persediaan == null ? 0 : persediaan.totalJumlah,
        list: list,
    }
    return result;
}

export const loadPersediaanAwal2 = async(data) => {
    const list = []
    const persediaan = data;
    const items = persediaan == null ? null : persediaan.items == null || persediaan.items.length < 0 ? null : persediaan.items;
    if (items != null) {
        for (let i = 0; i < items.length; i++) {
            const product = items[i].product_id == null ? null : items[i].product;
            const productable_id = product == null ? null : product.id;
            const type = product == null ? null : product.productable_type.split('Master')[1];
            const product_type = type == null ? null : type == 'Bulky' ? 'bulk' : type == 'Product' ? 'product' : 'subproduct';
            const category = product == null ? null : `${product.productable.name} (${product.nama})`
            list.push({
                id: items[i].id,
                product_id: items[i].product_id,
                nama: items[i].nama,
                tanggal: items[i].tanggal,
                productable_id: productable_id,
                product_type: product_type,
                category: product == null ? items[i].nama : category,
                harga: items[i].harga,
                jumlah: items[i].jumlah,
                qty: items[i].qty,
            })
        }
    }
    const result = {
        tot_qty: persediaan == null ? 0 : persediaan.totalQty,
        tot_harga: persediaan == null ? 0 : persediaan.totalHarga,
        tot_jumlah: persediaan == null ? 0 : persediaan.totalJumlah,
        list: list,
    }
    return result;
}

export const loadQtyBebanProduksi = async(data) => {
    const list = []
    const beban = data == null ? null : data.produksiBebanProduksi == null ? null : data.produksiBebanProduksi;
    console.log(beban);

    let tot_qty = 0, tot_jumlah = 0, tot_harga = 0 ;
    if (beban != null) {
        const items = beban.items 
        const qtyBebanProduksiArray = Object.keys(items).map(key => ({
            nama: items[key].name,
            qty: items[key].qty,
            rpPerKg: items[key].rpPerKg,
            jumlah: items[key].jumlah
        }));

        const categorizeNama = (nama) => {
            let kategori;
        
            if (nama.toLowerCase().includes('56') || nama.toLowerCase().includes('minyakita')) {
                kategori = 'RBD Olein (IV-56)';
            } else if (nama.toLowerCase().includes('57') || nama.toLowerCase().includes('inl')) {
                kategori = 'RBD Olein (IV-57)';
            } else if (!nama.toLowerCase().includes('kemasan') && !nama.toLowerCase().includes('bulk')) {
                kategori = nama;
            } else if (nama.toLowerCase().includes('58')) {
                kategori = 'RBD Olein (IV-58)';
            } else {
                kategori = 'RBD Olein (IV-60)';
            }
        
            return kategori;
        }

        const listByCategory = []
        for (let i = 0; i < qtyBebanProduksiArray.length; i++) {
            listByCategory.push({
                nama: qtyBebanProduksiArray[i].nama,
                category: categorizeNama(qtyBebanProduksiArray[i].nama),
                harga: qtyBebanProduksiArray[i].rpPerKg,
                jumlah: qtyBebanProduksiArray[i].jumlah,
                qty: qtyBebanProduksiArray[i].qty,
            })
        }

        const renameMapping = (name) => {
            if (name.startsWith('kemasan')) {
              const newName = name.replace('kemasan', 'Kemasan');
              const bracketedName = newName.replace(/Kemasan(\w+)/, 'Kemasan ($1)');
              return bracketedName;
            } else if (name.startsWith('bulk')) {
              return 'Bulk';
            } else if (name.startsWith('rbdStearin')) {
              return 'RBD Stearin';
            } else {
              return name.toUpperCase();
            }
          };
          
          const renamedData = listByCategory.map(item => ({
            ...item,
            nama: renameMapping(item.nama)
          }));
        
        for (let i = 0; i < renamedData.length; i++) {
            const kategori = renamedData[i].category == 'rbdStearin' ? 'RBD Stearin' : renamedData[i].category
            list.push({
                nama: renamedData[i].nama,
                category: kategori,
                harga: renamedData[i].harga,
                jumlah: renamedData[i].jumlah,
                qty: renamedData[i].qty,
            })
        }
    
        // Total
        for (let i = 0; i < list.length; i++) {
            tot_qty += list[i].qty;
            tot_jumlah += list[i].jumlah;
        }

        tot_harga = tot_jumlah / tot_qty;
    }
    const result = {
        tot_qty: tot_qty,
        tot_harga: tot_harga,
        tot_jumlah: tot_jumlah,
        list: list,
    }
    return result;
}

export const loadBebanBlending = async(data) => {
    const list = []
    const beban = data == null ? null : data.bebanBlendingDowngrade == null ? null : data.bebanBlendingDowngrade;

    let tot_qty = 0, tot_jumlah = 0, tot_harga = 0 ;
    if (beban != null) {
        const items = beban.items 
        const qtyBebanProduksiArray = Object.keys(items).map(key => ({
            nama: items[key].name,
            qty: items[key].qty,
            rpPerKg: items[key].rpPerKg,
            jumlah: items[key].jumlah
        }));

        const categorizeNama = (nama) => {
            let kategori;
        
            if (nama.toLowerCase().includes('56') || nama.toLowerCase().includes('minyakita')) {
                kategori = 'RBD Olein (IV-56)';
            } else if (nama.toLowerCase().includes('57') || nama.toLowerCase().includes('inl')) {
                kategori = 'RBD Olein (IV-57)';
            } else if (!nama.toLowerCase().includes('kemasan') && !nama.toLowerCase().includes('bulk')) {
                kategori = nama;
            } else if (nama.toLowerCase().includes('58')) {
                kategori = 'RBD Olein (IV-58)';
            } else {
                kategori = 'RBD Olein (IV-60)';
            }
        
            return kategori;
        }

        const listByCategory = []
        for (let i = 0; i < qtyBebanProduksiArray.length; i++) {
            listByCategory.push({
                nama: qtyBebanProduksiArray[i].nama,
                category: categorizeNama(qtyBebanProduksiArray[i].nama),
                harga: qtyBebanProduksiArray[i].rpPerKg,
                jumlah: qtyBebanProduksiArray[i].jumlah,
                qty: qtyBebanProduksiArray[i].qty,
            })
        }

        const renameMapping = (name) => {
            if (name.startsWith('kemasan')) {
              const newName = name.replace('kemasan', 'Kemasan');
              const bracketedName = newName.replace(/Kemasan(\w+)/, 'Kemasan ($1)');
              return bracketedName;
            } else if (name.startsWith('bulk')) {
              return 'Bulk';
            } else if (name.startsWith('rbdStearin')) {
              return 'RBD Stearin';
            } else {
              return name.toUpperCase();
            }
          };
          
          const renamedData = listByCategory.map(item => ({
            ...item,
            nama: renameMapping(item.nama)
          }));
        
        for (let i = 0; i < renamedData.length; i++) {
            const kategori = renamedData[i].category == 'rbdStearin' ? 'RBD Stearin' : renamedData[i].category
            list.push({
                nama: renamedData[i].nama,
                category: kategori,
                harga: renamedData[i].harga,
                jumlah: renamedData[i].jumlah,
                qty: renamedData[i].qty,
            })
        }
    
        // Total
        for (let i = 0; i < list.length; i++) {
            tot_qty += list[i].qty;
            tot_jumlah += list[i].jumlah;
        }

        tot_harga = tot_jumlah / tot_qty;
    }
    const result = {
        tot_qty: tot_qty,
        tot_harga: tot_harga,
        tot_jumlah: tot_jumlah,
        list: list,
    }
    return result;
}

export const loadStokTersedia = async(data) => {
    const list = []
    const beban = data == null ? null : data.stockTersedia == null ? null : data.stockTersedia;

    let tot_qty = 0, tot_jumlah = 0, tot_harga = 0 ;
    if (beban != null) {
        const items = beban.items 
        const qtyBebanProduksiArray = Object.keys(items).map(key => ({
            nama: items[key].name,
            qty: items[key].qty,
            rpPerKg: items[key].rpPerKg,
            jumlah: items[key].jumlah
        }));

        const categorizeNama = (nama) => {
            let kategori;
        
            if (nama.toLowerCase().includes('56') || nama.toLowerCase().includes('minyakita')) {
                kategori = 'RBD Olein (IV-56)';
            } else if (nama.toLowerCase().includes('57') || nama.toLowerCase().includes('inl')) {
                kategori = 'RBD Olein (IV-57)';
            } else if (!nama.toLowerCase().includes('kemasan') && !nama.toLowerCase().includes('bulk')) {
                kategori = nama;
            } else if (nama.toLowerCase().includes('58')) {
                kategori = 'RBD Olein (IV-58)';
            } else {
                kategori = 'RBD Olein (IV-60)';
            }
        
            return kategori;
        }

        const listByCategory = []
        for (let i = 0; i < qtyBebanProduksiArray.length; i++) {
            listByCategory.push({
                nama: qtyBebanProduksiArray[i].nama,
                category: categorizeNama(qtyBebanProduksiArray[i].nama),
                harga: qtyBebanProduksiArray[i].rpPerKg,
                jumlah: qtyBebanProduksiArray[i].jumlah,
                qty: qtyBebanProduksiArray[i].qty,
            })
        }

        const renameMapping = (name) => {
            if (name.startsWith('kemasan')) {
              const newName = name.replace('kemasan', 'Kemasan');
              const bracketedName = newName.replace(/Kemasan(\w+)/, 'Kemasan ($1)');
              return bracketedName;
            } else if (name.startsWith('bulk')) {
              return 'Bulk';
            } else if (name.startsWith('rbdStearin')) {
              return 'RBD Stearin';
            } else {
              return name.toUpperCase();
            }
          };
          
          const renamedData = listByCategory.map(item => ({
            ...item,
            nama: renameMapping(item.nama)
          }));
        
        for (let i = 0; i < renamedData.length; i++) {
            const kategori = renamedData[i].category == 'rbdStearin' ? 'RBD Stearin' : renamedData[i].category
            list.push({
                nama: renamedData[i].nama,
                category: kategori,
                harga: renamedData[i].harga,
                jumlah: renamedData[i].jumlah,
                qty: renamedData[i].qty,
            })
        }
    
        // Total
        for (let i = 0; i < list.length; i++) {
            tot_qty += list[i].qty;
            tot_jumlah += list[i].jumlah;
        }

        tot_harga = tot_jumlah / tot_qty;
    }
    const result = {
        tot_qty: tot_qty,
        tot_harga: tot_harga,
        tot_jumlah: tot_jumlah,
        list: list,
    }
    return result;
}