import React from "react";
import dynamic from 'next/dynamic';
import Layout from "../../components/static/Layout";
import { gql, useQuery, useMutation } from '@apollo/client';
import Moment from 'react-moment';

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
  EditOutlined
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
          balance
          age
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

  const [initialValues, setInitialValues] = React.useState<any>({});
  const [actionType, setActionType] = React.useState('CREATE_CLIENT');
  const [visible, setVisible] = React.useState(false);
  const { data, loading } = useQuery(ACADEMY_PAGINATION);
  const [selectedRowKeys, setSelectedRowKeys] = React.useState<React.Key[]>([]);
  const [academyRemoveById] = useMutation(ACADEMY_REMOVE_BY_ID, {
    refetchQueries: ['AcademyPagination']
  });

  function dispatchActionType(actionType: any, initialValues = {}) {

    return () => {

      setInitialValues(initialValues);
      setVisible(true);
      setActionType(actionType);
    }
  };
  
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

          <EditOutlined onClick={dispatchActionType("UPDATE_ACADEMY", record)} />

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
        title: "Balance",
        dataIndex: "balance",
        key: "balance",
        render(balance: number){
          return balance || 0;
        }
      },

      {
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
        render(age: any){
          
          if(age == 'unknown'){
            return age;
          }

          return <Moment format={'D MMM YYYY'}>{age}</Moment>
        }
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

  const modalProps = { visible, setVisible, actionType, initialValues };

  return (
    <React.Fragment>
      <UpsertAcademyModal {...modalProps}/>
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
              onClick={dispatchActionType("CREATE_ACADEMY")}
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
