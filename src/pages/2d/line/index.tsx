import React from 'react';
import style from'./index.scss';
import LineOfD3 from '../../../components/charts/lineOfD3'


interface IProps {
}
interface IState {
  lineData: any
}
class LineBase extends React.Component<IProps, IState> {
  constructor(props) {
    super(props)
    this.state = {
      lineData: [
        { date: '星期一', time: 20 },
        { date: '星期二', time: 58 },
        { date: '星期三', time: 97 },
        { date: '星期四', time: 117 },
        { date: '星期五', time: 98 },
        { date: '星期六', time: 120 },
        { date: '星期日', time: 84 },
      ]
    }
  }

  /**
   * @description: 改变props时候改变sate
   */
  componentWillReceiveProps(newProps) {
  }

  render() {
    const {lineData} = this.state
    return (
      <div className={style.line}>
        <div className={style.lineTop}>
          <div>线图相关配置</div>
        </div>
        <div className={style.lineBottom}>
          <div className= {style.lineSlider}>
            侧面
          </div>
          <div className={style.lineContent}>
            <LineOfD3 data={lineData} />
          </div>
        </div>
      </div>
    );
  }
}

export default LineBase;