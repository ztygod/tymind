import type { NodePosition, NodeShape, NodeSize, NodeStyle, NodeData } from "../type"
import type { Edge } from "./edge"
import type { Renderer } from "../renderer/renderer"

export class Node {
    readonly id: string
    label: string
    level: number /** Current node level */
    index: number /** Current node inedx */
    shape?: NodeShape
    size?: NodeSize
    style?: NodeStyle
    position?: NodePosition = { x: 0, y: 0}
    collapsed?: boolean
    children?: Node[]
    data?: Record<string, any>
    /** Attributes used to store connection relationships */
    incomingEdges: Edge[] = []
    outgoingEdges: Edge[] = []
    /** Temporary properties during the layout process */
    layoutProps: {
        /** Subtree total height */
        subtreeHeight?: number
        /** Y coordinate offset relative to the parent node */
        yOffset?: number
        /** Correction value used to avoid subtree overlap */
        modifier?: number
    } ={}


    private _renderer: Renderer
    private _element: SVGGElement | null = null // Store the SVG element corresponding to this node

    constructor(date: { id: string, label: string } & Partial<Omit<NodeData, 'id' | 'label'>>, 
        renderer: Renderer,
        level: number,
        index: number
    ) {
        // Default value
        const {
            shape = 'rect',
            size = { width: 100, height: 40 },
            style = {
                "borderColor": "#333",
                "borderWidth": 2,
                "background": "#fffbe6",
                "fontSize": 14,
                "fontColor": "#222"
            },
            position = { x: 0, y: 0 },
            collapsed = false,
            children = [],
            data: customData = {},
        } = date

        this.id = date.id
        this.label = date.label
        this.level = level
        this.index = index
        this._renderer = renderer

        Object.assign(this, { 
            shape,
            size,
            style,
            position,
            collapsed,
            children,
            data: customData,
        })
    }

    /** Command the Renderer to draw itself */
    public draw(): void {
        this._element = this._renderer.drawNode(this)

        // this.enableDragging();
    }

    /** Update position */
    public setPosition(x: number, y: number): void {
        if (this.position) {
            this.position.x = x
            this.position.y = y
        }

        // If the node has already been rendered, the command updates its position on the screen via the Renderer.
        if (this._element) {
            this._renderer.updateNodePosition(this._element, x, y)
        }
    }

    /** Methods for managing edge relationships */
    public addIncomingEdge(edge: Edge): void {
        this.incomingEdges.push(edge)
    }

    public addOutgoingEdge(edge: Edge): void {
        this.outgoingEdges.push(edge)
    }

    public removeIncomingEdge(edge: Edge): void {
        this.incomingEdges.filter(e => e.id !== edge.id)
    }

    public removeOutgoingEdge(edge: Edge): void {
        this.outgoingEdges.filter(e => e.id !== edge.id)
    }

    // Destroy itself
    public destroy() {
        if (this._element) {
            this._renderer.removeElement(this._element)
            this._element = null
        }
        this.incomingEdges = []
        this.outgoingEdges = []
        this._renderer = null as any
    }

    /** TODO: Enable node drag-and-drop functionality */
    private enableDragging(): void {
        if (!this._element) return

        // 拖拽逻辑
    }
}