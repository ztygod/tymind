import type { EdgeData, NodeData } from "../type"

export const DEFAULT_LAYOUT_OPTIONS: Required<LayoutOptions> = {
  layoutType: 'tree',
  direction: 'LR',
  nodeHorizontalGap: 80,
  nodeVerticalGap: 20,
  rootPosition: { x: 0, y: 0 },
  preventOverlap: true,
  animate: false,
  customLayoutFn: () => {}
}

export interface LayoutOptions {
  /** 
   * Type of layout algorithm.
   * Supported types: tree, radial, force-directed, mind map.
   */
  layoutType: 'tree' | 'radial' | 'force' | 'mindmap';

  /**
   * Layout direction (applicable for tree or mind map layouts).
   * - LR: Left to Right
   * - RL: Right to Left
   * - TB: Top to Bottom
   * - BT: Bottom to Top
   * - H:  Horizontal mind map (center node expands horizontally)
   * - V:  Vertical mind map (center node expands vertically)
   */
  direction?: 'LR' | 'RL' | 'TB' | 'BT' | 'H' | 'V';

  /** Horizontal spacing between sibling nodes. */
  nodeHorizontalGap?: number;

  /** Vertical spacing between levels of nodes. */
  nodeVerticalGap?: number;

  /** The initial position of the root node in the layout (relative coordinates). */
  rootPosition?: { x: number; y: number };

  /** Whether to automatically adjust node positions to prevent overlaps. */
  preventOverlap?: boolean;

  /** Whether to enable animation for smooth transitions during layout updates. */
  animate?: boolean;

  /**
   * Custom layout function.
   * Allows users to inject their own layout algorithm implementation.
   */
  customLayoutFn?: (nodes: NodeData[], edges: EdgeData[]) => void;
}
