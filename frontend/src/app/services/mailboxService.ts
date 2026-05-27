import { MOCK_MAILBOX_ITEMS } from "../constants/mockData";
import type { MailboxItem } from "../types/mailbox";
import { readStorage, writeStorage } from "../lib/storage";

const MAILBOX_KEY = "maeum-weather:mailbox";

// 우편함 항목을 localStorage에 저장하는 mock service layer입니다.
export const mailboxService = {
  list(): MailboxItem[] {
    const items = readStorage<MailboxItem[]>(MAILBOX_KEY, MOCK_MAILBOX_ITEMS);
    return Array.isArray(items) ? items : MOCK_MAILBOX_ITEMS;
  },

  saveAll(items: MailboxItem[]) {
    writeStorage(MAILBOX_KEY, items);
  },

  markRead(id: string): MailboxItem[] {
    // 읽음 처리 후 최신 목록을 화면 상태에 다시 반영할 수 있게 반환합니다.
    const items = this.list().map((item) => (item.id === id ? { ...item, read: true } : item));
    this.saveAll(items);
    return items;
  },
};
