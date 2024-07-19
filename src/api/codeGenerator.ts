import type { List } from "@/utils/request";
import { request, download } from "@/utils/request";

export interface DbConnection {
    username: string,
    password: string,
    url: string
}

export interface ColumnClass {
    propertyName: string, //对应java属性的名字
    columnName: string,  //数据库中的名字
    type: string,        //字段类型
    remark: string,      //备注
    isPrimary: Boolean,  //字段是不是一个主键
}

export interface TableClass {
    tableName: String,  //表名 ，以下是生成的名字
    modelName: String,
    serviceName: String,
    mapperName: String,
    controllerName: String,
    packageName: String,
    columns: ColumnClass[], // 字段
}

export function testConnection(connection: DbConnection) {
    return request(`/api/connect`, connection, "POST");
}

export function generateConfig(packageName: String) {
    return request<List<TableClass>>("/api/config", { packageName }, "POST");
}

export function generateCode(tables: Object[] = []) {
    return download(`/api/generateCode`, tables, "POST");
}