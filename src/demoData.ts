import { NodeData } from './type';

export const mixedShapeMindMapData: NodeData = {
  id: 'root',
  label: '中心主题',
  shape: 'rect',
  size: {
    width: 120,
    height: 60,
  },
  style: {
    borderColor: '#555',
    borderWidth: 2,
    background: '#e6f7ff',
    fontSize: 16,
    fontColor: '#111',
  },
  position: { x: 0, y: 0 },
  collapsed: false,
  children: [
    {
      id: 'branch1',
      label: '圆形',
      shape: 'circle',
      size: { radius: 25 },
      style: {
        borderColor: '#888',
        borderWidth: 2,
        background: '#fff0f6',
        fontSize: 14,
        fontColor: '#222',
      },
      children: [
        { id: 'branch1-1', label: '子节点 1A' },
        { id: 'branch1-2', label: '子节点 1B' },
      ],
    },
    {
      id: 'branch2',
      label: '菱形分支',
      shape: 'diamond',
      size: { width: 100, height: 50 },
      style: {
        borderColor: '#aa5500',
        borderWidth: 2,
        background: '#fff7e6',
        fontSize: 14,
        fontColor: '#333',
      },
      children: [
        { id: 'branch2-1', label: '子节点 2A' },
        { id: 'branch2-2', label: '子节点 2B' },
      ],
    },
    {
      id: 'branch3',
      label: '椭圆分支',
      shape: 'ellipse',
      size: { rx: 60, ry: 30 },
      style: {
        borderColor: '#007700',
        borderWidth: 2,
        background: '#f6fff0',
        fontSize: 14,
        fontColor: '#111',
      },
      children: [
        { id: 'branch3-1', label: '子节点 3A' },
        { id: 'branch3-2', label: '子节点 3B' },
      ],
    },
  ],
  data: {
    note: '示例多形状节点',
    link: 'https://example.com',
  },
};
