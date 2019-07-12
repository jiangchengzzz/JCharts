import React from 'react';
import style from'./index.scss';
import * as d3 from 'd3'

interface IProps {
    data:any
};
interface IState {
};
let chartRef: any = '';
class ForceOfD3 extends React.Component<IProps, IState> {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  componentDidMount() {
    const containerWidth = chartRef.parentElement.offsetWidth
    const data = this.props.data
    const margin = { top: 60, right: 60, bottom: 60, left: 60 }
    const width = containerWidth - margin.left - margin.right
    const height = 700 - margin.top - margin.bottom
    const chart = d3
      .select(chartRef)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
    const g = chart
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')') // 设最外包层在总图上的相对位置

    // 新建力导向图，以及一些配置
    const simulation = d3
      .forceSimulation() // 构建力导向图
      .force(
        'link',
        d3
          .forceLink()
          .id(function(d, i) {
            return i
          })
          .distance(function(d) {
            return 1
          })
      )
      .force('collision', d3.forceCollide(1).strength(0.1)) //
      // .force('charge', d3.forceManyBody().strength(-1000))
      .force('center', d3.forceCenter(width / 2, height / 2))

    // 创建一个颜色的比例尺
    var colorScale = d3.scaleOrdinal()
      .domain(d3.range(data.nodes.length))
      .range(d3.schemeCategory10);

    let link = g
      .append('g') // 画连接线
      .attr('class', 'links')
      .selectAll('line')
      .data(data.edges)
      .enter()
      .append('line')
      .attr("stroke",function(d,i){
          return colorScale(i);
      })
      .attr("stroke-width",1);

    let linkText = g
      .append('g') // 画连接连上面的关系文字
      .attr('class', 'link-text')
      .selectAll('text')
      .data(data.edges)
      .enter()
      .append('text')
      .text(function(d) {
        return d.relation
      })

    let node = g
      .append('g') // 画圆圈和文字`
      .attr('class', 'nodes')
      .selectAll('g')
      .data(data.nodes)
      .enter()
      .append('g')
      .on('mouseover', function(d, i) {
        //显示连接线上的文字
        linkText.style('fill-opacity', function(edge) {
          if (edge.source === d || edge.target === d) {
            return 1
          }
        })
        //连接线加粗
        link
          .style('stroke-width', function(edge) {
            if (edge.source === d || edge.target === d) {
              return '2px'
            }
          })
          .style('stroke', function(edge) {
            if (edge.source === d || edge.target === d) {
              return '#000'
            }
          })
      })
      .on('mouseout', function(d, i) {
        //隐去连接线上的文字
        linkText.style('fill-opacity', function(edge) {
          if (edge.source === d || edge.target === d) {
            return 0
          }
        })
        //连接线减粗
        link
          .style('stroke-width', function(edge) {
            if (edge.source === d || edge.target === d) {
              return '1px'
            }
          })
          .style('stroke', function(edge) {
            if (edge.source === d || edge.target === d) {
              return '#ddd'
            }
          })
      })
      .call(
        d3
          .drag()
          .on('start', dragstarted)
          .on('drag', dragged)
          .on('end', dragended)
      )

    node
      .append('circle')
      .attr('r', 20)
      .attr('fill', function(d, i) {
        return colorScale(i)
      })

    node
      .append('text')
      .attr('fill', function(d, i) {
        return colorScale(i)
      })
      .attr('y', -20)
      .attr('dy', '.71em')
      .text(function(d) {
        return d.name
      })

    simulation // 初始化力导向图
      .nodes(data.nodes)
      .on('tick', ticked)

    simulation.force('link')
        .links(data.edges)
        .distance(function(d){//每一边的长度
            return d.value*60;
        })

    chart
      .append('g') // 输出标题
      .attr('class', 'bar--title')
      .append('text')
      .attr('fill', '#000')
      .attr('font-size', '16px')
      .attr('font-weight', '700')
      .attr('text-anchor', 'middle')
      .attr('x', containerWidth / 2)
      .attr('y', 20)
      .text('人物关系图')

    function ticked() {
      // 力导向图变化函数，让力学图不断更新
      link
        .attr('x1', function(d) {
          return d.source.x
        })
        .attr('y1', function(d) {
          return d.source.y
        })
        .attr('x2', function(d) {
          return d.target.x
        })
        .attr('y2', function(d) {
          return d.target.y
        })
      linkText
        .attr('x', function(d) {
          return (d.source.x + d.target.x) / 2
        })
        .attr('y', function(d) {
          return (d.source.y + d.target.y) / 2
        })
      node.attr('transform', function(d) {
        return 'translate(' + d.x + ',' + d.y + ')'
      })
    }

    // 添加缩放
    chart.call(d3.zoom()
      .scaleExtent([1 / 2, 8])
      .on("zoom", zoomed));

    function zoomed() {
      g.attr("transform", d3.event.transform);
    }

    function dragstarted(d) {
      if (!d3.event.active) {
        simulation.alphaTarget(0.3).restart()
      }
      d.fx = d.x
      d.fy = d.y
    }

    function dragged(d) {
      d.fx = d3.event.x
      d.fy = d3.event.y
    }

    function dragended(d) {
      // if (!d3.event.active) {
      //   simulation.alphaTarget(0)
      // }
      // d.fx = null
      // d.fy = null
    }
  }

  /**
   * @description: 改变props时候改变sate
   */
  componentWillReceiveProps(newProps) {
  }


  render() {
    const {} = this.state;
    console.log('this.props.data', this.props.data)
    return (
      <div className="" style={{height: '100%',width: '100%'}}>
        <svg style={{height: '100%',width: '100%'}} ref={r => (chartRef = r)} />
      </div>
    );
  }
}

export default ForceOfD3;