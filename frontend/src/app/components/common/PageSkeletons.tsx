import { Skeleton } from "../ui/skeleton";

export function RoomPageSkeleton() {
  return (
    <main className="mx-auto grid max-w-[1320px] gap-5 px-5 py-6 lg:grid-cols-[300px_minmax(0,1fr)]" aria-label="방 데이터를 불러오는 중">
      <div className="flex flex-col gap-5">
        <section className="mw-surface rounded-xl p-5">
          <div className="mb-5 flex items-center justify-between">
            <Skeleton className="h-5 w-28" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 35 }, (_, index) => (
              <Skeleton key={index} className="aspect-square rounded-md" />
            ))}
          </div>
        </section>

        <section className="mw-surface rounded-xl p-5">
          <Skeleton className="mb-4 h-5 w-32" />
          <Skeleton className="mb-3 h-6 w-48" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-4/5" />
        </section>
      </div>

      <section className="relative min-h-[560px] overflow-hidden rounded-xl border border-white/8">
        <Skeleton className="absolute left-5 top-5 h-7 w-28 rounded-full" />
        <Skeleton className="absolute right-5 top-5 h-5 w-56" />
        <Skeleton className="absolute left-[8%] top-[10%] h-[46%] w-[28%] rounded-md" />
        <Skeleton className="absolute bottom-0 left-0 h-[35%] w-full rounded-none" />
        <Skeleton className="absolute left-[42%] top-[74%] h-20 w-20 rounded-full" />
        <Skeleton className="absolute left-[63%] top-[62%] h-16 w-16 rounded-full" />
        <Skeleton className="absolute left-[80%] top-[50%] h-14 w-14 rounded-full" />
      </section>
    </main>
  );
}
