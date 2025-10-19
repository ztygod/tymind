import { LayoutManager } from '../layout/layout-manager';
import type { EdgeStyleConfig, GraphOptions, NodeData } from '../type';
import { Edge } from './edge';
import { Node } from './node';
import { Renderer } from '../renderer/renderer';

interface GraphInitOptions {
  container: HTMLDivElement;
  data: NodeData;
  graphOptions?: GraphOptions;
  defaultEdgeStyle?: EdgeStyleConfig;
}

export class Graph {
  public width;
  public height;
  public grid;
  public background;

  private _renderer: Renderer;
  private _nodes: Map<string, Node> = new Map();
  private _edges: Map<string, Edge> = new Map();

  constructor(options: GraphInitOptions) {
    const {
      container,
      data,
      graphOptions,
      defaultEdgeStyle = {
        type: 'line',
        color: 'rgb(0,0,0)',
        width: 1,
        style: 'solid',
        arrow: 'end',
        label: '',
        labelStyle: {
          fontSize: 10,
          fontColor: 'rgb(0,0,0)',
          background: 'rgb(230,230,230)',
        },
      },
    } = options;

    const opts = {
      width: graphOptions?.width || 800,
      height: graphOptions?.height || 600,
      grid: graphOptions?.grid || false,
      background: graphOptions?.background || '#f2f7fa',
    };

    this.width = opts.width;
    this.height = opts.height;
    this.grid = opts.grid;
    this.background = opts.background;

    // Init background (grid) in the Renderer, while providing rendering API
    this._renderer = new Renderer(container, opts);

    // Init Node, Edge and load data
    this.loadData(data, defaultEdgeStyle);
  }

  public loadData(rootNode: NodeData, defaultEdgeStyle?: EdgeStyleConfig): void {
    // Clean old data
    this._clean();

    // Create Instance ( Nodes and Edges )
    this._createInstancesFromData(rootNode, defaultEdgeStyle);

    // Use layout algorithms to calculate the position of each node
    this._applyLayout();

    // Draw all instances
    this._drawAll();
  }

  private _createInstancesFromData(rootNode: NodeData, defaultEdgeStyle?: EdgeStyleConfig): void {
    const levelCounter: Record<number, number> = {};

    const traverse = (
      currentNodeData: NodeData,
      parentNodeInstance: Node | null,
      depth: number
    ): void => {
      if (levelCounter[depth] === undefined) levelCounter[depth] = 0;

      const newNodeInstance = new Node(currentNodeData, this._renderer, depth, levelCounter[depth]);
      levelCounter[depth]++;

      this._nodes.set(newNodeInstance.id, newNodeInstance);

      if (parentNodeInstance) {
        const edgeData = {
          id: `edge-${parentNodeInstance.id}-${currentNodeData.id}`,
          source: parentNodeInstance,
          target: newNodeInstance,
          ...defaultEdgeStyle,
        };

        const newEdgeInstance = new Edge(edgeData, this._renderer);
        this._edges.set(newEdgeInstance.id, newEdgeInstance);
      }

      if (currentNodeData.children) {
        currentNodeData.children?.forEach((childrenData) => {
          traverse(childrenData, newNodeInstance, depth + 1);
        });
      }
    };

    traverse(rootNode, null, 0);
  }

  private _applyLayout(layoutName: string = 'mindmap'): void {
    const layoutOptions = {
      /** TODO */
    };

    const layout = LayoutManager.getLayout(
      layoutName,
      this._nodes,
      this._edges
      // layoutOptions
    );

    if (layout) {
      /** Calculate the layout and coordinates of each node and edge */
      layout.run();
    }
  }

  private _drawAll(): void {
    for (const node of this._nodes.values()) {
      node.draw();
    }
  }

  private _clean(): void {
    this._nodes.forEach((node) => node.destroy());
    this._edges.forEach((edge) => edge.destroy());
    this._nodes.clear();
    this._edges.clear();
  }
}
