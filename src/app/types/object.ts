export type ObjectSlotKey = "window" | "bed" | "desk" | "wall" | "floor" | "light" | "corner";

export type RoomObject = {
  objectKey: string;
  name: string;
  slotKey: ObjectSlotKey;
  icon?: string;
  description?: string;
  allowPrivate: boolean;
  allowPlaza: boolean;
};

export type ObjectSlotPosition = {
  x: number;
  y: number;
  offsetX: number;
  offsetY: number;
};
