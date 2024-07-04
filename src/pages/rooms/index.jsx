import { Button, Col, Form, Row, Input, Typography, Divider, Table, Switch, message } from 'antd'
import './style.scss'
import { useEffect, useState } from 'react'
import { createRoom, getAllRooms, toogleActiveRoom } from '../../api/roomsAPI'
import { useNavigate } from 'react-router-dom'
import NotFound from '../notFound'

const { Title } = Typography

const Rooms = () => {
    const [form] = Form.useForm()
    const [rooms, setRooms] = useState([])
    const user_id = localStorage.getItem('userId')
    const navigate = useNavigate()

    useEffect(() => {
        if (user_id) {
            getAllRooms().then(response => {
                setRooms(response.data)
            })
        } else {
            navigate('/dang-nhap')
        }
    }, [user_id, navigate])

    const data = rooms

    const columns = [
        {
            title: 'STT',
            dataIndex: 'index',
            key: 'index',
            width: '10%',
            render: (_value, _record, index) => index + 1
        },
        {
            title: 'Hội trường',
            dataIndex: 'name',
            key: 'name',
            width: '70%'
        },
        {
            title: 'Trạng thái',
            dataIndex: 'isActive',
            key: 'isActive',
            width: '20%',
            render: (_value, record, _index) => (
                <Switch
                    checked={record.isActive}
                    onChange={() => toogleActive(record.id)}
                />
            )
        },
    ]

    const toogleActive = (id) => {
        toogleActiveRoom(id).then(async () => {
            await getAllRooms().then(response => {
                setRooms(response.data)
            })
            message.success('Chuyển trạng thái thành công', 3)
        }).catch(err => {
            message.error('Chuyển trạng thái thất bại', 3)
        })
    }

    const addNewRoom = () => {
        form.validateFields()
        const data = form.getFieldsValue()

        var name = data.name.trim()
        name = name.replace(/\s+/g, ' ');
        name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

        createRoom({ name }).then(async () => {
            await getAllRooms().then(response => {
                setRooms(response.data)
            })
            message.success('Thêm hội trường thành công', 3)
            form.resetFields();
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
                        <Title level={1}>Danh mục Hội trường</Title>
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
                            wrapperCol={{ span: 12 }}
                        >
                            <Form.Item
                                label='Hội trường'
                                name='name'
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập Hội trường mới'
                                    },
                                    { whitespace: true }
                                ]}
                            >
                                <Input placeholder='Nhập hội trường' />
                            </Form.Item>
                            <Form.Item
                                wrapperCol={{
                                    offset: 8,
                                    span: 16,
                                }}
                            >
                                <Button
                                    type='primary'
                                    onClick={() => addNewRoom()}
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
                                    rowKey={(record) => record.id}
                                />
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export default Rooms