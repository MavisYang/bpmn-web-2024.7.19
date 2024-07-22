/*
 * @Author: yangmiaomiao
 * @Date: 2024-07-19 13:26:56
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2024-07-22 11:16:30
 * @Description:
 */
import CustomPalette from './CustomPalette';
// import CustomRenderer from './CustomRenderer';

export default {
  __init__: [
    'paletteProvider',
    // 'customRenderer'
  ],
  paletteProvider: ['type', CustomPalette], // ,
  // customRenderer: ['type', CustomRenderer],
};
