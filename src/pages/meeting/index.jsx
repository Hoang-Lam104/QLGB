import { Col, Divider, Row, Table, Typography, Input } from "antd"
import './style.scss'
import { SearchOutlined } from '@ant-design/icons'
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getRooms } from "../../api/roomsAPI";
import { getMeetingAttendees } from "../../api/meetingAPI";
import { getDepartments } from "../../api/department";

const { Title } = Typography;

const Meeting = () => {
    const { id } = useParams()
    const [rooms, setRooms] = useState([])
    const [attendees, setAttendees] = useState([])
    const [departments, setDepartments] = useState([])
    const [pageIndex, setPageIndex] = useState(1)
    const [total, setTotal] = useState(0)

    useEffect(() => {
        getRooms().then(response => {
            setRooms(response.data)
        })
        getDepartments().then(response => {
            setDepartments(response.data)
        })
    }, [])

    useEffect(() => {
        getMeetingAttendees(id, pageIndex, 10).then(response => {
            setAttendees(response.data.attendees)
            setTotal(response.data.total)
        })
    }, [id, pageIndex])

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
            width: '20%',
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
            width: '30%',
            render: (_value, record, _index) => {
                if(record.status !== 'Không tham gia') return record.status
                return `${record.status} (${record.reason})`
            }
        },
    ]

    const onSearch = (value) => {
        console.log("first", value)
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
            <Divider dashed></Divider>
            <div className="report_content">
                <Row justify='space-between'>
                    <Col span={8}>
                    </Col>
                    <Col span={6}>
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