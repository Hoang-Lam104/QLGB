import { Button, Form, Input, Modal, Radio } from "antd"
import './style.scss'
import { useEffect } from "react"

const AbsentModal = ({ open, onClose, onSubmit, meeting }) => {
    const [form] = Form.useForm()

    useEffect(() => {
        form?.setFieldsValue({
            reason: 'Nghỉ bù trực',
            anotherReason: '',
        })
    }, [form, meeting])

    const onOK = () => {
        const data = form.getFieldsValue()
        onSubmit(meeting, data.reason)
    }

    return (
        <Modal
            title='Lý do vắng'
            open={open}
            onOk={onOK}
            onCancel={onClose}
            footer={[
                <Button key="back" onClick={onClose} danger>
                    Đóng
                </Button>,
                <Button key="submit" type="primary" onClick={onOK}>
                    Xác nhận
                </Button>,
            ]}
            className="absent_modal"
        >
            <Form form={form} onFinish={onClose}>
                <Form.Item name='reason' initialValue="Nghỉ bù trực">
                    <Radio.Group className="radio_container" buttonStyle="solid" >
                        <Radio.Button className="radio_btn" value="Nghỉ bù trực"> Nghỉ bù trực </Radio.Button>
                        <Radio.Button className="radio_btn" value="Ở lại khoa làm việc"> Ở lại khoa làm việc </Radio.Button>
                        <Radio.Button className="radio_btn" value="Khám bệnh ở phòng khám"> Khám bệnh ở phòng khám </Radio.Button>
                        <Radio.Button className="radio_btn" value="Nghỉ có lý do"> Nghỉ có lý do (Nhập lý do) </Radio.Button>
                    </Radio.Group>
                </Form.Item>
                <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues !== currentValues}>
                    {({ getFieldValue }) =>
                        <Form.Item
                            label='Lý do khác'
                            name='anotherReason'
                            rules={[{
                                required: true,
                                message: 'Nhập lý do vắng',
                            }]}
                        >
                            <Input.TextArea
                                autoSize={{
                                    minRows: 2,
                                    maxRows: 6,
                                }}
                                style={{ resize: 'none' }}
                                disabled={getFieldValue('reason') !== 'Nghỉ có lý do'}
                            />
                        </Form.Item>
                    }
                </Form.Item>

            </Form>
        </Modal>
    )
}

export default AbsentModal