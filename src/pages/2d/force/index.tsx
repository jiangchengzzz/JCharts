import React from 'react';
import style from'./index.scss';
import ForceOfD3 from '../../../components/charts/forceOfD3'


interface IProps {
}
interface IState {
  forceData: any
}
class ForceBase extends React.Component<IProps, IState> {
  constructor(props) {
    super(props)
    this.state = {
      forceData: {
          nodes: [
              { name: 'A人物' },
              { name: 'B人物' },
              { name: 'C人物' },
              { name: 'D人物' },
              { name: 'E人物' },
              { name: 'F人物' },
              { name: 'G人物' },
              { name: 'H人物' },
              { name: 'I人物' },
              { name: 'J人物' },
              { name: 'K人物' },
              { name: 'L人物' },
              { name: 'M人物' }
            ],
            edges: [
              // value越小关系越近
              { source: 0, target: 1, relation: '朋友', value: 3 },
              { source: 0, target: 2, relation: '朋友', value: 3 },
              { source: 0, target: 3, relation: '朋友', value: 6 },
              { source: 1, target: 2, relation: '朋友', value: 6 },
              { source: 1, target: 3, relation: '朋友', value: 7 },
              { source: 2, target: 3, relation: '朋友', value: 7 },
              { source: 0, target: 4, relation: '朋友', value: 3 },
              { source: 0, target: 5, relation: '朋友', value: 3 },
              { source: 4, target: 5, relation: '夫妻', value: 1 },
              { source: 0, target: 6, relation: '兄弟', value: 2 },
              { source: 4, target: 6, relation: '同学', value: 3 },
              { source: 5, target: 6, relation: '同学', value: 3 },
              { source: 4, target: 7, relation: '同学', value: 4 },
              { source: 5, target: 7, relation: '同学', value: 3 },
              { source: 6, target: 7, relation: '同学', value: 3 },
              { source: 4, target: 8, relation: '师生', value: 4 },
              { source: 5, target: 8, relation: '师生', value: 5 },
              { source: 6, target: 8, relation: '师生', value: 3 },
              { source: 7, target: 8, relation: '师生', value: 5 },
              { source: 8, target: 9, relation: '师生', value: 4 },
              { source: 3, target: 9, relation: '师生', value: 5 },
              { source: 2, target: 10, relation: '母子', value: 1 },
              { source: 10, target: 11, relation: '雇佣', value: 6 },
            ]
      }
    }
  }

  /**
   * @description: 改变props时候改变sate
   */
  componentWillReceiveProps(newProps) {
  }


  render() {
    const {forceData} = this.state
    return (
      <div className={style.force}>
        <div className={style.forceTop}>
          <div>力导向图相关配置</div>
        </div>
        <div className={style.forceBottom}>
          <div className= {style.forceSlider}>
            侧面
          </div>
          <div className={style.forceContent}>
            <ForceOfD3 data={forceData} />
          </div>
        </div>
      </div>
    );
  }
}

export default ForceBase;