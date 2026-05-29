import { replaceRoomObjectsFromCatalog } from "../constants/objects";
import type { RoomObject } from "../types/object";
import { requestApi } from "./api";

type ObjectCatalogResponse = {
  objectKey: string;
  name: string;
  slotKey: string;
  imageUrl?: string;
  imageScale?: number;
  flipX?: boolean;
  tiltDeg?: number;
  description?: string;
  allowPrivate: boolean;
  allowPlaza: boolean;
};

function toRoomObject(response: ObjectCatalogResponse): RoomObject {
  return {
    objectKey: response.objectKey,
    name: response.name,
    slotKey: response.slotKey,
    imageUrl: response.imageUrl,
    imageScale: response.imageScale,
    flipX: response.flipX,
    tiltDeg: response.tiltDeg,
    description: response.description,
    allowPrivate: response.allowPrivate,
    allowPlaza: response.allowPlaza,
  };
}

export const objectService = {
  async loadCatalog(): Promise<RoomObject[]> {
    // 백엔드 object_catalogs 테이블에서 오브젝트 이미지 경로와 메타데이터를 가져옵니다.
    const objects = await requestApi<ObjectCatalogResponse[]>("/api/objects");
    const roomObjects = objects.map(toRoomObject);
    if (roomObjects.length > 0) {
      replaceRoomObjectsFromCatalog(roomObjects);
    }
    return roomObjects;
  },
};
