(function () {
  //不同就业去向
  var jsonstr = document.cookie.split(';')[0];
  console.log("cookie：" + jsonstr);
  $.get("http://127.0.0.1:8888/api/nannv", function (ret, status) {

    var data1 = ret[jsonstr].data;
    var myChart = echarts.init(document.getElementById("div1"));
    var option = {
      legend: {
        bottom: "0%",
        textStyle: {
          color: "write"
        }
      },
      tooltip: {},
      dataset: {
        dimensions: ['product', '男', '女'],
        source: data1
      },

      xAxis: {
        type: 'category',
        axisLabel: {
          color: '#fff',
          fontSize: "20"
        },
        axisLine: {
          lineStyle: {
            type: 'solid',
            color: '#fff',
          }
        },
      },
      yAxis: {
        name: "人数",
        axisLabel: {
          color: '#fff',
          fontSize: "20"
        },
        axisLine: {
          lineStyle: {
            type: 'solid',
            color: '#fff',
          }
        },
      },
      barWidth: "30%",
      series: [
        {
          type: 'bar', itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: 'rgba(0, 221, 255)'
            }, {
              offset: 1,
              color: 'rgba(77, 119, 255)'
            }])
          },
          label: {
            show: true,
            position: 'top',
            color: "white",
            fontSize: 20
          },
          barGap: "20%"
        },
        {
          type: 'bar', color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: 'rgba(255, 0, 135)'
          }, {
            offset: 1,
            color: 'rgba(135, 0, 157)'
          }]),
          label: {
            show: true,
            position: 'top',
            color: "white",
            fontSize: 20
          },
        },

      ]
    };
    myChart.setOption(option);
  })
})();
(function () {
  //班级男生人数
  var jsonstr = document.cookie.split(';')[0];
  $.get("http://127.0.0.1:8888/api/nannv", function (ret, status) {
    var data1 = ret[jsonstr].nan;
    //班级女生人数
    var data2 = ret[jsonstr].nv;
    var myChart = echarts.init(document.getElementById('div2'));
    var option;
    option = {
      tooltip: {
        trigger: 'item',
        formatter: function (params) {
          // do some thing
          console.log(params)
          return params.name + ":" + params.value + "人"
        }
      },
      // legend: {
      //   orient: 'vertical',
      //   left: 'left',
      //   bottom: "0%",
      //   itemWidth: 30,
      //   itemHeight: 30,
      //   textStyle: {
      //     color: "write"
      //   }
      // },
      series: [
        {
          type: 'pie',
          radius: '60%',
          itemStyle: {
            normal: {
              label: {
                fontSize: 20,
                show: true,
                position: [0, -20],
                color: '#ddd',
                formatter: function (params) {
                  var percent = 0;
                  var total = 0;
                  total += data1 + data2;
                  percent = ((params.value / total) * 100).toFixed(0);
                  if (params.name !== '') {
                    return params.name + '：' + percent + '%';
                  } else {
                    return '';
                  }
                },
              },
              labelLine: {
                length: 15,
                length2: 10,
                show: true,
                color: '#00ffff',
              },
            },
          },

          data: [
            {
              value: data1, name: '男',
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: 'rgba(0, 221, 255)'
                }, {
                  offset: 1,
                  color: 'rgba(77, 119, 255)'
                }])
              }
            },
            {
              value: data2, name: '女',
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: 'rgba(255, 0, 135)'
                }, {
                  offset: 1,
                  color: 'rgba(135, 0, 157)'
                }])
              }
            }
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
    myChart.setOption(option)

  })
})()