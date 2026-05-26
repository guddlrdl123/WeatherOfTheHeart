import type { ObjectSlotKey, ObjectSlotPosition, RoomObject } from "../types/object";

// 실제 이미지가 생기기 전까지 사용할 임시 오브젝트 카탈로그입니다.
// allowPrivate/allowPlaza 값으로 개인 방과 광장에서 노출 여부를 나눕니다.
export const ROOM_OBJECTS: RoomObject[] = [
  {
    objectKey: "wooden_chair",
    name: "원목 의자",
    slotKey: "window",
    icon: "🪑",
    description: "창가 가까이에 놓인 낮은 의자",
    allowPrivate: true,
    allowPlaza: true,
  },
  {
    objectKey: "old_radio",
    name: "오래된 라디오",
    slotKey: "desk",
    icon: "📻",
    description: "작은 소리를 오래 품은 라디오",
    allowPrivate: true,
    allowPlaza: true,
  },
  {
    objectKey: "small_plant",
    name: "작은 식물",
    slotKey: "floor",
    icon: "🌿",
    description: "조금씩 자라는 연한 초록",
    allowPrivate: true,
    allowPlaza: true,
  },
  {
    objectKey: "mug_cup",
    name: "머그컵",
    slotKey: "desk",
    icon: "☕",
    description: "손에 남은 온기를 담은 컵",
    allowPrivate: true,
    allowPlaza: true,
  },
  {
    objectKey: "letter",
    name: "편지",
    slotKey: "wall",
    icon: "✉️",
    description: "보내지 못한 문장이 접힌 편지",
    allowPrivate: true,
    allowPlaza: true,
  },
  {
    objectKey: "poster",
    name: "포스터",
    slotKey: "wall",
    icon: "🖼️",
    description: "벽에 조용히 기대 있는 장면",
    allowPrivate: true,
    allowPlaza: true,
  },
  {
    objectKey: "stand_lamp",
    name: "스탠드 조명",
    slotKey: "light",
    icon: "💡",
    description: "방 한쪽을 은은히 밝히는 조명",
    allowPrivate: true,
    allowPlaza: true,
  },
  {
    objectKey: "rug",
    name: "러그",
    slotKey: "floor",
    icon: "▰",
    description: "바닥에 낮게 깔린 부드러운 면",
    allowPrivate: true,
    allowPlaza: true,
  },
  {
    objectKey: "book",
    name: "책",
    slotKey: "bed",
    icon: "📖",
    description: "덮어두기 아쉬운 페이지",
    allowPrivate: true,
    allowPlaza: true,
  },
  {
    objectKey: "doll",
    name: "인형",
    slotKey: "bed",
    icon: "🧸",
    description: "말없이 곁에 앉아 있는 작은 것",
    allowPrivate: true,
    allowPlaza: true,
  },
  {
    objectKey: "umbrella",
    name: "우산",
    slotKey: "corner",
    icon: "☂️",
    description: "문가에 기대어 마르는 우산",
    allowPrivate: true,
    allowPlaza: true,
  },
  {
    objectKey: "curtain",
    name: "창가 커튼",
    slotKey: "window",
    icon: "▥",
    description: "창가를 조금 더 조용하게 가려주는 천",
    allowPrivate: true,
    allowPlaza: false,
  },
  {
    objectKey: "shoes",
    name: "신발",
    slotKey: "floor",
    icon: "👟",
    description: "다녀온 하루가 살짝 남은 신발",
    allowPrivate: true,
    allowPlaza: true,
  },
  {
    objectKey: "frame",
    name: "액자",
    slotKey: "wall",
    icon: "□",
    description: "비워둔 채로도 무언가를 담는 액자",
    allowPrivate: true,
    allowPlaza: true,
  },
  {
    objectKey: "tiny_cloud",
    name: "작은 구름",
    slotKey: "light",
    icon: "☁️",
    description: "방 안에 낮게 떠 있는 작은 구름",
    allowPrivate: true,
    allowPlaza: true,
  },
  {
    objectKey: "pencil",
    name: "연필",
    slotKey: "desk",
    icon: "✎",
    description: "다음 문장을 기다리는 연필",
    allowPrivate: true,
    allowPlaza: true,
  },
];

// objectKey로 오브젝트 메타데이터를 빠르게 찾기 위한 조회용 맵입니다.
export const OBJECT_BY_KEY = ROOM_OBJECTS.reduce<Record<string, RoomObject>>((acc, object) => {
  acc[object.objectKey] = object;
  return acc;
}, {});

// 개인 방 장면에서 슬롯별 기준 위치를 퍼센트 좌표로 정의합니다.
export const ROOM_SLOT_POSITIONS: Record<ObjectSlotKey, ObjectSlotPosition> = {
  window: { x: 24, y: 55, offsetX: 0, offsetY: -8 },
  bed: { x: 58, y: 66, offsetX: 8, offsetY: -3 },
  desk: { x: 76, y: 58, offsetX: -8, offsetY: 2 },
  wall: { x: 72, y: 28, offsetX: -12, offsetY: 2 },
  floor: { x: 42, y: 82, offsetX: 10, offsetY: 0 },
  light: { x: 87, y: 38, offsetX: -7, offsetY: 9 },
  corner: { x: 9, y: 75, offsetX: 8, offsetY: 0 },
};

// 광장은 개인 방보다 넓게 보이도록 별도 좌표를 둡니다.
export const PLAZA_SLOT_POSITIONS: Record<ObjectSlotKey, ObjectSlotPosition> = {
  window: { x: 18, y: 45, offsetX: 7, offsetY: 8 },
  bed: { x: 56, y: 67, offsetX: 9, offsetY: -5 },
  desk: { x: 75, y: 58, offsetX: -9, offsetY: 5 },
  wall: { x: 50, y: 31, offsetX: 10, offsetY: 0 },
  floor: { x: 42, y: 78, offsetX: 11, offsetY: 0 },
  light: { x: 84, y: 34, offsetX: -9, offsetY: 6 },
  corner: { x: 12, y: 72, offsetX: 8, offsetY: 2 },
};
