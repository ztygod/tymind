import type { NodePosition, NodeShape, NodeSize, NodeStyle, Node as NodeType } from "../type"
import type { Renderer } from "./renderer"

export class Node {
    readonly id: string
    label: string
    color?: string
    shape?: NodeShape
    size?: NodeSize
    style?: NodeStyle
    position?: NodePosition = { x: 0, y: 0}
    collapsed?: boolean
    children?: Node[]
    data?: Record<string, any>

    private _renderer: Renderer
    private _element: SVGGElement | null = null // Store the SVG element corresponding to this node

    constructor(date: { id: string, label: string } & Partial<Omit<NodeType, 'id' | 'label'>>, renderer: Renderer) {
        this.id = date.id
        this.label = date.label
        this._renderer = renderer

        Object.assign(this, date)
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

    /** TODO: Enable node drag-and-drop functionality */
    private enableDragging(): void {
        if (!this._element) return

        // 拖拽逻辑
    }
}