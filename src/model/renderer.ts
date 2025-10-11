import type { GraphOptions } from "../type"

export class Renderer {
    private svgRoot: SVGSVGElement
    private mainLayer: SVGGElement

    constructor(container: HTMLDivElement, options: Required<GraphOptions>) {
        const { width, height, grid, background} = options

        this.svgRoot = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
        this.mainLayer = document.createElementNS('http://www.w3.org/2000/svg', 'g')

        this.svgRoot.appendChild(this.mainLayer)
        container.appendChild(this.svgRoot)

        // Draw Handling
        this.setSize(width, height)
        this.setBackground(background)

        if (grid) {
            this.drawGrid()
        }
    }

    public setSize(width: number, height: number) {
        this.svgRoot.setAttribute('width', String(width))
        this.svgRoot.setAttribute('height', String(height))
    }

    public setBackground(color: string): void {
        this.svgRoot.style.backgroundColor = color
    }

    public drawGrid(): void {

    }


}