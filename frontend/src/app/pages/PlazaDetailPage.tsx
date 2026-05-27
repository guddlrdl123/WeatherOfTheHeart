import { useEffect, useMemo, useState } from "react";
import { Check, Eye, PenLine, X } from "lucide-react";
import { WEATHER_BY_KEY } from "../constants/weather";
import { MemoryPopup } from "../components/room/MemoryPopup";
import { MemoryWriteModal, type WriteModalValue } from "../components/room/MemoryWriteModal";
import { RoomScene } from "../components/room/RoomScene";
import { SaveToast } from "../components/common/SaveToast";
import type { SceneObjectRecord } from "../components/object/RoomObjectItem";
import { useAppStore } from "../stores/AppStore";
import { getTodayString } from "../utils/date";

type PendingPlazaEntry = WriteModalValue & {
  positionX: number;
  positionY: number;
};

const DEFAULT_PLACEMENT_POSITION = { x: 50, y: 68 };

// 광장 하나의 상세 장면과 글 남기기 흐름을 담당합니다.
export function PlazaDetailPage({ plazaId }: { plazaId: string }) {
  const { plazas, plazaEntries, user, addPlazaEntry, navigate } = useAppStore();
  const plaza = plazas.find((item) => item.id === plazaId);
  const [isWriteOpen, setIsWriteOpen] = useState(false);
  const [showMineOnly, setShowMineOnly] = useState(false);
  const [popupRecord, setPopupRecord] = useState<SceneObjectRecord | null>(null);
  const [pendingEntry, setPendingEntry] = useState<PendingPlazaEntry | null>(null);
  const [toast, setToast] = useState("");

  // 저장 안내 문구는 잠깐 보여준 뒤 자동으로 사라지게 합니다.
  useEffect(() => {
    if (!toast) {
      return;
    }

    const timer = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  // 현재 광장에 속한 entry만 골라 장면에 넘깁니다.
  const entries = useMemo(() => plazaEntries.filter((entry) => entry.plazaId === plazaId), [plazaEntries, plazaId]);
  const myEntry = user ? entries.find((entry) => entry.ownerId === user.id) : undefined;
  const records: SceneObjectRecord[] = entries.map((entry) => ({ ...entry, weatherKey: entry.weatherKey }));
  const placementRecord: SceneObjectRecord | null =
    pendingEntry && user
      ? {
          id: "pending-plaza-entry",
          ownerId: user.id,
          title: pendingEntry.title,
          content: pendingEntry.content,
          memoryDate: pendingEntry.memoryDate,
          weatherKey: pendingEntry.weatherKey,
          objectKey: pendingEntry.objectKey,
          slotKey: pendingEntry.slotKey,
          positionX: pendingEntry.positionX,
          positionY: pendingEntry.positionY,
        }
      : null;

  // 주소에 존재하지 않는 plazaId가 들어오면 목록으로 돌아갈 수 있게 안내합니다.
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

    if (myEntry || pendingEntry) {
      setToast("한 광장에는 한 번만 이야기를 남길 수 있어요.");
      return;
    }

    if (complete) {
      setToast("이 광장은 이미 완성되었어요.");
      return;
    }

    if (!plaza.allowDuplicateObjects && entries.some((entry) => entry.objectKey === value.objectKey)) {
      // 중복 오브젝트를 허용하지 않는 광장에서는 이미 놓인 오브젝트를 다시 쓸 수 없습니다.
      setToast("이 광장에는 같은 오브젝트가 이미 놓여 있어요.");
      return;
    }

    setPendingEntry({
      ...value,
      positionX: value.positionX ?? DEFAULT_PLACEMENT_POSITION.x,
      positionY: value.positionY ?? DEFAULT_PLACEMENT_POSITION.y,
    });
    setIsWriteOpen(false);
    setShowMineOnly(false);
    setPopupRecord(null);
    setToast("광장 위 사물을 잡고 원하는 위치로 옮긴 뒤 완료를 눌러주세요.");
  }

  function handleCompletePlacement() {
    if (!user || !pendingEntry || !plaza) {
      return;
    }

    if (myEntry) {
      setToast("한 광장에는 한 번만 이야기를 남길 수 있어요.");
      return;
    }

    if (complete) {
      setToast("이 광장은 이미 완성되었어요.");
      return;
    }

    if (!plaza.allowDuplicateObjects && entries.some((entry) => entry.objectKey === pendingEntry.objectKey)) {
      setToast("이 광장에는 같은 오브젝트가 이미 놓여 있어요.");
      return;
    }

    const result = addPlazaEntry({
      plazaId: plaza.id,
      ownerId: user.id,
      title: pendingEntry.title,
      content: pendingEntry.content,
      moodKey: pendingEntry.moodKey,
      weatherKey: pendingEntry.weatherKey,
      objectKey: pendingEntry.objectKey,
      slotKey: pendingEntry.slotKey,
      positionX: pendingEntry.positionX,
      positionY: pendingEntry.positionY,
    });

    if (!result.ok) {
      setToast(result.reason === "already_joined" ? "한 광장에는 한 번만 이야기를 남길 수 있어요." : "이 광장은 이미 완성되었어요.");
      return;
    }

    setPendingEntry(null);
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
        placementRecord={placementRecord}
        onPlacementMove={(position) =>
          setPendingEntry((current) => (current ? { ...current, positionX: position.x, positionY: position.y } : current))
        }
        label={pendingEntry ? "사물을 드래그해 원하는 위치에 놓고 완료를 누르세요." : "닉네임 없이 오브젝트만 조용히 남는 공용 공간입니다."}
      />

      {pendingEntry && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#d8bd9a]/25 bg-[#d8bd9a]/10 px-4 py-3">
          <p className="text-sm leading-6 text-[#e0d2ba]">사물을 원하는 위치에 놓은 뒤 완료를 누르면 광장에 고정됩니다.</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setPendingEntry(null)}
              className="mw-button inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm"
            >
              <X size={16} />
              취소
            </button>
            <button
              type="button"
              onClick={handleCompletePlacement}
              className="mw-button-solid inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm"
            >
              <Check size={16} />
              완료
            </button>
          </div>
        </div>
      )}

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
          disabled={complete || Boolean(myEntry) || Boolean(pendingEntry)}
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
