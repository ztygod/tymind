import type { Node } from "../../core/node";
import { BaseLayout } from "../base-layout";

export class MindmapLayout extends BaseLayout{
    protected computeLayout(rootNode: Node): void {
        if (!this.nodes || this.nodes.size === 0) return;

        this._computeSubTreeHeight(rootNode)
        
        const { width: viewportWidth, height: viewportHeight } = this.layoutOptions.viewport
        const rootX = 
            this.layoutOptions.direction === 'LR'
                ? viewportWidth / 4
                : (viewportWidth * 3) / 4
        const rootY = viewportHeight / 2
        rootNode.setPosition(rootX, rootY)

        this._assignCoordinates(rootNode, 0)
    }

    protected preprocess(): void {
        if (!this._findRootNode()) {
            console.error("Layout Error: Root node not found.");
            return
        }
    }
    protected postprocess(): void {
        const { width: viewportWidth, height: viewportHeight } = this.layoutOptions.viewport
        if (!this.nodes || this.nodes.size === 0) return

        let minX = Infinity, maxX = -Infinity
        let minY = Infinity, maxY = -Infinity

        for (const node of this.nodes.values()) {
            const { width = 100, height = 40 } = node.size ?? {}
            const { x , y } = node.position ?? { x: 0, y: 0}
            minX = Math.min(minX, x)
            maxX = Math.max(maxX, x + width)
            minY = Math.min(minY, y)
            maxY = Math.max(maxY, y + height)
        }

        const graphWidth = maxX - minX
        const graphHeight = maxY - minY

        const offsetX = (viewportWidth - graphWidth) / 2 - minX
        const offsetY = (viewportHeight - graphHeight) / 2 - minY

        for (const node of this.nodes.values()) {
            if (!node.position) continue
            node.setPosition(
                node.position.x + offsetX,
                node.position.y + offsetY
            )
        }
    }

    /**
     * Bottom-up traversal: calculate the height of the subtree for each node
     */
    private _computeSubTreeHeight(node: Node): void {
        const children = this._getChildren(node)
        const nodeHeight = node.size?.height ?? 40
        const siblingGap = this.layoutOptions.nodeVerticalGap ?? 20

        if (children.length === 0) {
            node.layoutProps.subtreeHeight = nodeHeight
            return
        }

        let totalChildrenHeight = 0
        for (const child of children) {
            this._computeSubTreeHeight(child)
            totalChildrenHeight += child.layoutProps.subtreeHeight!
        }

        totalChildrenHeight += (children.length - 1) * siblingGap

        node.layoutProps.subtreeHeight = Math.max(nodeHeight, totalChildrenHeight)
    }

    /**
     * Top-down traversal: Calculate node coordinates
     */
    private _assignCoordinates(node: Node, level: number): void {
        const children = this._getChildren(node)
        if (children.length === 0) return 

        const parentSize  = {
            width: node.size?.width ?? 100,
            height: node.size?.height ?? 40
        }
        const siblingGap = this.layoutOptions.nodeVerticalGap ?? 20
        const levelGap = this.layoutOptions.nodeHorizontalGap ?? 80
        const alpha = 0.1 // The scaling factor slightly tightens the spacing between levels.

        const totalChildrenHeight = node.layoutProps.subtreeHeight!

        // 让整个子树在父节点垂直居中
        const parentCenterY = node.position!.y + parentSize.height / 2
        let currentY = parentCenterY - totalChildrenHeight / 2

        const direction = this.layoutOptions.direction === 'LR' ? 1 : -1

        for(const child of children) {
            const childSubtreeHeight = child.layoutProps.subtreeHeight!

            const childY = currentY + (child.layoutProps.subtreeHeight! - (child.size?.height ?? 40)) / 2;

            const effectiveGap = levelGap / Math.sqrt(1 + level)
            const childX = node.position!.x + direction * (parentSize.width + effectiveGap)

            child.setPosition(childX, childY)

            this._assignCoordinates(child, level + 1)
            currentY += childSubtreeHeight + siblingGap
        }
    }
}