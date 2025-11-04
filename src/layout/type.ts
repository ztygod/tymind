export type LayoutOptions = TreeLayoutOptions | MindMapLayoutOptions | ForceLayoutOptions;

export interface TreeLayoutOptions extends BaseLayoutOptions {
  /** Type of layout algorithm. */
  layoutType: 'tree';

  /** 树形排列方式，左侧单树，右侧单树，双侧都有 */
  treeType: 'right' | 'left' | 'both';

  /**
   * Layout direction (applicable for tree or mind map layouts).
   * - TB: Top to Bottom
   * - BT: Bottom to Top
   */
  direction?: 'TB' | 'BT';
}

export interface MindMapLayoutOptions extends BaseLayoutOptions {
  /** Type of layout algorithm. */
  layoutType: 'mindmap';

  /**
   * Layout direction (applicable for tree or mind map layouts).
   * - LR: Left to Right
   * - RL: Right to Left
   * - TB: Top to Bottom
   * - BT: Bottom to Top
   */
  direction?: 'LR' | 'RL' | 'TB' | 'BT';
}

export interface ForceLayoutOptions extends BaseLayoutOptions {
  /** Type of layout algorithm. */
  layoutType: 'force';

  /**
   * Layout direction (applicable for tree or mind map layouts).
   * - LR: Left to Right
   * - RL: Right to Left
   * - TB: Top to Bottom
   * - BT: Bottom to Top
   */
  direction?: 'LR' | 'RL';

  /** 节点之间的引力强度（负值表示排斥） */
  chargeStrength?: number;

  /** 边的长度期望值 */
  linkDistance?: number;

  /** 模拟阻尼系数 */
  alphaDecay?: number;

  /** 是否固定根节点 */
  fixRoot?: boolean;
}

export interface BaseLayoutOptions {
  /**
   * Width and Height of svg container
   */
  viewport?: {
    width: number;
    height: number;
  };

  /** Horizontal spacing between sibling nodes. */
  nodeHorizontalGap?: number;

  /** Vertical spacing between levels of nodes. */
  nodeVerticalGap?: number;

  /** The initial position of the root node in the layout (relative coordinates). */
  rootPosition?: { x: number; y: number };
}
