import { MindMapCreate } from '.';
import './style.css';
import { mixedShapeMindMapData } from './demoData';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1> TYmind Display </h1>
    <div id="main"></div>
  </div>
`;

MindMapCreate({
  container: document.querySelector<HTMLDivElement>('#main')!,
  data: mixedShapeMindMapData,
  graphStyle: {
    width: 800,
    height: 600,
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
    // treeType: 'both',
    // direction: 'TB',
    nodeVerticalGap: 10,
  },
});
