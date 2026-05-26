import { useEffect, useMemo, useState } from "react";
import { Eye, PenLine } from "lucide-react";
import { WEATHER_BY_KEY } from "../constants/weather";
import { MemoryPopup } from "../components/room/MemoryPopup";
import { MemoryWriteModal, type WriteModalValue } from "../components/room/MemoryWriteModal";
import { RoomScene } from "../components/room/RoomScene";
import { SaveToast } from "../components/common/SaveToast";
import type { SceneObjectRecord } from "../components/object/RoomObjectItem";
import { useAppStore } from "../stores/AppStore";
import { getTodayString } from "../utils/date";

export function PlazaDetailPage({ plazaId }: { plazaId: string }) {
  const { plazas, plazaEntries, user, addPlazaEntry, navigate } = useAppStore();
  const plaza = plazas.find((item) => item.id === plazaId);
  const [isWriteOpen, setIsWriteOpen] = useState(false);
  const [showMineOnly, setShowMineOnly] = useState(false);
  const [popupRecord, setPopupRecord] = useState<SceneObjectRecord | null>(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timer = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const entries = useMemo(() => plazaEntries.filter((entry) => entry.plazaId === plazaId), [plazaEntries, plazaId]);
  const myEntry = user ? entries.find((entry) => entry.ownerId === user.id) : undefined;
  const records: SceneObjectRecord[] = entries.map((entry) => ({ ...entry, weatherKey: entry.weatherKey }));

  if (!plaza) {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-[720px] items-center justify-center px-5">
        <section className="mw-surface rounded-xl p-8 text-center">
          <h1 className="text-xl font-normal text-[#e0d2ba]" style={{ fontFamily: "'Noto Serif KR', Georgia, serif" }}>
            광장을 찾을 수 없어요.
          </h1>
          <button type="button" onClick={() => navigate("/plazas")} className="mw-button mt-6 rounded-md px-5 py-2 text-sm">
            광장 목록으로
          </button>
        </section>
      </main>
    );
  }

  const weather = WEATHER_BY_KEY[plaza.backgroundKey];
  const complete = entries.length >= plaza.maxObjects;

  function handleSave(value: WriteModalValue) {
    if (!user || !plaza) {
      return;
    }

    if (!plaza.allowDuplicateObjects && entries.some((entry) => entry.objectKey === value.objectKey)) {
      setToast("이 광장에는 같은 오브젝트가 이미 놓여 있어요.");
      return;
    }

    const result = addPlazaEntry({
      plazaId: plaza.id,
      ownerId: user.id,
      title: value.title,
      content: value.content,
      moodKey: value.moodKey,
      weatherKey: value.weatherKey,
      objectKey: value.objectKey,
      slotKey: value.slotKey,
    });

    if (!result.ok) {
      setToast(result.reason === "already_joined" ? "한 광장에는 한 번만 이야기를 남길 수 있어요." : "이 광장은 이미 완성되었어요.");
      return;
    }

    setIsWriteOpen(false);
    setToast("광장에 오브젝트가 조용히 놓였어요.");
  }

  return (
    <main className="mx-auto max-w-[1280px] px-5 py-7">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <button type="button" onClick={() => navigate("/plazas")} className="mb-3 text-sm text-white/42 hover:text-white/62">
            ← 광장 목록
          </button>
          <p className="mb-2 text-[0.68rem] tracking-[0.22em] text-white/28">PLAZA DETAIL</p>
          <h1 className="text-3xl font-normal text-[#e0d2ba]" style={{ fontFamily: "'Noto Serif KR', Georgia, serif" }}>
            {plaza.title}
          </h1>
          <p className="mt-3 max-w-[720px] text-sm leading-7 text-white/50">{plaza.topic}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-white/10 px-3 py-2 text-sm text-white/42">
            {weather.icon} {weather.label}
          </span>
          <span className="rounded-full border border-white/10 px-3 py-2 text-sm text-white/42">
            {entries.length} / {plaza.maxObjects}
          </span>
        </div>
      </div>

      <RoomScene
        mode="plaza"
        weatherKey={plaza.backgroundKey}
        records={records}
        myUserId={user?.id}
        showMineOnly={showMineOnly}
        onObjectClick={setPopupRecord}
        label="닉네임 없이 오브젝트만 조용히 남는 공용 공간입니다."
      />

      <div className="mt-5 flex flex-wrap justify-end gap-3">
        <button
          type="button"
          onClick={() => setShowMineOnly((value) => !value)}
          className="mw-button inline-flex items-center gap-2 rounded-md px-5 py-3 text-sm"
        >
          <Eye size={16} />
          {showMineOnly ? "전체 보기" : "내가 남긴 오브젝트만 잠시 바라볼게요."}
        </button>
        <button
          type="button"
          onClick={() => setIsWriteOpen(true)}
          disabled={complete || Boolean(myEntry)}
          className="mw-button-solid inline-flex items-center gap-2 rounded-md px-5 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-35"
        >
          <PenLine size={16} />
          글 남기기
        </button>
      </div>

      {isWriteOpen && (
        <MemoryWriteModal
          mode="plaza"
          initialDate={getTodayString()}
          existingNotice={myEntry ? "한 광장에는 한 번만 이야기를 남길 수 있어요." : undefined}
          onClose={() => setIsWriteOpen(false)}
          onSave={handleSave}
        />
      )}
      {popupRecord && <MemoryPopup record={popupRecord} onClose={() => setPopupRecord(null)} />}
      {toast && <SaveToast message={toast} />}
    </main>
  );
}
