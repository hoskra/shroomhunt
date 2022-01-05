export function isInBounds(bounds: any, mousePos: any) {
  let centerX = bounds.x + bounds.width / 2;
  let centerY = bounds.y + bounds.height / 2;
  let boundsX = Math.abs(mousePos.posX - centerX) < bounds.width / 2;
  let boundsY = Math.abs(mousePos.posY - centerY) < bounds.height / 2;

  return boundsX && boundsY;
}