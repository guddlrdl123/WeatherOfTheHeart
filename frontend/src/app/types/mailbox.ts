// 광장이 완성되었을 때 사용자에게 도착하는 우편 항목입니다.
export type MailboxItem = {
  id: string;
  title: string;
  message: string;
  plazaTitle: string;
  plazaId?: string;
  generatedImageData?: string;
  completedAt: string;
  read: boolean;
};
