import { Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ChecksListPage from './pages/ChecksListPage';
import AddCheckPage from './pages/AddCheckPage';
import EditCheckPage from './pages/EditCheckPage';
import CheckDetailPage from './pages/CheckDetailPage';
import VerifyPublicPage from './pages/VerifyPublicPage';
import BanksPage from './pages/BanksPage';
import StatusesPage from './pages/StatusesPage';
import UsersPage from './pages/UsersPage';
import AddUserPage from './pages/AddUserPage';
import EditUserPage from './pages/EditUserPage';
import UserDetailPage from './pages/UserDetailPage';
import ProfilePage from './pages/ProfilePage';

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/verify/:checkNumber/:signature" element={<VerifyPublicPage />} />
      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route index element={<DashboardPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="checks" element={<ChecksListPage />} />
        <Route path="checks/add" element={<AddCheckPage />} />
        <Route path="checks/edit/:id" element={
          <ProtectedRoute requiredRole="admin"><EditCheckPage /></ProtectedRoute>
        } />
        <Route path="checks/:id" element={<CheckDetailPage />} />
        <Route path="banks" element={
          <ProtectedRoute requiredRole="admin"><BanksPage /></ProtectedRoute>
        } />
        <Route path="statuses" element={
          <ProtectedRoute requiredRole="admin"><StatusesPage /></ProtectedRoute>
        } />
        <Route path="users" element={
          <ProtectedRoute requiredRole="admin"><UsersPage /></ProtectedRoute>
        } />
        <Route path="users/add" element={
          <ProtectedRoute requiredRole="admin"><AddUserPage /></ProtectedRoute>
        } />
        <Route path="users/edit/:id" element={
          <ProtectedRoute requiredRole="admin"><EditUserPage /></ProtectedRoute>
        } />
        <Route path="users/:id" element={
          <ProtectedRoute requiredRole="admin"><UserDetailPage /></ProtectedRoute>
        } />
      </Route>
    </Routes>
  );
};

export default App;
