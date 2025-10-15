import type { Node } from "../../core/node";
import { BaseLayout } from "../base-layout";

export class MindmapLayout extends BaseLayout{
    protected computeLayout(rootNode: Node): void {
        throw new Error("Method not implemented.");
    }
    protected preprocess(): void {
        throw new Error("Method not implemented.");
    }
    protected postprocess(): void {
        throw new Error("Method not implemented.");
    }
}