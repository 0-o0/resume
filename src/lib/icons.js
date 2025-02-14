// 动态导入 @iconify/json/json/mdi.json
import { readFile } from 'fs/promises';
import path from 'path';

let mdiJSON;

// 使用 Node.js 的 fs 模块读取并解析 JSON 文件
const jsonFilePath = path.resolve(__dirname, '../../node_modules/@iconify/json/json/mdi.json');
readFile(jsonFilePath, 'utf8')
  .then(data => {
    mdiJSON = JSON.parse(data);
  })
  .catch(error => {
    console.error('Failed to load mdiJSON', error);
  });

import {
  getIconData,
  iconToSVG,
  replaceIDs,
  stringToIcon,
} from '@iconify/utils';

const svgAttributesBase = {
  'xmlns': 'http://www.w3.org/2000/svg',
  'xmlns:xlink': 'http://www.w3.org/1999/xlink',
};

const getIconsData = function(prefix) {
  if (prefix === 'mdi') {
    if (!mdiJSON) {
      console.error('mdiJSON is not loaded yet');
      return;
    }
    return mdiJSON;
  }
  throw new Error(`Icon set ${prefix} is not included.`);
};

export const getIconSVG = function(name, { dom } = {}) {
  const iconName = stringToIcon(name);
  const icon = getIconData(getIconsData(iconName.prefix), iconName.name);
  if (!icon) {
    console.log('icon not found', name);
    return;
  }
  const renderData = iconToSVG(icon, {
    height: '1em',
    width: '1em',
  });

  const svgAttributes = {
    ...svgAttributesBase,
    ...renderData.attributes,
  };

  // Generate SVG
  const svgAttributesStr = Object.keys(svgAttributes)
    .map(
      (attr) => `${attr}="${svgAttributes[attr]}"`
    )
    .join(' ');

  const svgHTML = `<svg ${svgAttributesStr}>${replaceIDs(renderData.body)}</svg>`;

  if (dom) {
    const div = document.createElement('div');
    div.innerHTML = svgHTML;
    return div.firstChild;
  }
  return svgHTML;
};
