import { MindMapCreate } from '.'
import type { NodeData } from './type'
import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg'

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
const sampleMindMapData: NodeData[] = [
  {
    id: 'root',
    label: 'Mind Map',
    type: 'root',
    color: '#4e79a7',
    children: [
      {
        id: '1',
        label: 'Frontend',
        type: 'category',
        color: '#f28e2b',
        children: [
          {
            id: '1-1',
            label: 'HTML',
            type: 'topic',
            notes: 'Markup language for web pages'
          },
          {
            id: '1-2',
            label: 'CSS',
            type: 'topic',
            notes: 'Styling web pages'
          },
          {
            id: '1-3',
            label: 'JavaScript',
            type: 'topic',
            notes: 'Interactive web behavior'
          }
        ]
      },
      {
        id: '2',
        label: 'Backend',
        type: 'category',
        color: '#e15759',
        children: [
          {
            id: '2-1',
            label: 'Node.js',
            type: 'topic',
            notes: 'JavaScript runtime for server'
          },
          {
            id: '2-2',
            label: 'Database',
            type: 'topic',
            children: [
              {
                id: '2-2-1',
                label: 'SQL',
                type: 'subtopic',
                notes: 'Relational databases'
              },
              {
                id: '2-2-2',
                label: 'NoSQL',
                type: 'subtopic',
                notes: 'Non-relational databases'
              }
            ]
          }
        ]
      },
      {
        id: '3',
        label: 'DevOps',
        type: 'category',
        color: '#76b7b2',
        children: [
          {
            id: '3-1',
            label: 'Docker',
            type: 'topic'
          },
          {
            id: '3-2',
            label: 'CI/CD',
            type: 'topic'
          }
        ]
      }
    ]
  }
]
MindMapCreate(document.querySelector<HTMLDivElement>('#main')!, sampleMindMapData)