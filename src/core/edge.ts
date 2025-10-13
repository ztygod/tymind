import type { EdgeArrow, EdgeLabelStyle, EdgeStyle, EdgeType, Node, Edge as EdgeDataType } from "../type"
import type { Renderer } from "./renderer"

export class Edge {
    readonly id: string
    readonly source: string
    readonly target: string
    type?: EdgeType
    color?: string
    width?: number
    style?: EdgeStyle
    arrow?: EdgeArrow
    label?: string
    labelStyle?: EdgeLabelStyle
    data?: Record<string, any>

    private _renderer: Renderer
    private _element: SVGGElement | null = null

    constructor(data: 
        { id: string, source: string, target: string } & Partial<Omit<EdgeDataType, 'id' | 'source' | 'target'>>,
        renderer: Renderer
    ) {
        this.id = data.id
        this.source = data.source
        this.target = data.target
        this._renderer = renderer


        Object.assign(this, data)
    }

    /** Command the Renderer to draw itself */
    public draw(): void {
        this._element = this._renderer.drawEdge(this)

    }

    /** Update Edge Layout */
    public update(): void {
        if (this._element) {
            this._renderer.updateEdgePath(this._element, this);
        }
    }


}