import { Graph } from "./model/graph";
import type { MindMapOptions, NodeData } from "./type";

/**
 * Create a MindMap instance in DOM
 * @param arg1 - container element | container selector | options
 * @param arg2 - optional data array when using container+data form
 */
export function MindMapCreate(container: HTMLDivElement, data: NodeData[]): Graph;
export function MindMapCreate(containerId: string, data: NodeData[]): Graph;
export function MindMapCreate(options: MindMapOptions): Graph;
export function MindMapCreate(
  arg1: string | HTMLDivElement | MindMapOptions,
  arg2?: NodeData[]
): Graph {
  // Normalize options
  const options: MindMapOptions =
    typeof arg1 === "string" || arg1 instanceof HTMLDivElement
      ? { container: arg1, data: arg2 }
      : arg1;

  const containerEl = resolveContainer(options.container);
  if (!containerEl) {
    throw new Error(
      `[MindMapCreate] Invalid container: ${
        typeof options.container === "string" ? `"${options.container}"` : "HTMLElement"
      }`
    );
  }

  // Create Graph instance and apply all configurations
  const { graph } = options;
  const GraphInstance = new Graph(containerEl, graph);

  console.log("✅ MindMap container ready:", containerEl);

  return GraphInstance
}

function resolveContainer(
  container: string | HTMLDivElement
): HTMLDivElement | null {
  if (typeof container === "string") {
    const el = document.querySelector(container);
    return el instanceof HTMLDivElement ? el : null;
  }
  return container;
}
