import { Col, Divider, Row, Table, Typography, Input, Select } from "antd"
import './style.scss'
import { SearchOutlined } from '@ant-design/icons'
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getRooms } from "../../api/roomsAPI";
import { getMeetingAttendees } from "../../api/meetingAPI";
import { getDepartments } from "../../api/departmentsAPI";
import { getReasons } from "../../api/reasonAPI";

const { Title, Text } = Typography;

const Meeting = () => {
    const { id } = useParams()
    const [rooms, setRooms] = useState([])
    const [attendees, setAttendees] = useState([])
    const [departments, setDepartments] = useState([])
    const [pageIndex, setPageIndex] = useState(1)
    const [total, setTotal] = useState(0)
    const [reasons, setReasons] = useState([])
    const [status, setStatus] = useState('')
    const [roomId, setRoomId] = useState(null)
    const [reasonId, setReasonId] = useState(null)
    const [departmentId, setDepartmentId] = useState(null)
    const [position, setPosition] = useState(null)
    const [search, setSearch] = useState('')

    const user_id = localStorage.getItem('userId')
    const navigate = useNavigate()


    useEffect(() => {
        if (!user_id) navigate('/dang-nhap')
        else {
            getRooms().then(response => {
                setRooms(response.data)
            })
            getDepartments().then(response => {
                setDepartments(response.data)
            })
            getReasons().then(response => {
                setReasons(response.data)
            })
        }
    }, [user_id, navigate])

    useEffect(() => {
        const data = {
            status: status,
            reasonId: reasonId,
            roomId: roomId,
            departmentId: departmentId,
            position: position,
            search: search,
        }

        if (user_id) {
            getMeetingAttendees(id, pageIndex, 10, data).then(response => {
                setAttendees(response.data.attendees)
                setTotal(response.data.total)
            })
        }
    }, [user_id,
        id,
        status,
        reasonId,
        roomId,
        departmentId,
        position,
        pageIndex,
        search])

    const dataSource = attendees
    const columns = [
        {
            title: 'Họ tên',
            dataIndex: 'fullname',
            key: 'fullname',
            width: '20%',
        },
        {
            title: 'Chức vụ',
            dataIndex: 'position',
            key: 'position',
            width: '15%',
        },
        {
            title: 'Phòng ban',
            dataIndex: 'department',
            key: 'department',
            width: '25%',
            render: (_value, record, _index) => {
                return departments.find(item => item.id === record.departmentId)?.name
            }
        },
        {
            title: `Hội trường`,
            dataIndex: 'room',
            key: 'room',
            width: '15%',
            render: (_value, record, _index) => {
                return rooms.find(item => item.id === record.roomId)?.name
            }
        },
        {
            title: 'Tình trạng',
            dataIndex: 'status',
            key: 'status',
            width: '25%',
            render: (_value, record, _index) => {
                if (record.status !== 'Không tham gia') return record.status
                const reason = reasons.find(r => r.reasonId === record.reasonId)
                return `${record.status} (${reason.reasonId === 1 ? `Lý do khác: ${record.anotherReason}` : reason.name})`
            }
        },
    ]

    const onSearch = (value) => {
        setSearch(value.toLowerCase())
    }

    return (
        <div className="report_container">
            <div className="report_header">
                <Row justify='space-between'>
                    <Col xs={20}>
                        <Title level={1}>Danh sách họp giao ban</Title>
                    </Col>
                    <Col xs={4}>
                        {/* <Button type="primary" shape="round" icon={<DownloadOutlined />} size="large">
                            Xuất Excel
                        </Button> */}
                    </Col>
                </Row>
            </div>
            <Divider dashed />
            <div className="report_content">

                <Row align='middle'>
                    <Col span={2}>
                        <Text>Bộ lọc:</Text>
                    </Col>
                    <Col span={3} style={{ padding: '0 5px' }}>
                        <Select
                            className='status_select'
                            options={[
                                {
                                    value: '',
                                    label: 'Tất cả'
                                },

                                {
                                    value: 'Chưa đăng ký',
                                    label: 'Chưa đăng ký'
                                },
                                {
                                    value: 'Tham gia',
                                    label: 'Tham gia'
                                },
                                {
                                    value: 'Không tham gia',
                                    label: 'Không tham gia'
                                }
                            ]}
                            onChange={(value) => setStatus(value)}
                            value={status}
                            showSearch
                            style={{ width: '100%' }}
                        />
                    </Col>
                    <Col span={4} style={{ padding: '0 5px' }}>
                        <Select
                            placeholder='Chọn Hội trường'
                            options={rooms.map(room => {
                                return {
                                    key: room.id,
                                    value: room.id,
                                    label: room.name,
                                }
                            })}
                            disabled={status === 'Không tham gia'}
                            showSearch
                            value={roomId}
                            onChange={value => setRoomId(value)}
                            style={{ width: '100%' }}
                            allowClear
                            onClear={() => setRoomId(null)}
                        />
                    </Col>
                    <Col span={4} style={{ padding: '0 5px' }}>
                        <Select
                            placeholder='Chọn Lý do vắng'
                            options={reasons.map(reason => {
                                return {
                                    key: reason.reasonId,
                                    value: reason.reasonId,
                                    label: reason.name,
                                }
                            })}
                            disabled={status === 'Tham gia' || status === 'Chưa đăng ký'}
                            showSearch
                            value={reasonId}
                            onChange={value => setReasonId(value)}
                            style={{ width: '100%' }}
                            allowClear
                            onClear={() => setReasonId(null)}
                        />
                    </Col>
                    <Col span={4} style={{ padding: '0 5px' }}>
                        <Select
                            placeholder='Chọn Khoa/Phòng'
                            options={departments.map(item => {
                                return {
                                    key: item.id,
                                    value: item.id,
                                    label: item.name,
                                }
                            })}
                            showSearch
                            value={departmentId}
                            onChange={value => setDepartmentId(value)}
                            style={{ width: '100%' }}
                            allowClear
                            onClear={() => setDepartmentId(null)}
                        />
                    </Col>
                    <Col span={4} style={{ padding: '0 5px' }}>
                        <Select
                            placeholder='Chọn Chức vụ'
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
                            showSearch
                            value={position}
                            onChange={value => setPosition(value)}
                            style={{ width: '100%' }}
                            allowClear
                            onClear={() => setPosition('')}
                        />
                    </Col>
                </Row>
                <Row justify='space-between' style={{ marginTop: '10px' }}>
                    <Col span={8}></Col>
                    <Col span={6} >
                        <Input
                            prefix={<SearchOutlined />}
                            placeholder="Tìm kiếm ..."
                            onChange={e => onSearch(e.target.value)}
                        />
                    </Col>
                </Row>
                <Row style={{ marginTop: '20px' }}>
                    <Col span={24}>
                        <Table
                            columns={columns}
                            dataSource={dataSource}
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
        </div>
    )
}

export default Meeting