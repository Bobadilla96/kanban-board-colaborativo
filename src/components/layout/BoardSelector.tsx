import { useNavigate } from 'react-router-dom';
import { useBoardStore } from '@/store/board.store';

export function BoardSelector() {
  const navigate = useNavigate();
  const boards = useBoardStore((state) => state.boards);
  const activeBoardId = useBoardStore((state) => state.activeBoardId);
  const setActiveBoard = useBoardStore((state) => state.setActiveBoard);

  return (
    <label className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700">
      Board
      <select
        value={activeBoardId}
        onChange={(event) => {
          const id = event.target.value;
          setActiveBoard(id);
          navigate(`/boards/${id}`);
        }}
        className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm"
      >
        {boards.map((board) => (
          <option key={board.id} value={board.id}>
            {board.name}
          </option>
        ))}
      </select>
    </label>
  );
}
