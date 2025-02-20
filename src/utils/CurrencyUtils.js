export function formatCurrency(amount) {
    const number = parseFloat(amount);
    if (isNaN(number)) {
        return 'Invalid number';
    }

    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,  // Menghindari desimal
        useGrouping: true        // Mengaktifkan pemisah ribuan
    }).format(number);
}