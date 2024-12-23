import {request} from '@umijs/max';



export async function statsManager(params){
    return request<API.FormattedResponse>('/prod-api/an/supplier/quotation/statsManager',{
        method:'get',
        params:{
            ...params
        }
        
    })
}

