import type { Edge } from '../core/edge';
import type { Node } from '../core/node';
import type { BaseLayout } from './base-layout';
import type { LayoutOptions } from './type';

type LayourConstructor = new (
  nodes: Map<string, Node>,
  edges: Map<string, Edge>,
  options?: LayoutOptions
) => BaseLayout;

/**
 * LayoutManager is a central registry for layout algorithms.
 * It allows registering custom layout classes and retrieving
 * instances based on a layout name.
 */
export class LayoutManager {
  private static layout: Map<string, LayourConstructor> = new Map();

  public static register(name: string, layoutClass: LayourConstructor): void {
    this.layout.set(name, layoutClass);
  }

  public static getLayout(
    name: string,
    nodes: Map<string, Node>,
    edges: Map<string, Edge>,
    options?: LayoutOptions
  ): BaseLayout | undefined {
    const layoutClass = this.layout.get(name);

    if (layoutClass) {
      return new layoutClass(nodes, edges, options);
    }
    console.error(`Layout "${name}" not registered.`);
  }
}
