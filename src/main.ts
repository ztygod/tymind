import { MindMapCreate } from '.'
import type { Node } from './type'
import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg'
import './style.css'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1> TYmind Display </h1>
    <div id="main"></div>
  </div>
`
const sampleMindMapData: Node = {
  "id": "n1",
  "label": "中心主题",
  "color": "#ff6b6b",
  "shape": "rect",
  "size": {
    "width": 120,
    "height": 50
  },
  "style": {
    "borderColor": "#333",
    "borderWidth": 2,
    "background": "#fffbe6",
    "fontSize": 14,
    "fontColor": "#222"
  },
  "position": {
    "x": 0,
    "y": 0
  },
  "collapsed": false,
  "children": [
    {
      "id": "n2",
      "label": "分支 1",
      "color": "#4dabf7",
      "shape": "circle",
      "children": [
        {
          "id": "n3",
          "label": "子节点 A",
          "color": "#74c0fc",
          "shape": "rect"
        },
        {
          "id": "n4",
          "label": "子节点 B",
          "color": "#74c0fc",
          "shape": "rect"
        }
      ]
    },
    {
      "id": "n5",
      "label": "分支 2",
      "color": "#63e6be",
      "shape": "rect"
    }
  ],
  "data": {
    "note": "自定义扩展字段",
    "link": "https://example.com"
  }
}

MindMapCreate({
  container: document.querySelector<HTMLDivElement>('#main')!, 
  data: sampleMindMapData,
  graph: {
    grid: {
      type: 'double-mesh',
    }
  }
})