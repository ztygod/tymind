import type { Node } from "../../core/node";
import { BaseLayout } from "../base-layout";

export class MindmapLayout extends BaseLayout{
    protected computeLayout(rootNode: Node): void {
        if (!this.nodes || this.nodes.size === 0) return;

        const { width: viewportWidth, height: viewportHeight } = this.layoutOptions.viewport
        const {direction, nodeHorizontalGap, nodeVerticalGap, preventOverlap, animate } = this.layoutOptions

        // Nodes at each level
        const levels: Record<number,  Node[]> = []
        const levelSizes: {width: number; height: number }[] = []
        
        for (const node of this.nodes.values()) {
            const level = node.level ?? 0
            if (!levels[level]) levels[level] = []
            levels[level].push(node)
        }

        // Calculate the maximum width of each layer and the total height of each layer
        let totalWidth = 0
        let totalHeight = 0
        const levelCount = Object.keys(levels).length

        for (const nodesAtLevel of Object.values(levels)) {
            let levelWidth = 0
            let levelHeight = 0

            for (const node of nodesAtLevel) {
                const { width = 100, height = 40 } = node.size ?? {}

                if (direction === 'LR' || direction === 'RL') {
                    levelWidth = Math.max(levelWidth, width)
                    levelHeight += height
                } else {
                    levelWidth += width
                    levelHeight = Math.max(levelHeight, height)
                }
            }

            // Apply gaps within the same level
            if (direction === 'LR' || direction === 'RL') {
                levelHeight += (nodesAtLevel.length - 1) * (nodeVerticalGap ?? 0)
            } else {
                levelWidth += (nodesAtLevel.length - 1) * (nodeVerticalGap ?? 0)
            }

            // Accumulate total size
            if (direction === 'LR' || direction === 'RL') {
                totalWidth += levelWidth
                totalHeight = Math.max(totalHeight, levelHeight)
            } else {
                totalWidth = Math.max(totalWidth, levelWidth)
                totalHeight += levelHeight
            }
        }

        // Apply gaps between levels
        if (direction === 'LR' || direction === 'RL') {
            totalWidth += (levelCount - 1) * (nodeHorizontalGap ?? 0)
        } else {
            totalHeight += (levelCount - 1) * (nodeVerticalGap ?? 0)
        }
        

        // Calculate centering offsets
        const offsetX = (viewportWidth - totalWidth) / 2
        const offsetY = (viewportHeight - totalHeight) / 2
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