$(function () {

  SocketService.Instance.connect();

  // 柱状图模块1   首页左上角柱状图
  (function () {

    // 1实例化对象
    var myChart = echarts.init(document.querySelector(".bar .chart"));
    // 2. 指定配置项和数据
    var option = {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
        offset: 0,
        color: '#0184d5'
      }, {
        offset: 1,
        color: '#00d887'
      }]),
      tooltip: {
        trigger: "axis",
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      // 修改图表的大小
      grid: {
        left: "0%",
        top: "10px",
        right: "0%",
        bottom: "4%",
        containLabel: true
      },
      xAxis: [
        {
          type: "category",
          axisTick: {
            alignWithLabel: true
          },
          // 修改刻度标签 相关样式
          axisLabel: {
            color: "rgba(255,255,255,.6) ",
            fontSize: "10"
          },
          // 不显示x坐标轴的样式
          axisLine: {
            show: false
          }
        }
      ],
      yAxis: [
        {
          type: "value",
          // 修改刻度标签 相关样式
          axisLabel: {
            color: "rgba(255,255,255,.6) ",
            fontSize: 10
          },
          // y轴的线条改为了 2像素
          axisLine: {
            lineStyle: {
              color: "rgba(255,255,255,.1)",
              width: 2
            }
          },
          // y轴分割线的颜色
          splitLine: {
            lineStyle: {
              color: "rgba(255,255,255,.1)"
            }
          }
        }
      ],
      series: [
        {
          name: "",
          type: "bar",
          barWidth: "40%",
          itemStyle: {
            // 修改柱子圆角
            barBorderRadius: 5
          }
        }
      ]
    };
    // 3. 把配置项给实例对象
    myChart.setOption(option);

    var dataLen = 1
    SocketService.Instance.registerCallBack('text2Data', ret => {
      console.log("text2:")
      console.log(ret);
      var Name2 = []
      var Value2 = []
      for (var i = 0; i < ret.length; i++) {
        var name = ret[i].name
        var value = ret[i].value
        Name2.push(name)
        Value2.push(value)
      }
      //数据
      myChart.setOption({
        xAxis: [
          {
            data: Name2
          },
        ],
        series: [
          {
            data: Value2,
          }
        ]
      });
      dataLen = Name2.length

    });
    SocketService.Instance.send({
      action: 'getData',
      socketType: 'text2Data',
      chartName: 'text2',
      value: ''
    })




    /*******高亮显示开始**********/
    var _this2 = this
    var isSet2 = true // 为了做判断：当鼠标移动上去的时候，自动高亮就被取消
    var currentIndex2 = 0

    // 2、鼠标移动上去的时候的高亮动画
    myChart.on('mouseover', function (param) {
      isSet2 = false
      clearInterval(_this2.startCharts)
      // 取消之前高亮的图形
      myChart.dispatchAction({
        type: 'downplay',
        seriesIndex: 0,
        dataIndex: currentIndex2
      })
      // 高亮当前图形
      myChart.dispatchAction({
        type: 'highlight',
        seriesIndex: 0,
        dataIndex: param.dataIndex
      })
      // 显示 tooltip
      myChart.dispatchAction({
        type: 'showTip',
        seriesIndex: 0,
        dataIndex: param.dataIndex
      })
    })

    // 3、自动高亮展示
    chartHover = function () {
      // 取消之前高亮的图形
      myChart.dispatchAction({
        type: 'downplay',
        seriesIndex: 0,
        dataIndex: currentIndex2
      })
      currentIndex2 = (currentIndex2 + 1) % dataLen
      // 高亮当前图形
      myChart.dispatchAction({
        type: 'highlight',
        seriesIndex: 0,
        dataIndex: currentIndex2
      })
      // 显示 tooltip
      myChart.dispatchAction({
        type: 'showTip',
        seriesIndex: 0,
        dataIndex: currentIndex2
      })
    }
    _this2.startCharts = setInterval(chartHover, 1000)
    // 4、鼠标移出之后，恢复自动高亮
    myChart.on('mouseout', function (param) {
      if (!isSet2) {
        _this2.startCharts = setInterval(chartHover, 1000)
        isSet2 = true
      }
    })
    /*******高亮显示结束**********/


    //4.点击柱状图跳转
    myChart.on('click', function (params) {
      console.log(params.dataIndex);
      document.cookie = params.dataIndex;
      console.log(document.cookie);
      //cookie传递params的数组下标
      //获取统计数据
      window.location.href = 'childpage.html';
    });
    // 5. 让图表跟随屏幕自动的去适应
    window.addEventListener("resize", function () {
      myChart.resize();
    });

    //--------------------------------ajax---------------------------------

    // $.get("http://127.0.0.1:8888/api/text2", function (ret) {
    // }).done(ret => {
    //   var Name2 = []
    //   var Value2 = []
    //   for (var i = 0; i < ret.length; i++) {
    //     var name = ret[i].name
    //     var value = ret[i].value
    //     console.log(name + " " + value)
    //     Name2.push(name)
    //     Value2.push(value)
    //   }
    //   // 1实例化对象
    //   var myChart1 = echarts.init(document.querySelector(".bar .chart"));
    //   // 2. 指定配置项和数据
    //   option = {
    //     color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
    //       offset: 0,
    //       color: '#0184d5'
    //     }, {
    //       offset: 1,
    //       color: '#00d887'
    //     }]),
    //     tooltip: {
    //       trigger: "axis",
    //       axisPointer: {
    //         // 坐标轴指示器，坐标轴触发有效
    //         type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
    //       }
    //     },
    //     // 修改图表的大小
    //     grid: {
    //       left: "0%",
    //       top: "10px",
    //       right: "0%",
    //       bottom: "4%",
    //       containLabel: true
    //     },
    //     xAxis: [
    //       {
    //         type: "category",
    //         data: Name2,
    //         axisTick: {
    //           alignWithLabel: true
    //         },
    //         // 修改刻度标签 相关样式
    //         axisLabel: {
    //           color: "rgba(255,255,255,.6) ",
    //           fontSize: "10"
    //         },
    //         // 不显示x坐标轴的样式
    //         axisLine: {
    //           show: false
    //         }
    //       }
    //     ],
    //     yAxis: [
    //       {
    //         type: "value",
    //         // 修改刻度标签 相关样式
    //         axisLabel: {
    //           color: "rgba(255,255,255,.6) ",
    //           fontSize: 10
    //         },
    //         // y轴的线条改为了 2像素
    //         axisLine: {
    //           lineStyle: {
    //             color: "rgba(255,255,255,.1)",
    //             width: 2
    //           }
    //         },
    //         // y轴分割线的颜色
    //         splitLine: {
    //           lineStyle: {
    //             color: "rgba(255,255,255,.1)"
    //           }
    //         }
    //       }
    //     ],
    //     series: [
    //       {
    //         name: "",
    //         type: "bar",
    //         barWidth: "35%",
    //         // data: [108, 6, 11, 8, 16],
    //         data: Value2,
    //         itemStyle: {
    //           // 修改柱子圆角
    //           barBorderRadius: 5
    //         }
    //       }
    //     ]
    //   };
    //   // 3. 把配置项给实例对象
    //   myChart1.setOption(option);
    //   /*******高亮显示开始**********/
    //   var _this2 = this
    //   var isSet2 = true // 为了做判断：当鼠标移动上去的时候，自动高亮就被取消
    //   var currentIndex2 = 0

    //   // 2、鼠标移动上去的时候的高亮动画
    //   myChart1.on('mouseover', function (param) {
    //     isSet2 = false
    //     clearInterval(_this2.startCharts)
    //     // 取消之前高亮的图形
    //     myChart1.dispatchAction({
    //       type: 'downplay',
    //       seriesIndex: 0,
    //       dataIndex: currentIndex2
    //     })
    //     // 高亮当前图形
    //     myChart1.dispatchAction({
    //       type: 'highlight',
    //       seriesIndex: 0,
    //       dataIndex: param.dataIndex
    //     })
    //     // 显示 tooltip
    //     myChart1.dispatchAction({
    //       type: 'showTip',
    //       seriesIndex: 0,
    //       dataIndex: param.dataIndex
    //     })
    //   })
    //   // 3、自动高亮展示
    //   chartHover = function () {
    //     var dataLen = myChart1.getOption().series[0].data.length
    //     // 取消之前高亮的图形
    //     myChart1.dispatchAction({
    //       type: 'downplay',
    //       seriesIndex: 0,
    //       dataIndex: currentIndex2
    //     })
    //     currentIndex2 = (currentIndex2 + 1) % dataLen
    //     // 高亮当前图形
    //     myChart1.dispatchAction({
    //       type: 'highlight',
    //       seriesIndex: 0,
    //       dataIndex: currentIndex2
    //     })
    //     // 显示 tooltip
    //     myChart1.dispatchAction({
    //       type: 'showTip',
    //       seriesIndex: 0,
    //       dataIndex: currentIndex2
    //     })
    //   }
    //   _this2.startCharts = setInterval(chartHover, 1000)
    //   // 4、鼠标移出之后，恢复自动高亮
    //   myChart1.on('mouseout', function (param) {
    //     if (!isSet2) {
    //       _this2.startCharts = setInterval(chartHover, 1000)
    //       isSet2 = true
    //     }
    //   })
    //   /*******高亮显示结束**********/


    //   //4.点击柱状图跳转
    //   myChart1.on('click', function (params) {
    //     console.log(params.dataIndex);
    //     document.cookie = params.dataIndex;
    //     console.log(document.cookie);
    //     //cookie传递params的数组下标
    //     //获取统计数据
    //     window.location.href = 'childpage.html';
    //   });
    //   // 5. 让图表跟随屏幕自动的去适应
    //   window.addEventListener("resize", function () {
    //     myChart1.resize();
    //   });
    // });

  })();

  // 雷达图 左中
  (function () {

    // 1实例化对象
    var myChart = echarts.init(document.querySelector(".radar .chart"));
    // 2. 指定配置项和数据
    var lineStyle = {
      normal: {
        width: 1,
        opacity: 0.5
      }
    };
    var option = {
      legend: {
        orient: "vertical",
        top: "bottom",
        left: "right",
        textStyle: {
          color: '#fff',
          fontSize: 12
        },
        selectedMode: 'single'
      },
      grid: {
        top: ""
      },
      radar: {
        indicator: [
          { name: '城市', max: 100 },
          { name: '岗位', max: 100 },
          { name: '工作时间', max: 100 },
          { name: '兴趣', max: 100 },
          { name: '薪资', max: 100 },
          { name: '工作环境', max: 100 }
        ],
        shape: 'circle',
        splitNumber: 5,  //指示器轴的分割段数。
        name: {
          textStyle: {
            color: 'rgb(238, 197, 102)'
          }
        },
        splitLine: {
          lineStyle: {
            color: [
              'rgba(238, 197, 102, 0.1)', 'rgba(238, 197, 102, 0.2)',
              'rgba(238, 197, 102, 0.4)', 'rgba(238, 197, 102, 0.6)',
              'rgba(238, 197, 102, 0.8)', 'rgba(238, 197, 102, 1)'
            ].reverse()
          }
        },
        splitArea: {
          show: false
        },
        axisLine: {
          lineStyle: {
            color: 'rgba(238, 197, 102, 0.5)'
          }
        }
      },
      series: [
        {
          name: "16数媒01",
          type: 'radar',
          lineStyle: lineStyle,
          symbol: 'none',
          itemStyle: {
            color: '#F9713C'
          },
          areaStyle: {
            opacity: 0.1
          }
        },
        {
          name: "16数媒02",
          type: 'radar',
          lineStyle: lineStyle,
          symbol: 'none',
          itemStyle: {
            color: '#B3E4A1'
          },
          areaStyle: {
            opacity: 0.05
          }
        },
        {
          name: "16数媒03",
          type: 'radar',
          lineStyle: lineStyle,
          symbol: 'none',
          itemStyle: {
            color: 'rgb(238, 197, 102)'
          },
          areaStyle: {
            opacity: 0.05
          }
        },
        {
          name: "18数媒(升本)01",
          type: 'radar',
          lineStyle: lineStyle,
          symbol: 'none',
          itemStyle: {
            color: 'rgb(182, 87, 203)'
          },
          areaStyle: {
            opacity: 0.05  //图形透明度
          }
        }
      ]
    };
    // 3. 把配置项给实例对象
    myChart.setOption(option);

    SocketService.Instance.registerCallBack('leftcenterData', ret => {
      console.log("leftcenter:")
      console.log(ret);
      var classname = [];
      var classdata = [];
      for (var i = 0; i < ret.length; i++) {
        classname.push(ret[i].name);
        classdata.push(ret[i].student);
      }
      //数据
      myChart.setOption({
        legend: {
          data: classname,
        },
        series: [
          {
            name: "16数媒01",
            data: classdata[0]
          }
          ,
          {
            name: "16数媒02",
            data: classdata[1]
          },
          {
            name: "16数媒03",
            data: classdata[2]
          },
          {
            name: "18数媒(升本)01",
            data: classdata[3]
          }
        ]
      });
    });

    SocketService.Instance.send({
      action: 'getData',
      socketType: 'leftcenterData',
      chartName: 'leftcenter',
      value: ''
    })
    // 4. 让图表跟随屏幕自动的去适应
    window.addEventListener("resize", function () {
      myChart.resize();
    });

  })();

  // 柱状图2  首页右上角柱状图
  (function () {

    var myColor = ["#1089E7", "#F57474", "#56D0E3", "#f8b448", "#8B78F6"];
    // 1. 实例化对象
    var myChart = echarts.init(document.querySelector(".bar2 .chart"));
    // 2. 指定配置和数据
    var option = {
      grid: {
        top: "10%",
        left: "30%",
        right: "15%",
        bottom: "10%"
        // containLabel: true
      },
      // 不显示x轴的相关信息
      xAxis: {
        show: false
      },
      yAxis: [
        {
          type: "category",
          inverse: true,
          // data: Name1,
          // 不显示y轴的线
          axisLine: {
            show: false
          },
          // 不显示刻度
          axisTick: {
            show: false
          },
          // 把刻度标签里面的文字颜色设置为白色
          axisLabel: {
            color: "#fff"
          }
        },
        {

          // data: Value1,
          data: [0, 0, 0, 0, 0],
          inverse: true,
          // 不显示y轴的线
          axisLine: {
            show: false
          },
          // 不显示刻度
          axisTick: {
            show: false
          },
          // 把刻度标签里面的文字颜色设置为白色
          axisLabel: {
            color: "#fff"
          }
        }
      ],
      series: [
        {
          name: "条",
          type: "bar",
          // data: proportion1,
          yAxisIndex: 0,
          // 修改第一组柱子的圆角
          itemStyle: {
            barBorderRadius: 20,
            // 此时的color 可以修改柱子的颜色
            color: function (params) {
              // params 传进来的是柱子对象
              // console.log(params);
              // dataIndex 是当前柱子的索引号
              return myColor[params.dataIndex];
            }
          },
          // 柱子之间的距离
          barCategoryGap: 50,
          //柱子的宽度
          barWidth: 10,
          // 显示柱子内的文字
          label: {
            show: true,
            position: "inside",
            // {c} 会自动的解析为 数据  data里面的数据
            formatter: "{c}%"
          }
        },
        {
          name: "框",
          type: "bar",
          barCategoryGap: 50,
          barWidth: 15,
          yAxisIndex: 1,
          data: [100, 100, 100, 100, 100],
          itemStyle: {
            color: "none",
            borderColor: "#00c1de",
            borderWidth: 3,
            barBorderRadius: 15
          }
        }
      ]
    };

    // 3. 把配置给实例对象
    myChart.setOption(option);



    SocketService.Instance.registerCallBack('text1Data', ret => {
      console.log("text1:")
      console.log(ret);
      var Name1 = []
      var Value1 = []
      var proportion1 = []
      for (var i = 0; i < ret.length; i++) {
        var name = ret[i].name
        var value = ret[i].value
        var proportion = ret[i].proportion
        Name1.push(name)
        Value1.push(value)
        proportion1.push(proportion)
      }
      //数据
      myChart.setOption({
        yAxis: [
          {
            data: Name1
          },
          {
            data: Value1
          }
        ],
        series: [
          {
            data: proportion1,
          },
          {

          }
        ]
      });

    });

    SocketService.Instance.send({
      action: 'getData',
      socketType: 'text1Data',
      chartName: 'text1',
      value: ''
    })



    //4.点击柱状图跳转
    myChart.on('click', function (params) {
      //获取统计数据
      document.cookie = params.dataIndex;
      window.location.href = 'nannv.html';
    });

    // 5. 让图表跟随屏幕自动的去适应
    window.addEventListener("resize", function () {
      myChart.resize();
    });

    //----------------------ajax-----------------------------
    // $.get("http://127.0.0.1:8888/api/text1", function (ret) {
    // }).done(ret => {
    //   var Name1 = []
    //   var Value1 = []
    //   var proportion1 = []
    //   for (var i = 0; i < ret.length; i++) {
    //     var name = ret[i].name
    //     var value = ret[i].value
    //     var proportion = ret[i].proportion
    //     console.log(name + " " + value)
    //     Name1.push(name)
    //     Value1.push(value)
    //     proportion1.push(proportion)
    //   }

    //   var myColor = ["#1089E7", "#F57474", "#56D0E3", "#f8b448", "#8B78F6"];
    //   // 1. 实例化对象
    //   var myChart = echarts.init(document.querySelector(".bar2 .chart"));
    //   // 2. 指定配置和数据
    //   var option = {
    //     grid: {
    //       top: "10%",
    //       left: "30%",
    //       right: "15%",
    //       bottom: "10%"
    //       // containLabel: true
    //     },
    //     // 不显示x轴的相关信息
    //     xAxis: {
    //       show: false
    //     },
    //     yAxis: [
    //       {
    //         type: "category",
    //         inverse: true,
    //         data: Name1,
    //         // 不显示y轴的线
    //         axisLine: {
    //           show: false
    //         },
    //         // 不显示刻度
    //         axisTick: {
    //           show: false
    //         },
    //         // 把刻度标签里面的文字颜色设置为白色
    //         axisLabel: {
    //           color: "#fff"
    //         }
    //       },
    //       {
    //         data: Value1,
    //         inverse: true,
    //         // 不显示y轴的线
    //         axisLine: {
    //           show: false
    //         },
    //         // 不显示刻度
    //         axisTick: {
    //           show: false
    //         },
    //         // 把刻度标签里面的文字颜色设置为白色
    //         axisLabel: {
    //           color: "#fff"
    //         }
    //       }
    //     ],
    //     series: [
    //       {
    //         name: "条",
    //         type: "bar",
    //         data: proportion1,
    //         yAxisIndex: 0,
    //         // 修改第一组柱子的圆角
    //         itemStyle: {
    //           barBorderRadius: 20,
    //           // 此时的color 可以修改柱子的颜色
    //           color: function (params) {
    //             // params 传进来的是柱子对象
    //             // console.log(params);
    //             // dataIndex 是当前柱子的索引号
    //             return myColor[params.dataIndex];
    //           }
    //         },
    //         // 柱子之间的距离
    //         barCategoryGap: 50,
    //         //柱子的宽度
    //         barWidth: 10,
    //         // 显示柱子内的文字
    //         label: {
    //           show: true,
    //           position: "inside",
    //           // {c} 会自动的解析为 数据  data里面的数据
    //           formatter: "{c}%"
    //         }
    //       },
    //       {
    //         name: "框",
    //         type: "bar",
    //         barCategoryGap: 50,
    //         barWidth: 15,
    //         yAxisIndex: 1,
    //         data: [100, 100, 100, 100, 100],
    //         itemStyle: {
    //           color: "none",
    //           borderColor: "#00c1de",
    //           borderWidth: 3,
    //           barBorderRadius: 15
    //         }
    //       }
    //     ]
    //   };

    //   // 3. 把配置给实例对象
    //   myChart.setOption(option);

    //   //4.点击柱状图跳转
    //   myChart.on('click', function (params) {
    //     //获取统计数据
    //     window.location.href = '3D.html';
    //   });

    //   // 5. 让图表跟随屏幕自动的去适应
    //   window.addEventListener("resize", function () {
    //     myChart.resize();
    //   });

    // });
  })();

  // 饼形图1  首页左下角
  (function () {

    // 1. 实例化对象
    var myChart = echarts.init(document.querySelector(".pie .chart"));
    // 2.指定配置
    var option = {
      color: ["#FE642E", "#FE9A2E", "#F4FA58", "#01DFD7", "#8258FA"],
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b}: {c} ({d}%)"
      },

      legend: {
        bottom: "0%",
        // 修改小图标的大小
        itemWidth: 10,
        itemHeight: 10,
        // 修改图例组件的文字为 12px
        textStyle: {
          color: "rgba(255,255,255,.5)",
          fontSize: "15"
        }
      },
      series: [
        {
          name: "工作地点",
          type: "pie",
          // 这个radius可以修改饼形图的大小
          // radius 第一个值是内圆的半径 第二个值是外圆的半径
          radius: ["35%", "60%"],
          center: ["50%", "45%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 20//图形边缘弧度大小
          },
          // 图形上的文字
          label: {
            show: true
          },
          // 连接文字和图形的线是否显示
          labelLine: {
            show: true
          }
        }
      ]
    };

    // 使用刚指定的配置项显示图表。
    myChart.setOption(option);
    var dataLen = 1

    SocketService.Instance.registerCallBack('text3Data', ret => {
      console.log("text3：")
      console.log(ret);
      //数据
      myChart.setOption({
        series: [
          {
            name: "工作地点",
            data: ret,
          }
        ]
      });
      dataLen = ret.length
    });

    SocketService.Instance.send({
      action: 'getData',
      socketType: 'text3Data',
      chartName: 'text3',
      value: ''
    })

    /*******高亮显示开始**********/
    var _this2 = this
    var isSet2 = true // 为了做判断：当鼠标移动上去的时候，自动高亮就被取消
    var currentIndex2 = 0

    // 2、鼠标移动上去的时候的高亮动画
    myChart.on('mouseover', function (param) {
      isSet2 = false
      clearInterval(_this2.startCharts)
      // 取消之前高亮的图形
      myChart.dispatchAction({
        type: 'downplay',
        seriesIndex: 0,
        dataIndex: currentIndex2
      })
      // 高亮当前图形
      myChart.dispatchAction({
        type: 'highlight',
        seriesIndex: 0,
        dataIndex: param.dataIndex
      })
      // 显示 tooltip
      myChart.dispatchAction({
        type: 'showTip',
        seriesIndex: 0,
        dataIndex: param.dataIndex
      })
    })
    // 3、自动高亮展示
    chartHover = function () {
      // 取消之前高亮的图形
      myChart.dispatchAction({
        type: 'downplay',
        seriesIndex: 0,
        dataIndex: currentIndex2
      })
      currentIndex2 = (currentIndex2 + 1) % dataLen
      // 高亮当前图形
      myChart.dispatchAction({
        type: 'highlight',
        seriesIndex: 0,
        dataIndex: currentIndex2
      })
      // 显示 tooltip
      myChart.dispatchAction({
        type: 'showTip',
        seriesIndex: 0,
        dataIndex: currentIndex2
      })
    }
    _this2.startCharts = setInterval(chartHover, 1000)
    // 4、鼠标移出之后，恢复自动高亮
    myChart.on('mouseout', function (param) {
      if (!isSet2) {
        _this2.startCharts = setInterval(chartHover, 1000)
        isSet2 = true
      }
    })
    /*******高亮显示结束**********/

    // 4. 让图表跟随屏幕自动的去适应
    window.addEventListener("resize", function () {
      myChart.resize();
    });

  })();

  // 折线图 右下
  (function () {

    var myChart = echarts.init(document.querySelector(".line .chart"));

    var option = {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          lineStyle: {
            color: "#dddc6b"
          }
        }
      },
      legend: {
        top: "0%",
        textStyle: {
          color: "rgba(255,255,255,.5)",
          fontSize: "12"
        }
      },
      grid: {
        left: "5px",
        top: "30",
        right: "25px",
        bottom: "10",
        containLabel: true
      },

      xAxis: [
        {
          type: "category",
          boundaryGap: false,   //坐标轴从0开始
          axisLabel: {
            textStyle: {
              color: "rgba(255,255,255,.6)",
              fontSize: 10
            }
          },
          axisLine: {
            lineStyle: {
              color: "rgba(255,255,255,.2)"
            }
          },
        },
        {
          axisPointer: { show: false },
          axisLine: { show: false },
          position: "bottom",
          offset: 20
        }
      ],

      yAxis: [
        {
          type: "value",
          axisTick: { show: false },
          axisLine: {
            lineStyle: {
              color: "rgba(255,255,255,.1)"
            }
          },
          axisLabel: {
            textStyle: {
              color: "rgba(255,255,255,.6)",
              fontSize: 12
            }
          },

          splitLine: {
            lineStyle: {
              color: "rgba(255,255,255,.1)"
            }
          }
        }
      ],
      series: [
        {
          name: "第一年薪资统计",
          type: "line",
          smooth: true,
          symbol: "circle",
          symbolSize: 5,
          showSymbol: false,
          lineStyle: {
            normal: {
              color: "#0184d5",
              width: 2
            }
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(
                0, 0, 0, 1,
                [
                  {
                    offset: 0,
                    color: "rgba(1, 132, 213, 0.4)"
                  },
                  {
                    offset: 0.8,
                    color: "rgba(1, 132, 213, 0.1)"
                  }
                ],
                false
              ),
              shadowColor: "rgba(0, 0, 0, 0.1)"
            }
          },
          itemStyle: {
            normal: {
              color: "#0184d5",
              borderColor: "rgba(221, 220, 107, .1)",
              borderWidth: 12
            }
          },
          markArea: {
            data: [
              [
                { xAxis: '5000' }, { xAxis: '6000' }
              ]
            ]
          }
        }
        ,
        {
          name: "第二年薪资统计",
          type: "line",
          smooth: true,
          symbol: "circle",
          symbolSize: 5,
          showSymbol: false,
          lineStyle: {
            normal: {
              color: "#00d887",
              width: 2
            }
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(
                0, 0, 0, 1,
                [
                  {
                    offset: 0,
                    color: "rgba(0, 216, 135, 0.4)"
                  },
                  {
                    offset: 0.8,
                    color: "rgba(0, 216, 135, 0.1)"
                  }
                ],
                false
              ),
              shadowColor: "rgba(0, 0, 0, 0.1)"
            }
          },
          itemStyle: {
            normal: {
              color: "#00d887",
              borderColor: "rgba(221, 220, 107, .1)",
              borderWidth: 12
            }
          },
          markArea: {
            data: [
              [
                { xAxis: '7000' }, { xAxis: '8000' }
              ]
            ]
          }
        }
      ]
    };
    // 使用刚指定的配置项显示图表。
    myChart.setOption(option);

    var dataLen = 1
    SocketService.Instance.registerCallBack('text5Data', ret => {
      console.log("text5:")
      console.log(ret);
      var Money = []
      var Nmuber1 = []
      var Nmuber2 = []
      for (var i = 0; i < ret.length; i++) {
        var money = ret[i].money
        var number1 = ret[i].number1
        var number2 = ret[i].number2
        Money.push(money)
        Nmuber1.push(number1)
        Nmuber2.push(number2)
      }
      // 数据
      myChart.setOption({
        xAxis: [
          {
            data: Money
          },
        ],
        series: [
          {
            data: Nmuber1,
          }
          ,
          {
            data: Nmuber2,
          }
        ]
      });
      // var dataLen = myChart.getOption().series[0].data.length
      dataLen = Nmuber1.length
    });

    SocketService.Instance.send({
      action: 'getData',
      socketType: 'text5Data',
      chartName: 'text5',
      value: ''
    })


    // $.get("http://127.0.0.1:8888/api/text5", function (ret) {
    // }).done(ret => {
    //   var Money = []
    //   var Nmuber1 = []
    //   var Nmuber2 = []
    //   for (var i = 0; i < ret.length; i++) {
    //     var money = ret[i].money
    //     var number1 = ret[i].number1
    //     var number2 = ret[i].number2
    //     Money.push(money)
    //     Nmuber1.push(number1)
    //     Nmuber2.push(number2)
    //   }

    //   // 基于准备好的dom，初始化echarts实例
    //   var myChart = echarts.init(document.querySelector(".line .chart"));

    //   var option = {
    //     tooltip: {
    //       trigger: "axis",
    //       axisPointer: {
    //         lineStyle: {
    //           color: "#dddc6b"
    //         }
    //       }
    //     },
    //     legend: {
    //       top: "0%",
    //       textStyle: {
    //         color: "rgba(255,255,255,.5)",
    //         fontSize: "12"
    //       }
    //     },
    //     grid: {
    //       left: "10",
    //       top: "30",
    //       right: "10",
    //       bottom: "10",
    //       containLabel: true
    //     },

    //     xAxis: [
    //       {
    //         type: "category",
    //         boundaryGap: false,   //坐标轴从0开始
    //         axisLabel: {
    //           textStyle: {
    //             color: "rgba(255,255,255,.6)",
    //             fontSize: 10
    //           }
    //         },
    //         axisLine: {
    //           lineStyle: {
    //             color: "rgba(255,255,255,.2)"
    //           }
    //         },

    //         data: Money
    //       },
    //       {
    //         axisPointer: { show: false },
    //         axisLine: { show: false },
    //         position: "bottom",
    //         offset: 20
    //       }
    //     ],

    //     yAxis: [
    //       {
    //         type: "value",
    //         axisTick: { show: false },
    //         axisLine: {
    //           lineStyle: {
    //             color: "rgba(255,255,255,.1)"
    //           }
    //         },
    //         axisLabel: {
    //           textStyle: {
    //             color: "rgba(255,255,255,.6)",
    //             fontSize: 12
    //           }
    //         },

    //         splitLine: {
    //           lineStyle: {
    //             color: "rgba(255,255,255,.1)"
    //           }
    //         }
    //       }
    //     ],
    //     series: [
    //       {
    //         name: "第一年薪资统计",
    //         type: "line",
    //         smooth: true,
    //         symbol: "circle",
    //         symbolSize: 5,
    //         showSymbol: false,
    //         lineStyle: {
    //           normal: {
    //             color: "#0184d5",
    //             width: 2
    //           }
    //         },
    //         areaStyle: {
    //           normal: {
    //             color: new echarts.graphic.LinearGradient(
    //               0, 0, 0, 1,
    //               [
    //                 {
    //                   offset: 0,
    //                   color: "rgba(1, 132, 213, 0.4)"
    //                 },
    //                 {
    //                   offset: 0.8,
    //                   color: "rgba(1, 132, 213, 0.1)"
    //                 }
    //               ],
    //               false
    //             ),
    //             shadowColor: "rgba(0, 0, 0, 0.1)"
    //           }
    //         },
    //         itemStyle: {
    //           normal: {
    //             color: "#0184d5",
    //             borderColor: "rgba(221, 220, 107, .1)",
    //             borderWidth: 12
    //           }
    //         },
    //         data: Nmuber1,

    //         markArea: {
    //           data: [
    //             [
    //               { xAxis: '3000' }, { xAxis: '4000' }
    //             ]
    //           ]
    //         }
    //       }
    //       ,
    //       {
    //         name: "第二年薪资统计",
    //         type: "line",
    //         smooth: true,
    //         symbol: "circle",
    //         symbolSize: 5,
    //         showSymbol: false,
    //         lineStyle: {
    //           normal: {
    //             color: "#00d887",
    //             width: 2
    //           }
    //         },
    //         areaStyle: {
    //           normal: {
    //             color: new echarts.graphic.LinearGradient(
    //               0, 0, 0, 1,
    //               [
    //                 {
    //                   offset: 0,
    //                   color: "rgba(0, 216, 135, 0.4)"
    //                 },
    //                 {
    //                   offset: 0.8,
    //                   color: "rgba(0, 216, 135, 0.1)"
    //                 }
    //               ],
    //               false
    //             ),
    //             shadowColor: "rgba(0, 0, 0, 0.1)"
    //           }
    //         },
    //         itemStyle: {
    //           normal: {
    //             color: "#00d887",
    //             borderColor: "rgba(221, 220, 107, .1)",
    //             borderWidth: 12
    //           }
    //         },
    //         data: Nmuber2,

    //         markArea: {
    //           data: [
    //             [
    //               { xAxis: '5000' }, { xAxis: '6000' }
    //             ]
    //           ]
    //         }
    //       }
    //     ]
    //   };
    //   // 使用刚指定的配置项和数据显示图表。
    //   myChart.setOption(option);

    /*******高亮显示开始**********/
    var _this2 = this
    var isSet2 = true // 为了做判断：当鼠标移动上去的时候，自动高亮就被取消
    var currentIndex2 = 0

    // 2、鼠标移动上去的时候的高亮动画
    myChart.on('mouseover', function (param) {
      isSet2 = false
      clearInterval(_this2.startCharts)
      // 取消之前高亮的图形
      myChart.dispatchAction({
        type: 'downplay',
        seriesIndex: 0,
        dataIndex: currentIndex2
      })
      // 高亮当前图形
      myChart.dispatchAction({
        type: 'highlight',
        seriesIndex: 0,
        dataIndex: param.dataIndex
      })
      // 显示 tooltip
      myChart.dispatchAction({
        type: 'showTip',
        seriesIndex: 0,
        dataIndex: param.dataIndex
      })
    })
    // 3、自动高亮展示
    chartHover = function () {
      // 取消之前高亮的图形
      myChart.dispatchAction({
        type: 'downplay',
        seriesIndex: 0,
        dataIndex: currentIndex2
      })
      currentIndex2 = (currentIndex2 + 1) % dataLen
      // 高亮当前图形
      myChart.dispatchAction({
        type: 'highlight',
        seriesIndex: 0,
        dataIndex: currentIndex2
      })
      // 显示 tooltip
      myChart.dispatchAction({
        type: 'showTip',
        seriesIndex: 0,
        dataIndex: currentIndex2
      })
    }
    _this2.startCharts = setInterval(chartHover, 1000)
    // 4、鼠标移出之后，恢复自动高亮
    myChart.on('mouseout', function (param) {
      if (!isSet2) {
        _this2.startCharts = setInterval(chartHover, 1000)
        isSet2 = true
      }
    })
    /*******高亮显示结束**********/

    window.addEventListener("resize", function () {
      myChart.resize();
    });
    // });
  })();

  // 饼形图2 工作职位类别模块  首页右中
  (function () {

    var myChart = echarts.init(document.querySelector(".pie2 .chart"));
    var option = {
      color: [
        "#006cff",
        "#60cda0",
        "#ed8884",
        "#ff9f7f",
        "#0096ff",
        "#9fe6b8",
        "#32c5e9",
        "#1d9dff"
      ],
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b} : {c} 元"
      },
      legend: {
        bottom: "0%",
        itemWidth: 10,
        itemHeight: 10,
        textStyle: {
          color: "rgba(255,255,255,.5)",
          fontSize: "10"
        }
      },
      series: [
        {
          name: "职业平均时薪分析",
          type: "pie",
          radius: ["10%", "65%"],
          center: ["50%", "40%"],
          roseType: "radius",
          // 图形的文字标签
          label: {
            fontSize: 10
          },
          // 链接图形和文字的线条
          labelLine: {
            // length 链接图形的线条
            length: 6,
            // length2 链接文字的线条
            length2: 8
          }
        }
      ]
    };
    myChart.setOption(option);
    // 监听浏览器缩放，图表对象调用缩放resize函数

    var dataLen = 1
    SocketService.Instance.registerCallBack('text4Data', ret => {
      console.log("text4：")
      console.log(ret);
      //数据
      myChart.setOption({
        series: [
          {
            name: "工作职位类别",
            data: ret,
          }
        ]
      });
      dataLen = ret.length
    });

    SocketService.Instance.send({
      action: 'getData',
      socketType: 'text4Data',
      chartName: 'text4',
      value: ''
    })


    /*******高亮显示开始**********/
    var _this2 = this
    var isSet2 = true // 为了做判断：当鼠标移动上去的时候，自动高亮就被取消
    var currentIndex2 = 0

    // 2、鼠标移动上去的时候的高亮动画
    myChart.on('mouseover', function (param) {
      isSet2 = false
      clearInterval(_this2.startCharts)
      // 取消之前高亮的图形
      myChart.dispatchAction({
        type: 'downplay',
        seriesIndex: 0,
        dataIndex: currentIndex2
      })
      // 高亮当前图形
      myChart.dispatchAction({
        type: 'highlight',
        seriesIndex: 0,
        dataIndex: param.dataIndex
      })
      // 显示 tooltip
      myChart.dispatchAction({
        type: 'showTip',
        seriesIndex: 0,
        dataIndex: param.dataIndex
      })
    })
    // 3、自动高亮展示
    chartHover = function () {
      // 取消之前高亮的图形
      myChart.dispatchAction({
        type: 'downplay',
        seriesIndex: 0,
        dataIndex: currentIndex2
      })
      currentIndex2 = (currentIndex2 + 1) % dataLen
      // 高亮当前图形
      myChart.dispatchAction({
        type: 'highlight',
        seriesIndex: 0,
        dataIndex: currentIndex2
      })
      // 显示 tooltip
      myChart.dispatchAction({
        type: 'showTip',
        seriesIndex: 0,
        dataIndex: currentIndex2
      })
    }
    _this2.startCharts = setInterval(chartHover, 1000)
    // 4、鼠标移出之后，恢复自动高亮
    myChart.on('mouseout', function (param) {
      if (!isSet2) {
        _this2.startCharts = setInterval(chartHover, 1000)
        isSet2 = true
      }
    })
    /*******高亮显示结束**********/
    myChart.on('click', function (params) {
      //获取统计数据
      window.location.href = '3D.html';
    });
    window.addEventListener("resize", function () {
      myChart.resize();
    });
  })();

  // 模拟飞行路线模块地图模块
  (function () {
    var myChart = echarts.init(document.querySelector(".map .chart"));
    var geoCoordMap = {
      上海: [121.4648, 31.2891],
      东莞: [113.8953, 22.901],
      东营: [118.7073, 37.5513],
      中山: [113.4229, 22.478],
      临汾: [111.4783, 36.1615],
      临沂: [118.3118, 35.2936],
      丹东: [124.541, 40.4242],
      丽水: [119.5642, 28.1854],
      乌鲁木齐: [87.9236, 43.5883],
      佛山: [112.8955, 23.1097],
      保定: [115.0488, 39.0948],
      兰州: [103.5901, 36.3043],
      包头: [110.3467, 41.4899],
      北京: [116.4551, 40.2539],
      北海: [109.314, 21.6211],
      南京: [118.8062, 31.9208],
      南宁: [108.479, 23.1152],
      南昌: [116.0046, 28.6633],
      南通: [121.1023, 32.1625],
      厦门: [118.1689, 24.6478],
      台州: [121.1353, 28.6688],
      合肥: [117.29, 32.0581],
      呼和浩特: [111.4124, 40.4901],
      咸阳: [108.4131, 34.8706],
      哈尔滨: [127.9688, 45.368],
      唐山: [118.4766, 39.6826],
      嘉兴: [120.9155, 30.6354],
      大同: [113.7854, 39.8035],
      大连: [122.2229, 39.4409],
      天津: [117.4219, 39.4189],
      太原: [112.3352, 37.9413],
      威海: [121.9482, 37.1393],
      宁波: [121.5967, 29.6466],
      宝鸡: [107.1826, 34.3433],
      宿迁: [118.5535, 33.7775],
      常州: [119.4543, 31.5582],
      广州: [113.5107, 23.2196],
      廊坊: [116.521, 39.0509],
      延安: [109.1052, 36.4252],
      张家口: [115.1477, 40.8527],
      徐州: [117.5208, 34.3268],
      德州: [116.6858, 37.2107],
      惠州: [114.6204, 23.1647],
      成都: [103.9526, 30.7617],
      扬州: [119.4653, 32.8162],
      承德: [117.5757, 41.4075],
      拉萨: [91.1865, 30.1465],
      无锡: [120.3442, 31.5527],
      日照: [119.2786, 35.5023],
      昆明: [102.9199, 25.4663],
      杭州: [119.5313, 29.8773],
      枣庄: [117.323, 34.8926],
      柳州: [109.3799, 24.9774],
      株洲: [113.5327, 27.0319],
      武汉: [114.3896, 30.6628],
      汕头: [117.1692, 23.3405],
      江门: [112.6318, 22.1484],
      沈阳: [123.1238, 42.1216],
      沧州: [116.8286, 38.2104],
      河源: [114.917, 23.9722],
      泉州: [118.3228, 25.1147],
      泰安: [117.0264, 36.0516],
      泰州: [120.0586, 32.5525],
      济南: [117.1582, 36.8701],
      济宁: [116.8286, 35.3375],
      海口: [110.3893, 19.8516],
      淄博: [118.0371, 36.6064],
      淮安: [118.927, 33.4039],
      深圳: [114.5435, 22.5439],
      清远: [112.9175, 24.3292],
      温州: [120.498, 27.8119],
      渭南: [109.7864, 35.0299],
      湖州: [119.8608, 30.7782],
      湘潭: [112.5439, 27.7075],
      滨州: [117.8174, 37.4963],
      潍坊: [119.0918, 36.524],
      烟台: [120.7397, 37.5128],
      玉溪: [101.9312, 23.8898],
      珠海: [113.7305, 22.1155],
      盐城: [120.2234, 33.5577],
      盘锦: [121.9482, 41.0449],
      石家庄: [114.4995, 38.1006],
      福州: [119.4543, 25.9222],
      秦皇岛: [119.2126, 40.0232],
      绍兴: [120.564, 29.7565],
      聊城: [115.9167, 36.4032],
      肇庆: [112.1265, 23.5822],
      舟山: [122.2559, 30.2234],
      苏州: [120.6519, 31.3989],
      莱芜: [117.6526, 36.2714],
      菏泽: [115.6201, 35.2057],
      营口: [122.4316, 40.4297],
      葫芦岛: [120.1575, 40.578],
      衡水: [115.8838, 37.7161],
      衢州: [118.6853, 28.8666],
      西宁: [101.4038, 36.8207],
      西安: [109.1162, 34.2004],
      贵阳: [106.6992, 26.7682],
      连云港: [119.1248, 34.552],
      邢台: [114.8071, 37.2821],
      邯郸: [114.4775, 36.535],
      郑州: [113.4668, 34.6234],
      鄂尔多斯: [108.9734, 39.2487],
      重庆: [107.7539, 30.1904],
      金华: [120.0037, 29.1028],
      铜川: [109.0393, 35.1947],
      银川: [106.3586, 38.1775],
      镇江: [119.4763, 31.9702],
      长春: [125.8154, 44.2584],
      长沙: [113.0823, 28.2568],
      长治: [112.8625, 36.4746],
      阳泉: [113.4778, 38.0951],
      青岛: [120.4651, 36.3373],
      韶关: [113.7964, 24.7028],
      阿克苏地区: [80.2671, 41.1749],
      安阳: [114.352482, 36.103442],
      鹤壁: [114.295444, 35.748236],
      濮阳: [115.041299, 35.768234],
      新乡: [113.883991, 35.302616],
      焦作: [113.238266, 35.23904],
      济源: [112.590047, 35.090378],
      三门峡: [111.194099, 34.777338],
      洛阳: [112.434468, 34.663041],
      郑州: [113.665412, 34.757975],
      开封: [114.341447, 34.797049],
      商丘: [115.650497, 34.437054],
      许昌: [113.826063, 34.022956],
      平顶山: [113.307718, 33.735241],
      漯河: [114.026405, 33.575855],
      周口: [114.649653, 33.620357],
      南阳: [112.540918, 32.999082],
      驻马店: [114.024736, 32.980169],
      信阳: [114.075031, 32.123274],
    };

    var XAData = [
      [{ name: "郑州" }, { value: 79, name: "郑州" }],
      [{ name: "郑州" }, { name: "洛阳", value: 4 }],
      [{ name: "郑州" }, { name: "周口", value: 4 }],
      [{ name: "郑州" }, { name: "安阳", value: 3 }],
      [{ name: "郑州" }, { name: "驻马店", value: 3 }],
      [{ name: "郑州" }, { name: "新乡", value: 1 }],
      [{ name: "郑州" }, { name: "鹤壁", value: 2 }],
      [{ name: "郑州" }, { name: "开封", value: 2 }],
      [{ name: "郑州" }, { name: "平顶山", value: 2 }],
      [{ name: "郑州" }, { name: "商丘", value: 2 }],
      [{ name: "郑州" }, { name: "信阳", value: 2 }],
      [{ name: "郑州" }, { name: "许昌", value: 2 }],
      [{ name: "郑州" }, { name: "焦作", value: 1 }],
      [{ name: "郑州" }, { name: "北京", value: 2 }],
      [{ name: "郑州" }, { name: "杭州", value: 2 }],
      [{ name: "郑州" }, { name: "厦门", value: 1 }],
      [{ name: "郑州" }, { name: "苏州", value: 1 }],
      [{ name: "郑州" }, { name: "武汉", value: 1 }],
      [{ name: "郑州" }, { name: "重庆", value: 1 }],
      [{ name: "郑州" }, { name: "上海", value: 3 }],
      [{ name: "郑州" }, { name: "深圳", value: 3 }],
      [{ name: "郑州" }, { name: "惠州", value: 1 }],
      [{ name: "郑州" }, { name: "阿克苏地区", value: 1 }]
    ];
    // [{name: "郑州"}, {value: 79, name: "郑州"}],
    var XNData = [
      // [{ name: "洛阳" }, { name: "南阳", value: 100 }],
      // [{ name: "洛阳" }, { name: "三门峡", value: 100 }],
      // [{ name: "洛阳" }, { name: "新乡", value: 100 }],
      // [{ name: "洛阳" }, { name: "安阳", value: 100 }]
    ];

    //箭头样式
    var planePath =
      "path://M482.73408 403.02592a40.96 40.96 0 0 1 59.71968-1.90464l144.81408 144.7936a40.96 40.96 0 1 1-57.91744 57.9584l-115.79392-115.8144-115.95776 115.95776a40.96 40.96 0 0 1-57.91744-57.93792l143.0528-143.0528z";
    //var planePath = 'arrow';
    var convertData = function (data) {
      var res = [];
      for (var i = 0; i < data.length; i++) {
        var dataItem = data[i];

        var fromCoord = geoCoordMap[dataItem[0].name];
        var toCoord = geoCoordMap[dataItem[1].name];
        if (fromCoord && toCoord) {
          res.push({
            fromName: dataItem[0].name,
            toName: dataItem[1].name,
            coords: [fromCoord, toCoord],
            value: dataItem[1].value
          });
        }
      }
      return res;
    };

    var color = ["#a6c84c", "#ffa022", "#46bee9"]; //航线的颜色
    var series = [];
    [
      ["郑州", XAData],
      ["洛阳", XNData]
    ].forEach(function (item, i) {
      series.push(
        {
          name: item[0] + " Top1",
          type: "lines",
          zlevel: 1,
          effect: {
            show: true,
            period: 6,
            trailLength: 0.7,
            color: "red", //arrow箭头的颜色
            symbolSize: 3
          },
          lineStyle: {
            normal: {
              color: color[i],
              width: 0,
              curveness: 0.2
            }
          },
          data: convertData(item[1])
        },
        {
          name: item[0] + " Top2",
          type: "lines",
          zlevel: 2,
          symbol: ["none", "arrow"],
          symbolSize: 10,
          effect: {
            show: true,
            period: 6,
            trailLength: 0,
            symbol: planePath,
            symbolSize: 15
          },
          lineStyle: {
            normal: {
              color: color[i],
              width: 1,
              opacity: 0.6,
              curveness: 0.2
            }
          },
          data: convertData(item[1])
        },
        // {
        //     name: item[0] + " Top3",
        //     type: "lines",
        //     zlevel: 2,
        //     symbol: ["none", "arrow"],
        //     symbolSize: 10,
        //     effect: {
        //         show: true,
        //         period: 6,
        //         trailLength: 0,
        //         symbol: planePath,
        //         symbolSize: 15
        //     },
        //     lineStyle: {
        //         normal: {
        //             color: color[i],
        //             width: 1,
        //             opacity: 0.6,
        //             curveness: 0.2
        //         }
        //     },
        //     data: convertData(item[1])
        // },
        {
          name: item[0] + " Top3",
          type: "effectScatter",
          coordinateSystem: "geo",
          zlevel: 2,
          rippleEffect: {
            brushType: "stroke"
          },
          label: {
            normal: {
              show: false,
              position: "right",
              formatter: "{b}"
            }
          },
          symbolSize: function (val) {
            return 10;
          },
          itemStyle: {
            normal: {
              color: color[i]
            },
            emphasis: {
              areaColor: "#2B91B7"
            }
          },
          data: item[1].map(function (dataItem) {
            return {
              name: dataItem[1].name,
              value: geoCoordMap[dataItem[1].name].concat([dataItem[1].value])
            };
          })
        }
      );
    });
    var option = {
      tooltip: {
        trigger: "item",
        formatter: function (params, ticket, callback) {
          if (params.seriesType == "effectScatter") {
            return "城市：" + params.data.name + "<br />人数：" + params.data.value[2];
          } else if (params.seriesType == "lines") {
            return (
              params.data.fromName +
              "---->" +
              params.data.toName +
              "<br />人数：" +
              params.data.value
            );
          } else {
            return params.name;
          }
        }
      },
      legend: {
        orient: "vertical",
        top: "bottom",
        left: "right",
        data: ["郑州 Top1", "洛阳 Top2"],
        textStyle: {
          color: "#fff"
        },
        selectedMode: "multiple"
      },
      geo: {
        map: "henan",
        label: {
          // emphasis: {
          show: true,
          color: "#fff"
          // }
        },
        // 把中国地图放大了1.2倍
        zoom: 1.2,
        roam: true,
        itemStyle: {
          normal: {
            // 地图省份的背景颜色
            areaColor: "rgba(20, 41, 87,0.6)",
            borderColor: "#195BB9",
            borderWidth: 1
          },
          emphasis: {
            areaColor: "#2B91B7"
          }
        }
      },
      series: series
    };
    myChart.setOption(option);
    // 监听浏览器缩放，图表对象调用缩放resize函数
    // window.addEventListener("resize", function () {
    //     myChart.resize()
    // }


    /****************** 3D地球 ********************/
    //初始化echart实例
    const globe3D = echarts.init(document.getElementById("globe3D"));
    //配置项
    const globeOpt = {
      globe: {
        zoom: 0.9,
        environment: 'images/bg01.jpg', //环境贴图
        baseTexture: "images/globe.jpg", //地球的纹理
        heightTexture: "images/globe.jpg", //地图的高度纹理
        displacementScale: 0, //地球顶点位移的大小
        shading: 'realistic', //着色效果，真实感渲染
        realisticMaterial: { //真实感渲染配置
          roughness: 0.8 //材质的粗糙度
        },
        postEffect: { //后处理特效配置
          enable: true
        },
        // viewControl: {   //控制地球是否自转
        //     autoRotate: false
        // },
        light: { //光照设置
          main: { //场景主光源设置，在globe设置中就是太阳光
            intensity: 4, //主光源强度
            shadow: true //是否投影
          },
          ambientCubemap: { //使用纹理作为光源的环境光， 会为物体提供漫反射和高光反射
            texture: 'images/pisa.hdr', //环境光贴图
            diffuseIntensity: 0.1 //漫反射强度
          }
        }
      }
    };
    //渲染图表
    globe3D.setOption(globeOpt);


    //浏览器窗口大小变化时，重置报表大小
    $(window).resize(function () {
      myChart.resize();

    });
  })();

});
