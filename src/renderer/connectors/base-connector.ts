import type { Node } from "../../core/node";

export interface AnchorPoint {
    x: number
    y: number
    direction: 'left-top' | 'left-bottom' | 'right-top' | 'right-bottom' 
}

export abstract class BaseConnector {
    /**
     * Get Edge's start and end connection points
     */ 
    abstract getEndPosints(source: Node, target: Node): { sourcePoint: AnchorPoint, targetPoint: AnchorPoint }

    /**
     * Calculate the four central anchor points of a node's bounding box
     */
    abstract getNodeAnchours(node: Node): Record<AnchorPoint['direction'], Omit<AnchorPoint, 'direction'>>
}