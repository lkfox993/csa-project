import * as React from 'react';
import Router from 'next/router';
import Image from 'next/image';
import type { NextPage } from 'next'
import Head from 'next/head';
import { gql, useQuery, useMutation } from '@apollo/client';
import { Form, Input, Button, DatePicker, Steps, Space, Select, Result, message } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'


const { useForm } = Form; 
const { Option, OptGroup } = Select;

const CATEGORY_PAGINATION = gql`

  query CategoryPagination {
    categoryPagination(page: 1, perPage: 20, filter: {}, sort: _ID_ASC) {
      count
      items {
        name
        _id,
        weights
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

const ACADEMY_CREATE_ONE = gql`

  mutation AcademyCreateOne($record: CreateOneAcademyInput!) {
    academyCreateOne(record: $record) {
      recordId
      record {
        name
        _id
      }
      
    }
  }

`

const Home: NextPage & any = () => {

  const [form] = Form.useForm();
  const [success, setSuccess] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [academyCreateOne] = useMutation(ACADEMY_CREATE_ONE);
  const { data, error } = useQuery(CATEGORY_PAGINATION);

  const [current, setCurrent] = React.useState(0);

  if (success) {
    return (
      <Result
        style={{
          position: 'absolute',
          top: '50%',
          transform: 'translateY(-50%)',
          width: current > 0 ? 500 : 350,
          margin: '0 auto',
          right: 0,
          left: 0
        }}
        status="success"
        title="Are you registered!"
        subTitle="Thank you"
        extra={[
          <Button key="buy" size={'large'} onClick={() => {
            setSuccess(false);
          }}>Register Again</Button>,
        ]}
      />
    )
  }

  const onFinish = (record: any) => {

    academyCreateOne({ variables: { record } })
      .then(() => {
        form.resetFields();
        setCurrent(0);
        setSuccess(true);
      }).catch(() => {
        message.error('Something was wrong')
      });
  }

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  return (
    <div>

      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div
        style={{
          position: 'absolute',
          top: '50%',
          transform: 'translateY(-50%)',
          width: current > 0 ? 500 : 350,
          margin: '0 auto',
          right: 0,
          left: 0
        }}>

        <div
          className={'logo'}
          style={{ textAlign: 'center' }}>
          <Image src={'/csa.png'} width={250} height={220} alt={'health'} />
        </div>

        <p
          
          style={{ textAlign: 'center' }}>
          fef
        </p>

        <Form
          form={form}
          layout={'vertical'}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Steps current={current} items={[]} />

          <div style={{ display: current == 0 ? 'block' : 'none' }}>

            <Form.Item
              label="Academy"
              name="name"
              hasFeedback
              rules={[{
                required: true,
                message: 'Please input your academy!',
                type: 'string'
              }]}
            >
              <Input
                size={'large'}
                placeholder={'Example: CSA'} />
            </Form.Item>

            <Form.Item
              label="Trainer"
              name="trainer"
              hasFeedback
              rules={[{
                required: true,
                message: 'Please input your trainer!',
                type: 'string'
              }]}
            >
              <Input
                size={'large'}
                placeholder={'Example: Alexandr Demidov'} />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              hasFeedback
              rules={[{
                required: true,
                message: 'Please input your email!',
                type: 'email'
              }]}
            >
              <Input
                size={'large'}
                placeholder={'Example: ademidov@gmail.com'} />
            </Form.Item>

            <Form.Item
              label="Phone"
              name="phone"
              hasFeedback
              rules={[{
                required: true,
                message: 'Please input your phone!',
                type: 'string'
              }]}
            >
              <Input
                size={'large'}
                placeholder={'Example: 37379665234'} />
            </Form.Item>

          </div>

          <div style={{ display: current == 1 ? 'block' : 'none' }}>

            <Form.List name="participants">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                      <Form.Item
                        {...restField}
                        name={[name, 'name']}
                        rules={[{ required: true, message: 'Missing full name' }]}
                      >
                        <Input placeholder="Full Name" size={'large'} style={{ width: 230 }} />
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, 'weight']}
                        rules={[{ required: true, message: 'Missing category weight' }]}
                      >
                        <Select placeholder="Weight" size={'large'} style={{ width: 230 }}>

                          {data?.categoryPagination?.items?.map((category: any) => {
                            return (
                              <OptGroup label="Manager">
                                {category?.weights.map((weight: number) => {
                                  return <Option value={`${category._id}/${weight}`}>{weight} kg</Option>
                                })}
                              </OptGroup>
                            )
                          })}

                        </Select>
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />} size={'large'}>
                      Add participant
                    </Button>

                  </Form.Item>
                </>
              )}
            </Form.List>

          </div>


          <Form.Item>

            <Space.Compact block size={'large'}>
              <Button
                loading={loading}
                size={'large'}
                type="primary"
                style={{
                  marginRight: 5
                }}
                block
                onClick={() => {
                  current > 0 ? prev() : next()
                }}>
                {current > 0 ? 'Previous' : 'Next'}
              </Button>

              {current == 1 && (
                <Button
                  size={'large'}
                  block
                  style={{
                    marginLeft: 5
                  }}
                  htmlType="submit">
                  Register
                </Button>
              )}

            </Space.Compact>
          </Form.Item>
        </Form>
      </div>

    </div>
  )
}

Home.auth = false;

export default Home
