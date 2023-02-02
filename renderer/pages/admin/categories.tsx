import React from "react";
import Layout from "../../components/static/Layout";
import { gql, useQuery, useMutation } from '@apollo/client';
import {
    Table,
    Space,
    Popconfirm,
    Badge,
    Button,
    PageHeader,
    Typography
} from "antd";

import {
    EditOutlined,
    DeleteOutlined,
    ClearOutlined,
    PlusOutlined,
} from "@ant-design/icons";

import UpsertCategoryModal from '../../components/modals/UpsertCategoryModal';

const CATEGORY_PAGINATION = gql`

  query CategoryPagination {
    categoryPagination(page: 1, perPage: 20, filter: {}, sort: _ID_ASC) {
      count
      items {
        name
        _id
      }
      pageInfo {
        currentPage
        perPage
        pageCount
        itemCount
        hasNextPage
        hasPreviousPage
      }
    }
  }

`

const CATEGORY_REMOVE_BY_ID = gql`
    mutation CategoryRemoveById($_id: MongoID!) {
        categoryRemoveById(_id: $_id){
          recordId
        }
    }
`;

function CategoriesPage(props: any) {

    const [visible, setVisible] = React.useState(false);
    const { data, loading, error } = useQuery(CATEGORY_PAGINATION);
    const [categoryRemoveById] = useMutation(CATEGORY_REMOVE_BY_ID, {
        refetchQueries: ['CategoryPagination']
    });
    const [selectedRowKeys, setSelectedRowKeys] = React.useState<React.Key[]>([]);

    const columns = [

        {
            title: "Name",
            dataIndex: "name",
            key: "firstName",
        },

        {
            title: "Action",
            key: "action",
            render: (record: any) => (
                <Space size={[25, 16]}>
                    <EditOutlined />

                    <Popconfirm
                        title="Are you sure？"
                        onConfirm={() => {
                            categoryRemoveById({
                                variables: {
                                    _id: record._id
                                }
                            })
                        }}
                        okText="Yes"
                        cancelText="No"
                    >
                        <DeleteOutlined />
                    </Popconfirm>

                </Space>
            ),
        },
    ];


    return (
        <React.Fragment>

            <UpsertCategoryModal visible={visible} setVisible={() => {
                setVisible(!visible)
            }} />

            <Layout>
                <PageHeader
                    ghost={false}
                    style={{
                        marginBottom: 20,
                    }}
                    className="site-page-header"
                    title={
                        <React.Fragment>
                            Categories <Badge count={0} offset={[0, -15]} />
                        </React.Fragment>
                    }
                    subTitle={"On this page you can manage categories"}
                    extra={[
                        <Badge count={selectedRowKeys.length} overflowCount={9} key={'badge-delete'}>
                            <Popconfirm
                                title="Are you sure？"
                                onConfirm={() => {
                                    const length = selectedRowKeys.length;
                                }}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button
                                    key={"delete"}
                                    danger
                                    icon={<DeleteOutlined />}
                                    disabled={selectedRowKeys.length == 0}
                                >
                                    Delete
                                </Button>
                            </Popconfirm>
                        </Badge>,

                        <Button
                            onClick={() => {
                                setVisible(true);
                            }}
                            key="3"
                            type={"primary"}
                            icon={<PlusOutlined />}
                        ></Button>
                    ]}
                />

                <Table
                    rowKey={'_id'}
                    
                    dataSource={data?.categoryPagination?.items} 
                    rowSelection={{
                        type: 'checkbox',
                        selectedRowKeys
                    }}
                    columns={columns}
                    loading={loading}
                />
            </Layout>
        </React.Fragment>
    );
}

export default CategoriesPage
