$(function(){

    $('#propertyCreatedDate').selectize({
        create: false,
        // sortField: 'text'
    });

    $('#propertyCreatedDate').selectize({
            buttonWidth: '400px'
    });

    
    $(document).on('change', '#propertyCreatedDate', function(){
        days = $(this).val()
        $(".loaderDiv").show();
        $.ajax({
            url: "/admin/ajax-load-property-records/",
            type: "POST",
            data: { 
                'days': days,     
            },
            cache: false,
            success: function(data) {
                if(data.error == 0 || data.status == 200) {
                    data = data.data
                    days_list = convert_date(data.last_seven_days_prop_count.day)
                    count_list = data.last_seven_days_prop_count.counts
                    title_text = 'Last ' + days + ' Days'
                    create_bar_chart(days_list, count_list, title_text)
                } else {
                    showAlert(data.msg, 1)
                }
            },
            complete: function(jqXhr) {
                $(".loaderDiv").hide();
            }
        });
    });

});


function convert_date(dateobj){
    date_list = []
    $.each(dateobj, function(key, date){
      //date = date.toDateString();
      date = date.replaceAll('-','/')
      var currentDate = new Date(date);
      month_name = currentDate.toLocaleString('default', { month: 'short' })
      dt = (currentDate.getDate() < 10)?'0'+currentDate.getDate():currentDate.getDate();

      date_list.push(month_name + ' ' + dt)
    });
    return date_list
}

function create_bar_chart(days, count, title_text="Daily Property Count"){
    // create last days properties analytics
    if ($('#mainb').length) {
        var theme = {
            color: [
                '#26B99A', '#34495E', '#BDC3C7', '#3498DB',
                '#9B59B6', '#8abb6f', '#759c6a', '#bfd3b7'
            ],
  
            title: {
                itemGap: 8,
                textStyle: {
                    fontWeight: 'normal',
                    color: '#408829'
                }
            },
  
            dataRange: {
                color: ['#1f610a', '#97b58d']
            },
  
            toolbox: {
                color: ['#408829', '#408829', '#408829', '#408829']
            },
  
            tooltip: {
                backgroundColor: 'rgba(0,0,0,0.5)',
                axisPointer: {
                    type: 'line',
                    lineStyle: {
                        color: '#408829',
                        type: 'dashed'
                    },
                    crossStyle: {
                        color: '#408829'
                    },
                    shadowStyle: {
                        color: 'rgba(200,200,200,0.3)'
                    }
                }
            },
  
            dataZoom: {
                dataBackgroundColor: '#eee',
                fillerColor: 'rgba(64,136,41,0.2)',
                handleColor: '#408829'
            },
            grid: {
                borderWidth: 0
            },
  
            categoryAxis: {
                axisLine: {
                    lineStyle: {
                        color: '#408829'
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: ['#eee']
                    }
                }
            },
  
            valueAxis: {
                axisLine: {
                    lineStyle: {
                        color: '#408829'
                    }
                },
                splitArea: {
                    show: true,
                    areaStyle: {
                        color: ['rgba(250,250,250,0.1)', 'rgba(200,200,200,0.1)']
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: ['#eee']
                    }
                }
            },
            timeline: {
                lineStyle: {
                    color: '#408829'
                },
                controlStyle: {
                    normal: { color: '#408829' },
                    emphasis: { color: '#408829' }
                }
            },
  
            k: {
                itemStyle: {
                    normal: {
                        color: '#68a54a',
                        color0: '#a9cba2',
                        lineStyle: {
                            width: 1,
                            color: '#408829',
                            color0: '#86b379'
                        }
                    }
                }
            },
            map: {
                itemStyle: {
                    normal: {
                        areaStyle: {
                            color: '#ddd'
                        },
                        label: {
                            textStyle: {
                                color: '#c12e34'
                            }
                        }
                    },
                    emphasis: {
                        areaStyle: {
                            color: '#99d2dd'
                        },
                        label: {
                            textStyle: {
                                color: '#c12e34'
                            }
                        }
                    }
                }
            },
            force: {
                itemStyle: {
                    normal: {
                        linkStyle: {
                            strokeColor: '#408829'
                        }
                    }
                }
            },
            chord: {
                padding: 4,
                itemStyle: {
                    normal: {
                        lineStyle: {
                            width: 1,
                            color: 'rgba(128, 128, 128, 0.5)'
                        },
                        chordStyle: {
                            lineStyle: {
                                width: 1,
                                color: 'rgba(128, 128, 128, 0.5)'
                            }
                        }
                    },
                    emphasis: {
                        lineStyle: {
                            width: 1,
                            color: 'rgba(128, 128, 128, 0.5)'
                        },
                        chordStyle: {
                            lineStyle: {
                                width: 1,
                                color: 'rgba(128, 128, 128, 0.5)'
                            }
                        }
                    }
                }
            },
            gauge: {
                startAngle: 225,
                endAngle: -45,
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: [
                            [0.2, '#86b379'],
                            [0.8, '#68a54a'],
                            [1, '#408829']
                        ],
                        width: 8
                    }
                },
                axisTick: {
                    splitNumber: 10,
                    length: 12,
                    lineStyle: {
                        color: 'auto'
                    }
                },
                axisLabel: {
                    textStyle: {
                        color: 'auto'
                    }
                },
                splitLine: {
                    length: 18,
                    lineStyle: {
                        color: 'auto'
                    }
                },
                pointer: {
                    length: '90%',
                    color: 'auto'
                },
                title: {
                    textStyle: {
                        color: '#333'
                    }
                },
                detail: {
                    textStyle: {
                        color: 'auto'
                    }
                }
            },
            textStyle: {
                fontFamily: 'Arial, Verdana, sans-serif'
            }
        };
        var echartBar = echarts.init(document.getElementById('mainb'), theme);
  
        echartBar.setOption({
            title: {
                text: title_text,
            },
            tooltip: {
                trigger: 'axis'
            },
            toolbox: {
                show: true,
                feature: {
                    dataView: {
                      show: true,
                      readOnly: false,
                      lang: [
                            "Text View",
                            "Close",
                            "Refresh",
                          ],
                      title: "Text View"},
                    magicType: {
                      show: true,
                      type: ['line', 'bar'],
                      title: {
                            line: 'Line',
                            bar: 'Bar',
                      }},
                    restore: {show: true, title: "Restore"},
                    saveAsImage: {show: true, title: "Save Image"}
                }
            },
            calculable: false,
            xAxis: [{
                type: 'category',
                data: days
            }],
            yAxis: [{
                type: 'value'
            }],
            series: [{
                name: 'Properties',
                type: 'bar',
                data: count,
                markPoint: {
                    data: [{
                        type: 'max',
                        name: 'Highest Count'
                    }, {
                        type: 'min',
                        name: 'Lowest Count'
                    }]
                },
                markLine: {
                    data: [{
                        type: 'average',
                        name: 'Daily Average',
                    }]
                }
            }]
        });
  
      }
}