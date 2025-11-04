import { Node } from '../../core/node';
import { BaseLayout } from '../base-layout';
import { TreeLayoutOptions } from '../type';

export class TreeLayout extends BaseLayout {
  /** 主计算入口 */
  protected computeLayout(rootNode: Node): void {
    if (!this.nodes || this.nodes.size === 0) return;

    this._computeSubTreeHeight(rootNode);

    const { width: viewportWidth, height: viewportHeight } = this.layoutOptions.viewport!;
    const rootX = viewportWidth / 2 - (rootNode.size?.width ?? 0) / 2;
    const rootY =
      this.layoutOptions.direction === 'TB' ? viewportHeight / 4 : (viewportHeight * 3) / 4;

    rootNode.setPosition(rootX, rootY);
    this._assignCoordinates(rootNode, 0);
  }

  /** 预处理：确保根节点存在 */
  protected preprocess(): void {
    if (!this._findRootNode()) {
      console.error('TreeLayout Error: Root node not found.');
    }
  }

  /** 后处理：整体居中布局 */
  protected postprocess(): void {
    const { width: viewportWidth, height: viewportHeight } = this.layoutOptions.viewport!;
    if (!this.nodes || this.nodes.size === 0) return;

    let minX = Infinity,
      maxX = -Infinity;
    let minY = Infinity,
      maxY = -Infinity;

    // 计算布局边界
    for (const node of this.nodes.values()) {
      const { width = 100, height = 40 } = node.size ?? {};
      const { x, y } = node.position ?? { x: 0, y: 0 };

      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x + width);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y + height);
    }

    const graphWidth = maxX - minX;
    const graphHeight = maxY - minY;
    const offsetX = (viewportWidth - graphWidth) / 2 - minX;
    const offsetY = (viewportHeight - graphHeight) / 2 - minY;

    // 将所有节点整体平移
    for (const node of this.nodes.values()) {
      if (!node.position) continue;
      node.setPosition(node.position.x + offsetX, node.position.y + offsetY);
    }
  }

  /** 递归计算节点坐标 */
  private _assignCoordinates(node: Node, level: number): void {
    this._assignCoordinatesWithDirection(
      node,
      level,
      (this.layoutOptions as TreeLayoutOptions).treeType
    );
  }

  private _assignCoordinatesWithDirection(
    node: Node,
    level: number,
    treeType: 'left' | 'right' | 'both'
  ): void {
    const { direction } = this.layoutOptions as TreeLayoutOptions;
    const children = this._getChildren(node);
    if (children.length === 0) return;

    const parentWidth = node.size?.width ?? 100;
    const parentHeight = node.size?.height ?? 40;
    const siblingGap = this.layoutOptions.nodeVerticalGap ?? 20;
    const parentX = node.getPositionX();
    const parentY = node.getPositionY();

    // 根节点分左右布局
    if (level === 0 && treeType === 'both') {
      const mid = Math.ceil(children.length / 2);
      const leftChildren = children.slice(0, mid);
      const rightChildren = children.slice(mid);

      let accumulatedHeightLeft = 0;
      let accumulatedHeightRight = 0;

      // 左侧子节点，强制向 left
      for (const child of leftChildren) {
        const childSubtreeHeight = child.layoutProps.subtreeHeight ?? child.size?.height ?? 40;
        const childX = this._calcCoordinatesX(
          'left',
          parentWidth,
          parentX,
          child.size?.width ?? 100
        );
        const childY = this._calcCoordinatesY(
          direction,
          parentHeight,
          parentY,
          accumulatedHeightLeft,
          child.size?.height ?? 40
        );
        child.setPosition(childX, childY);

        // 递归时沿用 left
        this._assignCoordinatesWithDirection(child, level + 1, 'left');
        accumulatedHeightLeft += childSubtreeHeight + siblingGap;
      }

      // 右侧子节点，强制向 right
      for (const child of rightChildren) {
        const childSubtreeHeight = child.layoutProps.subtreeHeight ?? child.size?.height ?? 40;
        const childX = this._calcCoordinatesX(
          'right',
          parentWidth,
          parentX,
          child.size?.width ?? 100
        );
        const childY = this._calcCoordinatesY(
          direction,
          parentHeight,
          parentY,
          accumulatedHeightRight,
          child.size?.height ?? 40
        );
        child.setPosition(childX, childY);

        // 递归时沿用 right
        this._assignCoordinatesWithDirection(child, level + 1, 'right');
        accumulatedHeightRight += childSubtreeHeight + siblingGap;
      }

      return;
    }

    // 非根节点正常逻辑
    let accumulatedHeight = 0;
    for (const child of children) {
      const childSubtreeHeight = child.layoutProps.subtreeHeight ?? child.size?.height ?? 40;
      const childX = this._calcCoordinatesX(
        treeType,
        parentWidth,
        parentX,
        child.size?.width ?? 100
      );
      const childY = this._calcCoordinatesY(
        direction,
        parentHeight,
        parentY,
        accumulatedHeight,
        child.size?.height ?? 40
      );
      child.setPosition(childX, childY);

      // 保持方向一致
      this._assignCoordinatesWithDirection(child, level + 1, treeType);
      accumulatedHeight += childSubtreeHeight + siblingGap;
    }
  }

  /** 递归计算子树高度 */
  private _computeSubTreeHeight(node: Node): void {
    const children = this._getChildren(node);
    const nodeHeight = node.size?.height ?? 40;
    const siblingGap = this.layoutOptions.nodeVerticalGap ?? 20;

    if (children.length === 0) {
      node.layoutProps.subtreeHeight = nodeHeight;
      return;
    }

    let totalChildrenHeight = 0;
    for (const child of children) {
      this._computeSubTreeHeight(child);
      totalChildrenHeight += child.layoutProps.subtreeHeight!;
    }

    totalChildrenHeight += children.length * siblingGap + nodeHeight;
    node.layoutProps.subtreeHeight = Math.max(nodeHeight, totalChildrenHeight);
  }

  /** 计算子节点的 X 坐标 */
  private _calcCoordinatesX(
    treeType: 'right' | 'left' | 'both',
    parentWidth: number,
    parentX: number,
    childWidth: number
  ): number {
    switch (treeType) {
      case 'left':
        return parentX + parentWidth / 2 - childWidth - 10;
      case 'right':
        return parentX + parentWidth / 2 + 10;
      case 'both':
      default:
        // 默认右侧布局
        return parentX + parentWidth / 2 + 10;
    }
  }

  /** 计算子节点的 Y 坐标 */
  private _calcCoordinatesY(
    direction: 'BT' | 'TB' | undefined,
    parentHeight: number,
    parentY: number,
    accumulatedHeight: number,
    childHeight: number
  ): number {
    const gap = this.layoutOptions.nodeVerticalGap ?? 20;
    if (direction === 'TB') {
      return parentY + parentHeight + accumulatedHeight + gap;
    } else if (direction === 'BT') {
      return parentY - childHeight - accumulatedHeight - gap;
    }
    return parentY + accumulatedHeight; // fallback
  }
}
