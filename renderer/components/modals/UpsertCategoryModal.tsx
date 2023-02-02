import * as React from "react";
import {
    Modal,
    Form,
    Input,
    Select,
    Tabs,
    message
} from "antd";
import { useMutation, useQuery, gql } from '@apollo/client';
import { ReloadOutlined } from "@ant-design/icons";

const CATEGORY_CREATE_ONE = gql`

  mutation AdCreateOne($record: CreateOneCategoryInput!) {
    categoryCreateOne(record: $record) {
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

function UpsertCategoryModal(props: IProps) {

    const [form] = Form.useForm();

    const [categoryCreateOne] = useMutation(CATEGORY_CREATE_ONE, {
        refetchQueries: ['CategoryPagination'],
    });

    React.useEffect(() => {
        form.resetFields();
    }, [props.visible]);

    const onFinish = (record: any) => {

        categoryCreateOne({ variables: { record } })
                .then(() => {
                    props.setVisible(false);
                    form.resetFields();
                    message.success('Category created');
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
            width={500}
        >
            <Form
                form={form}
                onFinish={onFinish}
                name="basic"
                layout={"vertical"}
            >
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

                <Form.Item
                    label="Weight"
                    hasFeedback
                    name="weights"
                    rules={[
                        {
                            required: true,
                            message: "Please input weight!",
                            type: 'array',
                        },
                    ]}
                >
                    <Select mode={'multiple'} size={'large'}>

                        {Array.from({ length: 140 }, (_, i) => i + 1).map((weight)=>{
                            return <Option value={weight}>{weight}kg</Option>
                        })}

                    </Select>

                </Form.Item>

            </Form>
        </Modal>
    );
}

UpsertCategoryModal.defaultProps = {
    visible: false,
    initialValues: {},
};

export default UpsertCategoryModal
