import type { Node } from "../../core/node";
import { BaseLayout } from "../base-layout";

export class MindmapLayout extends BaseLayout{
    protected computeLayout(rootNode: Node): void {
        if (!this.nodes || this.nodes.size === 0) return;

        const { width: viewportWidth, height: viewportHeight } = this.layoutOptions.viewport
        const {direction, nodeHorizontalGap, nodeVerticalGap, preventOverlap, animate } = this.layoutOptions

        // Calculate the total width, total height, and maximum level
        let totalNodeWidth = 0;
        let totalNodeHeight = 0;
        let maxDepth = 0;

        for (const node of this.nodes.values()) {
            const nodeWidth = node.size?.width ?? 100;
            const nodeHeight = node.size?.height ?? 40;

            totalNodeWidth += nodeWidth;
            totalNodeHeight += nodeHeight;

            maxDepth = Math.max(maxDepth, node.level ?? 0);
        }

        switch (direction) {
            case 'LR':
            case 'RL':
            case 'H':
                totalNodeWidth += nodeHorizontalGap! * maxDepth
                break;
            case 'TB':
            case 'BT':
            case 'V':
                totalNodeHeight += nodeVerticalGap! * maxDepth
                break;
            default:
                break;
        }

        let containerOffsetX = (viewportWidth - totalNodeWidth) / 2
        let containerOffsetY = (viewportHeight - totalNodeHeight) / 2

        /** Calculate the coordinates of the root node */
        rootNode.position!.x = containerOffsetX
        rootNode.position!.y = containerOffsetY + totalNodeHeight - rootNode.size?.height! / 2
        
    }

    protected preprocess(): void {
        if (!this._findRootNode()) {
            console.error("Layout Error: Root node not found.");
            return
        }
    }
    protected postprocess(): void {
        throw new Error("Method not implemented.");
    }
}