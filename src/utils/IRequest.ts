export interface IRequest {
    method: HttpMethods;
    url: string;
    params?: any;
    data?: any;
    successCallback?: Function;
    errorCallback?: Function;
    headers?: any;
}

export enum HttpMethods {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
}