import { Layout } from "antd";
import { Suspense, useState, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import './app.scss'
import LeftMenu from "./components/layout/LeftMenu";
import Login from "./pages/login";
import Meeting from "./pages/meeting";
import MeetingList from "./pages/meetingList";
import Header from "./components/layout/Header";
import Setting from "./pages/setting";
import Users from "./pages/users";
import Rooms from "./pages/rooms";
import Reasons from "./pages/reasons";

const { Sider, Content } = Layout;

function App() {
  const location = useLocation();
  const [pathname, setPathname] = useState('')

  useEffect(() => {
    setPathname(location.pathname);
  }, [location]);

  return (
    <Layout className="layout_container">
      {
        pathname !== '/dang-nhap' &&
        <Header />
      }
      <Layout className="layout_content">
        {
          pathname !== '/dang-nhap' &&
          <Sider>
            <LeftMenu />
          </Sider>
        }
        <Content>
          <Suspense fallback={null}>
            <Routes>
              <Route path='/' element={<MeetingList />} />
              <Route path='/cuoc-hop/:id' element={<Meeting />} />
              <Route path='/dang-nhap' element={<Login />} />
              <Route path='/cai-dat' element={<Setting />} />
              <Route path='/nguoi-dung' element={<Users />} />
              <Route path='/hoi-truong' element={<Rooms />} />
              <Route path='/ly-do' element={<Reasons />} />
            </Routes>
          </Suspense>
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;
