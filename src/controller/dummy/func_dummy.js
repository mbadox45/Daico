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

export const barChartOptionsApex = (labels, color, strokeColor, dataLabelStat, total) => {
    return {
        chart: {
            toolbar: {
                show: true
            }
        },
        title: {
            text: total,
            style: {
              fontSize: '12px',
            }
        },
        xaxis: {
            categories: labels
        },
        plotOptions: {
            bar: {
                dataLabels: {
                    position: 'top'
                }
            }
        },
        dataLabels: {
            enabled: dataLabelStat, // enables labels
            style: {
                colors: ['#000'], // sets label text color to black
            },
            offsetY: -10, // moves the label above the bar
        },
        colors: color,
        stroke: { 
            show: true,
            width: 1,
            colors: strokeColor,
        }
    };
}

export const comboChartOptionsApex = (total, label1, label2, listLabels, colors, scale1, scale2) => {
    return {
        chart: {
          height: 350,
          type: 'line',
        },
        stroke: {
          width: [2, 4],
          curve: 'smooth'
        },
        title: {
          text: total,
          style: {
            fontSize: '12px',
          }
        },
        colors: colors,
        dataLabels: {
            enabled: false,
            enabledOnSeries: [0],
            style: {
              fontSize: '10px',
              colors: ['#000']
            },
            background: {
              enabled: false,
            },
            formatter: function (val) {
                if (val >= 1000) {
                    return (val / 1000).toFixed(1) + 'K';
                }
                return val.toFixed(2);
            }
        },
        plotOptions: {
            dataLabels: {
                offsetY: 10,
            },
            bar: {
                colors: {
                    ranges: [
                        {
                            from: -Infinity,
                            to: 0,
                            color: 'rgb(255, 0, 0)'
                        }
                    ]
                },
            }
        },
        labels: listLabels,
        yaxis: [{
            title: {
              text: label2,
            },
            labels: {
              formatter: function (val) {
                if (scale2 === 'percent') {
                  if (val >= 1000) {
                    return ((val / 1000).toFixed(1)) + 'K%';
                  }
                  return val.toFixed(2) + '%';
                } else {
                  if (val >= 1000) {
                    return (val / 1000).toFixed(1) + 'K';
                  }
                  return val.toFixed(2);
                }
              }
            }
        }, 
        {
            opposite: true,
            title: {
              text: label1
            },
            labels: {
              formatter: function (val) {
                if (scale1 === 'percent') {
                  if (val >= 1000) {
                    return ((val / 1000).toFixed(1)) + 'K%';
                  }
                  return val.toFixed(2) + '%';
                } else {
                  if (val >= 1000) {
                    return (val / 1000).toFixed(1) + 'K';
                  }
                  return val;
                }
              }
            }
        }]
    }
}

export const stackedChartOptionsApex = (total, listLabels) => {
    return {
        chart: {
          type: 'bar',
          height: 300,
          stacked: true,
        },
        plotOptions: {
          bar: {
            horizontal: false,
            dataLabels: {
              enabled: true,
              total: {
                enabled: true,
                offsetX: 0,
                style: {
                  fontSize: '10px',
                  fontWeight: 900
                },
                formatter: function(val) {
                    return parseFloat(val).toFixed(2);
                }
              }
            }
          },
        },
        dataLabels: {
          enabled: true,
          style: {
            fontSize: '10px', // Reduce the font size inside the bars
            fontWeight: 'bold',
            colors: ['#fff'], // Optional: You can set a color if needed
          }
        },
        stroke: {
          width: 1,
          colors: ['#fff']
        },
        title: {
          text: total
        },
        yaxis: {
          labels: {
            formatter: function (val) {
              return val;
            }
          }
        },
        xaxis: {
          categories: listLabels,
          title: {
            text: undefined
          },
        },
        tooltip: {
          x: {
            formatter: function (val) {
              return val + "K";
            }
          }
        },
        fill: {
          opacity: 1
        },
        legend: {
          position: 'top',
          horizontalAlign: 'left',
          offsetX: 40
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

export const setChartStackedBarData3 = (labels, data1, data2, data3, label1, label2, label3, type) =>  {
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
            }
        ]
        
    };
};

export const setChartStackedBarOptions = () => {
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
