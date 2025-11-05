import type { Node } from '../core/node';
import { LayoutStore } from '../layout/layout-store';
import { LayoutOptions } from '../layout/type';
import { getIntersectionCalculator } from '../shapes/registry';
import { AnchorPoint } from '../type';
import { isCircle, isEllipse, isRectOrDiamond } from '../share/typeUtils';

/**
 * BaseConnector 负责计算节点之间连接的锚点。
 * 可以扩展为不同的样式（直线、曲线、折线等）
 */
export class BaseConnector {
  public getEdgesEndPoints(
    parentNode: Node,
    childrenNode: Node,
    direction: 'LR' | 'RL' | 'TB' | 'BT',
    layout: LayoutOptions['layoutType'],
    treeDirection: 'both-right' | 'both-left' | null
  ): { sourcePoint: AnchorPoint; targetPoint: AnchorPoint } {
    const sourceCalculator = getIntersectionCalculator(parentNode.shape!);
    const { position, shape, size } = childrenNode;

    if (!position) throw new Error('childNode.position is missing');
    if (!size) throw new Error('childNode.size is missing');

    // 根据 layout 和 direction 计算 x,y 偏移
    const offsetX = (val: number) => {
      if (layout === 'tree') {
        // 根据 treeType 判断
        const type = LayoutStore.treeType;
        if (type === 'right') return position.x;
        if (type === 'left' || treeDirection === 'both-left') return position.x + val;
        return position.x; // 其他情况
      }

      // 非 tree 布局
      switch (direction) {
        case 'LR':
          return position.x;
        case 'RL':
          return position.x + val;
        default:
          return position.x + val / 2;
      }
    };

    const offsetY = (val: number) => position.y + val;

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
