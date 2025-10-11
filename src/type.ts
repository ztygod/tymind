export interface MindMapOptions {
  /** 
   * Container element or selector string 
   * where the mind map will be rendered.
   */
  container: string | HTMLDivElement;

  /**
   * Initial hierarchical data for the mind map.
   */
  data?: NodeData[];

  /**
   * Graph rendering configurations (size, grid, background, etc.)
   */
  graph?: GraphOptions;
}

/**
 * Structure of a single node in the mind map.
 */
export interface NodeData {
  /** Unique identifier of the node */
  id: string;

  /** Display label of the node */
  label: string;

  /** Child nodes, forming a tree structure */
  children?: NodeData[];

  /** Allow arbitrary custom attributes */
  [key: string]: any;
}

/**
 * Structure of an edge (connection) between two nodes.
 */
export interface EdgeData {
  /** Unique identifier of the edge */
  id: string;

  /** ID of the source node */
  source: string;

  /** ID of the target node */
  target: string;

  /** Allow arbitrary custom attributes */
  [key: string]: any;
}

/**
 * Graph-level configuration options 
 * controlling rendering size, background, and grid display.
 */
export interface GraphOptions {
  /** Canvas width (in pixels) */
  width: number;

  /** Canvas height (in pixels) */
  height: number;

  /** Whether to display a background grid (optional) */
  grid?: boolean;

  /** Background color of the canvas (optional) */
  background?: string;
}
