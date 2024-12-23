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
            width: 3,
            colors: strokeColor,
        }
    };
}

export const barChartOptionsApex2 = (labels, color, strokeColor, dataLabelStat, total) => {
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
      yaxis: {
        labels: {
          formatter: function(val) {
            if (val >= 1000 && val < 100000) {
              return (val.toLocaleString() ); // Convert to thousands and add 'K'
            } else if (val >= 100000 && val < 1000000) {
              return (val / 1000).toFixed(2) + ' rb'; // Convert to thousands and add 'K'
            } if (val >= 1000000) {
              return (val / 1000000).toFixed(2) + ' jt'; // Convert to thousands and add 'K'
            } else {
              return val;
            }
            return val; // Return the value as-is if it's below 1000
          },
          style: {
            fontSize: '12px'
          }
        }
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
          width: 3,
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

export const barStackedChartOptionsApex = (total, labels) =>{
  return {
    chart: {
      type: 'bar',
      height: 350,
      stacked: true,
    },
    plotOptions: {
      bar: {
        horizontal: true,
        dataLabels: {
          total: {
            enabled: true,
            offsetX: 0,
            style: {
              fontSize: '13px',
              fontWeight: 600
            }
          }
        }
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: '10px', // Reduced font size for data labels inside the bar
        fontWeight: 'bold',
        colors: ['#fff'], // You can change the color if needed
      },
      formatter: function(val) {
          return parseFloat(val).toFixed(2);
      }
  },
    stroke: {
      width: 1,
      colors: ['#fff']
    },
    title: {
      text: total
    },
    xaxis: {
      categories: labels,
      labels: {
        formatter: function (val) {
          return val + "K"
        }
      }
    },
    yaxis: {
      title: {
        text: undefined
      },
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + "K"
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
  }
}

export const stackedChartOptionsApexNew = (total, listLabels, toolbar) => {
  return {
    chart: {
      type: 'bar',
      height: 350,
      stacked: true,
      toolbar: {
        show: toolbar !== null ? toolbar : true
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
    // plotOptions: {
    //   bar: {
    //     horizontal: false,
    //     borderRadius: 10,
    //     borderRadiusApplication: 'end',
    //     borderRadiusWhenStacked: 'last',
    //     // columnWidth: columnWidth !== null ? columnWidth : '80%', // Adjust this value to reduce/increase bar width
    //     dataLabels: {
    //       total: {
    //         enabled: true,
    //         style: {
    //           fontSize: '10px',
    //           fontWeight: 300
    //         },
    //         formatter: function(val) {
    //             return parseFloat(val).toFixed(2);
    //         }
    //       }
    //     }
    //   },
    // },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 5,
        borderRadiusApplication: 'end'
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
            return parseFloat(val).toFixed(2);
        }
    },
    xaxis: {
      tickPlacement: 'on',
    },
    yaxis: {
      labels: {
        formatter: function(val) {
          if (val >= 1000) {
            return (val / 1000).toFixed(1) + 'K'; // Convert to thousands and append 'K'
          }
          return val;
        },
        style: {
          fontSize: '10px' // Adjust the font size if needed
        }
      }
    },
    legend: {
      position: 'bottom',
      horizontalAlign: 'left', // Center the legend horizontally
      // floating: false, // Set to false to make sure it does not float
      offsetY: 0 
    },
    fill: {
      opacity: 1
    }
  };  
}

export const stackedChartOptionsApex = (total, listLabels, toolbar) => {
  return {
      chart: {
        type: 'bar',
        height: 350,
        stacked: true,
        toolbar: {
          show: toolbar !== null ? toolbar : true
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
      // plotOptions: {
      //   bar: {
      //     horizontal: false,
      //     borderRadius: 10,
      //     borderRadiusApplication: 'end',
      //     borderRadiusWhenStacked: 'last',
      //     // columnWidth: columnWidth !== null ? columnWidth : '80%', // Adjust this value to reduce/increase bar width
      //     dataLabels: {
      //       total: {
      //         enabled: true,
      //         style: {
      //           fontSize: '10px',
      //           fontWeight: 300
      //         },
      //         formatter: function(val) {
      //             return parseFloat(val).toFixed(2);
      //         }
      //       }
      //     }
      //   },
      // },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          borderRadius: 5,
          borderRadiusApplication: 'end'
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
              return parseFloat(val).toFixed(2);
          }
      },
      xaxis: {
        tickPlacement: 'on',
      },
      yaxis: {
        labels: {
          formatter: function(val) {
            if (val >= 1000) {
              return (val / 1000).toFixed(1) + 'K'; // Convert to thousands and append 'K'
            }
            return val;
          },
          style: {
            fontSize: '10px' // Adjust the font size if needed
          }
        }
      },
      legend: {
        position: 'bottom',
        horizontalAlign: 'left', // Center the legend horizontally
        // floating: false, // Set to false to make sure it does not float
        offsetY: 0 
      },
      fill: {
        opacity: 1
      }
  };  
}

export const distributedColumnChart = (labels, colors) => {
  return {
    chart: {
      height: 350,
      type: 'bar',
      events: {
        click: function(chart, w, e) {
          // Handle chart click event here if needed
        }
      }
    },
    colors: colors,
    plotOptions: {
      bar: {
        columnWidth: '45%',
        distributed: true,
      }
    },
    dataLabels: {
      enabled: false
    },
    legend: {
      show: false
    },
    xaxis: {
      tickPlacement: 'on',
      categories: labels,
      labels: {
        style: {
          colors: colors,
          fontSize: '12px'
        }
      }
    },
    yaxis: {
      labels: {
        formatter: function(val) {
          if (val >= 1000) {
            return (val / 1000).toFixed(1) + 'K'; // Convert to thousands and add 'K'
          }
          return val; // Return the value as-is if it's below 1000
        },
        style: {
          fontSize: '12px'
        }
      }
    }
  }
}

export const distributedColumnChart2 = (labels, colors) => {
  return {
    chart: {
      height: 350,
      type: 'bar',
      events: {
        click: function(chart, w, e) {
          // Handle chart click event here if needed
        }
      }
    },
    colors: colors,
    plotOptions: {
      bar: {
        columnWidth: '45%',
        distributed: true,
      }
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false
    },
    xaxis: {
      tickPlacement: 'on',
      categories: labels,
      labels: {
        style: {
          colors: colors,
          fontSize: '12px'
        }
      }
    },
    yaxis: {
      labels: {
        formatter: function(val) {
          if (val >= 1000 && val < 100000) {
            return (val.toLocaleString() ); // Convert to thousands and add 'K'
          } else if (val >= 100000 && val < 1000000) {
            return (val / 1000).toFixed(2) + ' rb'; // Convert to thousands and add 'K'
          } if (val >= 1000000) {
            return (val / 1000000).toFixed(2) + ' jt'; // Convert to thousands and add 'K'
          } else {
            return val;
          }
          return val; // Return the value as-is if it's below 1000
        },
        style: {
          fontSize: '12px'
        }
      }
    }
  }
}
