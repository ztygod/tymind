import type { GraphOptions, NodeData } from "../type"
import { Edge } from "./edge"
import { Node } from "./node"
import { Renderer } from "./renderer"

export class Graph {
    public width
    public height
    public grid
    public background

    private _render: Renderer | null
    private _nodes: Map<string, Node> = new Map()
    private _edges: Map<string, Edge> = new Map()

    constructor(container: HTMLDivElement, options: GraphOptions | undefined) {
        // Use default values
        const opts = {
            width: options?.width ?? 800,
            height: options?.height ?? 600,
            grid: options?.grid ?? false,
            background: options?.background ?? '#f2f7fa',
        }

        this.width = opts.width
        this.height = opts.height
        this.grid = opts.grid
        this.background = opts.background

        this._render = new Renderer(container, opts)
    }

    public loadData(data: NodeData[]): void {
        this.clear()

        // TODO
    }

    public clear(): void {
        this._nodes.clear()
        this._edges.clear()
        this._render = null
    }
}