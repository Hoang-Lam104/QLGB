import { Button, Col, Form, Row, Input, Typography, Divider, Table, Switch, message } from 'antd'
import './style.scss'
import { useEffect, useState } from 'react'
import { createReason, getAllReasons, toogleActiveReason } from '../../api/reasonAPI'
import { useNavigate } from 'react-router-dom'
import NotFound from '../notFound'

const { Title } = Typography

const Reasons = () => {
    const [form] = Form.useForm()
    const [reasons, setReasons] = useState([])
    const user_id = localStorage.getItem('userId')
    const navigate = useNavigate()


    useEffect(() => {
        if (!user_id) {
            navigate('/dang-nhap')
        } else {
            getAllReasons().then(response => {
                setReasons(response.data)
            })
        }
    }, [user_id, navigate])

    const data = reasons.sort((a, b) => b.reasonId - a.reasonId)

    const columns = [
        {
            title: 'STT',
            dataIndex: 'index',
            key: 'index',
            width: '10%',
            render: (_value, _record, index) => index + 1
        },
        {
            title: 'Lý do',
            dataIndex: 'title',
            key: 'title',
            width: '70%'
        },
        {
            title: 'Trạng thái',
            dataIndex: 'isActive',
            key: 'isActive',
            width: '20%',
            render: (_value, record, _index) => (
                <Switch
                    disabled={record.reasonId === 1}
                    checked={record.isActive}
                    onChange={() => toggleActive(record.reasonId)}
                />
            )
        },
    ]

    const toggleActive = (id) => {
        toogleActiveReason(id).then(async () => {
            await getAllReasons().then(response => {
                setReasons(response.data)
            })
            message.success('Chuyển đổi trạng thái thành công', 3)
        }).catch(err => {
            message.error('Chuyển đội trạng thái thất bại', 3)
        })
    }

    const addNewReason = () => {
        form.validateFields()
        const data = form.getFieldsValue()
        if (!data.name) return

        var name = data.name.trim()
        name = name.replace(/\s+/g, ' ');
        name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

        createReason({ name }).then(async () => {
            await getAllReasons().then(response => {
                setReasons(response.data)
            })
            message.success('Tạo lý do mới thành công', 3)
            form.resetFields()
        }).catch(err => {
            message.error(err.response.data.message, 3)
        })
    }

    if (Number(user_id) !== 1) return <NotFound />

    return (
        <div className='reasons_container'>
            <div className='reasons_header'>
                <Row>
                    <Col>
                        <Title level={1}>Danh mục Lý do vắng</Title>
                    </Col>
                </Row>
            </div>
            <Divider dashed />
            <div className='reasons_content'>
                <Row >
                    <Col className="reasons_content_col" span={12}>
                        <Title level={4}>Thêm mới</Title>
                        <Form
                            form={form}
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 14 }}
                            onFinish={(_) => addNewReason()}
                        >
                            <Form.Item
                                label='Lý do'
                                name='title'
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập lý do mới'
                                    },
                                    {
                                        whitespace: true,
                                        message: 'Lý do không được để trống'
                                    }
                                ]}
                                hasFeedback
                            >
                                <Input placeholder='Nhập lý do' />
                            </Form.Item>
                            <Form.Item
                                wrapperCol={{
                                    offset: 8,
                                    span: 16,
                                }}
                            >
                                <Button
                                    type='primary'
                                    htmlType='submit'
                                >
                                    Thêm
                                </Button>
                            </Form.Item>
                        </Form>
                    </Col>
                    <Col className="reasons_content_col" span={12}>
                        <Title level={4}>Danh sách</Title>
                        <Row>
                            <Col span={24}>
                                <Table
                                    dataSource={data}
                                    columns={columns}
                                    rowKey={(record) => record.reasonId}
                                />
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export default Reasons