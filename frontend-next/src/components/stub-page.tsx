export function StubPage({ title, note }: { title: string; note: string }) {
  return (
    <main className="mx-auto flex max-w-3xl flex-col items-start px-3 py-10 sm:px-4 sm:py-16">
      <div className="glass-card w-full rounded-2xl p-6 sm:p-8">
        <span className="mb-3 inline-block rounded-full bg-epl-magenta/15 px-3 py-1 text-xs font-semibold text-epl-pink">
          В разработке
        </span>
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        <p className="mt-2 max-w-md text-white/40">{note}</p>
      </div>
    </main>
  );
}
