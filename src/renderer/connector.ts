import type { Node } from '../core/node';
import { LayoutStore } from '../layout/layout-store';
import { LayoutOptions } from '../layout/type';
import { getIntersectionCalculator } from '../shapes/registry';
import { AnchorPoint } from '../type';
import { isCircle, isEllipse, isRectOrDiamond } from './typeUtils';

/**
 * BaseConnector 负责计算节点之间连接的锚点。
 * 可以扩展为不同的样式（直线、曲线、折线等）
 */
export class BaseConnector {
  public getEdgesEndPoints(
    parentNode: Node,
    childrenNode: Node,
    direction: 'LR' | 'RL' | 'TB' | 'BT',
    layout: LayoutOptions['layoutType']
  ): { sourcePoint: AnchorPoint; targetPoint: AnchorPoint } {
    const sourceCalculator = getIntersectionCalculator(parentNode.shape!);
    const { position, shape, size } = childrenNode;

    if (!position) throw new Error('childNode.position is missing');
    if (!size) throw new Error('childNode.size is missing');

    // 根据 layout 和 direction 计算 x,y 偏移
    const offsetX = (val: number) =>
      layout === 'tree'
        ? LayoutStore.treeType === 'right'
          ? position.x
          : position.x + val
        : direction === 'LR'
          ? position.x
          : direction === 'RL'
            ? position.x + val
            : position.x + val / 2;

    const offsetY = (val: number) =>
      layout === 'mindmap'
        ? position.y + val
        : direction === 'TB'
          ? position.y + val
          : position.y + val;

    // 计算 targetPoint 的通用函数
    const calcTargetPoint = (): AnchorPoint => {
      if (isRectOrDiamond(size)) {
        return { x: offsetX(size.width), y: offsetY(size.height / 2) };
      }
      if (isCircle(size)) {
        return { x: offsetX(size.radius), y: offsetY(size.radius) };
      }
      if (isEllipse(size)) {
        return { x: offsetX(size.rx), y: offsetY(size.ry) };
      }
      throw new Error(`Unsupported shape: ${shape}`);
    };

    const sourcePoint =
      layout === 'tree'
        ? sourceCalculator.getIntersectionInTree(parentNode as Node<any>, direction)
        : sourceCalculator.getIntersectionInMindmap(parentNode as Node<any>, childrenNode);

    const targetPoint = calcTargetPoint();

    return { sourcePoint, targetPoint };
  }
}
