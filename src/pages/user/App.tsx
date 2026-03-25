import { Routes, Route } from 'react-router-dom';
import Home from '@/views/user/Home';
import Login from '@/views/user/Login';
import Settings from '@/views/user/Settings';
import NotFound from '@/views/user/NotFound';
import ProtectedRoute from '@/router/ProtectRoute';
import './App.css'

function App() {
  return (
    <div className="App">
      <Routes>
        {/* 普通路由 */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* 权限判断路由 */}
        <Route element={<ProtectedRoute />} >
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* 404 页面：用 * 匹配所有未定义路径 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;