import { Space, Dropdown, Avatar, Badge, Menu } from 'antd';
import { BellOutlined } from '@ant-design/icons';

import Link from 'next/link';
import { PartitionOutlined } from '@ant-design/icons';

export const Navigation = () => {

    return (
        <>

            <Menu theme="dark" defaultSelectedKeys={['1']} mode={'horizontal'}>

                <Menu.Item key="academies" icon={<PartitionOutlined />} title="Academies">
                    <Link href={'/admin/academies'}>Academies</Link>
                </Menu.Item>

                <Menu.Item key="categories" icon={<PartitionOutlined />} title="Categories">
                    <Link href={'/admin/categories'}>Categories</Link>
                </Menu.Item>


            </Menu>
        </>
    )
}