
import * as React from 'react';
import Image from 'next/image';
import { Layout, Breadcrumb, Row, Col } from 'antd';
import { Navigation } from './Navigation';

const { Header, Content, Footer, Sider } = Layout;

export interface IProps {
  children?: any;
}

export default function Layou(props: IProps) {

  return (
    <Layout style={{ minHeight: '100vh' }}>

      <Header className="site-layout-background">

        <Navigation />

      </Header>
      <Content style={{ margin: '16px 32px' }}>

        <div className="site-layout-background" style={{ minHeight: 360 }}>
          {props.children}
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
    </Layout>
  )
}