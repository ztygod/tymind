import { Graph } from './core/graph';
import { ForceLayout } from './layout/force/force-layout';
import { LayoutManager } from './layout/layout-manager';
import { MindmapLayout } from './layout/tree/mindmap-layout';
import { TreeLayout } from './layout/tree/tree-layout';
import type { MindMapOptions, NodeData } from './type';

LayoutManager.register('tree', TreeLayout);
LayoutManager.register('mindmap', MindmapLayout);
LayoutManager.register('force', ForceLayout);

/**
 * Creates and initializes a MindMap instance.
 *
 * Supports three calling patterns:
 * 1. `MindMapCreate(container: HTMLDivElement, data: Node)`
 * 2. `MindMapCreate(containerId: string, data: Node)`
 * 3. `MindMapCreate(options: MindMapOptions)`
 */
export function MindMapCreate(container: HTMLDivElement, data: NodeData): Graph;
export function MindMapCreate(containerId: string, data: NodeData): Graph;
export function MindMapCreate(options: MindMapOptions): Graph;

export function MindMapCreate(
  arg1: string | HTMLDivElement | MindMapOptions,
  arg2?: NodeData
): Graph {
  let options: MindMapOptions;

  // Normalize parameters
  if (typeof arg1 === 'string' || arg1 instanceof HTMLDivElement) {
    if (!arg2) {
      throw new Error(`[MindMapCreate] Missing required "data" parameter.`);
    }
    options = { container: arg1, data: arg2 };
  } else {
    options = arg1;
  }

  // Validate container
  const containerEl = resolveContainer(options.container);
  if (!containerEl) {
    throw new Error(
      `[MindMapCreate] Invalid container: ${
        typeof options.container === 'string' ? `"${options.container}"` : 'HTMLElement'
      }`
    );
  }

  // Validate data
  if (!options.data || typeof options.data !== 'object') {
    throw new Error(`[MindMapCreate] "data" must be a valid Node object.`);
  }

  // Initialize Graph
  const { graphStyle, data, edgeStyle, layoutOptions } = options;
  const graphInstance = new Graph({
    container: containerEl,
    data,
    graphStyle,
    edgeStyle,
    layoutOptions,
  });

  return graphInstance;
}

/**
 * Resolve DOM container element by selector or direct reference.
 */
function resolveContainer(container: string | HTMLDivElement): HTMLDivElement | null {
  if (typeof container === 'string') {
    const el = document.querySelector(container);
    return el instanceof HTMLDivElement ? el : null;
  }
  return container;
}
