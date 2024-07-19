import type { Page } from "@/utils/request";
import { request } from "@/utils/request";

export interface DataSource {
    id?: string,
    name?: string,
    remark?: string,
    databaseType?: string,
    //jdbcDriverClass?: string,
    //jdbcUrl: string,
    host: string,
    port: string,
    database: string,
    username: string,
    password: string,
    tenantId?: string,
    createBy?: string,
    createdTime?: Date,
    updateBy?: string,
    updatedTime?: Date,
}

export interface DataSourcePageQuery {
    page: number,
    size: number,
    keyword: string,
}

export function createDataSource(dataSource: DataSource) {
    return request("/api/data-sources", dataSource, "POST");
}

export function deleteDataSource(id: string) {
    return request(`/api/data-sources/${id}`, null, "DELETE");
}

export function findPageList(dataSourcePageQuery: DataSourcePageQuery) {
    return request<Page<DataSource>>("/api/data-sources", dataSourcePageQuery, "GET");
}

export function testConnection(dataSource: DataSource) {
    return request(`/api/data-sources/connect`,dataSource,"POST");
}