import { Checkbox, Form, Modal, Row, Typography } from 'antd'
import './style.scss'

const FilterModal = ({ open, onClose, onSubmit, filters, departments, rooms }) => {
    const [form] = Form.useForm()

    return (
        <Modal
            title='Bộ lọc'
            open={open}
            onOk={onSubmit}
            onCancel={onClose}
            footer={[
                <Button key="back" onClick={onClose} danger>
                    Đóng
                </Button>,
                <Button key="submit" type="primary" onClick={onSubmit}>
                    Xác nhận
                </Button>,
            ]}
            className='filter_modal'
        >
            <Form form={form}>
                <Row>
                    <Typography.Title />
                </Row>
                <Form.Item label='Tiêu đề' name='title'>
                    <Checkbox />
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default FilterModal