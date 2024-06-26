import { DatePicker, Modal, Button, Form, Input, Select } from "antd"

const ModalMeeting = ({ title, open, onOk, onCancel }) => {
    const [form] = Form.useForm()

    const onSubmit = () => {
        const data = form.getFieldsValue()
        const startTime = new Date(data.startTime)
        const formatStartTime = new Date(startTime.getTime() - (startTime.getTimezoneOffset() * 60000))
            .toISOString()

        const endTime = new Date(data.endTime)
        const formatEndTime = new Date(endTime.getTime() - (endTime.getTimezoneOffset() * 60000))
            .toISOString()

        onOk({ title: data.title, startTime: formatStartTime, endTime: formatEndTime })
    }

    return (
        <Modal
            title={title}
            open={open}
            onOk={onSubmit}
            onCancel={onCancel}
            footer={[
                <Button key="back" onClick={onCancel}>
                    Đóng
                </Button>,
                <Button key="submit" type="primary" onClick={onSubmit}>
                    Thêm
                </Button>,
            ]}
        >
            <Form form={form} style={{ padding: '10px' }}>
                <Form.Item label='Tiêu đề' name='title'>
                    <Input />
                </Form.Item>
                <Form.Item label='Thời gian bắt đầu' name='startTime'>
                    <DatePicker
                        showTime={{
                            format: 'HH:mm',
                        }}
                        placeholder="Nhập thời gian bắt đầu"
                        format={'HH:mm DD/MM/YYYY'}
                    />
                </Form.Item>
                <Form.Item label='Thời gian kết thúc' name='endTime'>
                    <DatePicker
                        showTime={{
                            format: 'HH:mm',
                        }}
                        placeholder="Nhập thời gian kết thúc"
                        format={'HH:mm DD/MM/YYYY'}
                    />
                </Form.Item>
                <Form.Item label='Người tham dự' name='attendees'>
                    <Select
                        defaultValue={'all'}
                        options={[
                            {
                                label: 'Tất cả',
                                value: 'all'
                            }
                        ]}
                    />
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default ModalMeeting