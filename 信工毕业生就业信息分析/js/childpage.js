(function () {
  var jsonstr = document.cookie.split(';')[0];

  console.log("cookie：" + jsonstr);

  $.get("http://127.0.0.1:8888/api/case0", function (ret, status) {

    var job = []
    var number = []
    console.log("data长度：" + ret[jsonstr].length)
    console.log(ret)
    var maxn = 0;
    for (var i = 0; i < ret[jsonstr].length; i++) {
      var name = ret[jsonstr][i].name
      var num = ret[jsonstr][i].number
      if (maxn < num) maxn = num
      console.log(name + " " + num + "  ==== ")
      job.push(name)
      number.push(num)
    }
    // console.log(job)
    // console.log(number)

    var mCharts1 = echarts.init(document.getElementById("div1"))
    option1 = {
      grid: { containLabel: true },
      xAxis: {
        type: 'value',
        axisLabel: {
          color: '#fff',
          fontSize: "15"
        },
        axisLine: {
          lineStyle: {
            type: 'solid',
            color: '#fff',//左边线的颜色
            //width:'1'
          }
        }
      },
      yAxis: {
        name: '职业',
        type: 'category',
        axisLabel: {
          //color: "rgba(255,255,255,.6) ",
          color: '#fff',
          fontSize: "20"
        },
        axisLine: {
          lineStyle: {
            type: 'solid',
            color: '#fff',//左边线的颜色
            //width:'1'
          }
        },
        data: job,
      },
      visualMap: {
        orient: 'horizontal',
        left: 'center',
        min: 1,
        max: maxn,
        textStyle: {
          fontSize: 20,
          color: '#fff'
        },
        text: ['', '就业人数：'],
        // Map the score column to color
        dimension: 0,
        inRange: {
          color: ['#65B581', '#FFCE34', '#FD665F']
        }
      },
      //控制颜色渐变
      series: [{
        data: number,
        type: 'bar',
        barWidth: "50%",
        label: {
          show: false
        },
        itemStyle: {
          // 修改柱子圆角
          barBorderRadius: 10
        }
      }],
    };

    mCharts1.setOption(option1)

  });
})();

(function () {
  var jsonstr = document.cookie.split(';')[0];

  console.log("cookie：" + jsonstr);

  $.get("http://127.0.0.1:8888/api/banjibili", function (ret, status) {

    console.log(ret)
    console.log(ret[jsonstr])
    var mCharts2 = echarts.init(document.getElementById("div2"))
    option2 = {
      tooltip: {
        trigger: 'item',
        formatter: '{b} : {c} ({d}%)'
      },
      color: [
        "#FE642E",
        "#FE9A2E",
        "#F4FA58",
        "#ACFA58",
        "#01DFD7",
        "#0096ff",
        "#8258FA",
        "#FE2E9A"
      ],
      legend: {
        top: "bottom",
        left: "center",
        //bottom: '0',
        textStyle: {
          color: '#fff',
          fontSize: 18
        }
      },
      series: [
        {
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: 'center',
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '30',
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: ret[jsonstr]
        }
      ]
    };
    mCharts2.setOption(option2);

    /*******高亮显示开始**********/
    var _this2 = this
    var isSet2 = true // 为了做判断：当鼠标移动上去的时候，自动高亮就被取消
    var currentIndex2 = 0

    // 2、鼠标移动上去的时候的高亮动画
    mCharts2.on('mouseover', function (param) {
      isSet2 = false
      clearInterval(_this2.startCharts)
      // 取消之前高亮的图形
      mCharts2.dispatchAction({
        type: 'downplay',
        seriesIndex: 0,
        dataIndex: currentIndex2
      })
      // 高亮当前图形
      mCharts2.dispatchAction({
        type: 'highlight',
        seriesIndex: 0,
        dataIndex: param.dataIndex
      })
      // 显示 tooltip
      mCharts2.dispatchAction({
        type: 'showTip',
        seriesIndex: 0,
        dataIndex: param.dataIndex
      })
    })
    // 3、自动高亮展示
    chartHover = function () {
      var dataLen = mCharts2.getOption().series[0].data.length //计算总的数组长度
      // 取消之前高亮的图形
      mCharts2.dispatchAction({
        type: 'downplay',
        seriesIndex: 0,
        dataIndex: currentIndex2
      })
      currentIndex2 = (currentIndex2 + 1) % dataLen
      // 高亮当前图形
      mCharts2.dispatchAction({
        type: 'highlight',
        seriesIndex: 0,
        dataIndex: currentIndex2
      })
      // 显示 tooltip
      mCharts2.dispatchAction({
        type: 'showTip',
        seriesIndex: 0,
        dataIndex: currentIndex2
      })
    }
    _this2.startCharts = setInterval(chartHover, 1000)
    // 4、鼠标移出之后，恢复自动高亮
    mCharts2.on('mouseout', function (param) {
      if (!isSet2) {
        _this2.startCharts = setInterval(chartHover, 1000)
        isSet2 = true
      }
    })
    /*******高亮显示结束**********/


  });
})();

