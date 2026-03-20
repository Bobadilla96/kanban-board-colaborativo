import { Navigate, Route, Routes } from 'react-router-dom';
import { BoardPage } from '@/pages/BoardPage';
import { BoardsListPage } from '@/pages/BoardsListPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/boards" replace />} />
      <Route path="/boards" element={<BoardsListPage />} />
      <Route path="/boards/:boardId" element={<BoardPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
