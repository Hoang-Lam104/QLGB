import { Button, Col, Row, Typography, Divider, Table, Switch, message } from 'antd'
import './style.scss'
import { useEffect, useState } from 'react'
import { createUser, getUsers, toogleActiveUser } from '../../api/userAPI'
import { getDepartments } from '../../api/departmentsAPI'
import { PlusOutlined } from '@ant-design/icons'
import AddUserModal from '../../components/AddUserModal'
import { useNavigate } from 'react-router-dom'
import NotFound from '../notFound'

const { Title } = Typography

const Users = () => {
    const [users, setUsers] = useState([])
    const [departments, setDepartments] = useState([])
    const [isOpenModal, setIsOpenModal] = useState(false)
    const [pageIndex, setPageIndex] = useState(1)
    const [total, setTotal] = useState(0)
    const user_id = localStorage.getItem('userId')
    const navigate = useNavigate()


    useEffect(() => {
        if (!user_id) navigate('/dang-nhap')
        else {
            getUsers(pageIndex, 10).then(response => {
                setUsers(response.data.users)
                setTotal(response.data.total)
            })

            getDepartments().then(response => {
                setDepartments(response.data)
            })
        }
    }, [pageIndex, user_id, navigate])

    const data = users
    const columns = [
        {
            title: 'STT',
            dataIndex: 'index',
            key: 'index',
            width: '5%',
            render: (_value, _record, index) => index + 1
        },
        {
            title: 'Họ tên',
            dataIndex: 'fullname',
            key: 'fullname',
            width: '20%'
        },
        {
            title: 'Tài khoản',
            dataIndex: 'username',
            key: 'username',
            width: '15%'
        },
        {
            title: 'Khoa/Phòng',
            dataIndex: 'department',
            key: 'department',
            width: '30%',
            render: (_value, record, _index) => {
                return departments.find(item => item.id === record.departmentId)?.name
            }
        },
        {
            title: 'Trạng thái',
            dataIndex: 'isActive',
            key: 'isActive',
            width: '10%',
            render: (_value, record, _index) => (
                <Switch
                    checked={record.isActive}
                    disabled={record.id === 1}
                    onChange={() => toogleActive(record.id)}
                />
            )
        },
    ]

    const toogleActive = (id) => {
        toogleActiveUser(id).then(async () => {
            await getUsers(pageIndex, 10).then(response => {
                setUsers(response.data.users)
                setTotal(response.data.total)
            })
            message.success('Chuyển đổi trạng thái người dùng thành công', 3)
        }).catch(err => {
            message.error('Chuyển đổi trạng thái người dùng thất bại', 3)
        })
    }

    const onOk = (data) => {
        const param = {
            username: data.username,
            password: data.password,
            fullname: data.fullname,
            departmentId: data.department,
            position: data.position
        }

        createUser(param).then(async () => {
            await getUsers(pageIndex, 10).then(response => {
                setUsers(response.data.users)
                setTotal(response.data.total)
                message.success('Tạo người dùng mới thành công', 3)
                setIsOpenModal(false)
            })
        }).catch(err => {
            message.error(err.response.data.messager, 3)
        })
    }

    const onCancel = () => setIsOpenModal(false)

    if (Number(user_id) !== 1) return <NotFound />

    return (
        <div className='users_container'>
            <div className='users_header'>
                <Row justify="space-between" align="middle">
                    <Col>
                        <Title level={1}>Danh mục Người dùng</Title>
                    </Col>
                    <Col>
                        <Col xs={4}>
                            <Button
                                type="primary"
                                shape="round"
                                icon={<PlusOutlined />}
                                size="large"
                                onClick={() => setIsOpenModal(true)}
                            >
                                Thêm người dùng
                            </Button>
                        </Col>
                    </Col>
                </Row>
            </div>
            <Divider dashed />
            <div className='users_content'>
                <Row>
                    <Col xl={24}>
                        <Table
                            dataSource={data}
                            columns={columns}
                            rowKey={(record) => record.id}
                            pagination={{
                                pageSize: 10,
                                total: total,
                                current: pageIndex,
                                onChange: (page) => setPageIndex(page)
                            }}
                        />
                    </Col>
                </Row>

            </div>
            <AddUserModal
                title='Thêm người dùng mới'
                open={isOpenModal}
                onOk={onOk}
                onCancel={onCancel}
                departments={departments}
            />
        </div>
    )
}

export default Users