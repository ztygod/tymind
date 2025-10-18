import type { Node } from "../../core/node";
import { BaseConnector, type AnchorPoint } from "./base-connector";

export class LineConnector extends BaseConnector {
    getEndPosints(source: Node, target: Node): { sourcePoint: AnchorPoint; targetPoint: AnchorPoint; } {
        throw new Error("Method not implemented.");
    }
    getNodeAnchours(node: Node): Record<AnchorPoint["direction"], Omit<AnchorPoint, "direction">> {
        throw new Error("Method not implemented.");
    }
    
}