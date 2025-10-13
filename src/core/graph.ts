import type { GraphOptions, Node as NodeType, Edge as EdgeType } from "../type"
import { Edge } from "./edge"
import { Node } from "./node"
import { Renderer } from "./renderer"

export class Graph {
    public width
    public height
    public grid
    public background

    private _renderer: Renderer
    private _nodes: Map<string, Node> = new Map()
    private _edges: Map<string, Edge> = new Map()

    constructor(container: HTMLDivElement, options: GraphOptions | undefined, rootNode: NodeType) {
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

        // Init background (grid) in the Renderer, while providing rendering API
        this._renderer = new Renderer(container, opts)

        // Init Node and load data
        
    }

    public loadData(rootNode: NodeType): void {
        // clean old data
        this._clean()

        // Create Instance
        this._createInstancesFromData

        // Use layout algorithms to calculate the position of each node
        this._applyLayout()

        // Draw all instances
        this._drawAll()
    }

    private _createInstancesFromData(rootNode: NodeType): void {
        const traverse = (currentNodeData: NodeType, parentNodeInstance: Node | null): void => {
            const newNodeInstance = new Node(currentNodeData, this._renderer)
            this._nodes.set(newNodeInstance.id, newNodeInstance)

            if (parentNodeInstance) {
                const edgeData: EdgeType = {
                    id: `edge-${parentNodeInstance.id}-${currentNodeData.id}`,
                    source: parentNodeInstance.id,
                    target: currentNodeData.id,
                    // ... 从 currentNodeData.edgeData 读取其他属性 ...
                }

                const newEdgeInstance = new Edge(
                    edgeData,
                    this._renderer
                )
                this._edges.set(newEdgeInstance.id, newEdgeInstance)
            }

            currentNodeData.children?.forEach(childrenData => {
                traverse(childrenData, newNodeInstance)
            })
        }

        traverse(rootNode, null)
    }

    private _applyLayout(): void {

    }

    private _drawAll(): void {

    }

    private _clean() {

    }

}