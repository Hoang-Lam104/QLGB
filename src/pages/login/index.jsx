import { Button, Form, Input, message } from "antd"
import './style.scss'
import { useNavigate } from "react-router-dom"
import { login } from "../../api/auth"

const Login = () => {
    const [form] = Form.useForm()
    const navigate = useNavigate()

    const onFinish = async (value) => {
        const data = {
            username: value.username,
            password: value.password
        }
        
        login(data).then(response => {
            localStorage.setItem('userId', response.data.userId)
            localStorage.setItem('accessToken', response.data.accessToken)
            message.success('Đăng nhập thành công', 3)
            navigate('/')
        }).catch(err => {
            if (err.response.status === 401) message.error('Tài khoản hoặc mật khẩu không chính xác', 3)
        })
    }

    return (
        <div className="login_container">
            <div className="login_content">
                <Form form={form} onFinish={onFinish}>
                    <Form.Item
                        label="Tài khoản"
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: 'Nhập tài khoản!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Mật khẩu"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Nhập mật khẩu!',
                            },
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item
                        wrapperCol={{
                            offset: 8,
                            span: 16,
                        }}
                    >
                        <Button type="primary" htmlType="submit">
                            Đăng nhập
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}

export default Login