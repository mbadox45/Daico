import moment from 'moment';

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