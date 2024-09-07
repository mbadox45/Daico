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

export const productableType = async(post) => {
    const data = post.split('\\').pop().replace('Master', '');
    const result = data.toLowerCase()
    return result;
}

export const setPieChartData = (data1, data2, label) => {
    const documentStyle = getComputedStyle(document.body);
    
    return {
        labels: label,
        datasets: [
            {
                data: [data1, data2],
                backgroundColor: [documentStyle.getPropertyValue('--blue-500'), documentStyle.getPropertyValue('--orange-500')],
                hoverBackgroundColor: [documentStyle.getPropertyValue('--blue-400'), documentStyle.getPropertyValue('--orange-400')],
                borderWidth: 1,
                borderRadius: 5,
            }
        ],
    };
}

export const setPieChartOptions = () => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    return {
        plugins: {
            legend: {
                labels: {
                    cutout: '60%',
                    color: textColor,
                    rotation: 0,
                },
                display: false,
            },
        },
        options: {
            layout: {
                padding: {
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            rotation: -0.5 * Math.PI,
        }
    };
};

export const setBasicBarChartData = (data, labels, label, type) => {
    return {
        labels: labels,
        datasets: [
            {   
                type: type,
                label: label,
                data: data,
                backgroundColor: ['rgba(6, 182, 212, 0.2)'],
                borderColor: ['rgb(6, 182, 212)'],
                borderWidth: 2,
                fill: false,
                tension: 0.4,
                yAxisID: 'y',
            }
        ]
    };
};

export const setBasicBarChartOptions = () => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
    const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

    return {
        plugins: {
            legend: {
                labels: {
                    color: textColor
                }
            },
            datalabels: {
                display: false // Disable data labels for line charts
            }
        },
        scales: {
            x: {
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder
                }
            },
            y: {
                beginAtZero: true,
                ticks: {
                    color: textColorSecondary,
                },
                grid: {
                    color: surfaceBorder
                },
            }
        }
    };
}

export const setChartOptionsCpoKpbn = (labels) => {
    return {
        chart: {
            id: 'cpoKPBNChartMonth',
            toolbar: {
                show: true
            }
        },
        xaxis: {
            categories: labels
        },
        // title: {
        //     text: 'CPO KPBN'
        // },
        plotOptions: {
            bar: {
                dataLabels: {
                    position: 'top'
                }
            }
        },
        dataLabels: {
            enabled: false
        },
        colors: ['rgba(249, 115, 22, 0.2)'],
        stroke: { 
            show: true,
            width: 1,
            colors: ['rgb(249, 115, 22)'],
        }
    };
}

export const setChartDataCombo = (labels, data1, data2, label1, label2, backgroundColor1, borderColor1, backgroundColor2, borderColor2, type1, type2) => {
    const backgroundColor2Dynamic = data2.map(value => value < 0 ? 'rgba(250, 119, 5, 0.5)' : backgroundColor2);
    const borderColor2Dynamic = data2.map(value => value < 0 ? 'rgba(255, 0, 0, 1)' : borderColor2);

    return {
        labels: labels,
        datasets: [
            {
                type: type1,
                label: label1,
                backgroundColor: backgroundColor1,
                borderColor: borderColor1,
                borderWidth: 2,
                fill: false,
                tension: 0.4,
                yAxisID: 'y',
                data: data1
            },
            {
                type: type2,
                label: label2,
                backgroundColor: backgroundColor2Dynamic,
                borderColor: borderColor2Dynamic,
                borderWidth: 2,
                yAxisID: 'y1',
                data: data2
            }
        ]
    };
};
export const setChartOptionsCombo = (options1, options2) => {
    return {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                position: 'left', 
                ticks: {
                    callback: function(value) {
                        if (value >= 1000) {
                            return (value / 1000) + 'k';
                        }
                        return value;
                    }
                },
                ticks: {
                    callback: function(value) {
                        if (options1 === 'percent') {
                            return value + '%';
                        } else if (value >= 1000) {
                            return (value / 1000) + 'k';
                        }
                        return value;
                    }
                }
            },
            y1: {
                beginAtZero: true,
                position: 'right',
                grid: {
                    drawOnChartArea: false,
                },
                ticks: {
                    callback: function(value) {
                        if (options2 === 'percent') {
                            return value + '%';
                        }
                        return value;
                    }
                }
            },
        },
        plugins: {
            legend: {
                display: true,
                position: 'top',
            },
            tooltip: {
                mode: 'index',
                intersect: false
            }
        },
        interaction: {
            mode: 'index',
            intersect: false
        }
    };
};

export const setChartStackedBarData = (labels, data1, data2, data3, data4, label1, label2, label3, label4, type) =>  {
    return {
        labels: labels,
        datasets: [
            {
                type: type,
                label: label1,
                backgroundColor: 'rgba(6, 182, 212, 1)',
                data: data1
            },
            {
                type: type,
                label: label2,
                backgroundColor: 'rgba(107, 114, 128, 1)',
                data: data2
            },
            {
                type: type,
                label: label3,
                backgroundColor: 'rgba(249, 115, 22, 1)',
                data: data3
            },
            {
                type: type,
                label: label4,
                backgroundColor: 'rgba(236, 72, 153, 1)',
                data: data4
            }
        ]
        
    };
};

export const setChartStackedBarOptions = (data1, data2, data3, data4) => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
    const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

    return {
        maintainAspectRatio: false,
        aspectRatio: 0.8,
        plugins: {
            legend: {
                labels: {
                    color: textColor
                }
            },
        },
        scales: {
            x: {
                stacked: true,
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder
                }
            },
            y: {
                stacked: true,
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder
                }
            }
        }
    };
};
