import { Button, Form, Modal, Select } from "antd"
import './style.scss'
import { useEffect } from "react"

const JoinModal = ({ open, onSubmit, onClose, meeting, rooms }) => {
    const [form] = Form.useForm()

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