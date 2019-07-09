import React from 'react';
import style from'./index.scss';


interface IProps {
}
interface IState {
}
class LineBase extends React.Component<IProps, IState> {
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
      <div>LineBase</div>
    );
  }
}

export default LineBase;