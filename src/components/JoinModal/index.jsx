import { Button, Form, Modal, Select } from "antd"
import './style.scss'
import { useEffect, useState } from "react"
import { getRooms } from "../../api/roomsAPI"

const JoinModal = ({ open, onSubmit,  onClose, meeting }) => {
    const [form] = Form.useForm()
    const [rooms, setRooms] = useState([])

    useEffect(() => {
        getRooms().then(response => {
            setRooms(response.data)
        })
    }, [])

    useEffect(() => {
        form?.setFieldsValue({
            room: 1
        })
    }, [form, meeting])

    const onOk = () => {
        const data = form.getFieldsValue()
        onSubmit(meeting, data.room)
    }   

    return (
        <Modal
            title='Tham gia họp'
            open={open}
            onOk={onOk}
            onCancel={onClose}
            footer={[
                <Button key="back" onClick={onClose} danger>
                    Đóng
                </Button>,
                <Button key="submit" type="primary" onClick={onOk}>
                    Xác nhận
                </Button>,
            ]}
            className="join_modal"
        >
            <Form form={form} onFinish={onClose}>
                <Form.Item name='room' label='Chọn hội trường'>
                    <Select
                        options={rooms.map(room => {
                            return {
                                key: room.id,
                                value: room.id,
                                label: room.name
                            }
                        })}
                    />
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default JoinModal