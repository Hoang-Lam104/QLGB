import { DatePicker, Modal, Button, Form, Input, Select } from "antd"
import { useEffect } from "react"

const ModalMeeting = ({ title, open, onOk, onCancel }) => {
    const [form] = Form.useForm()

    useEffect(() => {
        form.resetFields()
    }, [form, open])

    const onSubmit = () => {
        form.validateFields()
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
                <Form.Item
                    label='Tiêu đề'
                    name='title'
                    rules={[
                        {
                            required: true,
                            message: 'Nhập tiêu đề',
                        },
                        { whitespace: true }
                    ]}
                    hasFeedback
                >
                    <Input placeholder="Nhập tiêu đề" />
                </Form.Item>
                <Form.Item
                    label='Thời gian bắt đầu'
                    name='startTime'
                    rules={[
                        {
                            required: true,
                            message: 'Chọn thời gian bắt đầu',
                        },
                    ]}
                >
                    <DatePicker
                        showTime={{
                            format: 'HH:mm',
                        }}
                        placeholder="Nhập thời gian bắt đầu"
                        format={'HH:mm DD/MM/YYYY'}
                    />
                </Form.Item>
                <Form.Item
                    label='Thời gian kết thúc'
                    name='endTime'
                    dependencies={['startTime']}
                    rules={[
                        {
                            required: true,
                            message: 'Chọn thời gian kết thúc',
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('startTime') < value) {
                                    return Promise.resolve()
                                }
                                return Promise.reject('Thời gian kết thúc phải lớn hơn thời gian bắt đầu')
                            }
                        })
                    ]}
                >
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