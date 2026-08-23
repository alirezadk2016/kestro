import {
  Laptop,
  Computer,
  Monitor,
  HardDrive,
  Tablet,
  Smartphone,
  Watch,
  Cable,
  Gamepad2,
  type LucideIcon,
} from "lucide-react";

/** Icon per category slug. Keep in sync with lib/categories.ts. */
export const categoryIcons: Record<string, LucideIcon> = {
  "baerbare-computere": Laptop,
  "stationaere-computere": Computer,
  skaerme: Monitor,
  "mini-pc": HardDrive,
  tablets: Tablet,
  smartphones: Smartphone,
  smartwatches: Watch,
  dockingstationer: Cable,
  gaming: Gamepad2,
};

export function getCategoryIcon(slug: string): LucideIcon {
  return categoryIcons[slug] ?? Laptop;
}
