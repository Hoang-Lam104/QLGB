import { AppstoreOutlined, SettingOutlined } from '@ant-design/icons';
import { Menu } from "antd"
import './style.scss'
import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const LeftMenu = () => {
    const navigate = useNavigate()
    let location = useLocation()
    const [current, setCurrent] = useState(location.pathname.replace(/\/+$/, ''))

    useEffect(() => {
        if (location) {
            const pathName = location.pathname.replace(/\/+$/, '');
            if (current !== pathName) {
                setCurrent(pathName);
            }
        }
    }, [location, current]);


    const items = [
        {
            key: '',
            icon: <AppstoreOutlined />,
            label: 'Danh sách cuộc họp',
        },
        {
            key: '/',
            icon: <SettingOutlined />,
            label: 'Cài đặt Danh mục',
            children: [
                {
                    key: '/cai-dat',
                    icon: <AppstoreOutlined />,
                    label: 'Người dùng',
                },
                // {
                //     key: '/cai-dat/1',
                //     icon: <AppstoreOutlined />,
                //     label: 'Danh mục',
                // },
            ]
        },
    ]

    const onClick = (e) => {
        navigate(e.key)
        setCurrent(e.key)
    }

    return (
        <Menu
            className='left_menu'
            mode="inline"
            selectedKeys={[current]}
            items={items}
            onClick={e => onClick(e)}
            inlineCollapsed={true}
        />
    )
}

export default LeftMenu