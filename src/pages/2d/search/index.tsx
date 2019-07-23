import React from 'react';
import style from'./index.scss';
import SearchOfD3 from '../../../components/charts/searchOfD3'
import { Input } from 'antd';
const { Search } = Input;


interface IProps {
}
interface IState {
  searchData: any
}
class SearchBase extends React.Component<IProps, IState> {
  constructor(props) {
    super(props)
    this.state = {
      searchData: {
        nodes: [

          {id: '6f', name: '耕地占用税', priority: 2 },
          {id: '7f', name: '城镇土地使用税', priority: 2 },
          {id: '8f', name: '城市维护建设税', priority: 2 },
          {id: '9f', name: '企业所得税', priority: 2 },
          {id: '10f', name: '车辆购置税', priority: 2 },
          {id: '11f', name: '环保税', priority: 2 },
          {id: '12f', name: '土地增值税', priority: 2 },
          {id: '13f', name: '车船使用税', priority: 2 },
          {id: '14f', name: '船舶吨税', priority: 2 },
          {id: '15f', name: '契税', priority: 2 },
          {id: '16f', name: '烟叶税', priority: 2 },
          {id: '17f', name: '个人所得税', priority: 2 },
          {id: '1f', name: '流转税', priority: 3 },
          {id: '2f', name: '所得税', priority: 3},
          {id: '3f', name: '资源税', priority: 3 },
          {id: '4f', name: '财产类税', priority: 3 },
          {id: '5f', name: '行为税', priority: 3  },
          {id: '1f1s', name: '增值税', priority: 1, father: '1f' },
          {id: '1f2s', name: '消费税', priority: 1, father: '1f' },
          {id: '1f3s', name: '关税', priority: 1, father: '1f'  },
          {id: '3f1s', name: '一般资源税', priority: 1, father: '3f' },
          {id: '3f2s', name: '级差资源税', priority: 1, father: '3f' },
          {id: '4f1s', name: '房产税', priority: 1, father: '4f' },
          {id: '4f2s', name: '财产税', priority: 1, father: '4f' },
          {id: '4f3s', name: '遗产税', priority: 1, father: '4f' },
          {id: '4f4s', name: '赠与税', priority: 1, father: '4f' },
          {id: '5f1s', name: '印花税', priority: 1, father: '5f' },
          {id: '5f2s', name: '交易税', priority: 1, father: '5f' },
          {id: '5f3s', name: '屠宰税', priority: 1, father: '5f' },
          {id: '5f4s', name: '特种消费行为税', priority: 1, father: '5f' },

        ],
        edges: [
          // value越小关系越近
          {id:'1', source: '1f', target: '1f1s', relation: '包含', value: 8 },
          {id:'2', source: '1f', target: '1f2s', relation: '包含', value: 3 },
          {id:'3', source: '1f', target: '1f3s', relation: '包含', value: 6 },
          {id:'4', source: '3f', target: '3f1s', relation: '包含', value: 6 },
          {id:'5', source: '3f', target: '3f2s', relation: '包含', value: 7 },
          {id:'6', source: '4f', target: '4f1s', relation: '包含', value: 7 },
          {id:'7', source: '4f', target: '4f2s', relation: '包含', value: 3 },
          {id:'8', source: '4f', target: '4f3s', relation: '包含', value: 3 },
          {id:'9', source: '4f', target: '4f4s', relation: '包含', value: 1 },
          {id:'10', source: '5f', target: '5f1s', relation: '包含', value: 2 },
          {id:'11', source: '5f', target: '5f2s', relation: '包含', value: 3 },
          {id:'12', source: '5f', target: '5f3s', relation: '包含', value: 3 },
          {id:'13', source: '5f', target: '5f4s', relation: '包含', value: 4 },
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
    const {searchData} = this.state
    return (
      <div className={style.search}>
        <div className={style.searchTop}>
          <div className={style.logo}>
            <span >不问</span>
          </div>
          <div className={style.searchBox}>
            <Search
              className={style.searchIpt}
              placeholder=""
              onSearch={value => console.log(value)}
            />
          </div>
        </div>
        <div className={style.searchContent}>
          <SearchOfD3 data={searchData} />
        </div>
      </div>
    );
  }
}

export default SearchBase;