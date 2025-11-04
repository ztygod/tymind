/** 判断是否 Rect 或 Diamond */
export function isRectOrDiamond(size: any): size is { width: number; height: number } {
  return size && typeof size.width === 'number' && typeof size.height === 'number';
}

/** 判断是否 Circle */
export function isCircle(size: any): size is { radius: number } {
  return size && typeof size.radius === 'number';
}

/** 判断是否 Ellipse */
export function isEllipse(size: any): size is { rx: number; ry: number } {
  return size && typeof size.rx === 'number' && typeof size.ry === 'number';
}
