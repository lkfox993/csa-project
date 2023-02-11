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

const { Option } = Select;

export interface IProps {
    visible: boolean;
    className?: string;
    setVisible(visible: boolean): void;
};

function UpsertAcademyModal(props: IProps) {

    const [form] = Form.useForm();

    const [AcademyCreateOne] = useMutation(Academy_CREATE_ONE, {
        refetchQueries: ['AcademyPagination'],
    });

    React.useEffect(() => {
        form.resetFields();
    }, [props.visible, form]);

    const onFinish = (record: any) => {

        AcademyCreateOne({ variables: { record } })
            .then(() => {
                props.setVisible(false);
                form.resetFields();
                message.success('Academy created');
            });
    };

    return (
        <Modal
            title={'Create'}
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
                        name={[name, 'age']}
                        rules={[{ required: true, message: 'Missing age' }]}
                      >
                        <DatePicker placeholder="Age" size={'large'}  />
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, 'weight']}
                        rules={[{ required: true, message: 'Missing category weight' }]}
                      >
                        <Select placeholder="Weight" size={'large'} style={{ width: 400 / 3 }}>

                          {/* {data?.categoryPagination?.items?.map((category: any, i: number) => {
                            return (
                              <OptGroup label={category?.name} key={i}>
                                {category?.weights.map((weight: number) => {
                                  return <Option key={`${category._id}/${weight}`} value={`${category._id}/${weight}`}>{weight} kg</Option>
                                })}
                              </OptGroup>
                            )
                          })} */}

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
