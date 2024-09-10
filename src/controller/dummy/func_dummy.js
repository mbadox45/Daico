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
            categories: labels,
            tickPlacement: 'on',
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
            offsetY: -20, // moves the label above the bar
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
          height: 350,
          stacked: true,
          toolbar: {
              show: true
          },
          zoom: {
              enabled: true
          }
      },
      responsive: [{
          breakpoint: 480,
          options: {
              legend: {
                  position: 'bottom',
                  offsetX: -10,
                  offsetY: 0
              }
          }
      }],
      plotOptions: {
          bar: {
              horizontal: false,
              borderRadius: 10,
              borderRadiusApplication: 'end', // 'around', 'end'
              borderRadiusWhenStacked: 'last', // 'all', 'last'
              dataLabels: {
                  total: {
                      enabled: true,
                      style: {
                          fontSize: '10px',
                          fontWeight: 300
                      },
                      formatter: function(val) {
                        if (val >= 1000) {
                          return (parseFloat(val) / 1000).toFixed(2) + 'K';
                        }
                        return parseFloat(val).toFixed(2);
                      }
                  }
              }
          },
      },
      title: {
          text: total,
          style: {
              fontSize: '12px',
          }
      },
      labels: listLabels,
      dataLabels: {
          enabled: true,
          style: {
              fontSize: '8px', // Reduced font size for data labels inside the bar
              fontWeight: 'bold',
              colors: ['#fff'], // You can change the color if needed
          },
          formatter: function(val) {
            if (val >= 1000) {
              return (parseFloat(val) / 1000).toFixed(2) + 'K';
            }
            return parseFloat(val).toFixed(2);
          }
      },
      xaxis: {
          tickPlacement: 'on',
          labels: {
              formatter: function (val) {
                if (val >= 1000) {
                  return (parseFloat(val) / 1000).toFixed(1) + 'K';
                }
                return parseFloat(val).toFixed(2);
              }
          }
      },
      yaxis: {
          labels: {
              formatter: function (val) {
                if (val >= 1000) {
                  return (parseFloat(val) / 1000).toFixed(1) + 'K';
                }
                return parseFloat(val).toFixed(2);
              }
          }
      },
      legend: {
          position: 'bottom',
          offsetX: 40
      },
      fill: {
          opacity: 1
      }
  };  
}
