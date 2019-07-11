import React from 'react';
import * as d3 from 'd3';
import * as d3Tip from 'd3-tip'

interface IProps {
    data:any
};
interface IState {
};
let chartRef: any = '';
class LineOfD3 extends React.Component<IProps, IState> {
  constructor(props) {
    super(props)
    this.state = {
    }
  }
  componentDidMount() {
    //1.设置一些画布配置，创建svg画布，
    const containerWidth = chartRef.parentElement.offsetWidth;
    const margin = { top: 80, right: 80, bottom: 30, left: 60 };
    const width = containerWidth - margin.left - margin.right;
    const height = 700 - margin.top - margin.bottom;
    const labelPadding = 3
    const chart = d3
        .select(chartRef)
        .attr('width', width + margin.left + margin.right)
        .attr('height', height+ margin.top + margin.bottom);
    const g = chart
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
    const data = this.props.data;
    // 设置数据
    const xData = [];
    const serieArr = data.map((val, i) => {
        xData.push(val.date);
        return {
            key: i,
            date: val.date,
            value: val.time
        }
    })

    let maxVal = d3.max(serieArr, function(d) {
        return d.value
    })
    maxVal = maxVal*1.1

    // 开始建立x轴 为序数比例尺
    const ranges = d3.range(0, width, width/data.length);
    const xScale = d3.scaleOrdinal() // 创建一个序数分段比例尺
        .domain(xData)
        .range(ranges)

    const xAxis = d3.axisBottom(xScale); // 定义x轴, 通过创建刻度在下的坐标轴生成器

    // 开始建立y轴，线性比例尺
    const yScale = d3.scaleLinear()  // 定义y轴, 通过创建刻度在左的坐标轴生成器
        .domain([0, maxVal])
        .range([height, 0]);
    const yAxis = d3.axisLeft(yScale);

    // 设置线条的颜色
    const lineColor = d3.scaleOrdinal(d3.schemeCategory10) // 通用线条颜色

    const stepValue = 30 // 用于生成背景宽
    const rangeByStep = d3.range(0, maxVal, stepValue) // 用于生成背景柱
    // 生成背景颜色
    const colors = [
        '#6bcd07',
        '#fbd029',
        '#fe8800',
        '#fe0000',
        '#970454',
        '#62001e'
      ]
    // 背景文字
    const ngName = [
        '轻松惬意',
        '满头大汗',
        '提心吊胆',
        '破罐破摔',
    ]

    // 创建线条
    const line = d3
        .line()
        .x(d => xScale(d.date))
        .y(d => yScale(d.value))

    console.log('d3Tip', d3Tip)
    // let tip = d3Tip() // 设置tip
    //     .attr('class', 'd3-tip')
    //     .offset([-10, 0])
    //     .html(function(d) {
    //         console.log('dddede', d)
    //         return (
    //         '<strong>星期：' +
    //         d.date +
    //         "<br>到达时间:</strong> <span style='color:#ffeb3b'>" +
    //         d.value +
    //         '</span>'
    //         )
    //     })
    // chart.call(tip)

    chart
      .append('defs')
      .append('clipPath') // 添加长方形方块，遮罩作用
      .attr('id', 'clip')
      .append('rect')
      .attr('height', height)
      .attr('width', 0) // 用遮罩实现线动画
      .transition()
      .duration(1000)
      .attr('width', width)

    // 开始绘制
    g.append('g')
        .attr('class', 'axis axis--y') // y轴虚线
        .call(yAxis)
        .append('text')
        .attr('y', -720)
        .attr('dy', '71em')
        .style('text-anchor', 'middle')
        .style('fill', 'red')
        .text('数值')

    g.append('g') // 设置背景柱
        .attr('class', 'lineii--bg-bar')
        .selectAll('rect')
        .data(rangeByStep)
        .enter()
        .append('rect')
        .attr('stroke', 'none')
        .attr('stroke-width', 0)
        .attr('fill', function(d, i) {
          return colors[i]
        })
        .attr('x', 1)
        .attr('width', width)
        .attr('height', function(d, i) {
          if (i !== rangeByStep.length - 1) {
            return yScale(maxVal - stepValue)
          } else {
            return yScale(rangeByStep[rangeByStep.length - 1])
          }
        })
        .attr('y', function(d, i) {
          if (i !== rangeByStep.length - 1) {
            return yScale(rangeByStep[i + 1])
          } else {
            return 0
          }
        })

    // 因为x轴虚线需要覆盖在背景上所以要放在y轴背景后面
    g.append('g') // 生成x轴
    .attr('class', 'axis axis--x') // x轴虚线
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)

