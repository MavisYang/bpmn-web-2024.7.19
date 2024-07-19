import type { List, Page, PageQuery } from "@/utils/request";
import { request, download } from "@/utils/request";

export interface WorkflowModel {
    id: String,
    keycode: String,
    name: String,
    nameEn:String,
    group: String,
    model: String,
    status: String,
}

export interface WorkflowPageQuery extends PageQuery {
    keyword: String
}


export function save(model: WorkflowModel) {
    alert(JSON.stringify(model));
    return request<Page<WorkflowModel>>(`/api/workflow-models/{keycode}/xml-create`, model, "POST");
}

export function findPageList(query: WorkflowPageQuery) {
    return request<Page<WorkflowModel>>(`/api/workflow-models`, query, "GET");
}