/*
 * @Author: yangmiaomiao
 * @Date: 2024-07-19 13:26:56
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2024-07-22 15:42:27
 * @Description:
 */
import type { List, Page, PageQuery } from '@/utils/request';
import { request, download } from '@/utils/request';
import XML from '@/views/WorkflowDesign/xml.json';

export interface WorkflowModel {
  id: string;
  keycode: string;
  name: string;
  nameEn: string;
  group: string;
  model: string;
  status: string;
}

export interface WorkflowPageQuery extends PageQuery {
  keyword: string;
}

export function getXmlData() {
  // return request<Page<WorkflowModel>>(`/api/workflow-models/{keycode}/xml-create`, model, 'POST');
  return Promise.resolve({
    code: 200,
    data: XML,
  });
}

export function save(model: WorkflowModel) {
  return request<Page<WorkflowModel>>(`/api/workflow-models/{keycode}/xml-create`, model, 'POST');
}

export function findPageList(query: WorkflowPageQuery) {
  return request<Page<WorkflowModel>>(`/api/workflow-models`, query, 'GET');
}
