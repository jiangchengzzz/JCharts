import React from 'react';
import style from'./index.scss';
import * as d3 from 'd3'

interface IProps {
    data:any
};
interface IState {
};
let chartRef: any = '';
class SearchOfD3 extends React.Component<IProps, IState> {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  componentDidMount() {
    const containerWidth = chartRef.parentElement.offsetWidth
    const orgData = this.props.data
    const source: any = {};
    // 初始只返回一层数据，对数据进行筛选。
    source.nodes = orgData.nodes.filter((v) => {
      return v.priority !== 1;
    })
    source.edges = [];
    const margin = { top: 60, right: 60, bottom: 60, left: 60 }
    const width = containerWidth - margin.left - margin.right
    const height = 900 - margin.top - margin.bottom
    const chart = d3
      .select(chartRef)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
    const g = chart
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')') // 设最外包层在总图上的相对位置
    const simulation = d3
      .forceSimulation() // 构建力导向图
      .force(
        'link',
        d3
          .forceLink()
          .id(function(d, i) {
            return d.id
          })
          .distance(function(d) {
            return 1
          })
      )
      .force('collision', d3.forceCollide(20).strength(30)) //
      .force('charge', d3.forceManyBody().strength((d) => {
        if (d.priority === 3) {
          return -100;
        } else {
          return -200;
        }

      }).distanceMin(20).distanceMax(300))
      .force('center', d3.forceCenter(width / 2, height / 2))

    update(source)
    function update(data: any) {
      // 数据更新需要先删除
      g.selectAll(".nodes").remove();
      g.selectAll(".node-circle").remove();
      g.selectAll(".node-text").remove();
      g.selectAll(".links").remove();
      g.selectAll(".link-text").remove();
      g.selectAll("#marker").remove();

      // 创建颜色比例尺
      const colorScale = d3.scaleLinear()
        .domain([3, 2, 1])
        .range(['#6a1b9a', '#ab47bc', ]);
      // 创建箭头
      var maker = g
        .append('marker')
        .attr('id', 'marker')
        // .attr("id", function(d) { return `marker${d}`; }) // 目前发现所有箭头都是同一个如果更改样式则所有箭头全变，尝试每个关系一个箭头失败
        .attr("markerUnits","strokeWidth")// 设置为strokeWidth箭头会随着线的粗细发生变化
        .attr("markerUnits","userSpaceOnUse")
        .attr("viewBox", "0 -5 10 10")//坐标系的区域
        .attr("refX",26)//箭头坐标
        .attr("refY", 0)
        .attr("markerWidth", 12)//标识的大小
        .attr("markerHeight", 12)
        .attr("orient", "auto")//绘制方向，可设定为：auto（自动确认方向）和 角度值
        .attr("stroke-width",2)//箭头宽度
        .append("path")
        .attr("d", "M0,-5L10,0L0,5")//箭头的路径
        .attr('fill','#000000');//箭头颜色

      // 设置关系连接线
      let link = g
        .append('g') // 画连接线
        .selectAll('line')
        .data(data.edges)
        .enter()
        .append('line')
        .attr('class', 'links')
        .attr(
          'id', function(d,i) {return `link-${d.source}_${d.target}`})
        .attr("stroke",function(d,i){
            return colorScale(i);
        })
        .attr("stroke-width",1)
        .attr("marker-end", "url(#marker)")//根据箭头标记的id号标记箭头
      // 创建线上文字
      let linkText = g
        .append('g') // 画连接连上面的关系文字
        .selectAll('text')
        .data(data.edges)
        .enter()
        .append('text')
        .attr('class', 'link-text')
        .text(function(d) {
          return d.relation
        })
      // 绘制节点以及文字
      let node = g
        .append('g') // 画圆圈和文字`
        .selectAll('g')
        .data(data.nodes)
        .enter()
        .append('g')
        .attr('class', 'nodes')
        .attr('id', function(d, i) {
          return 'node-' + d.id
        })
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
        .on('dblclick', function(d, i) {
          addChild(d)
          update(source)
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
        .attr('r',  function(d, i) {
          return d.priority * 20
        })
        .attr('fill', function(d, i) {
          return colorScale(d.priority)
        })

      node
      .append('text')
      .attr('fill', function(d, i) {
        return colorScale(i)
      })
      .attr("text-anchor", "middle")
      .attr("y", function(d) {return `${d.priority * 1.7}em`})
      .attr('dy', '.6em')
      .text(function(d) {
        return d.name
      })

      simulation // 初始化力导向图
        .nodes(data.nodes)
        .on('tick', ticked)
          simulation.restart();
      simulation.force('link')
        .links(data.edges)
        .distance(function(d){ // 每一边的长度
            return 150;
        })

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
    }
    // 添加缩放
    chart.call(d3.zoom()
      .scaleExtent([1 / 2, 8])
      .on("zoom", zoomed))
      .on("dblclick.zoom", null) // 禁制zoom的默认双击缩放

    function zoomed() {
      g.attr("transform", d3.event.transform);
    }

    function dragstarted(d) {
      if (!d3.event.active) {
        simulation.alphaTarget(0.9).restart()
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
    // 下钻节点数据
    function addChild(d) {
      source.nodes.push(...orgData.nodes.filter((val) => {
        return val.father === d.id&& !source.nodes.includes(val)
      }))
      source.edges.push(...orgData.edges.filter((val) => {
        return val.source === d.id
      }))
    }
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

export default SearchOfD3;