import { Row, Col, Button, Typography, Divider, Table, Tooltip, message } from 'antd'
import {
    PlusOutlined,
    EyeOutlined,
    PauseOutlined,
    CaretRightOutlined,
    CheckOutlined,
    CloseOutlined,
    CheckCircleOutlined
} from '@ant-design/icons'
import './style.scss'
import { useEffect, useState } from 'react'
import ModalMeeting from '../../components/AddMeetingModal'
import { useNavigate } from 'react-router-dom'
import AbsentModal from '../../components/AbsentModal'
import JoinModal from '../../components/JoinModal'
import { getRooms } from '../../api/roomsAPI'
import { attendMeeting, getUserMeetings } from '../../api/userAPI'
import { createMeeting, getMeetings, toggleActiveMeeting } from '../../api/meetingAPI'

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
    const [pageIndex, setPageIndex] = useState(1);
    const [total, setTotal] = useState(0);
    const [status, setStatus] = useState('')

    if (!user_id) navigate('/dang-nhap')

    useEffect(() => {
        getRooms().then(response => {
            setRooms(response.data)
        })
    }, [])

    useEffect(() => {
        const data = {
            status: status,
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
            getMeetings(pageIndex, 10).then(response => {
                setMeetings(response.data.meetings)
                setTotal(response.data.total)
            }).catch(err => {
                if (err.response.status === 401) {
                    message.error('Token hết hạn', 3)
                    navigate('/dang-nhap')
                }
            })
        }
    }, [user_id, pageIndex, status, navigate])

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
            render: (_value, record, _index) => {
                const date = new Date(record.startTime)
                return `${date.getHours()}:${date.getMinutes()} ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
            }
        },
        {
            title: 'Thời gian kết thúc',
            dataIndex: 'endTime',
            key: 'endTime',
            width: '15%',
            render: (_value, record, _index) => {
                const date = new Date(record.endTime)
                return `${date.getHours()}:${date.getMinutes()} ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
            }
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
                return record.reason && `${record.reason}`
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
                            </>}
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
            render: (_value, record, _index) => {
                const date = new Date(record.startTime)
                return `${date.getHours()}:${date.getMinutes()} ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
            }
        },
        {
            title: 'Thời gian kết thúc',
            dataIndex: 'endTime',
            key: 'endTime',
            width: '15%',
            render: (_value, record, _index) => {
                const date = new Date(record.endTime)
                return `${date.getHours()}:${date.getMinutes()} ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
            }
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
        {
            title: '',
            dataIndex: '',
            key: 'delete_action',
            width: '1%',
            render: (_value, record, _index) => (
                <Tooltip title={record.isActive ? 'Tạm ngưng' : 'Kích hoạt'}>
                    <Button
                        type='primary'
                        danger={record.isActive}
                        icon={record.isActive ? <PauseOutlined /> : <CaretRightOutlined />}
                        onClick={() => onToggleActive(record.id)}
                    />
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
            .toISOString()

        if (new Date(record.startTime).getTime() - 15 * 60 * 1000 > formatTime) {
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

        const date = {}

        attendMeeting(data).then(async () => {
            await getUserMeetings(user_id, pageIndex, 10, date).then(response => {
                setMeetings(response.data.meetings)
                setTotal(response.data.total)
            })
            message.success('Check in họp thành công', 3)
        }).catch(err => {
            if (err.response.status === 401) {
                message.error('Token hết hạn', 3)
                navigate('/dang-nhap')
            }
            message.error('Check in họp thất bại', 3)
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
            await getUserMeetings(user_id, pageIndex, 10).then(response => {
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
            reason: reason,
            registerTime: formatTime
        }

        const date = {}

        attendMeeting(data).then(async () => {
            await getUserMeetings(user_id, pageIndex, 10, date).then(response => {
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
                {
                    Number(user_id) !== 1 &&
                    <Row>
                        <Col span={10} style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Button onClick={() => setStatus('')}>Tất cả</Button>
                            <Button onClick={() => setStatus('Chưa đăng ký')}>Chưa đăng ký</Button>
                            <Button onClick={() => setStatus('Tham gia')}>Tham gia</Button>
                            <Button onClick={() => setStatus('Không tham gia')}>Không tham gia</Button>
                        </Col>
                    </Row>
                }
            </div>
            <Divider dashed></Divider>
            <div className='meeting_list_content'>
                <Row>
                    <Text>Bộ lọc: {status ? status : 'Tất cả'}</Text>
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
            />
            <JoinModal
                open={isOpenJoinModal}
                onClose={onCancelJoin}
                onSubmit={onSubmitJoin}
                meeting={meeting}
            />
        </div>
    )
}

export default MeetingList