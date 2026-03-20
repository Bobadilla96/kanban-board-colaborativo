import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <main className="shell grid min-h-[70vh] place-items-center">
      <section className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">404</p>
        <h1 className="text-3xl font-bold text-slate-900">Pagina no encontrada</h1>
        <p className="text-sm text-slate-600">La ruta solicitada no existe en este proyecto.</p>
        <Link
          to="/boards"
          className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
        >
          Volver a tableros
        </Link>
      </section>
    </main>
  );
}
