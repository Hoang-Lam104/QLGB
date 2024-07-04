import { Form, Row, Col, Input, Typography, Divider, Button, Select, message } from "antd"
import { useEffect, useState } from "react"
import './style.scss'
import { SaveOutlined } from "@ant-design/icons"
import { changePassword, getUserInfo, putInfo } from "../../api/userAPI"
import { getDepartments } from "../../api/department"
import { useNavigate } from "react-router-dom"

const Setting = () => {
    const [form1] = Form.useForm()
    const [form2] = Form.useForm()
    const [user, setUser] = useState()
    const user_id = localStorage.getItem('userId')
    const [departments, setDepartments] = useState([])
    const navigate = useNavigate()
    if (!user_id) navigate('/dang-nhap')

    useEffect(() => {
        getUserInfo(user_id).then(response => {
            setUser(response.data)
        })
        getDepartments().then(response => {
            setDepartments(response.data)
        })
    }, [user_id])

    useEffect(() => {
        form1.setFieldsValue({
            fullname: user && user.fullname,
            departmentId: user && user.departmentId,
            position: user && user.position
        })
    }, [form1, user])

    const onFinish = () => {
        const data = form1.getFieldsValue()
        putInfo(user_id, data).then(response => {
            setUser(response.data)
            message.success("Thay đổi thông tin thành công", 5)
        }).catch(error => {
            message.error("Thay đổi thông tin thất bại", 5)

        })
    }

    const onFinishChangePassword = () => {
        const data = form2.getFieldsValue()
        const body = {
            userId: user_id,
            oldPassword: data.oldPassword,
            newPassword: data.newPassword
        }
        changePassword(body).then(response => {
            message.success("Thay đổi mật khẩu thành công", 5)
            navigate('/dang-nhap')
        }).catch(error => {
            message.error(error.response.data.message, 5)
        })
    }

    return (
        <div className="user_container">
            <div className="user_header">
                <Row justify='space-between'>
                    <Col>
                        <Typography.Title>Cài đặt</Typography.Title>
                    </Col>
                </Row>
            </div>
            <Divider dashed />
            <div className="user_content">
                <Typography.Title level={3}>Sửa thông tin Người dùng</Typography.Title>
                <Form
                    form={form1}
                    onFinish={onFinish}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 10 }}
                >
                    <Form.Item
                        name="fullname"
                        label="Họ tên"
                        rules={[{ required: true, message: 'Vui lòng nhập họ tên người dùng' }]}
                    >
                        <Input placeholder="Nguyễn Trường A" />
                    </Form.Item>
                    <Form.Item
                        name="departmentId"
                        label="Khoa/Phòng"
                        rules={[{ required: true, message: 'Vui lòng chọn khoa/phòng' }]}
                    >
                        <Select
                            options={departments.map(item => {
                                return {
                                    key: item.id,
                                    label: item.name,
                                    value: item.id,
                                }
                            })}
                        />
                    </Form.Item>
                    <Form.Item
                        name="position"
                        label="Chức vụ"
                        rules={[{ required: true, message: 'Vui lòng chọn chức vụ' }]}
                    >
                        <Select
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
                    <Form.Item
                        wrapperCol={{
                            offset: 7,
                            span: 14,
                        }}
                    >
                        <Button
                            type="primary"
                            htmlType="submit"
                            icon={<SaveOutlined />}
                        >
                            Lưu thông tin
                        </Button>
                    </Form.Item>
                </Form>
            </div>
            <Divider dashed />
            <div className="user_content">
                <Typography.Title level={3}>Đổi mật khẩu</Typography.Title>
                <Form
                    form={form2}
                    onFinish={onFinishChangePassword}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 6 }}
                >
                    <Form.Item
                        name="oldPassword"
                        label="Mật khẩu cũ"
                        rules={[{ required: true, message: 'Vui lòng nhập họ tên người dùng' }]}
                        hasFeedback
                    >
                        <Input.Password placeholder="Nhập mật khẩu cũ" />
                    </Form.Item>
                    <Form.Item
                        name="newPassword"
                        label="Mật khẩu mới"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới' }]}
                        hasFeedback
                    >
                        <Input.Password placeholder="Nhập mật khẩu mới" />
                    </Form.Item>
                    <Form.Item
                        name="confirmPassword"
                        label="Xác nhận mật khẩu"
                        rules={[
                            { required: true, message: 'Vui lòng chọn chức vụ' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('newPassword') === value) {
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
                        wrapperCol={{
                            offset: 5,
                            span: 10,
                        }}
                    >
                        <Button
                            type="primary"
                            htmlType="submit"
                            icon={<SaveOutlined />}
                        >
                            Lưu thông tin
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>

    )
}

export default Setting