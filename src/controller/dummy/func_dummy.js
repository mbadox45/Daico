export const formatCurrency = (amount) => {
    let parts = amount.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    return parts.join(',');
}

export const msg_success = {
    status: true,
    code: 200,
    msg: 'Data berhasil disimpan.',
}

export const msg_warning = {
    status: false,
    code: 400,
    msg: 'Proses Gagal, silahkan dicoba beberapa saat lagi.',
}

export const msg_error = {
    status: false,
    code: 404,
    msg: 'Proses Gagal, data sudah tersedia. Jika belum tersedia silahkan dicoba beberapa saat lagi.',
}