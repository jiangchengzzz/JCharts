import React from 'react';
import styles from './index.scss';
import { Layout, Menu, Icon} from 'antd';
import Link from 'umi/link';

const { SubMenu } = Menu;
const { Header, Content, Footer } = Layout;

interface MenuData {
  route: string,
  name: string,
  id: string,
  children?: any,
}

const menuData: Array<MenuData> = [
  {id: '2d', route: '/2d', name: '2D图表库'},
  {id: '3d', route: '/3d', name: '3D图表库'},
]

const sliderData: any = {
  sliderData2d: [
    { id: '2d-1', route: '/2d', name: '相关', },
    { id: '2d-2', route: '/2d/bar', name: '柱状图'},
    { id: '2d-3', route: '/2d/line', name: '折线图'},
    { id: '2d-4', route: '/2d/pie', name: '饼图'},
    { id: '2d-5', route: '/2d/force', name: '力导向图'},
    { id: '2d-6', route: '/2d/search', name: '图搜索'},
    // { id: '2d-6', route: '/2d/radar', name: '雷达图', children: [
    //   {id: '2d-6-1', route: '/2d/radar/data', name: '雷达图数据'},
    //   {id: '2d-6-2', route: '/2d/radar/layout', name: '雷达图布局'},
    // ]}
  ],
  sliderData3d: [
    { id: '3d-1', route: '/3d', name: 'papapapie', },
  ]
}

interface IProps {
  location: any,
}
interface IState {
  pathname: string,
  menuData: any
  sliderData: any,
}
class BasicLayout extends React.Component<IProps, IState> {
  constructor(props) {
    super(props)
    this.state = {
      pathname: '',
      menuData: menuData,
      sliderData: sliderData.sliderData2d,
    }
  }

  /**
   * @description: 判断和选择侧边栏跳转路由
   */
  selectRouter(types) : string {
    const route: Array<string> = this.state.pathname.split('/');
    let res: string = '';
    if (types === 'top') {
      res = route[1];
    } else if ('slider') {
      res = `${route[1]}/${route[2]}`;
    }
    return res;
  }

  setSlider(types: string): any {
  }
  /**
   * @description: 改变props时候改变sate
   */
  componentWillReceiveProps(newProps) {
    this.setState({
      pathname: newProps.location.pathname,
    });
    if (this.state.pathname.split('/')[1]) {
      switch (this.state.pathname.split('/')[1]) {
        case '2d':
          this.setState({
            sliderData: sliderData.sliderData2d,
          });
        break;
        case '3d':
          this.setState({
            sliderData: sliderData.sliderData3d,
          });
        break;
        default:
          break;
      }
    }
  }

  render() {
    const {sliderData,} = this.state
    return (
      <Layout>
        <Header className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.logo}>蒋兄的图表库</div>
            <Menu
              theme="dark"
              mode="horizontal"
              defaultSelectedKeys={[this.selectRouter('top')]}
              style={{ lineHeight: '64px' }}>
              {
                menuData.map(menu => (
                    <Menu.Item key={menu.route}>
                      <Link to={menu.route}>{menu.name}</Link></Menu.Item>
                  )
                )
              }
            </Menu>
          </div>
          <div className={styles.headerRight}>jiangjiang</div>
        </Header>
        <Content className={styles.content}>
          <div className={styles.contentSlider}>
            <Menu
              defaultSelectedKeys={[sliderData[0].id]}
              defaultOpenKeys={[sliderData[0].id]}
              mode="inline"
              theme="dark"
            >
              {
                sliderData.map((v: any) => {
                  if (v.children) {
                    return (
                      <SubMenu
                        key={v.children[0].id}
                        title={
                          <span>
                            <Icon type="mail" />
                            <span>{v.name}</span>
                          </span>
                        }
                      >
                        {
                          v.children.map((val: any) => {
                            return (
                              <Menu.Item key={val.id}><Link to={val.route}>{val.name}</Link></Menu.Item>
                            )
                          })
                        }
                      </SubMenu>
                    )
                  } else {
                    return (
                      <Menu.Item key={v.id}>
                        <Link className={styles.linkStyle} to={v.route}><Icon type="bar-chart" />{v.name}</Link>
                      </Menu.Item>
                    )
                  }
                })
              }
              </Menu>
            </div>
            <div className={styles.contentBody}>
              {this.props.children}
            </div>

        </Content>
        <Footer style={{ textAlign: 'center' }}>jiangjiang</Footer>
      </Layout>
    );
  }
}


export default BasicLayout;
