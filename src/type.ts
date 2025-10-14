export interface MindMapOptions {
  /** 
   * Container element or selector string 
   * where the mind map will be rendered.
   */
  container: string | HTMLDivElement;

  /**
   * Initial hierarchical data for the mind map.
   */
  data: NodeData;

  /**
   * Graph rendering configurations (size, grid, background, etc.)
   */
  graphOptions?: GraphOptions;

  /**
   * Edges global rendering configurations
   */
  defaultEdgeStyle?: EdgeStyleConfig
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


/**
 * Structure of a single node in the mind map.
 */
export interface NodeData {
  /** Unique identifier of the node */
  id: string

  /** Display label or text shown inside the node */
  label: string

  /** Shape of the node */
  shape?: NodeShape

  /** Size configuration of the node */
  size?: NodeSize

  /** Style settings (e.g., border, font, background) */
  style?: NodeStyle

  /** Position of the node in the coordinate system */
  position?: NodePosition

  /** Indicates whether the node is collapsed (children hidden) */
  collapsed?: boolean

  /** Child nodes, forming a hierarchical tree structure */
  children?: NodeData[]

  /** Custom data payload attached to this node */
  data?: Record<string, any>
}

export type NodeShape = 'rect' | 'circle' | 'diamond' | 'ellipse'

export interface NodeSize {
  width: number
  height: number
}

export interface NodePosition {
  x: number
  y: number
}

export interface NodeStyle {
  borderColor?: string
  borderWidth?: number
  background?: string
  fontSize?: number
  fontColor?: string
}


/**
 * Structure of an edge (connection) between two nodes.
 */
export interface EdgeData extends EdgeStyleConfig{
  /** Unique ID of the edge */
  id: string

  /** Source node */
  source: Node

  /** Target node */
  target: Node
}

export interface EdgeStyleConfig {
  /** Connection type */
  type?: EdgeType

  /** Line color */
  color?: string

  /** Line thickness */
  width?: number

  /** Line style */
  style?: EdgeStyle

  /** Arrow direction */
  arrow?: EdgeArrow

  /** Optional text label */
  label?: string

  /** Label style */
  labelStyle?: EdgeLabelStyle

  /** Custom data for extensions */
  data?: Record<string, any>
}

export type EdgeType = 'line' | 'curve' | 'bezier'
export type EdgeStyle = 'solid' | 'dashed' | 'dotted'
export type EdgeArrow = 'none' | 'start' | 'end' | 'both'

export interface EdgeLabelStyle {
  fontSize?: number
  fontColor?: string
  background?: string
}