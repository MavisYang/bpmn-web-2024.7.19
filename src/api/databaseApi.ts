import { request, type List } from '@/utils/request';

interface DataTable {
  name: String;
  columns: any[];
  indexs: any[];
}

interface DataBase {
  name: String;
  tables: DataTable[];
  views: any[];
  procedures: any[];
  functions: any[];
  triggers: any[];
  events: any[];
}

export function connectByDataSource(dataSourceId: String) {
  return request<List<DataBase>>(`/api/databases/connect-by-source/${dataSourceId}`, null, 'GET');
}

export function executeSql(dataSourceId: String, sql: String) {
  return request<string>(`/api/databases/execute-sql/${dataSourceId}`, sql, 'POST');
}
