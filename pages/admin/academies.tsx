import React from "react";
import dynamic from 'next/dynamic';
import Layout from "../../components/static/Layout";
import { gql, useQuery, useMutation } from '@apollo/client';

const UpsertAcademyModal = dynamic(() => import('../../components/modals/UpsertAcademyModal'), {
  ssr: false
})

import {
  Table,
  Space,
  Popconfirm,
  Badge,
  PageHeader,
  Button
} from "antd";

import {
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

const ACADEMY_PAGINATION = gql`

  query AcademyPagination {
    academyPagination(page: 1, perPage: 20, filter: {}, sort: _ID_ASC) {
      count
      items {
        name
        trainer
        email
        phone
        participants {
          name
          weight
        }
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

const ACADEMY_REMOVE_BY_ID = gql`
    mutation AcademyRemoveById($_id: MongoID!) {
        academyRemoveById(_id: $_id){
          recordId
        }
    }
`;

function AcademiesPage() {

  const [visible, setVisible] = React.useState(false);
  const { data, loading } = useQuery(ACADEMY_PAGINATION);
  const [selectedRowKeys, setSelectedRowKeys] = React.useState<React.Key[]>([]);
  const [academyRemoveById] = useMutation(ACADEMY_REMOVE_BY_ID, {
    refetchQueries: ['AcademyPagination']
  });

  const columns = [

    {
      title: "Name",
      dataIndex: "name",
      key: "firstName",
    },

    {
      title: "Trainer",
      dataIndex: "trainer",
      key: "trainer",
    },

    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },

    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },

    {
      title: "Action",
      key: "action",
      render: (record: any) => (
        <Space size={[25, 16]}>

          <Popconfirm
            title="Are you sure？"
            onConfirm={() => {
              academyRemoveById({
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

  const expandedRowRender = ({ participants }: any) => {

    if (!participants) {
      return false
    }

    const columns = [

      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name'
      },

      {
        title: 'Weight',
        dataIndex: 'weight',
        key: 'weight',
        render(record: any) {

          const [_, weight] = record.split('/');
          return `${weight} kg`;
        }
      }
    ];

    return (
      <Table
        columns={columns}
        dataSource={participants}
        pagination={false} />
    )
  }


  return (
    <React.Fragment>
      <UpsertAcademyModal visible={visible} setVisible={() => {
        setVisible(!visible);
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
              Academies <Badge count={0} offset={[0, -15]} />
            </React.Fragment>
          }
          subTitle={"On this page you can manage academies"}
          extra={[

            <Badge count={selectedRowKeys.length} overflowCount={9} key={'badge-delete'}>
              <Popconfirm
                key={'delete'}
                title="Are you sure？"
                onConfirm={() => { }}
                okText="Yes"
                cancelText="No"
              >

              </Popconfirm>
            </Badge>,

            <Button
              key="3"
              type={"primary"}
              icon={<PlusOutlined />}
              onClick={() => {
                setVisible(true)
              }}
            ></Button>

          ]}
        />

        <Table
          rowKey={'_id'}
          expandable={{ expandedRowRender, defaultExpandedRowKeys: ['0'] }}
          pagination={{
            pageSize: 15,
          }}
          dataSource={data?.academyPagination?.items}
          columns={columns}
          loading={loading}
        />
      </Layout>
    </React.Fragment>
  );
}

export default AcademiesPage
