import { requestApi } from "./api";
import type { MailboxItem } from "../types/mailbox";

type MailboxItemResponse = {
  id: number;
  title: string;
  message: string;
  plazaTitle: string;
  plazaId?: number;
  generatedImageData?: string;
  completedAt: string;
  read: boolean;
};

function toMailboxItem(response: MailboxItemResponse): MailboxItem {
  return {
    ...response,
    id: String(response.id),
    plazaId: response.plazaId == null ? undefined : String(response.plazaId),
  };
}

// 광장 완성 우편과 AI 생성 이미지는 백엔드 DB에서 불러옵니다.
export const mailboxService = {
  async list(userId: string): Promise<MailboxItem[]> {
    const items = await requestApi<MailboxItemResponse[]>(`/api/users/${userId}/mailbox`);
    return items.map(toMailboxItem);
  },

  async markRead(userId: string, id: string): Promise<MailboxItem> {
    const item = await requestApi<MailboxItemResponse>(`/api/users/${userId}/mailbox/${id}/read`, {
      method: "PATCH",
    });
    return toMailboxItem(item);
  },
};
