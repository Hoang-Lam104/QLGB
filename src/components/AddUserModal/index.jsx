import { Modal, Button, Form, Input, Select } from "antd"
import './style.scss'

const AddUserModal = ({ title, departments, open, onOk, onCancel }) => {
    const [form] = Form.useForm()

    const onSubmit = () => {
        form.validateFields()
        var data = form.getFieldsValue()
        onOk(data)
    }

    return (
        <Modal
            title={title}
            open={open}
            onOk={onSubmit}
            onCancel={onCancel}
            footer={[
                <Button key="back" onClick={onCancel}>
                    Đóng
                </Button>,
                <Button key="submit" type="primary" onClick={onSubmit}>
                    Thêm
                </Button>,
            ]}
        >
            <Form form={form} style={{ padding: '10px' }} labelCol={{ span: 8 }}>
                <Form.Item
                    label='Họ tên'
                    name='fullname'
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập họ tên'
                        },
                        { whitespace: true }
                    ]}
                    hasFeedback
                >
                    <Input placeholder="Nhập họ tên người dùng" />
                </Form.Item>
                <Form.Item
                    label='Tên tài khoản'
                    name='username'
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập tài khoản'
                        },
                        { whitespace: true }
                    ]}
                    hasFeedback
                >
                    <Input placeholder="Nhập tài khoản" />
                </Form.Item>
                <Form.Item
                    label='Mật khẩu'
                    name='password'
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập mật khẩu'
                        },
                        { whitespace: true }
                    ]}
                    hasFeedback
                >
                    <Input.Password placeholder="Nhập mật khẩu" />
                </Form.Item>
                <Form.Item
                    label='Xác nhận mật khẩu'
                    name='confirmPassword'
                    dependencies={['password']}
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng xác nhận mật khẩu'
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve()
                                }
                                return Promise.reject('Xác nhận mật khẩu không trùng với mật khẩu')
                            }
                        })
                    ]}
                    hasFeedback
                >
                    <Input.Password placeholder="Xác nhận mật khẩu" />
                </Form.Item>
                <Form.Item
                    label='Khoa/Phòng'
                    name='department'
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng chọn khoa phòng'
                        },
                    ]}
                    hasFeedback
                >
                    <Select
                        placeholder='Chọn Khoa/Phòng'
                        options={departments.map((item) => {
                            return {
                                key: item.id,
                                label: item.name,
                                value: item.id
                            }
                        })}
                    />
                </Form.Item>
                <Form.Item
                    label='Chức vụ'
                    name='position'
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng chọn chức vụ'
                        },
                    ]}
                    hasFeedback
                >
                    <Select
                        placeholder='Chọn chức vụ'
                        options={[
                            {
                                label: 'Nhân viên',
                                value: 'Nhân viên',
                            },
                            {
                                label: 'Bác sĩ',
                                value: 'Bác sĩ',
                            },
                            {
                                label: 'Điều dưỡng',
                                value: 'Điều dưỡng',
                            },
                            {
                                label: 'Điều dưỡng trưởng',
                                value: 'Điều dưỡng trưởng',
                            },
                            {
                                label: 'Dược sĩ',
                                value: 'Dược sĩ',
                            },
                            {
                                label: 'Trưởng khoa',
                                value: 'Trưởng khoa',
                            },
                        ]}
                    />
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default AddUserModal