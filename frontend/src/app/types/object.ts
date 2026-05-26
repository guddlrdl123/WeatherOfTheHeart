// 방 안에서 오브젝트가 자동 배치될 수 있는 고정 위치 이름입니다.
export type ObjectSlotKey = "window" | "bed" | "desk" | "wall" | "floor" | "light" | "corner";

// 사용자가 글을 남길 때 선택할 수 있는 오브젝트 카탈로그 항목입니다.
export type RoomObject = {
  objectKey: string;
  name: string;
  slotKey: ObjectSlotKey;
  icon?: string;
  description?: string;
  allowPrivate: boolean;
  allowPlaza: boolean;
};

// 슬롯의 기준 좌표와 같은 슬롯에 여러 오브젝트가 있을 때의 보정값입니다.
export type ObjectSlotPosition = {
  x: number;
  y: number;
  offsetX: number;
  offsetY: number;
};
