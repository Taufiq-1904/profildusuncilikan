import {
  Users,
  Map,
  Grid3x3,
  LayoutGrid,
  Wheat,
  Trees,
  Beef,
  Cookie,
  MountainSnow,
  Shapes,
  Package,
  type LucideIcon,
} from "lucide-react";

export const iconMap: Record<string, LucideIcon> = {
  users: Users,
  map: Map,
  grid: Grid3x3,
  "layout-grid": LayoutGrid,
  wheat: Wheat,
  trees: Trees,
  beef: Beef,
  cookie: Cookie,
  "mountain-snow": MountainSnow,
  shapes: Shapes,
  package: Package,
};

export function getIcon(name: string): LucideIcon {
  return iconMap[name] ?? Package;
}

/**
 * Returns a ready-made icon element instead of the component reference.
 * Prefer this in JSX (`{getIconElement("wheat")}`) over resolving the
 * component and rendering it as a tag — assigning a dynamically looked-up
 * component to a capitalized variable and using it as `<Icon />` trips the
 * react-hooks "static components" rule, even though the lookup is stable.
 */
export function getIconElement(
  name: string,
  className?: string,
  props?: React.SVGProps<SVGSVGElement>
) {
  const Icon = getIcon(name);
  return <Icon className={className} {...props} />;
}
