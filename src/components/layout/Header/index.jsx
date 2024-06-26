import { Col, Row, Button, Tooltip } from "antd"
import { SettingOutlined, PoweroffOutlined } from '@ant-design/icons'
import './style.scss'
import { useNavigate } from "react-router-dom"
import { logout } from "../../../api/auth"

const Header = () => {
    const navigate = useNavigate()

    const onLogout = async () => {
        const userId = localStorage.getItem('userId')
        await logout(userId)
        navigate('/dang-nhap')
    }

    const onSetting = () => {
        navigate('/cai-dat')
    }

    return (
        <div className="header_container">
            <Row justify='end'>
                <Col span={1}>
                    <Tooltip title='Cài đặt'>
                        <Button
                            icon={<SettingOutlined />}
                            shape="circle"
                            onClick={onSetting}
                        />
                    </Tooltip>
                </Col>
                <Col span={1}>
                    <Tooltip title='Đăng xuất'>
                        <Button
                            icon={<PoweroffOutlined />}
                            shape="circle"
                            onClick={onLogout}
                        />
                    </Tooltip>
                </Col>

            </Row>
        </div>
    )
}

export default Header