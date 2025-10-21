import { MindMapCreate } from '.';
import type { NodeData } from './type';
import './style.css';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1> TYmind Display </h1>
    <div id="main"></div>
  </div>
`;
const sampleMindMapData: NodeData = {
  id: 'n1',
  label: '中心主题',
  shape: 'rect',
  size: {
    width: 120,
    height: 50,
  },
  style: {
    borderColor: '#333',
    borderWidth: 2,
    background: '#fffbe6',
    fontSize: 14,
    fontColor: '#222',
  },
  position: {
    x: 0,
    y: 0,
  },
  collapsed: false,
  children: [
    {
      id: 'n2',
      label: '分支 1',
      // "shape": "circle",
      children: [
        {
          id: 'n3',
          label: '子节点 A',
          shape: 'rect',
        },
        {
          id: 'n4',
          label: '子节点 B',
          shape: 'rect',
          children: [
            {
              id: 'n4-1',
              label: '子节点 B-1',
              shape: 'rect',
            },
            {
              id: 'n4-2',
              label: '子节点 B-2',
              shape: 'rect',
            },
          ],
        },
        {
          id: 'n5',
          label: '子节点 C',
          shape: 'rect',
        },
      ],
    },
    {
      id: 'n6',
      label: '分支 2',
      shape: 'rect',
      children: [
        {
          id: 'n6-1',
          label: '分支 2-1',
        },
        {
          id: 'n6-2',
          label: '分支 2-2',
        },
      ],
    },
    {
      id: 'n7',
      label: '分支 3',
      shape: 'rect',
    },
  ],
  data: {
    note: '自定义扩展字段',
    link: 'https://example.com',
  },
};

MindMapCreate({
  container: document.querySelector<HTMLDivElement>('#main')!,
  data: sampleMindMapData,
  graphStyle: {
    grid: {
      type: 'dot',
    },
  },
  edgeStyle: {
    type: 'bezier',
    color: 'black',
  },
  layoutOptions: {
    layoutType: 'mindmap',
    direction: 'LR',
  },
});
