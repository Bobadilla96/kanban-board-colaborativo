import { Link, NavLink } from 'react-router-dom';
import { BoardSelector } from '@/components/layout/BoardSelector';

interface HeaderProps {
  showBoardSelector?: boolean;
}

export function Header({ showBoardSelector = false }: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="shell flex flex-wrap items-center gap-3 py-3">
        <Link to="/boards" className="rounded-xl bg-slate-900 px-3 py-1.5 text-sm font-bold text-white">
          KB Kanban
        </Link>

        <nav className="flex items-center gap-1 text-sm">
          <NavLink
            to="/boards"
            className={({ isActive }) =>
              `rounded-lg px-3 py-1.5 font-semibold transition ${
                isActive ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
              }`
            }
          >
            Tableros
          </NavLink>
        </nav>

        <div className="ml-auto">{showBoardSelector ? <BoardSelector /> : null}</div>
      </div>
    </header>
  );
}
