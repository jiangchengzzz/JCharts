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
    const margin = { top: 30, right: 30, bottom: 30, left: 30 }
    const width = containerWidth - margin.left - margin.right
    const height = 700 - margin.top - margin.bottom
    let chart = d3
      .select(chartRef)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
    let g = chart
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')') // 设最外包层在总图上的相对位置
    var colorScale = d3.scaleOrdinal()
        .domain(d3.range(data.nodes.length))
        .range(d3.schemeCategory10);

    //新建一个力导向图
    var forceSimulation = d3.forceSimulation()
        .force("link",d3.forceLink())
        .force("charge",d3.forceManyBody())
        .force("center",d3.forceCenter());;

    //初始化力导向图，也就是传入数据
    //生成节点数据
    forceSimulation.nodes(data.nodes)
        .on("tick",ticked);//这个函数很重要，后面给出具体实现和说明
    //生成边数据
    forceSimulation.force("link")
        .links(data.edges)
        .distance(function(d){//每一边的长度
            return d.value*60;
        })
    //设置图形的中心位置
    forceSimulation.force("center")
        .x(width/2)
        .y(height/2);
    //在浏览器的控制台输出
    console.log(data.nodes);
    console.log(data.edges);

    //有了节点和边的数据后，我们开始绘制
    //绘制边
    var links = g.append("g")
        .selectAll("line")
        .data(data.edges)
        .enter()
        .append("line")
        .attr("stroke",function(d,i){
            return colorScale(i);
        })
        .attr("stroke-width",1);
    var linksText = g.append("g")
        .selectAll("text")
        .data(data.edges)
        .enter()
        .append("text")
        .text(function(d){
            return d.relation;
        })

    //绘制节点
    //老规矩，先为节点和节点上的文字分组
    var gs = g.selectAll(".circleText")
        .data(data.nodes)
        .enter()
        .append("g")
        .attr("transform",function(d,i){
            var cirX = d.x;
            var cirY = d.y;
            return "translate("+cirX+","+cirY+")";
        })
        .call(d3.drag()
            .on("start",started)
            .on("drag",dragged)
            .on("end",ended)
        );

    //绘制节点
    gs.append("circle")
        .attr("r",10)
        .attr("fill",function(d,i){
            return colorScale(i);
        })
    //文字
    gs.append("text")
        .attr("x",-10)
        .attr("y",-20)
        .attr("dy",10)
        .text(function(d){
            return d.name;
        })

    function ticked(){
        links
            .attr("x1",function(d){return d.source.x;})
            .attr("y1",function(d){return d.source.y;})
            .attr("x2",function(d){return d.target.x;})
            .attr("y2",function(d){return d.target.y;});

        linksText
            .attr("x",function(d){
            return (d.source.x+d.target.x)/2;
        })
        .attr("y",function(d){
            return (d.source.y+d.target.y)/2;
        });

        gs
            .attr("transform",function(d) { return "translate(" + d.x + "," + d.y + ")"; });
    }
    function started(d){
        if(!d3.event.active){
            forceSimulation.alphaTarget(0.3).restart();
        }
        d.fx = d.x;
        d.fy = d.y;
    }
    function dragged(d){
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }
    function ended(d){
        if(!d3.event.active){
            forceSimulation.alphaTarget(0);
        }
        d.fx = null;
        d.fy = null;
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