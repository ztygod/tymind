import { Graph } from "./core/graph";
import type { MindMapOptions, Node } from "./type";

/**
 * Creates and initializes a MindMap instance.
 * 
 * Supports three calling patterns:
 * 1. `MindMapCreate(container: HTMLDivElement, data: Node)`
 * 2. `MindMapCreate(containerId: string, data: Node)`
 * 3. `MindMapCreate(options: MindMapOptions)`
 */
export function MindMapCreate(container: HTMLDivElement, data: Node): Graph
export function MindMapCreate(containerId: string, data: Node): Graph
export function MindMapCreate(options: MindMapOptions): Graph

export function MindMapCreate(
  arg1: string | HTMLDivElement | MindMapOptions,
  arg2?: Node
): Graph {
  let options: MindMapOptions

  // Normalize parameters
  if (typeof arg1 === "string" || arg1 instanceof HTMLDivElement) {
    if (!arg2) {
      throw new Error(`[MindMapCreate] Missing required "data" parameter.`)
    }
    options = { container: arg1, data: arg2 }
  } else {
    options = arg1
  }

  // Validate container
  const containerEl = resolveContainer(options.container)
  if (!containerEl) {
    throw new Error(
      `[MindMapCreate] Invalid container: ${
        typeof options.container === "string" ? `"${options.container}"` : "HTMLElement"
      }`
    )
  }

  // Validate data
  if (!options.data || typeof options.data !== "object") {
    throw new Error(`[MindMapCreate] "data" must be a valid Node object.`)
  }

  // Initialize Graph
  const { graph, data } = options
  const graphInstance = new Graph(containerEl, graph, data)

  return graphInstance
}

/** 
 * Resolve DOM container element by selector or direct reference.
 */
function resolveContainer(
  container: string | HTMLDivElement
): HTMLDivElement | null {
  if (typeof container === "string") {
    const el = document.querySelector(container)
    return el instanceof HTMLDivElement ? el : null
  }
  return container
}
