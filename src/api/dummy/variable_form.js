import moment from 'moment';


// CPO Form
export const cpo_kpbn = {
    id: null,
    tanggal: moment().format('YYYY-MM-DD'),
    avg: null
}

export const actual_cpo = {
    id: null,
    tanggal: moment().format('YYYY-MM-DD'),
    qty: null,
    harga: null,
}

export const outstanding_cpo = {
    id: null,
    kontrak: null,
    supplier: null,
    qty: null,
    harga: null,
}

// Config Form
export const debe = {
    id: null,
    coa: null,
    id_category3: null,
    id_m_report: null,
    id_c_centre: null,
    id_plant: null,
    id_allocation: null,
}

export const master = {
    id: null,
    nama: null,
}

export const m_router = [
    {
        cond: 'add',
        id: null,
        id_bulky: null,
        name_bulk: null,
        tanggal: moment().format('YYYY-MM-DD'),
        currency_id: 2,
        nilai: null
    },
]

export const levy_duty = [
    {
        cond: 'add',
        id: null,
        id_bulky: null,
        name_bulk: null,
        tanggal: moment().format('YYYY-MM-DD'),
        currency_id: 2,
        nilai: null
    },
]