import { Button, Form, Input, Modal, Radio } from "antd"
import './style.scss'

const AbsentModal = ({ open, onClose, onSubmit, meeting, reasons }) => {
    const [form] = Form.useForm()

    const onOK = () => {
        const data = form.getFieldsValue()
        onSubmit(meeting, data)
    }

    reasons.sort((a, b) => b.reasonId - a.reasonId)

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
                <Form.Item 
                    name='reason' 
                    label='Lý do'
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng chọn Lý do'
                        }
                    ]}
                >
                    <Radio.Group className="radio_container" buttonStyle="solid" >
                        {reasons.map(reason => {
                            return (
                                <Radio.Button
                                    key={reason.reasonId}
                                    className="radio_btn"
                                    value={reason.reasonId}
                                >
                                    {reason.title === 'Khác' ?
                                        'Nghỉ có lý do (Nhập lý do)' :
                                        reason.title
                                    }
                                </Radio.Button>
                            )
                        })}
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
                                disabled={getFieldValue('reason') !== 1}
                                placeholder="Nhập lý do vắng khác"
                            />
                        </Form.Item>
                    }
                </Form.Item>

            </Form>
        </Modal>
    )
}

export default AbsentModal