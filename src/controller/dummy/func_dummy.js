export const formatCurrency = (amount) => {
    let parts = amount.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    return parts.join(',');
}