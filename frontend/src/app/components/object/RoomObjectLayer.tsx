import { PLAZA_SLOT_POSITIONS, ROOM_SLOT_POSITIONS } from "../../constants/objects";
import type { ObjectSlotKey } from "../../types/object";
import { type SceneObjectRecord, RoomObjectItem } from "./RoomObjectItem";

// 여러 기록을 슬롯 좌표에 맞춰 자동 배치하는 레이어입니다.
export function RoomObjectLayer({
  records,
  mode = "room",
  myUserId,
  showMineOnly,
  onObjectClick,
}: {
  records: SceneObjectRecord[];
  mode?: "room" | "plaza";
  myUserId?: string;
  showMineOnly?: boolean;
  onObjectClick: (record: SceneObjectRecord) => void;
}) {
  const positions = mode === "plaza" ? PLAZA_SLOT_POSITIONS : ROOM_SLOT_POSITIONS;
  // 같은 슬롯에 여러 오브젝트가 오면 offset을 누적해서 겹침을 줄입니다.
  const slotCounts: Partial<Record<ObjectSlotKey, number>> = {};

  return (
    <>
      {records.map((record) => {
        const count = slotCounts[record.slotKey] ?? 0;
        slotCounts[record.slotKey] = count + 1;
        const position = positions[record.slotKey];
        const left = position.x + position.offsetX * count;
        const top = position.y + position.offsetY * count;
        const faded = Boolean(showMineOnly && myUserId && record.ownerId !== myUserId);

        return <RoomObjectItem key={record.id} record={record} left={left} top={top} faded={faded} onClick={onObjectClick} />;
      })}
    </>
  );
}
