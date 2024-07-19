import axios from 'axios';
import { message } from "ant-design-vue";

// 参考 https://wenku.baidu.com/view/42136a10346baf1ffc4ffe4733687e21ae45ff59.html

// 全局配置 
// Vite-Vue3.x-TS-Eslint项目初始化（2022-05-02）https://wenku.baidu.com/view/d033e7f67c192279168884868762caaedd33ba09.html
axios.defaults.baseURL = ""; // import.meta.env.VITE_APP_BASE_URL
axios.defaults.timeout = 5000;

// 拦截器
axios.interceptors.request.use(config => {
    return config;
}, error => {
    return Promise.reject(error);
});

axios.interceptors.response.use(response => {
    const msg = response.data.msg || "操作成功";
    message.success(msg);
    return response;
}, error => {
    console.log(error);
    const msg = error.data || "操作失败";
    message.error(msg);
    return Promise.reject(error);
});

export function request<T>(url: string = '', params: Object | null = {}, method: string = 'GET'): Promise<T> {
    const param = ["GET", "DELETE"].indexOf(method.toUpperCase()) > -1 ? { params } : { data: params };
    return new Promise((resolve, reject) => {
        const promise = axios({
            url, method, ...param
        });
        promise.then(ret => {
            // http://events.jianshu.io/p/72cd07dc8f69
            let t = ret.data;
            return resolve(t);
        }).catch(reject);
        return promise;
    })
}

const downloadFile = (res: any) => {
    let contentDisposition = res.headers["content-disposition"];
    let fileName = contentDisposition ? contentDisposition.split(";")[1].split("=")[1] : (new Date().getTime() + "");

    //console.log(res);
    let blob = new Blob([res.data]);
    let downloadElement = document.createElement("a");
    let href = window.URL.createObjectURL(blob); //创建下载链接


    downloadElement.href = href;
    downloadElement.download = decodeURIComponent((fileName + "").replace(/^("|')|("|')$/g, "")); //解码
    document.body.appendChild(downloadElement);
    downloadElement.click();
    document.body.removeChild(downloadElement);
    window.URL.revokeObjectURL(href); //释放掉blob对象
}

export function download(url: string = '', params: Object | null = {}, method: string = 'GET') {
    try {
        const hideLoadMessage = message.loading('downloading in progress..', 0);
        const param = ["GET", "DELETE"].indexOf(method.toUpperCase()) > -1 ? { params } : { data: params };
        const headers = {
            Authorization: "Bearer " + "getToken()",
            "Access-Control-Allow-Origin": "*",
        }
        const responseType = "arraybuffer";
        axios({
            url, method, headers, responseType, ...param
            // xml返回数据的钩子函数，可以用来获取数据的进度 具体可查看axios的官网 onDownloadProgress:(progressEvent)=>{}
        }).then(response => {
            hideLoadMessage();
            message.success('download success');
            downloadFile(response)
        }).catch(response => {
            console.log("download file has error", response);
            hideLoadMessage();
        });
    } catch (error) {
        console.log(error);
        message.error("您访问的相关资源有误");
    }
}

// 分页元数据
export interface PageMeta {
    page: number, // 当前页，起始页 1
    size: number, // 页大小，
    totalElements?: number, // 总记录数
    totalPages?: number,    // 总页数
    hasNext: Boolean,       // 是否有下一页
    [x: string]: any, // 可能存在其他动态属性
}

export interface ValueMeta {
    [x: string]: any, // 可能存在其他动态属性
}

// 集合元数据
export interface ListMeta {
    totalElements: Number, // 总记录数
    [x: string]: any, // 可能存在其他动态属性
}

// 单值,值可以为任意类型
export interface Value<T> {
    content: T,
    meta: ValueMeta
}

// 列表对象
export interface List<T> {
    content: T[],
    meta: ListMeta
}

// 分页对象
export interface Page<T> {
    meta?: PageMeta,
    content?: T[]
}

export interface PageQuery {
    page: number,
    size: number
}