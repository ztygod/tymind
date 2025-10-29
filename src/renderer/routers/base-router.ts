import { AnchorPoint } from '../../type';

export abstract class BaseRouter {
  /**
   * Calculate the SVG path based on the start and end points
   */
  abstract getPathD(sourcePoint: AnchorPoint, targetPoint: AnchorPoint): string;
}
