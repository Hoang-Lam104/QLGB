import { Row, Col, Button, Typography, Divider, Table, Tooltip, message, Switch, Select, DatePicker } from 'antd'
import {
    PlusOutlined,
    EyeOutlined,
    CheckOutlined,
    CloseOutlined,
    CheckCircleOutlined
} from '@ant-design/icons'
import './style.scss'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getRooms } from '../../api/roomsAPI'
import { attendMeeting, getUserMeetings } from '../../api/userAPI'
import { createMeeting, getMeetings, toggleActiveMeeting } from '../../api/meetingAPI'
import { getReasons } from '../../api/reasonAPI'
import { formatDate } from '../../util'
import ModalMeeting from '../../components/AddMeetingModal'
import AbsentModal from '../../components/AbsentModal'
import JoinModal from '../../components/JoinModal'

const { Title, Text } = Typography

const MeetingList = () => {
    const user_id = localStorage.getItem('userId')
    const navigate = useNavigate()
    const [isOpenModal, setIsOpenModal] = useState(false)
    const [isOpenAbsentModal, setIsOpenAbsentModal] = useState(false)
    const [isOpenJoinModal, setIsOpenJoinModal] = useState(false)
    const [meetings, setMeetings] = useState([])
    const [meeting, setMeeting] = useState({})
    const [rooms, setRooms] = useState([])
    const [reasons, setReasons] = useState([])
    const [pageIndex, setPageIndex] = useState(1);
    const [total, setTotal] = useState(0);
    const [status, setStatus] = useState('')
    const [roomId, setRoomId] = useState(null)
    const [reasonId, setReasonId] = useState(null)
    const [startTime, setStartTime] = useState(null)
    const [endTime, setEndTime] = useState(null)

    useEffect(() => {
        if (user_id) {
            getRooms().then(response => {
                setRooms(response.data)
            })
            getReasons().then(response => {
                setReasons(response.data)
            })
        } else {
            navigate('/dang-nhap')
        }
    }, [user_id, navigate])

    useEffect(() => {
        if (user_id) {
            const data = {
                status: status,
                reasonId: reasonId,
                roomId: roomId,
                startTime: startTime,
                endTime: endTime
            }

            if (Number(user_id) !== 1) {
                getUserMeetings(user_id, pageIndex, 10, data).then(response => {
                    setMeetings(response.data.meetings)
                    setTotal(response.data.total)
                }).catch(err => {
                    if (err.response.status === 401) {
                        message.error('Token hết hạn', 3)
                        navigate('/dang-nhap')
                    }
                })
            } else {
                getMeetings(pageIndex, 10, { startTime, endTime }).then(response => {
                    setMeetings(response.data.meetings)
                    setTotal(response.data.total)
                }).catch(err => {
                    if (err.response.status === 401) {
                        message.error('Token hết hạn', 3)
                        navigate('/dang-nhap')
                    }
                })
            }
        } else {
            navigate('/dang-nhap')
        }
    }, [user_id, pageIndex, status, reasonId, roomId, startTime, endTime, navigate])

    const columns = Number(user_id) !== 1 ? [
        {
            title: 'STT',
            dataIndex: 'index',
            key: 'index',
            width: '3%',
            render: (_value, _record, index) => index + 1
        },
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            key: 'title',
            width: '15%',
        },
        {
            title: 'Thời gian bắt đầu',
            dataIndex: 'startTime',
            key: 'startTime',
            width: '15%',
            render: (_value, record, _index) => formatDate(record.startTime)
        },
        {
            title: 'Thời gian kết thúc',
            dataIndex: 'endTime',
            key: 'endTime',
            width: '15%',
            render: (_value, record, _index) => formatDate(record.endTime)
        },
        {
            title: 'Hội trường',
            dataIndex: 'room',
            key: 'room',
            width: '15%',
            render: (_value, record, _index) => {
                return rooms.find(item => item.id === record.roomId)?.name
            }
        },
        {
            title: 'Lý do vắng',
            dataIndex: 'reason',
            key: 'reason',
            width: '30%',
            render: (_value, record, _index) => {
                var reason = reasons.find(item => item.reasonId === record.reasonId)
                return !reason ? '' : reason.reasonId === 1 ? `Lý do khác (${record.anotherReason})` : reason.title
            }
        },
        {
            title: '',
            dataIndex: '',
            key: 'action',
            width: '10%',
            render: (_value, record, _index) => {
                const date = new Date(Date.now())
                const formatTime = new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
                    .toISOString()

                return (
                    <div style={{ display: 'flex' }}>
                        {record.status === "Chưa đăng ký" ?
                            <>
                                <Tooltip title='Tham gia'>
                                    <Button
                                        type='primary'
                                        onClick={() => onCLickJoin(record)}
                                        disabled={record.startTime <= formatTime}
                                        icon={<CheckOutlined />}
                                        style={{ margin: '0 2px' }}
                                    />
                                </Tooltip>
                                <Tooltip title="Vắng">
                                    <Button
                                        type='primary'
                                        danger
                                        onClick={() => onClickAbsent(record)}
                                        disabled={record.startTime <= formatTime}
                                        icon={<CloseOutlined />}
                                        style={{ margin: '0 2px' }}
                                    />
                                </Tooltip>
                            </>
                            :
                            <>
                                <Tooltip title={record.status === 'Tham gia' ? 'Vắng' : 'Tham gia'}>
                                    <Button
                                        type='primary'
                                        danger={record.status === 'Tham gia'}
                                        onClick={() => onClick(record)}
                                        disabled={record.startTime <= formatTime}
                                        icon={record.status === 'Tham gia' ? <CloseOutlined /> : <CheckOutlined />}
                                        style={{ margin: '0 2px' }}
                                    />
                                </Tooltip>
                                <Tooltip title="Check in">
                                    <Button
                                        type='primary'
                                        onClick={() => onClickCheckIn(record)}
                                        icon={<CheckCircleOutlined />}
                                        style={{ margin: '0 2px', backgroundColor: 'green', color: 'white' }}
                                    />
                                </Tooltip>
                            </>
                        }
                    </div>
                )
            }
        },
    ] : [
        {
            title: 'STT',
            dataIndex: 'index',
            key: 'index',
            width: '5%',
            render: (_value, _record, index) => index + 1
        },
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            key: 'title',
            width: '15%',
        },
        {
            title: 'Thời gian bắt đầu',
            dataIndex: 'startTime',
            key: 'startTime',
            width: '15%',
            render: (_value, record, _index) => formatDate(record.startTime)
        },
        {
            title: 'Thời gian kết thúc',
            dataIndex: 'endTime',
            key: 'endTime',
            width: '15%',
            render: (_value, record, _index) => formatDate(record.endTime)
        },
        {
            title: 'Trạng thái',
            dataIndex: '',
            key: 'delete_action',
            width: '5%',
            render: (_value, record, _index) => (
                <Tooltip title={record.isActive ? 'Mở' : 'Đóng'}>
                    <Switch
                        checked={record.isActive}
                        onClick={() => onToggleActive(record.id)}
                    />
                </Tooltip>
            )
        },
        {
            title: '',
            dataIndex: '',
            key: 'watch_action',
            width: '1%',
            render: (_value, record, _index) => (
                <Tooltip title='Xem'>
                    <Button type='primary' icon={<EyeOutlined />} onClick={() => onClickEdit(record.id)} />
                </Tooltip>
            )
        },
    ]

    const onClickEdit = (id) => navigate('/cuoc-hop/' + id)

    const onToggleActive = async (id) => {
        toggleActiveMeeting(id).then(async () => {
            await getMeetings(pageIndex, 10).then(response => {
                setMeetings(response.data.meetings)
                setTotal(response.data.total)
            })
            message.success('Chuyển trạng thái thành công')
        }).catch(err => {
            if (err.response.status === 401) {
                message.error('Token hết hạn', 3)
                navigate('/dang-nhap')
            }
            message.error('Chuyển trạng thái thất bại')
        })
    }

    const onOk = async ({ title, startTime, endTime }) => {
        const data = {
            title: title,
            startTime: startTime,
            endTime: endTime
        }

        createMeeting(data).then(async () => {
            await getMeetings(pageIndex, 10).then(response => {
                setMeetings(response.data.meetings)
                setTotal(response.data.total)
            })
            message.success('Tạo cuộc họp thành công', 3)
        }).catch(err => {
            if (err.response.status === 401) {
                message.error('Token hết hạn', 3)
                navigate('/dang-nhap')
            }
            message.success('Tạo cuộc họp thất bại', 3)
        })

        setIsOpenModal(false)
    }

    const onCancel = () => setIsOpenModal(false)
    const onCancelAbsent = () => setIsOpenAbsentModal(false)
    const onCancelJoin = () => setIsOpenJoinModal(false)

    const onClick = (record) => {
        setMeeting(record)
        const now = Date.now()
        const registerTime = new Date(now)
        const formatTime = new Date(registerTime.getTime() - (registerTime.getTimezoneOffset() * 60000))

        if (record.startTime < formatTime) {
            return message.error('Đã quá thời gian đăng ký cuộc họp')
        }

        if (record.status === 'Tham gia') {
            setIsOpenAbsentModal(true)
        } else {
            setIsOpenJoinModal(true)
        }
    }

    const onCLickJoin = (record) => {
        setMeeting(record)
        setIsOpenJoinModal(true)
    }

    const onClickAbsent = (record) => {
        setMeeting(record)
        setIsOpenAbsentModal(true)
    }

    const onClickCheckIn = (record) => {
        if (record.status !== "Tham gia") {
            return message.warning(`Bạn chưa đăng ký tham gia cuộc họp này`, 5)
        }

        const now = Date.now()
        const registerTime = new Date(now)
        const formatTime = new Date(registerTime.getTime() - (registerTime.getTimezoneOffset() * 60000))

        if (new Date(new Date(record.startTime).getTime() - 15 * 60 * 1000) > formatTime) {
            return message.warning('Chưa đến thời gian check in cuộc họp', 3)
        }

        if (new Date(record.endTime).getTime() < formatTime) {
            return message.warning('Cuộc họp đã kết thúc', 3)
        }

        const data = {
            userId: user_id,
            meetingId: record.id,
            status: 'Tham gia',
            roomId: record.roomId,
            meetingTime: formatTime
        }

        attendMeeting(data).then(async () => {
            await getUserMeetings(user_id, pageIndex, 10, { status, reasonId, roomId }).then(response => {
                setMeetings(response.data.meetings)
                setTotal(response.data.total)
            })
            message.success('Check in họp thành công', 3)
        }).catch(err => {
            if (err.response.status === 401) {
                message.error('Token hết hạn', 3)
                navigate('/dang-nhap')
            } else {
                message.error('Check in họp thất bại', 3)
            }
        })
    }

    const onSubmitJoin = async (meeting, room) => {
        const registerTime = new Date(Date.now())
        const formatTime = new Date(registerTime.getTime() - (registerTime.getTimezoneOffset() * 60000))
            .toISOString()

        const data = {
            userId: user_id,
            meetingId: meeting.id,
            status: 'Tham gia',
            roomId: room,
            registerTime: formatTime
        }

        attendMeeting(data).then(async () => {
            await getUserMeetings(user_id, pageIndex, 10, { status, reasonId, roomId }).then(response => {
                setMeetings(response.data.meetings)
                setTotal(response.data.total)
            })
            message.success('Đăng ký họp thành công', 3)
        }).catch(err => {
            if (err.response.status === 401) {
                message.error('Token hết hạn', 3)
                navigate('/dang-nhap')
            }
            message.error('Đăng ký họp thất bại', 3)
        })

        setIsOpenJoinModal(false)
    }

    const onSubmitAbsent = async (meeting, reason) => {
        const registerTime = new Date(Date.now())
        const formatTime = new Date(registerTime.getTime() - (registerTime.getTimezoneOffset() * 60000))
            .toISOString()

        const data = {
            userId: user_id,
            meetingId: meeting.id,
            status: "Không tham gia",
            reasonId: reason.reason,
            anotherReason: reason.anotherReason,
            registerTime: formatTime
        }

        attendMeeting(data).then(async () => {
            await getUserMeetings(user_id, pageIndex, 10, { status, reasonId, roomId }).then(response => {
                setMeetings(response.data.meetings)
                setTotal(response.data.total)
            })
            message.success('Đăng ký vắng thành công', 3)
        }).catch(err => {
            if (err.response.status === 401) {
                message.error('Token hết hạn', 3)
                navigate('/dang-nhap')
            }
            message.error('Đăng ký vắng thất bại', 3)
        })

        setIsOpenAbsentModal(false)
    }

    const onChangeStartTime = (value) => {
        if (value === null) return setStartTime(value)

        const startTime = new Date(value)
        const formatStartTime = new Date(startTime.getTime() - (startTime.getTimezoneOffset() * 60000))
            .toISOString()

        setStartTime(formatStartTime)
    }

    const onChangeEndTime = (value) => {
        if (value === null) return setEndTime(value)

        const endTime = new Date(value)
        const formatEndTime = new Date(endTime.getTime() - (endTime.getTimezoneOffset() * 60000))
            .toISOString()

        setEndTime(formatEndTime)
    }

    return (
        <div className='meeting_list_container'>
            <div className="report_header">
                <Row justify='space-between'>
                    <Col xs={20}>
                        <Title level={1}>Danh sách cuộc họp</Title>
                    </Col>
                    {
                        Number(user_id) === 1 &&
                        <Col xs={4}>
                            <Button
                                type="primary"
                                shape="round"
                                icon={<PlusOutlined />}
                                size="large"
                                onClick={() => setIsOpenModal(true)}
                            >
                                Tạo cuộc họp
                            </Button>
                        </Col>
                    }
                </Row>
            </div>
            <Divider dashed></Divider>
            <div className='meeting_list_content'>
                {
                    Number(user_id) !== 1 &&
                    <Row justify='center' align='middle'>
                        <Col span={2}>
                            <Text>Bộ lọc:</Text>
                        </Col>
                        <Col span={5} style={{ margin: '0 5px' }}>
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
                        <Col span={5} style={{ margin: '0 5px' }}>
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
                                optionFilterProp={(input, option) => {

                                }}
                            />
                        </Col>
                        <Col span={5} style={{ margin: '0 5px' }}>
                            <Select
                                placeholder='Chọn Lý do vắng'
                                options={reasons.map(reason => {
                                    return {
                                        key: reason.reasonId,
                                        value: reason.reasonId,
                                        label: reason.title,
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
                    </Row>
                }

                <Row justify='center' align='middle' style={{ marginTop: '10px' }}>
                    <Col span={1}>
                        <Text>Từ</Text>
                    </Col>
                    <Col span={5} style={{ padding: '0 5px' }}>
                        <DatePicker
                            showTime
                            placeholder='Nhập thời gian bắt đầu'
                            format={'HH:mm DD/MM/YYYY'}
                            style={{ width: '100%' }}
                            onChange={(value) => onChangeStartTime(value)}
                            allowClear
                        />
                    </Col>
                    <Col span={1}>
                        <Text>Đến</Text>
                    </Col>
                    <Col span={5} style={{ padding: '0 5px' }}>
                        <DatePicker
                            showTime
                            placeholder='Nhập thời gian kết thúc'
                            format={'HH:mm DD/MM/YYYY'}
                            style={{ width: '100%' }}
                            onChange={(value) => onChangeEndTime(value)}
                            allowClear
                        />
                    </Col>
                </Row>

                <Row style={{ marginTop: '24px' }}>
                    <Col span={24}>
                        <Table
                            columns={columns}
                            dataSource={meetings}
                            rowKey={(record) => record.id}
                            pagination={{
                                pageSize: 10,
                                total: total,
                                current: pageIndex,
                                onChange: (page) => setPageIndex(page)
                            }}
                            locale={{ emptyText: 'Chưa có dữ liệu cuộc họp' }}
                        />
                    </Col>
                </Row>
            </div>
            <ModalMeeting
                title='Tạo cuộc họp mới'
                open={isOpenModal}
                onOk={onOk}
                onCancel={onCancel}
            />
            <AbsentModal
                open={isOpenAbsentModal}
                onClose={onCancelAbsent}
                onSubmit={onSubmitAbsent}
                meeting={meeting}
                reasons={reasons}
            />
            <JoinModal
                open={isOpenJoinModal}
                onClose={onCancelJoin}
                onSubmit={onSubmitJoin}
                meeting={meeting}
                rooms={rooms}
            />
        </div>
    )
}

export default MeetingList