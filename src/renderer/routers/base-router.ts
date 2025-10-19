import type { AnchorPoint } from '../connectors/base-connector';

export abstract class BaseRouter {
  /**
   * Calculate the SVG path based on the start and end points
   */
  abstract getPathD(sourcePoint: AnchorPoint, targetPoint: AnchorPoint): string;
}
