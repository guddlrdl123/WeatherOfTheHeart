import type { AppUser } from "../types/auth";
import type { MailboxItem } from "../types/mailbox";
import type { Memory } from "../types/memory";
import type { Plaza, PlazaEntry } from "../types/plaza";

// API가 연결되기 전 로그인 성공 상태를 보여주기 위한 기본 사용자입니다.
export const MOCK_USER: AppUser = {
  id: "me",
  email: "demo@maeum.weather",
  nickname: "구름",
  joinedAt: "2026-05-01T09:00:00.000Z",
};

// localStorage에 저장된 기록이 없을 때 처음 보여줄 개인 방 샘플 기록입니다.
export const MOCK_MEMORIES: Memory[] = [
  {
    id: "memory-1",
    memoryDate: "2026-05-01",
    title: "햇살이 머문 오후",
    content: "오후 햇살이 창문으로 길게 들어왔다. 별일 없는 하루였는데 이상하게 마음이 조금 놓였다.",
    moodKey: "sunny",
    weatherKey: "sunny",
    objectKey: "small_plant",
    slotKey: "floor",
    createdAt: "2026-05-01T12:30:00.000Z",
  },
  {
    id: "memory-2",
    memoryDate: "2026-05-14",
    title: "비 냄새가 스민 저녁",
    content: "비 오는 냄새가 좋아서 창가에 오래 앉아 있었다. 아무것도 하지 않는 시간이 필요했다.",
    moodKey: "rainy",
    weatherKey: "rainy",
    objectKey: "wooden_chair",
    slotKey: "window",
    createdAt: "2026-05-14T19:20:00.000Z",
  },
  {
    id: "memory-3",
    memoryDate: "2026-05-20",
    title: "차 한 잔의 균형",
    content: "일이 조금 버거웠지만 따뜻한 차를 마시고 나니 하루가 덜 거칠게 느껴졌다.",
    moodKey: "sunset",
    weatherKey: "sunset",
    objectKey: "mug_cup",
    slotKey: "desk",
    createdAt: "2026-05-20T21:10:00.000Z",
  },
];

// 광장 목록 화면을 처음 열었을 때 보여줄 샘플 광장입니다.
export const MOCK_PLAZAS: Plaza[] = [
  {
    id: "plaza-night",
    title: "가장 외로웠던 밤",
    topic: "말없이 지나간 밤에 남은 것",
    maxObjects: 8,
    allowSearch: true,
    allowInvite: true,
    allowDuplicateObjects: false,
    backgroundKey: "night",
    createdAt: "2026-05-08T10:00:00.000Z",
  },
  {
    id: "plaza-rain",
    title: "비가 온 뒤의 자리",
    topic: "조금 젖은 하루를 위한 광장",
    maxObjects: 10,
    allowSearch: true,
    allowInvite: false,
    allowDuplicateObjects: true,
    backgroundKey: "rainy",
    createdAt: "2026-05-12T10:00:00.000Z",
  },
  {
    id: "plaza-sunset",
    title: "해가 지기 전의 말",
    topic: "끝나기 전에 남기고 싶은 장면",
    maxObjects: 6,
    allowSearch: false,
    allowInvite: true,
    allowDuplicateObjects: false,
    backgroundKey: "sunset",
    createdAt: "2026-05-18T10:00:00.000Z",
  },
];

// 광장 안에 이미 놓여 있는 샘플 오브젝트 기록입니다.
export const MOCK_PLAZA_ENTRIES: PlazaEntry[] = [
  {
    id: "plaza-entry-1",
    plazaId: "plaza-night",
    ownerId: "visitor-1",
    title: "켜진 조명",
    content: "누군가의 밤에 작은 조명이 하나 남았습니다.",
    moodKey: "night",
    weatherKey: "night",
    objectKey: "stand_lamp",
    slotKey: "light",
    createdAt: "2026-05-09T11:00:00.000Z",
  },
  {
    id: "plaza-entry-2",
    plazaId: "plaza-night",
    ownerId: "visitor-2",
    title: "접힌 편지",
    content: "보내지 못한 말이 접힌 채 벽에 놓였습니다.",
    moodKey: "cloudy",
    weatherKey: "cloudy",
    objectKey: "letter",
    slotKey: "wall",
    createdAt: "2026-05-10T11:00:00.000Z",
  },
  {
    id: "plaza-entry-3",
    plazaId: "plaza-rain",
    ownerId: "visitor-3",
    title: "마르는 우산",
    content: "비가 지나간 뒤에도 우산은 천천히 마르고 있었습니다.",
    moodKey: "rainy",
    weatherKey: "rainy",
    objectKey: "umbrella",
    slotKey: "corner",
    createdAt: "2026-05-15T11:00:00.000Z",
  },
  {
    id: "plaza-entry-4",
    plazaId: "plaza-sunset",
    ownerId: "visitor-4",
    title: "오래된 라디오",
    content: "끝나기 전의 말들이 낮은 소리로 남았습니다.",
    moodKey: "sunset",
    weatherKey: "sunset",
    objectKey: "old_radio",
    slotKey: "desk",
    createdAt: "2026-05-20T11:00:00.000Z",
  },
];

// 완성된 광장에서 도착한 것처럼 보이는 샘플 우편입니다.
export const MOCK_MAILBOX_ITEMS: MailboxItem[] = [
  {
    id: "mail-1",
    title: "가장 외로웠던 밤 광장이 완성되었어요.",
    message: "여러 나그네의 이야기가 하나의 풍경으로 남았어요.",
    plazaTitle: "가장 외로웠던 밤",
    completedAt: "2026-05-22",
    read: false,
  },
  {
    id: "mail-2",
    title: "비가 온 뒤의 자리에서 편지가 도착했어요.",
    message: "젖은 하루들이 천천히 말라가는 장면으로 놓였어요.",
    plazaTitle: "비가 온 뒤의 자리",
    completedAt: "2026-05-24",
    read: true,
  },
];
