import { Plus } from "lucide-react";
import { PlazaCard } from "../components/plaza/PlazaCard";
import { useAppStore } from "../stores/AppStore";

// 생성된 광장 목록과 각 광장의 참여 현황을 보여주는 화면입니다.
export function PlazaListPage() {
  const { plazas, plazaEntries, navigate, user } = useAppStore();

  return (
    <main className="mx-auto max-w-[1280px] px-5 py-8">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-[0.68rem] tracking-[0.22em] text-white/28">PLAZA</p>
          <h1 className="text-3xl font-normal text-[#e0d2ba]" style={{ fontFamily: "'Noto Serif KR', Georgia, serif" }}>
            나그네들의 이야기가 광장에 하나씩 놓이고 있어요.
          </h1>
        </div>
        <button type="button" onClick={() => navigate("/plazas/new")} className="mw-button-solid inline-flex items-center gap-2 rounded-md px-5 py-3 text-sm">
          <Plus size={16} />새 광장 만들기
        </button>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {plazas.map((plaza) => {
          const entries = plazaEntries.filter((entry) => entry.plazaId === plaza.id);

          return (
            <PlazaCard
              key={plaza.id}
              plaza={plaza}
              // 광장별 참여 수는 entry 목록에서 plazaId로 계산합니다.
              entryCount={entries.length}
              hasMyEntry={Boolean(user && entries.some((entry) => entry.ownerId === user.id))}
            />
          );
        })}
      </div>
    </main>
  );
}
