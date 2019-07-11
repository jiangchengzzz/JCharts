import React from 'react';
import style from'./index.scss';
import BarOfD3 from '../../../components/charts/barOfD3'


interface IProps {
}
interface IState {
  barData: any
}
class BarBase extends React.Component<IProps, IState> {
  constructor(props) {
    super(props)
    this.state = {
      barData: [10, 20, 30, 23, 13, 40, 27, 35, 20, 33]
    }
  }

  /**
   * @description: 改变props时候改变sate
   */
  componentWillReceiveProps(newProps) {
  }

  render() {
    const {barData} = this.state
    return (
      <div className={style.bar}>
        <div className={style.barTop}>
          <div>线图相关配置</div>
        </div>
        <div className={style.barBottom}>
          <div className= {style.barSlider}>
            侧面
          </div>
          <div className={style.barContent}>
            <BarOfD3 data={barData} />
          </div>
        </div>
      </div>
    );
  }
}

export default BarBase;