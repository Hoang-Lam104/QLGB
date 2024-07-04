import {
    AppstoreOutlined,
    SettingOutlined,
    UserOutlined,
    SignatureOutlined,
    ClusterOutlined,
    PoweroffOutlined
} from '@ant-design/icons';
import { Button, Menu } from "antd"
import './style.scss'
import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const LeftMenu = () => {
    const navigate = useNavigate()
    let location = useLocation()
    const [current, setCurrent] = useState(location.pathname.replace(/\/+$/, ''))
    const user_id = localStorage.getItem('userId')

    useEffect(() => {
        if (location) {
            const pathName = location.pathname.replace(/\/+$/, '');
            if (current !== pathName) {
                setCurrent(pathName);
            }
        }
    }, [location, current]);


    const items = Number(user_id) === 1 ? [
        {
            key: '',
            icon: <AppstoreOutlined />,
            label: 'Danh sách cuộc họp',
        },
        {
            key: '/cai-dat',
            icon: <SettingOutlined />,
            label: 'Danh mục',
            children: [
                {
                    key: '/nguoi-dung',
                    icon: <UserOutlined />,
                    label: 'Người dùng',
                },
                {
                    key: '/hoi-truong',
                    icon: <ClusterOutlined />,
                    label: 'Hội trường',
                },
                {
                    key: '/ly-do',
                    icon: <SignatureOutlined />,
                    label: 'Lý do',
                },
            ]
        },
    ] : [
        {
            key: '',
            icon: <AppstoreOutlined />,
            label: 'Danh sách cuộc họp',
        },
        {
            key: '/cai-dat',
            icon: <AppstoreOutlined />,
            label: 'Cài đặt',
        },
    ]

    const onClick = (e) => {
        navigate(e.key)
        setCurrent(e.key)
    }

    return (
        <div className='side_menu'>
            <Menu
                className='left_menu'
                mode="inline"
                selectedKeys={[current]}
                items={items}
                onClick={e => onClick(e)}
                collapsed="true"
            />
            <Button
                style={{
                    borderRadius: '0',
                    backgroundColor: '#00923f',
                    color: 'white',
                    width: '100%'
                }}
                icon={<PoweroffOutlined />}
            />
        </div>
    )
}

export default LeftMenu