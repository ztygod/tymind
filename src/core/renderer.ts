import type { 
    DotGridConfig, 
    DoubleMeshConfig, 
    GraphOptions, 
    GridConfig, 
    MeshGridConfig, 
} from "../type"
import type { Edge } from "./edge"
import type { Node } from "./node"

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
            this.drawGrid(grid)
        }
    }

    public setSize(width: number, height: number) {
        this.svgRoot.setAttribute('width', String(width))
        this.svgRoot.setAttribute('height', String(height))
    }

    public setBackground(color: string): void {
        this.svgRoot.style.backgroundColor = color
    }

    public removeElement(element: SVGGElement): void {

    }

    public drawGrid(grid: boolean | GridConfig): void {
        if (typeof grid === 'boolean') {
            if (!grid) return
            grid = {
                type: 'dot',
                gridSize: 10,
                dotColor: 'rgb(170,170,170)',
                dotThickness: 1.0
            }
        }

        // Basic default configuration
        const defaultConfig: Record<GridConfig['type'], GridConfig> = {
            'dot': {
                type: 'dot',
                gridSize: 10,
                dotColor: 'rgb(170,170,170)',
                dotThickness: 1.0,
            },
            'mesh': {
                type: 'mesh',
                gridSize: 10,
                meshColor: 'rgb(170,170,170)',
                meshThickness: 1.0
            },
            'double-mesh': {
                type: 'double-mesh',
                gridSize: 10,
                thinLineColor: 'rgb(170,170,170)',
                thinLineWidth: 1.0,
                boldLineColor: 'rgb(136,136,136)',
                boldLineWidth: 3.0,
                boldLineInterval: 4,
            }
        }

        // Merge user-provided configuration with default configuration
        const mergedGrid = {
            ...defaultConfig[grid.type],
            ...grid
        } as GridConfig

        // Draw grid
        switch (mergedGrid.type) {
            case 'dot':
                this.drawDotPattern(mergedGrid)
                break
            case "mesh":
                this.drawMeshPattern(mergedGrid)
                break
            case "double-mesh":
                this.drawDoubleMeshPattern(mergedGrid)
                break
            default:
                break
        }
    }

    public drawNode(rootNode: Node): SVGGElement {

    }

    public drawEdge(edge: Edge): SVGGElement {

    }

    /**  Update Node Position */
    public updateNodePosition(element: SVGGElement, x: number, y: number): void {

    } 

    /** Update Edge Position */
    public updateEdgePath(element: SVGGElement, edge: Edge): void {

    }

    /** Draw dot-style grid */
    private drawDotPattern(config: DotGridConfig): void {
        const { gridSize, dotColor, dotThickness} = config

        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs')
        const pattern = document.createElementNS('http://www.w3.org/2000/svg', 'pattern')
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
        const rect  =document.createElementNS('http://www.w3.org/2000/svg', 'rect')

        const patternId = `dot-pattern-${Date.now()}`

        pattern.setAttribute('id', patternId)
        pattern.setAttribute('patternUnits', 'userSpaceOnUse')
        pattern.setAttribute('width', String(gridSize))
        pattern.setAttribute('height', String(gridSize))

        circle.setAttribute('cx', String(gridSize! / 2))
        circle.setAttribute('cy', String(gridSize! / 2))
        circle.setAttribute('r', String(dotThickness))
        circle.setAttribute('fill', dotColor!)

        pattern.appendChild(circle)
        defs.appendChild(pattern)
        this.svgRoot.appendChild(defs)

        rect.setAttribute('width', '100%')
        rect.setAttribute('height', '100%')
        rect.setAttribute('fill', `url(#${patternId})`)

        // insert at the bottom of the main layer
        this.svgRoot.insertBefore(rect, this.mainLayer)
    }

    /** Draw mesh-style grid */
    private drawMeshPattern(config: MeshGridConfig): void {
        const { gridSize, meshColor, meshThickness } = config

        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs')
        const pattern = document.createElementNS('http://www.w3.org/2000/svg', 'pattern')
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')

        const patternId = `mesh-pattern-${Date.now()}`

        pattern.setAttribute('id', patternId)
        pattern.setAttribute('patternUnits', 'userSpaceOnUse')
        pattern.setAttribute('width', String(gridSize))
        pattern.setAttribute('height', String(gridSize))

        // Create a horizontal line
        const hLine = document.createElementNS('http://www.w3.org/2000/svg', 'line')
        hLine.setAttribute('x1', '0')
        hLine.setAttribute('y1', '0')
        hLine.setAttribute('x2', String(gridSize))
        hLine.setAttribute('y2', '0')
        hLine.setAttribute('stroke', meshColor!)
        hLine.setAttribute('stroke-width', String(meshThickness))

        // Create a vertical line
        const vLine = document.createElementNS('http://www.w3.org/2000/svg', 'line')
        vLine.setAttribute('x1', '0')
        vLine.setAttribute('y1', '0')
        vLine.setAttribute('x2', '0')
        vLine.setAttribute('y2', String(gridSize))
        vLine.setAttribute('stroke', meshColor!)
        vLine.setAttribute('stroke-width', String(meshThickness))

        pattern.appendChild(hLine)
        pattern.appendChild(vLine)
        defs.appendChild(pattern)
        this.svgRoot.appendChild(defs)

        rect.setAttribute('width', '100%')
        rect.setAttribute('height', '100%')
        rect.setAttribute('fill', `url(#${patternId})`)

        // insert at the bottom of the main layer
        this.svgRoot.insertBefore(rect, this.mainLayer)
    }

    /** Draw double-mesh-style grid*/
    private drawDoubleMeshPattern(config: DoubleMeshConfig): void {
        const { 
            gridSize, 
            thinLineColor, 
            thinLineWidth, 
            boldLineColor, 
            boldLineWidth, 
            boldLineInterval
        } = config

        if (!gridSize || !boldLineInterval || !thinLineColor || !boldLineColor) return

        const totalSize = gridSize * boldLineInterval

        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs')
        const pattern = document.createElementNS('http://www.w3.org/2000/svg', 'pattern')
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')

        const patternId = `double-mesh-pattern-${Date.now()}`

        pattern.setAttribute('id', patternId)
        pattern.setAttribute('patternUnits', 'userSpaceOnUse')
        pattern.setAttribute('width', String(totalSize))
        pattern.setAttribute('height', String(totalSize))

        // Draw thin lines and thick lines
        for (let i = 0;i <= boldLineInterval; i++) {
            const pos = i * gridSize

            // thin lines
            if (i < boldLineInterval) {
                const hLine = document.createElementNS('http://www.w3.org/2000/svg', 'line')
                hLine.setAttribute('x1', '0')
                hLine.setAttribute('y1', String(pos))
                hLine.setAttribute('x2', String(totalSize))
                hLine.setAttribute('y2', String(pos))
                hLine.setAttribute('stroke', thinLineColor)
                hLine.setAttribute('stroke-width', String(thinLineWidth))
                pattern.appendChild(hLine)

                const vLine = document.createElementNS('http://www.w3.org/2000/svg', 'line')
                vLine.setAttribute('x1', String(pos))
                vLine.setAttribute('y1', '0')
                vLine.setAttribute('x2', String(pos))
                vLine.setAttribute('y2', String(totalSize))
                vLine.setAttribute('stroke', thinLineColor)
                vLine.setAttribute('stroke-width', String(thinLineWidth))
                pattern.appendChild(vLine)
            }

            // thick lines
            if (i === boldLineInterval) {
                const hBold = document.createElementNS('http://www.w3.org/2000/svg', 'line')
                hBold.setAttribute('x1', '0')
                hBold.setAttribute('y1', String(pos))
                hBold.setAttribute('x2', String(totalSize))
                hBold.setAttribute('y2', String(pos))
                hBold.setAttribute('stroke', boldLineColor)
                hBold.setAttribute('stroke-width', String(boldLineWidth))
                pattern.appendChild(hBold)

                const vBold = document.createElementNS('http://www.w3.org/2000/svg', 'line')
                vBold.setAttribute('x1', String(pos))
                vBold.setAttribute('y1', '0')
                vBold.setAttribute('x2', String(pos))
                vBold.setAttribute('y2', String(totalSize))
                vBold.setAttribute('stroke', boldLineColor)
                vBold.setAttribute('stroke-width', String(boldLineWidth))
                pattern.appendChild(vBold)
            }
        }

        defs.appendChild(pattern)
        this.svgRoot.appendChild(defs)

        rect.setAttribute('width', '100%')
        rect.setAttribute('height', '100%')
        rect.setAttribute('fill', `url(#${patternId})`)

        // insert at the bottom of the main layer
        this.svgRoot.insertBefore(rect, this.mainLayer)
    }
}