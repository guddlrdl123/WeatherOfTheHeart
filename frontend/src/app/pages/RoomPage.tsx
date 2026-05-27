import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Check, FlipHorizontal, Move, PenLine, RotateCcw, X } from "lucide-react";
import { OBJECT_BY_KEY, ROOM_OBJECTS, ROOM_SLOT_POSITIONS } from "../constants/objects";
import { WEATHER_BY_KEY } from "../constants/weather";
import { MemoryPopup } from "../components/room/MemoryPopup";
import { MemoryWriteModal, type WriteModalValue } from "../components/room/MemoryWriteModal";
import { RoomCalendarSidebar } from "../components/calendar/RoomCalendarSidebar";
import { RoomScene } from "../components/room/RoomScene";
import { SaveToast } from "../components/common/SaveToast";
import type { SceneObjectRecord } from "../components/object/RoomObjectItem";
import { useAppStore } from "../stores/AppStore";
import { formatDotDate, getTodayString } from "../utils/date";

type RoomPlacementPosition = {
  x: number;
  y: number;
  flipX: boolean;
  tiltDeg: number;
};

const FALLBACK_ROOM_POSITION = { x: 50, y: 68 };

// 개인 방 화면입니다. 캘린더, 방 장면, 글 작성 모달을 한 페이지에서 조율합니다.
export function RoomPage() {
  const {
    selectedDate,
    setSelectedDate,
    memories,
    addMemory,
    updateMemoryPosition,
    roomObjectPositions,
    updateRoomObjectPosition,
    selectedMemory,
    currentWeather,
    user,
  } = useAppStore();
  const initial = new Date(`${selectedDate}T00:00:00`);
  const [viewYear, setViewYear] = useState(initial.getFullYear());
  const [viewMonth, setViewMonth] = useState(initial.getMonth() + 1);
  const [isWriteOpen, setIsWriteOpen] = useState(false);
  const [popupRecord, setPopupRecord] = useState<SceneObjectRecord | null>(null);
  const [placementPosition, setPlacementPosition] = useState<RoomPlacementPosition | null>(null);
  const [editingRecordId, setEditingRecordId] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const today = getTodayString();
  const weather = WEATHER_BY_KEY[currentWeather];

  // 저장 완료/중복 안내 토스트는 잠깐 보여준 뒤 사라지게 합니다.
  useEffect(() => {
    if (!toast) {
      return;
    }

    const timer = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    setPlacementPosition(null);
    setEditingRecordId(null);
    setPopupRecord(null);
  }, [selectedDate]);

  // RoomScene은 장면용 record 배열을 받으므로 선택 날짜의 기록을 배열로 변환합니다.
  const sceneRecords = useMemo<SceneObjectRecord[]>(() => {
    if (user?.isAdmin) {
      return ROOM_OBJECTS.map((object) => {
        const savedPosition = roomObjectPositions[object.objectKey];

        return {
          id: `admin-object-${object.objectKey}`,
          title: object.name,
          content: object.description ?? "관리자 계정에서 방에 배치한 사물입니다.",
          memoryDate: selectedDate,
          weatherKey: selectedMemory?.weatherKey ?? currentWeather,
          objectKey: object.objectKey,
          slotKey: object.slotKey,
          positionX: savedPosition?.positionX,
          positionY: savedPosition?.positionY,
          flipX: savedPosition?.flipX,
          tiltDeg: savedPosition?.tiltDeg,
          ownerId: user.id,
        };
      });
    }

    if (!selectedMemory) {
      return [];
    }

    const savedPosition = roomObjectPositions[selectedMemory.objectKey];

    return [
      {
        ...selectedMemory,
        memoryDate: selectedMemory.memoryDate,
        positionX: selectedMemory.positionX ?? savedPosition?.positionX,
        positionY: selectedMemory.positionY ?? savedPosition?.positionY,
        flipX: selectedMemory.flipX ?? savedPosition?.flipX,
        tiltDeg: selectedMemory.tiltDeg ?? savedPosition?.tiltDeg,
      },
    ];
  }, [currentWeather, roomObjectPositions, selectedDate, selectedMemory, user]);
  const editingRecord = editingRecordId ? sceneRecords.find((record) => record.id === editingRecordId) ?? null : null;
  const placementRecord: SceneObjectRecord | null =
    placementPosition && editingRecord
      ? {
          ...editingRecord,
          positionX: placementPosition.x,
          positionY: placementPosition.y,
          flipX: placementPosition.flipX,
          tiltDeg: placementPosition.tiltDeg,
        }
      : null;
  const visibleSceneRecords = placementRecord ? sceneRecords.filter((record) => record.id !== placementRecord.id) : sceneRecords;

  function getRecordDefaultPosition(record: SceneObjectRecord) {
    const savedPosition = roomObjectPositions[record.objectKey];
    const object = OBJECT_BY_KEY[record.objectKey];
    const slotKey = object?.slotKey ?? record.slotKey;
    const position = ROOM_SLOT_POSITIONS[slotKey];

    return {
      x: record.positionX ?? savedPosition?.positionX ?? position?.x ?? FALLBACK_ROOM_POSITION.x,
      y: record.positionY ?? savedPosition?.positionY ?? position?.y ?? FALLBACK_ROOM_POSITION.y,
      flipX: record.flipX ?? savedPosition?.flipX ?? position?.flipX ?? object?.flipX ?? false,
      tiltDeg: record.tiltDeg ?? savedPosition?.tiltDeg ?? position?.tiltDeg ?? object?.tiltDeg ?? 0,
    };
  }

  function startPositionEdit(record: SceneObjectRecord) {
    if (!user?.isAdmin && record.id !== selectedMemory?.id) {
      return;
    }

    setPopupRecord(null);
    setEditingRecordId(record.id);
    setPlacementPosition(getRecordDefaultPosition(record));
    setToast(user?.isAdmin ? "관리자 기본 위치를 정할 사물을 드래그한 뒤 완료를 눌러주세요." : "사물을 드래그해서 원하는 위치에 놓고 완료를 눌러주세요.");
  }

  function handleObjectClick(record: SceneObjectRecord) {
    if (user?.isAdmin) {
      startPositionEdit(record);
      return;
    }

    setPopupRecord(record);
  }

  async function handleCompletePlacement() {
    if (!placementPosition || !editingRecord) {
      return;
    }

    if (user?.isAdmin) {
      updateRoomObjectPosition({
        objectKey: editingRecord.objectKey,
        positionX: placementPosition.x,
        positionY: placementPosition.y,
        flipX: placementPosition.flipX,
        tiltDeg: placementPosition.tiltDeg,
      });
      setEditingRecordId(null);
      setPlacementPosition(null);
      setToast("관리자 기본 사물 위치가 저장되었어요.");
      return;
    }

    if (!selectedMemory) {
      return;
    }

    const result = await updateMemoryPosition({
      id: selectedMemory.id,
      positionX: placementPosition.x,
      positionY: placementPosition.y,
      flipX: placementPosition.flipX,
      tiltDeg: placementPosition.tiltDeg,
    });

    if (!result.ok) {
      setToast("위치를 저장할 사물을 찾을 수 없어요.");
      return;
    }

    setEditingRecordId(null);
    setPlacementPosition(null);
    setToast("사물 위치가 저장되었어요.");
  }

  function handlePrevMonth() {
    setViewMonth((month) => {
      if (month === 1) {
        setViewYear((year) => year - 1);
        return 12;
      }

      return month - 1;
    });
  }

  function handleNextMonth() {
    const now = new Date();

    // 미래 월로는 이동하지 못하게 막습니다.
    if (viewYear > now.getFullYear() || (viewYear === now.getFullYear() && viewMonth >= now.getMonth() + 1)) {
      return;
    }

    setViewMonth((month) => {
      if (month === 12) {
        setViewYear((year) => year + 1);
        return 1;
      }

      return month + 1;
    });
  }

  async function handleSave(value: WriteModalValue) {
    const result = await addMemory(value);

    if (!result.ok) {
      // 같은 날짜에 이미 기록이 있으면 새 기록을 만들지 않습니다.
      setToast("이미 이 날의 이야기가 방에 남아 있어요.");
      return;
    }

    setSelectedDate(result.memory.memoryDate);
    const next = new Date(`${result.memory.memoryDate}T00:00:00`);
    setViewYear(next.getFullYear());
    setViewMonth(next.getMonth() + 1);
    setIsWriteOpen(false);
    setToast("오늘의 이야기가 방에 남았어요.");
  }

  return (
    <main className="mx-auto grid max-w-[1320px] gap-5 px-5 py-6 lg:grid-cols-[300px_minmax(0,1fr)]">
      <div className="flex flex-col gap-5">
        <RoomCalendarSidebar
          year={viewYear}
          month={viewMonth}
          selectedDate={selectedDate}
          memories={memories}
          onDateSelect={setSelectedDate}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
        />

        <section className="mw-surface rounded-xl p-5">
          <div className="mb-3 flex items-center gap-2 text-sm text-[#d8bd9a]">
            <CalendarDays size={16} />
            {formatDotDate(selectedDate)}
          </div>
          {selectedMemory ? (
            <div>
              <h2 className="text-lg font-normal text-[#e0d2ba]" style={{ fontFamily: "'Noto Serif KR', Georgia, serif" }}>
                {selectedMemory.title || "제목 없는 기억"}
              </h2>
              <p className="mt-3 text-sm leading-7 text-white/52">{selectedMemory.content}</p>
              <p className="mt-4 text-[0.72rem] text-white/34">
                {weather.icon} {weather.quietText}
              </p>
            </div>
          ) : (
            <div>
              <h2 className="text-lg font-normal text-[#e0d2ba]" style={{ fontFamily: "'Noto Serif KR', Georgia, serif" }}>
                아직 이 날의 이야기는 비어 있어요.
              </h2>
              <p className="mt-3 text-sm leading-7 text-white/48">비어 있는 날짜에는 작은 메모지 하나를 남길 수 있어요.</p>
              {selectedDate <= today && (
                <button type="button" onClick={() => setIsWriteOpen(true)} className="mw-button mt-5 inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm">
                  <PenLine size={15} />이 날의 이야기 남기기
                </button>
              )}
            </div>
          )}
        </section>
      </div>

      <div className="min-w-0">
        <RoomScene
          weatherKey={currentWeather}
          records={visibleSceneRecords}
          placementRecord={placementRecord}
          onPlacementMove={(position) =>
            setPlacementPosition((currentPosition) =>
              currentPosition ? { ...currentPosition, x: position.x, y: position.y } : { x: position.x, y: position.y, flipX: false, tiltDeg: 0 },
            )
          }
          label={
            placementPosition
              ? "사물을 드래그한 뒤 완료를 눌러 위치를 저장하세요."
              : user?.isAdmin
                ? "관리자 계정에서는 사물을 눌러 기본 위치를 바꿀 수 있어요."
                : selectedMemory
                  ? "사물을 누르면 남긴 글을 볼 수 있어요."
                  : "아직 이 날의 이야기는 비어 있어요."
          }
          onObjectClick={handleObjectClick}
        />
        {placementPosition && (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#d8bd9a]/25 bg-[#d8bd9a]/10 px-4 py-3">
            <p className="text-sm leading-6 text-[#e0d2ba]">
              {user?.isAdmin ? "원하는 위치에 놓은 뒤 완료를 누르면 이 사물의 기본 위치가 저장됩니다." : "원하는 위치에 놓은 뒤 완료를 누르면 이 날짜의 사물 위치가 저장됩니다."}
            </p>
            <div className="flex flex-1 flex-wrap items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setPlacementPosition((currentPosition) => (currentPosition ? { ...currentPosition, flipX: !currentPosition.flipX } : currentPosition))}
                className="mw-button inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm"
              >
                <FlipHorizontal size={16} />
                좌우반전
              </button>
              <label className="flex min-w-[210px] items-center gap-3 text-sm text-[#e0d2ba]">
                <span className="whitespace-nowrap">기울기 {placementPosition.tiltDeg}도</span>
                <input
                  type="range"
                  min={-45}
                  max={45}
                  step={1}
                  value={placementPosition.tiltDeg}
                  onChange={(event) =>
                    setPlacementPosition((currentPosition) => (currentPosition ? { ...currentPosition, tiltDeg: Number(event.target.value) } : currentPosition))
                  }
                  className="w-28 accent-[#d8bd9a]"
                />
              </label>
              <button
                type="button"
                onClick={() => setPlacementPosition((currentPosition) => (currentPosition ? { ...currentPosition, tiltDeg: 0 } : currentPosition))}
                className="mw-button inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm"
              >
                <RotateCcw size={16} />
                기울기 초기화
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setEditingRecordId(null);
                  setPlacementPosition(null);
                }}
                className="mw-button inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm"
              >
                <X size={16} />
                취소
              </button>
              <button type="button" onClick={handleCompletePlacement} className="mw-button-solid inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm">
                <Check size={16} />
                완료
              </button>
            </div>
          </div>
        )}
        <div className="mt-4 flex flex-wrap justify-end gap-3">
          {selectedMemory && !user?.isAdmin && (
            <button
              type="button"
              onClick={() => {
                const targetRecord = sceneRecords[0];

                if (targetRecord) {
                  startPositionEdit(targetRecord);
                }
              }}
              disabled={Boolean(placementPosition)}
              className="mw-button inline-flex items-center gap-2 rounded-md px-5 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-35"
            >
              <Move size={16} />
              위치 바꾸기
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsWriteOpen(true)}
            disabled={Boolean(selectedMemory) || selectedDate > today || Boolean(placementPosition)}
            className="mw-button-solid inline-flex items-center gap-2 rounded-md px-5 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-35"
          >
            <PenLine size={16} />
            기억 남기기
          </button>
        </div>
      </div>

      {isWriteOpen && (
        <MemoryWriteModal
          initialDate={selectedDate}
          existingMemory={selectedMemory}
          onClose={() => setIsWriteOpen(false)}
          onSave={handleSave}
        />
      )}
      {popupRecord && <MemoryPopup record={popupRecord} onClose={() => setPopupRecord(null)} />}
      {toast && <SaveToast message={toast} />}
    </main>
  );
}
