import React from 'react';
import * as d3 from 'd3'

interface IProps {
    data:any
};
interface IState {
};
let chartRef: any = '';
class BarOfD3 extends React.Component<IProps, IState> {
  constructor(props) {
    super(props)
    this.state = {
    }
  }
  componentDidMount() {
    //1.创建svg画布
    const containerWidth = chartRef.parentElement.offsetWidth
    const data = this.props.data
    const margin = { top: 30, right: 30, bottom: 30, left: 30 }
    const width = containerWidth - margin.left - margin.right
    const height = 700 - margin.top - margin.bottom
    let chart = d3
      .select(chartRef)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
    let g = chart.append('g').attr('transform', 'translate(' + margin.top + ',' + margin.left + ')')
    //3.坐标轴
    //x轴序数比例尺（d3.scaleBand()并不是一个连续性的比例尺，domain()中使用一个数组，不过range()需要是一个连续域）
    let ranges = d3.range(data.length)
    let xcale = d3.scaleBand().domain(ranges).range([0, width - margin.left - margin.right])
    let xAxis = d3.axisBottom(xcale)
    g.append('g')
        .attr('transform', 'translate(' + 0 + ',' + (height - margin.top - margin.bottom) + ')')
        .call(xAxis)
    //y轴线性比例尺
    let yscale = d3.scaleLinear().domain([0, d3.max(data)]).range([height - margin.top - margin.bottom, 0])
    let yAxis = d3.axisLeft(yscale)
    g.append('g')
        .attr('transform', 'translate(0, 0)')
        .call(yAxis)
    //4.为每个矩形和对应的文字创建一个分组<g>
    let gs = g.selectAll('rect')
        .data(data)
        .enter()
        .append('g')
    //5.绘制矩形
    //设置矩形之间的间隙
    let rectPadding = 20
    gs.append('rect')
        .attr('x', function(d, i) {
            //xcale(i): 画布真实宽度(48)横坐标且从0开始, 0, 48, 96 ... 432
            return xcale(i) + rectPadding/2
        })
        .attr('width', function() {
            //xcale.step() 画布真实宽度(48):width-marge.left-marge.right/dataset.lenght
            return xcale.step() - rectPadding
        })
        .attr('y', function(d){
            let min = yscale.domain()[0] //0 ； yscale(0) --- 280
            return yscale(min)   //返回的是最大值
        })
        .attr('height', function(d){
            //默认开始高度为0
            return 0
        })
        .attr('fill', '#e57373')
        .transition()
        .duration(1000)
        .delay(function(d, i){
            return i * 200
        })
        // .ease(d3.easeElasticInOut)
        .attr('y', function(d){
            return yscale(d)
        })
        .attr('height', function(d){
            return height - margin.top - margin.bottom - yscale(d)
        })
    //6.绘制文字
    gs.append('text')
        .attr('x', function(d, i) {
            return xcale(i) + rectPadding/2
        })
        .attr('width', function() {
            return xcale.step() - rectPadding
        })
        .attr('y', function(d) {
            // return yscale(d)
            let min = yscale.domain()[0] //0 ； yscale(0) --- 280
            return yscale(min)   //返回的是最大值, 即在最底部
        })
        .attr('dy', rectPadding)
        .text(function(d) {
            return d
        })
        .transition()
        .duration(1000)
        .delay(function(d,i){
            return i * 200;
        })
        //.ease(d3.easeElasticInOut)
        .attr("y",function(d){
            return yscale(d);
        });
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

export default BarOfD3;