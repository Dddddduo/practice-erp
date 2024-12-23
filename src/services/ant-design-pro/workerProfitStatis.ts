import {request} from '@umijs/max';

// /prod-api/an/supplier/reim/statsWorker

export async function statsWorker(params){
    return request<API.FormattedResponse>('/prod-api/an/supplier/reim/statsWorker',{
        method:'get',
        params:{
            ...params
        }
        
    })
}