    g.selectAll('.axis--x .tick') // xx轴背景线
        .append('line')
        .attr('class', 'bg-line')
        .attr('stroke', '#bdbdbd')
        .attr('stroke-dasharray', '2,2')
        .attr('shape-rendering', 'crispEdges')
        .attr('transform', 'translate(' + 0 + ',' + -1 * height + ')')
        .attr('y2', height)
    g.select('.bg-line').remove()
    // 在背景里面添加文字
    g.append('g') // 设置背景文字
      .attr('class', 'lineii--bg-bar-text')
      .selectAll('.ylabel') // 生成右边文字
      .data(rangeByStep)
      .enter()
      .append('text')
      .attr('class', 'ylabel')
      .attr('fill', 'rgba(255,255,255,0.5)')
      .attr('font-size', '24px')
      .attr('x', width / 2)
      .attr('y', function(d, i) {
        if (i !== rangeByStep.length - 1) {
          return yScale(rangeByStep[i + 1])
        } else {
          return 0
        }
      })
      .attr('dy', function(d, i) {
        if (i !== rangeByStep.length - 1) {
          return yScale(maxVal - stepValue) / 2
        } else {
          return yScale(rangeByStep[rangeByStep.length - 1]) / 2 + 8
        }
      })
      .attr('text-anchor', 'middle')
      .text(function(d, i) {
        return ngName[i]
      })

    const serie = g
        .selectAll('.serie') // 生成线条
        .data([serieArr])
        .enter()
        .append('g')
        .attr('class', 'serie')
    serie
      .append('path') // 绘画线条
      .attr('clip-path', 'url(#clip)')
      .attr('class', 'line')
      .style('stroke', function(d) {
        return lineColor(d[0].key)
      })
      .style('stroke-width', 2)
      .attr('fill', 'none')
      .attr('d', line)

    let label = serie
      .selectAll('.label') // 生成文字包层
      .data(function(d) {
        return d
      })
      .enter()
      .append('g')
    //   .on('mouseover', tip.show)
    //   .on('mouseout', tip.hide)
      .attr('cursor', 'pointer')
      .attr('class', 'label')
      .attr('transform', function(d, i) {
        return 'translate(' + xScale(d.date) + ',' + yScale(d.value) + ')'
      })

    label
      .append('text') // 生成数值文字
      .attr('dy', '.35em')
      .attr('fill', '#fff')
      .attr('text-anchor', 'middle')
      .text(function(d) {
        return d.value
      })

      label
      .insert('rect', 'text') // 生成背景白块
      .datum(function() {
        return this.nextSibling.getBBox()
      })
      .attr('fill', 'rgba(0,0,0,0.5)')
      .attr('rx', '5px')
      .attr('ry', '5px')
      .attr('x', function(d) {
        return d.x - labelPadding
      })
      .attr('y', function(d) {
        return d.y - labelPadding
      })
      .attr('width', function(d) {
        return d.width + 2 * labelPadding
      })
      .attr('height', function(d) {
        return d.height + 2 * labelPadding
      })

    chart
      .append('g') // 输出标题
      .attr('class', 'line-title')
      .append('text')
      .attr('fill', '#000')
      .attr('font-weight', '700')
      .attr(
        'transform',
        'translate(' + (width / 2 + margin.left) + ',' + 20 + ')'
      )
      .attr('text-anchor', 'middle')
      .attr('x', 0)
      .attr('y', 0)
      .text('蒋兄早考勤情况')
  }

  /**
   * @description: 改变props时候改变sate
   */
  componentWillReceiveProps(newProps) {
  }


  render() {
    const {} = this.state;
    return (
      <div className="" style={{height: '100%',width: '100%'}}>
        <svg style={{height: '100%',width: '100%'}} ref={r => (chartRef = r)} />
      </div>
    );
  }
}

export default LineOfD3;