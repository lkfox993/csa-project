import * as React from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Tabs,
  DatePicker,
  Button,
  Space,
  message
} from "antd";
import { useMutation, useQuery, gql } from '@apollo/client';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import moment from 'moment';

const { OptGroup } = Select;
const { TabPane } = Tabs;

const Academy_CREATE_ONE = gql`

  mutation AdCreateOne($record: CreateOneAcademyInput!) {
    AcademyCreateOne(record: $record) {
      recordId
      record {
        name
        _id
      }
      
    }
  }
`

export const UPDATE_ACADEMY = gql`
    mutation AcademyUpdateById($_id: MongoID!, $record: UpdateByIdAcademyInput!) {
        academyUpdateById(_id: $_id, record: $record){
            recordId
            record {
                name
                participants {
                  name
                  age
                  weight
                }
            }
        }
    }
`;

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

const { Option } = Select;

export interface IProps {
  visible: boolean;
  className?: string;
  initialValues?: any;
  actionType: string;
  setVisible(visible: boolean): void;
};

function UpsertAcademyModal(props: IProps) {

  const [form] = Form.useForm();

  const [AcademyCreateOne] = useMutation(Academy_CREATE_ONE, {
    refetchQueries: ['AcademyPagination'],
  });

  const [updateAcademy] = useMutation(UPDATE_ACADEMY, {
    refetchQueries: ['AcademyPagination'],
  });

  const categoryPaginationResult = useQuery(CATEGORY_PAGINATION);

  React.useEffect(() => {

    if (props.actionType == "CREATE_ACADEMY") {
      form.resetFields();
    } else {
      form.setFieldsValue(props.initialValues);
    };

  }, [props.initialValues]);

  const onFinish = (record: any) => {

    if (props.actionType == "CREATE_ACADEMY") {

      AcademyCreateOne({ variables: { record } })
        .then(() => {
          props.setVisible(false);
          form.resetFields();
          message.success('Academy created');
        });

    } else {

      const { _id } = props.initialValues;

      updateAcademy({ variables: { _id, record } })
        .then(() => {
          props.setVisible(false);
          form.resetFields();
          message.success('Academy updated');
        })
    };
  };

  console.log(props.initialValues);

  return (
    <Modal
      title={props.actionType == 'CREATE_ACADEMY' ? 'Create' : 'Update'}
      className={props.className}
      okButtonProps={{
        disabled: false
      }}
      maskClosable={false}
      bodyStyle={{
        padding: "0px 24px",
      }}
      visible={props.visible}
      onOk={() => {
        form.submit();
      }}
      onCancel={() => {
        props.setVisible(false);
      }}
      width={550}
    >
      <Form
        form={form}
        onFinish={onFinish}
        name="basic"
        layout={"vertical"}
      >
        <Tabs>

          <TabPane tab={'General'} tabKey={'general'} key={'general'}>

            <Form.Item
              label="Name"
              hasFeedback
              name="name"
              rules={[
                {
                  required: true,
                  message: "Please input name!",
                  type: "string",
                },
              ]}
            >
              <Input placeholder={"Your name"} size={'large'} />
            </Form.Item>

          </TabPane>

          <TabPane tab={'Participants'} tabKey={'participants'} key={'participants'}>
            <Form.List name="participants">
              {(fields, { add, remove }) => (
                <>
                {console.log(fields)}
                  {fields.map(({ key, name, ...restField }) => (
                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                      <Form.Item
                        {...restField}
                        name={[name, 'name']}
                        rules={[{ required: true, message: 'Missing full name' }]}
                      >
                        <Input placeholder="Full Name" size={'large'} />
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, 'weight']}
                        rules={[{ required: true, message: 'Missing category weight' }]}
                      >
                        <Select placeholder="Weight" size={'large'} style={{ width: 400 / 3 }}>

                          {categoryPaginationResult?.data?.categoryPagination?.items?.map((category: any, i: number) => {
                            return (
                              <OptGroup label={category?.name} key={i}>
                                {category?.weights.map((weight: number) => {
                                  return <Option key={`${category._id}/${weight}`} value={`${category._id}/${weight}`}>{weight} kg</Option>
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
          </TabPane>

        </Tabs>

      </Form>
    </Modal>
  );
}

UpsertAcademyModal.defaultProps = {
  visible: false,
  initialValues: {},
};

export default UpsertAcademyModal
