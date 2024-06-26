import { Form, Row, Col, Input, Typography, Divider, Button, Select, message } from "antd"
import { useEffect, useState } from "react"
import './style.scss'
import { SaveOutlined } from "@ant-design/icons"
import { getUserInfo, putInfo } from "../../api/userAPI"
import { getDepartments } from "../../api/department"

const Setting = () => {
    const [form] = Form.useForm()
    const [user, setUser] = useState()
    const user_id = localStorage.getItem('userId')
    const [departments, setDepartments] = useState([])

    useEffect(() => {
        getUserInfo(user_id).then(response => {
            setUser(response.data)
        })
        getDepartments().then(response => {
            setDepartments(response.data)
        })
    }, [user_id])

    useEffect(() => {
        form.setFieldsValue({
            fullname: user && user.fullname,
            departmentId: user && user.departmentId,
            position: user && user.position
        })
    }, [form, user])

    const onFinish = () => {
        const data = form.getFieldsValue()
        putInfo(user_id, data).then(response => {
            setUser(response.data)
            message.success("Thay đổi thông tin thành công", 5)
        }).catch(error => {
            message.error("Thay đổi thông tin thất bại", 5)

        })
    }

    return (
        <div className="user_container">
            <div className="user_header">
                <Row justify='space-between'>
                    <Col>
                        <Typography.Title>Cài đặt</Typography.Title>
                    </Col>
                    <Col>
                        <Button
                            type="primary"
                            icon={<SaveOutlined />}
                            style={{ margin: '10px 10px 0 0' }}
                            onClick={onFinish}
                        >
                            Lưu
                        </Button>
                    </Col>
                </Row>
            </div>
            <Divider dashed />
            <div className="user_content">
                <Form form={form} onFinish={onFinish}>
                    <Row>
                        <Col xs={{ span: 24 }} lg={{ span: 4 }}>
                            <p className="field-title item-required">Họ tên</p>
                        </Col>
                        <Col xs={{ span: 24 }} lg={{ span: 8 }} className="field-container">
                            <Form.Item
                                name="fullname"
                                rules={[{ required: true, message: 'Vui lòng nhập họ tên người dùng' }]}
                                initialValue={user ? user.fullname : null}
                            >
                                <Input placeholder="Nguyễn Trường A" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={{ span: 24 }} lg={{ span: 4 }}>
                            <p className="field-title item-required">Khoa/Phòng</p>
                        </Col>
                        <Col xs={{ span: 24 }} lg={{ span: 8 }} className="field-container">
                            <Form.Item
                                name="departmentId"
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
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={{ span: 24 }} lg={{ span: 4 }}>
                            <p className="field-title item-required">Chức vụ</p>
                        </Col>
                        <Col xs={{ span: 24 }} lg={{ span: 8 }} className="field-container">
                            <Form.Item
                                name="position"
                            >
                                <Select
                                    options={[
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
                        </Col>
                    </Row>
                </Form>
            </div>
        </div>

    )
}

export default Setting