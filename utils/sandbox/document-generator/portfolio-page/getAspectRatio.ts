export function getAspectRatio(photoCount: number, index: number): number {
  switch (photoCount) {
    case 1:
      return 90.5 / 60.25; // Full width and height
    case 2:
      return index === 0 ? 100 / 58.91 : 100 / 39.01;
    case 3:
      if (index === 0) return 100 / 58.91;
      return 49.17 / 39.01;
    case 4:
      if (index === 0 || index === 1) return 49.17 / 58.91;
      return 49.17 / 39.01;
    default:
      return 16 / 9; // Default aspect ratio
  }
}
