import React from 'react';
import style from'./index.scss';

interface IProps {
}
interface IState {
}
class BarBase extends React.Component<IProps, IState> {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  /**
   * @description: 改变props时候改变sate
   */
  componentWillReceiveProps(newProps) {
  }

  render() {
    const {} = this.state
    return (
      <div className={style.barrr}>BarBase</div>
    );
  }
}

export default BarBase;