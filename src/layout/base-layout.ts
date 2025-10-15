import type { Edge } from "../core/edge";
import type { Node } from "../core/node";
import { DEFAULT_LAYOUT_OPTIONS, type LayoutOptions } from "./type";

export abstract class BaseLayout {
    protected nodes: Map<string, Node>
    protected edges: Map<string, Edge>
    protected layoutOptions: LayoutOptions

    constructor(
        nodes: Map<string, Node>, 
        edges: Map<string, Edge>, 
        options?: LayoutOptions,
    ) {
        this.nodes = nodes
        this.edges = edges    
        this.layoutOptions = { ...DEFAULT_LAYOUT_OPTIONS, ...options}
    }

    public run(): Map<string, Node> | undefined{
        this.preprocess()
        this.computeLayout(this._findRootNode()!)
        this.postprocess()

        return this.nodes
    }

    protected abstract computeLayout(rootNode: Node): void

    protected abstract preprocess(): void

    protected abstract postprocess(): void

    protected _findRootNode(): Node | undefined {
        for (const node of this.nodes.values()) {
            if (node.incomingEdges.length === 0) {
                return node
            }
        }
        return undefined
    }

    protected _getChildren(node: Node): Node[] {
        return node.outgoingEdges.map(e => e.target)
    }

    protected _getParent(node: Node): Node[] {
        return node.incomingEdges.map(e => e.source)
    }

}