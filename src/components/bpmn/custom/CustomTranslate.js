/*
 * @Author: yangmiaomiao
 * @Date: 2024-07-19 16:45:35
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2024-07-22 13:51:46
 * @Description: 汉化模块
 */
import translations from './translationsGerman';

export default function customTranslate(template, replacements) {
  replacements = replacements || {};

  // Translate
  template = translations[template] || template;

  // Replace
  return template.replace(/{([^}]+)}/g, function (_, key) {
    return replacements[key] || '{' + key + '}';
  });
}
