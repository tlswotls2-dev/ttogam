import { Navigate, Route, Routes } from 'react-router-dom';
import TabletLayout from '../components/layout/TabletLayout.jsx';
import CollectionBook from '../pages/CollectionBook.jsx';
import MainMap from '../pages/MainMap.jsx';
import TeacherDashboard from '../pages/TeacherDashboard.jsx';

function AppRouter() {
  return (
    <Routes>
      <Route element={<TabletLayout />}>
        <Route path="/" element={<MainMap />} />
        <Route path="/collection" element={<CollectionBook />} />
        <Route path="/teacher" element={<TeacherDashboard />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRouter;
