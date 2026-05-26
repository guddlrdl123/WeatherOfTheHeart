import { MOCK_MAILBOX_ITEMS } from "../constants/mockData";
import type { MailboxItem } from "../types/mailbox";
import { readStorage, writeStorage } from "../lib/storage";

const MAILBOX_KEY = "maeum-weather:mailbox";

export const mailboxService = {
  list(): MailboxItem[] {
    return readStorage<MailboxItem[]>(MAILBOX_KEY, MOCK_MAILBOX_ITEMS);
  },

  saveAll(items: MailboxItem[]) {
    writeStorage(MAILBOX_KEY, items);
  },

  markRead(id: string): MailboxItem[] {
    const items = this.list().map((item) => (item.id === id ? { ...item, read: true } : item));
    this.saveAll(items);
    return items;
  },
};
