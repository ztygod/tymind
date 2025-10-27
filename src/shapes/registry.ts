import { NodeShape } from '../type';
import { CircleIntersections } from './intersections/circle';
import { DiamondIntersections } from './intersections/diamond';
import { EllipseIntersections } from './intersections/ellipse';
import { RectangleIntersections } from './intersections/rectangle';

export const shapeRegistry = {
  rect: new RectangleIntersections(),
  ellipse: new EllipseIntersections(),
  diamond: new DiamondIntersections(),
  circle: new CircleIntersections(),
};

export function getIntersectionCalculator(shape: NodeShape) {
  return shapeRegistry[shape] || shapeRegistry.rect;
}
