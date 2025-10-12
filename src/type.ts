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
  width?: number;

  /** Canvas height (in pixels) */
  height?: number;

  /**
   * Background grid configuration.
   * 
   * - `false` → No grid is rendered.
   * - `true` → Use the default grid settings ( DotGridConfig ).
   * - `GridConfig` → Custom grid configuration.
   */
  grid?: boolean | GridConfig;

  /** Background color of the canvas (optional) */
  background?: string;
}

/** Base configuration shared by all grid types */
interface BaseGridConfig {
  /** Grid Type */
  type: 'dot' | 'mesh' | 'double-mesh';

  /** Grid spacing (distance between grid units) */
  gridSize?: number;
}

/** Configuration for dot-style grids */
export interface DotGridConfig extends BaseGridConfig {
  type: 'dot';

  /** Color of each dot */
  dotColor?: string;

  /** Radius (thickness) of each dot */
  dotThickness?: number;
}

/** Configuration for line-style grids */
export interface MeshGridConfig extends BaseGridConfig{
  type: 'mesh';

  /** Color of each line */
  meshColor?: string;

  /** Line width (thickness) */
  meshThickness?: number;
}

/** Configuration for double-mesh grids */
export interface DoubleMeshConfig extends BaseGridConfig {
  type: 'double-mesh'

   /** Thin line color */
  thinLineColor?: string;

  /** Thin line width */
  thinLineWidth?: number;

  /** Bold line color */
  boldLineColor?: string;

  /** Bold line width */
  boldLineWidth?: number;

  /** Interval between bold lines (multiples of gridSize, optional) */
  boldLineInterval?: number;
}

export type GridConfig = 
  | DotGridConfig
  | MeshGridConfig
  | DoubleMeshConfig
