import { LayoutManager } from '../layout/layout-manager';
import type { EdgeStyleConfig, GraphOptions, NodeData } from '../type';
import { Edge } from './edge';
import { Node } from './node';
import { Renderer } from '../renderer/renderer';
import type { LayoutOptions } from '../layout/type';

interface GraphInitOptions {
  container: HTMLDivElement;
  data: NodeData;
  graphStyle?: GraphOptions;
  edgeStyle?: EdgeStyleConfig;
  layoutOptions?: LayoutOptions;
}

export class Graph {
  public width;
  public height;
  public grid;
  public background;
  public edgeStyle: EdgeStyleConfig;
  public layoutOptions: LayoutOptions;

  private _renderer: Renderer;
  private _nodes: Map<string, Node> = new Map();
  private _edges: Map<string, Edge> = new Map();

  constructor(options: GraphInitOptions) {
    const defaultEdgeStyle: EdgeStyleConfig = {
      type: 'straight',
      color: 'rgb(0,0,0)',
      width: 1,
      style: 'solid',
      arrow: 'none',
      label: '',
      labelStyle: {
        fontSize: 10,
        fontColor: 'rgb(0,0,0)',
        background: 'rgb(230,230,230)',
      },
    };

    const defaultLayoutOptions: LayoutOptions = {
      layoutType: 'mindmap',
      viewport: { width: 800, height: 600 },
      direction: 'LR',
      nodeHorizontalGap: 80,
      nodeVerticalGap: 20,
      preventOverlap: true,
      animate: false,
    };

    const defaultGraphStyle = {
      width: 800,
      height: 600,
      grid: false,
      background: '#f2f7fa',
    };

    const {
      container,
      data,
      graphStyle = {},
      edgeStyle = {},
      layoutOptions = {} as Partial<LayoutOptions>,
    } = options;
    const mergedGraphStyle = { ...defaultGraphStyle, ...graphStyle };
    const mergedEdgeStyle = { ...defaultEdgeStyle, ...edgeStyle };
    const mergedLayoutOptions: LayoutOptions = {
      ...defaultLayoutOptions,
      ...layoutOptions,
      viewport: {
        ...defaultLayoutOptions.viewport!,
        ...layoutOptions.viewport!,
      },
    };

    this.width = mergedGraphStyle.width;
    this.height = mergedGraphStyle.height;
    this.grid = mergedGraphStyle.grid;
    this.background = mergedGraphStyle.background;
    this.edgeStyle = mergedEdgeStyle;
    this.layoutOptions = mergedLayoutOptions;

    this.layoutOptions.viewport!.width = this.width;
    this.layoutOptions.viewport!.height = this.height;

    // Init background (grid) in the Renderer, while providing rendering API
    this._renderer = new Renderer(container, mergedGraphStyle);

    // Init Node, Edge and load data
    this.loadData(data);
  }

  public loadData(rootNode: NodeData): void {
    // Clean old data
    this._clean();

    // Create Instance ( Nodes and Edges )
    this._createInstancesFromData(rootNode, this.edgeStyle);

    // Use layout algorithms to calculate the position of each node
    this._applyLayout(this.layoutOptions);

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
          direction: this.layoutOptions.direction!,
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

  private _applyLayout(layoutOptions: LayoutOptions): void {
    const { layoutType } = layoutOptions;

    const layout = LayoutManager.getLayout(layoutType, this._nodes, this._edges, layoutOptions);

    if (layout) {
      /** Calculate the layout and coordinates of each node and edge */
      layout.run();
    }
  }

  private _drawAll(): void {
    for (const node of this._nodes.values()) {
      node.draw();
    }

    for (const edge of this._edges.values()) {
      edge.draw();
      console.log('edge draw');
    }
  }

  private _clean(): void {
    this._nodes.forEach((node) => node.destroy());
    this._edges.forEach((edge) => edge.destroy());
    this._nodes.clear();
    this._edges.clear();
  }
}
