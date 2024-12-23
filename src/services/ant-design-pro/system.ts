import { request } from '@umijs/max';

// 客户端账号管理
export async function getBrandUserListPage(params) {
    return request<API.FormattedResponse>('/prod-api/an/supplier/getBrandUserListPage', {
        method: 'get',
        params: {
            ...params
        }
    })
}

export async function getStoreUserListPage(params) {
    return request<API.FormattedResponse>('/prod-api/an/supplier/getStoreUserListPage', {
        method: 'get',
        params: {
            ...params
        }
    })
}

//
export async function createOrUpdate(params) {
    return request<API.FormattedResponse>('/prod-api/an/supplier/createOrUpdateStoreUser', {
        method: 'post',
        data: {
            ...params
        }
    })
}

export async function createOrUpdateByBrandUser(params) {
    return request<API.FormattedResponse>('/prod-api/an/supplier/createOrUpdateBrandUser', {
        method: 'post',
        params: {
            ...params
        }
    })
}

export async function getStoreUserInfo(params) {
    return request<API.FormattedResponse>('/prod-api/an/supplier/getStoreUserInfo', {
        method: 'get',
        params: {
            ...params
        }
    })
}

export async function category(params) {
    return request<API.FormattedResponse>('/prod-api/inventory/category', {
        method: 'get',
        params: {
            ...params
        }
    })
}
//

export async function postCategory(params) {
    return request<API.FormattedResponse>('/prod-api/inventory/category', {
        method: 'POST',
        data: {
            ...params
        }
    })
}

//

export async function categoryStatus(params) {
    return request<API.FormattedResponse>(`/prod-api/inventory/category-status/${params.id}`, {
        method: 'PUT',
        data: {
            ...params
        }
    })
}

//
export async function warehouses(params) {
    return request<API.FormattedResponse>('/prod-api/inventory/warehouses', {
        method: 'get',
        params: {
            ...params
        }
    })
}
//
export async function AddWarehouses(params) {
    return request<API.FormattedResponse>('/prod-api/inventory/warehouse', {
        method: 'post',
        data: {
            ...params
        }
    })
}

export async function applyList(params) {
    return request<API.FormattedResponse>('/prod-api/inventory/apply-list', {
        method: 'get',
        params: {
            ...params
        }
    })
}



//   /prod-api/inventory/operate
export async function operate(params) {
    return request<API.FormattedResponse>(`/prod-api/inventory/operate/${params.id}`, {
        method: 'get',
        params: {
            warehouse_id: params.warehouse_id
        }
    })
}

//   /prod-api/inventory/category-all

export async function categoryAll() {
    return request<API.FormattedResponse>('/prod-api/inventory/category-all', {
        method: 'get',
    })
}

// /prod-api/inventory/warehouse-all

export async function warehouseAll() {
    return request<API.FormattedResponse>('/prod-api/inventory/warehouse-all', {
        method: 'get',
    })
}

// /prod-api/inventory/apply
export async function apply(params) {
    return request<API.FormattedResponse>('/prod-api/inventory/apply', {
        method: 'put',
        data: {
            ...params
        }
    })
}
// /prod-api/inventory/list
export async function toryList(params) {
    return request<API.FormattedResponse>('/prod-api/inventory/list', {
        method: 'get',
        params: {
            ...params
        }
    })
}
// /prod-api/inventory/enter
export async function enter(params) {
    return request<API.FormattedResponse>('/prod-api/inventory/enter', {
        method: 'put',
        data: {
            ...params
        }
    })
}

// /prod-api/inventory/ex
export async function ex(params) {
    return request<API.FormattedResponse>('/prod-api/inventory/ex', {
        method: 'put',
        data: {
            ...params
        }
    })
}

// /prod-api/inventory/record-list
export async function record(params) {
    return request<API.FormattedResponse>('/prod-api/inventory/record-list', {
        method: 'get',
        params: {
            ...params
        }
    })
}

// /prod-api/brands/getInitData
export async function getInitData() {
    return request<API.FormattedResponse>('/prod-api/brands/getInitData', {
        method: 'get',
    })
}

// /prod-api/an/supplier/getWorkerList 工人管理
export async function getWorkerList(params) {
    return request<API.FormattedResponse>('/prod-api/an/supplier/getWorkerList', {
        method: 'get',
        params: {
            ...params
        }
    })
}

export async function approval(params, id) {
    return request(`/prod-api/man/approval/${id}`, {
        method: "PUT",
        data: {
            ...params
        }
    })
}

// /prod-api/an/supplier/getAllWorkerList
export async function getAllWorkerList() {
    return request<API.FormattedResponse>('/prod-api/an/supplier/getAllWorkerList', {
        method: 'get',
    })
}
export async function getWorkerInfo(params) {
    return request('/prod-api/an/supplier/getWorkerInfo', {
        method: 'GET',
        params: {
            ...params
        }
    })
}
// /prod-api/general/manager-list
export async function managerList() {
    return request<API.FormattedResponse>('/prod-api/general/manager-list', {
        method: 'get',
    })
}
// /prod-api/man/add-man 添加
export async function AddMan(params) {
    return request<API.FormattedResponse>('/prod-api/man/add-man', {
        method: 'post',
        data: {
            ...params
        }
    })
}
// /prod-api/man/update-man/660 修改
export async function UpdateMan(params) {
    return request<API.FormattedResponse>(`/prod-api/man/update-man/${params.id}`, {
        method: 'put',
        data: {
            ...params
        }
    })
}

export async function showScore(id) {
    return request(`/prod-api/an/worker-year-score/show-score/${id}`, {
        method: "GET"
    })
}

export async function createOrUPdateComplaint(params) {
  return request('/prod-api/an/supplier/createOrUPdateComplaint', {
    method: 'POST',
    data: {
      ...params
    }
  })
}

export async function createOrUpdateScore(params) {
    return request('/prod-api/an/worker-year-score/create-or-update-score', {
        method: 'POST',
        data: {
            ...params
        }
    })
}

// /prod-api/an/supplier/getWorkerContract? 工人合同
export async function getWorkerContract(params) {
    return request<API.FormattedResponse>('/prod-api/an/supplier/getWorkerContract', {
        method: 'get',
        params: {
            ...params
        }
    })
}
// an/supplier/createPdfFile
export async function createPdfFile(params) {
    return request<API.FormattedResponse>('/an/supplier/createPdfFile', {
        method: 'post',
        data: {
            ...params
        }
    })
}
// /an/supplier/getFileOssUrl
export async function getFileOssUrl(params) {
    return request<API.FormattedResponse>('/an/supplier/getFileOssUrl', {
        method: 'post',
        data: {
            ...params
        }
    })
}


// /prod-api/project/category 类型管理
export async function projectCategory(params) {
    return request<API.FormattedResponse>('/prod-api/project/category', {
        method: 'get',
        params: {
            ...params
        }
    })
}

// /prod-api/project/category/139
export async function categorytatus(params) {
    return request<API.FormattedResponse>(`/prod-api/project/category/${params.id}`, {
        method: 'PUT',
        data: {
            ...params
        }
    })
}
export async function Categorytatus(id) {
    return request<API.FormattedResponse>(`/prod-api/project/category/${id}`, {
        method: 'DELETE',
    })
}

// /prod-api/project/category-all
export async function CategoryAll() {
    return request<API.FormattedResponse>('/prod-api/project/category-all', {
        method: 'get',
    })
}

// /prod-api/project/category
export async function categoryAdd(params) {
    return request<API.FormattedResponse>('/prod-api/project/category', {
        method: 'post',
        params: {
            ...params
        }
    })
}

// project/category-subs/
export async function getSubCategory(pid) {
    return request<API.FormattedResponse>(`/prod-api/project/category-subs/${pid}`, {
        method: 'get',
    })
}

// /prod-api/jobTypes/list 工作类型
export async function jobTypesList(params) {
    return request<API.FormattedResponse>('/prod-api/jobTypes/list', {
        method: 'get',
        params: {
            data: {
                ...params
            }

        }
    })
}

// /prod-api/jobTypes/add
export async function jobTypesAdd(params) {
    return request<API.FormattedResponse>('/prod-api/jobTypes/add', {
        method: 'post',
        params: {
            data: {
                ...params
            }
        }
    })
}
// /prod-api/jobTypes/edit
export async function jobTypesEdit(params) {
    return request<API.FormattedResponse>('/prod-api/jobTypes/edit', {
        method: 'post',
        params: {
            data: {
                ...params
            }
        }
    })
}

// /prod-api/brands/list 品牌管理
export async function brandsList(params) {
    return request<API.FormattedResponse>('/prod-api/brands/list', {
        method: 'get',
        params: {
            data: {
                ...params
            }

        }
    })
}

export async function brandsAdd(params) {
    return request('/prod-api/brands/add', {
        method: "POST",
        params: {
            data: params
        }
    })
}

export async function brandsEdit(params) {
    return request('/prod-api/brands/edit', {
        method: "POST",
        params: {
            data: params
        }
    })
}

// /prod-api/markets/list 商场管理
export async function marketsList(params) {
    return request<API.FormattedResponse>('/prod-api/markets/list', {
        method: 'get',
        params: {
            data: {
                ...params
            }

        }
    })
}
// /prod-api/markets/add
export async function marketsAdd(params) {
    return request<API.FormattedResponse>('/prod-api/markets/add', {
        method: 'post',
        params: {
            data: {
                ...params
            }
        }
    })
}
// /prod-api/markets/edit
export async function marketsEdit(params) {
    return request<API.FormattedResponse>('/prod-api/markets/edit', {
        method: 'post',
        params: {
            data: {
                ...params
            }
        }
    })
}

export async function marketsExportExcel(params) {
    return request('/prod-api/markets/exportExcel', {
        method: 'GET',
        params: {
            data: {
                ...params
            }
        }
    })
}

export async function downloadExcel(url, params) {
    return request(`/prod-api/${url}`, {
        method: 'GET',
        responseType: 'blob',
        params: {
            data: {
                ...params
            }
        }
    })
}

// /prod-api/maintManagers/list 施工负责人
export async function maintManagersList(params) {
    return request<API.FormattedResponse>('/prod-api/maintManagers/list', {
        method: 'get',
        params: {
            data: {
                ...params
            }

        }
    })

}
// /prod-api/maintManagers/add
export async function maintManagersAdd(params) {
    return request<API.FormattedResponse>('/prod-api/maintManagers/add', {
        method: 'post',
        params: {
            data: {
                ...params
            }
        }
    })
}
// /prod-api/maintManagers/edit
export async function maintManagersEdit(params) {
    return request<API.FormattedResponse>('/prod-api/maintManagers/edit', {
        method: 'post',
        params: {
            data: {
                ...params
            }
        }
    })
}
// /prod-api/maintManagers/del
export async function maintManagersDel(params) {
    return request<API.FormattedResponse>('/prod-api/maintManagers/del', {
        method: 'post',
        params: {
            data: {
                ...params
            }
        }
    })
}


// /prod-api/brandDescPrices/list  费用明细
export async function brandDescPricesList(params) {
    return request<API.FormattedResponse>('/prod-api/brandDescPrices/list', {
        method: 'get',
        params: {
            data: {
                ...params
            }

        }
    })

}
// /prod-api/brandDescPrices/add
export async function brandDescPricesAdd(params) {
    return request<API.FormattedResponse>('/prod-api/brandDescPrices/add', {
        method: 'post',
        params: {
            data: {
                ...params
            }
        }
    })
}

// /prod-api/brandDescPrices/edit
export async function brandDescPricesEdit(params) {
    return request<API.FormattedResponse>('/prod-api/brandDescPrices/edit', {
        method: 'post',
        params: {
            data: {
                ...params
            }
        }
    })
}

// /prod-api/brandDescPrices/del
export async function brandDescPricesDel(params) {
    return request<API.FormattedResponse>('/prod-api/brandDescPrices/del', {
        method: 'post',
        params: {
            data: {
                ...params
            }
        }
    })
}



// /prod-api/companies/list?data=%7B%7D 公司管理

export async function corporateGovernance(params) {
    return request<API.FormattedResponse>('/prod-api/companies/list?data=%7B%7D', {
        method: 'get',
        params: {
            ...params
        }
    })

}

// /prod-api/companies/add
export async function companies(params) {
    return request<API.FormattedResponse>('/prod-api/companies/add', {
        method: 'post',
        params: {
            data: {
                ...params
            }
        }
    })
}

// /prod-api/companies/edit
export async function companiesedit(params) {
    return request<API.FormattedResponse>('/prod-api/companies/edit', {
        method: 'post',
        params: {
            data: {
                ...params
            }
        }
    })
}



// /prod-api/an/supplier/getVendorListPage 供应商管理
export async function getVendorListPage(params) {
    return request<API.FormattedResponse>('/prod-api/an/supplier/getVendorListPage', {
        method: 'get',
        params: {
            ...params
        }
    })

}

// /prod-api/an/supplier/createOrUpdateVendor
export async function createOrUpdateVendor(params) {
    return request<API.FormattedResponse>('/prod-api/an/supplier/createOrUpdateVendor', {
        method: 'post',
        params: {
            ...params
        }
    })
}

export async function getFileUrlById(params) {
    return request('/prod-api/an/supplier/getFileUrlById', {
        method: 'GET',
        params: {
            ...params
        }
    })
}

// /prod-api/an/supplier/getVendorAccountListPage 供应商账号
export async function getVendorAccountListPage(params) {
    return request('/prod-api/an/supplier/getVendorAccountListPage', {
        method: 'GET',
        params: {
            ...params
        }
    })
}

// /prod-api/an/supplier/createOrUpdateVendorAccount
export async function createOrUpdateVendorAccount(params) {
    return request('/prod-api/an/supplier/createOrUpdateVendorAccount', {
        method: 'post',
        data: {
            ...params
        }
    })
}

// /prod-api/an/supplier/getCityList 城市管理

export async function getCityList(params) {
    return request('/prod-api/an/supplier/getCityList', {
        method: 'get',
        params: {
            ...params
        }
    })
}

// /prod-api/an/supplier/createOrUpdateCityInfo

export async function createOrUpdateCityInfo(params) {
    return request('/prod-api/an/supplier/createOrUpdateCityInfo', {
        method: 'post',
        data: {
            ...params
        }
    })
}

// /prod-api/an/supplier/getWorkItemUserList 工作计划
export async function getWorkItemUserList() {
    return request('/prod-api/an/supplier/getWorkItemUserList', {
        method: 'get',
    })
}

export async function getWorkItemList(params) {
    return request('/prod-api/an/supplier/getWorkItemList', {
        method: 'get',
        params: {
            ...params
        }
    })
}

export async function officeDocumentChildren(id: number) {
    return request(`/prod-api/an/gpt-get-folder-details/${id}`, {
        method: 'GET'
    })
}

export async function officeDocumentDetail(id: number) {
    return request(`/prod-api/an/office-document-detail/${id}`, {
        method: 'GET'
    })
}

export async function deleteDocument(id: number) {
    return request(`/prod-api/an/gpt-delete-folder/${id}`, {
        method: 'DELETE'
    })
}

export async function destroyDocumentAnnexes(id: number) {
    return request(`/prod-api/an/gpt-delete-file-in-folder/${id}`, {
        method: 'DELETE'
    })
}

export async function createOfficeDocument(params: any) {
    return request('/prod-api/an/gpt-create-folder', {
        method: 'POST',
        data: {
            ...params
        }
    })
}

export async function updateOfficeDocument(params: any, id: number) {
    return request(`/prod-api/an/gpt-update-folder/${id}`, {
        method: 'PUT',
        data: {
            ...params
        }
    })
}

export async function filesInFolder(params, id) {
    return request(`/prod-api/an/gpt-files-in-folder/${id}`, {
        method: "PUT",
        data: {
            ...params
        }
    })
}

export async function folderPermissions(id) {
    return request(`/prod-api/an/gpt-folder-permissions/${id}`)
}

export async function folders(params, id) {
    return request(`/prod-api/an/gpt-folders/${id}`, {
        method: "PUT",
        data: {
            ...params
        }
    })
}

export async function folderDelete(id) {
    return request(`/prod-api/an/gpt-folder-delete/${id}`, {
        method: "DELETE"
    })
}

// 合同管理

// local.zhian-api.com/api/an/contract-management-list 列表
export async function contractManagementList(params) {
    return request('/prod-api/an/gpt-contracts', {
        method: 'GET',
        params: {
            ...params
        }
    })
}

export async function assignDeptContract(params) {
    return request('/prod-api/an/gpt-assign-dept-contract', {
        method: "PUT",
        data: {
            ...params
        }
    })
}

export async function contractsDeptPermissions(params) {
    return request('/prod-api/an/gpt-contracts-dept-permissions', {
        method: "GET",
        params: {
            ...params
        }
    })
}

export async function contractsImport(params) {
    return request('/prod-api/an/gpt-contracts-import', {
        method: "POST",
        data: {
            ...params
        }
    })
}

// /api/an/create-contract-management 添加
export async function createContractManagement(params: any) {
    return request('/prod-api/an/gpt-create-contract', {
        method: 'POST',
        data: {
            ...params
        }
    })
}

export async function officeDocumentPermission() {
    return request(`/prod-api/an/office-document-permission`, {
        method: "GET",
    })
}

export async function storeUpdatePermission(params, id) {
    return request(`/prod-api/an/gpt-folder-assign-users/${id}`, {
        method: "PUT",
        data: {
            ...params
        }
    })
}

// /api/an/update-contract-management/{id}编辑
export async function updateContractManageMent(params: any, id) {
    return request(`/prod-api/an/gpt-update-contract/${id}`, {
        method: 'PUT',
        data: {
            ...params
        }
    })
}

// /an/department-all
export async function departmentAll() {
    return request('/prod-api/an/department-all', {
        method: 'get',
    })
}

// /an/user-department-all
export async function userAll(params) {
    return request(`/prod-api/an/user-department-all/${params.department_id}`, {
        method: 'get',
        params: {
            ...params
        }
    })
}
export async function officeDocumentList(params) {
    return request('/prod-api/an/gpt-folders', {
        method: "GET",
        params: {
            ...params
        }
    })
}

// 删除/an/delete-contract-management

export async function deletecontract(params) {
    return request('/prod-api/an/delete-contract-management', {
        method: 'DELETE',
        params: {
            ...params
        }
    })
}

// /an/contract-management-permission//全局权限
export async function contractManagementPermission() {
    return request('/prod-api/an/contract-management-permission', {
        method: 'GET',
    })
}

// /an/add-contract-permission 权限
export async function addcontract(params: any) {
    return request('/prod-api/an/gpt-assign-contract', {
        method: 'PUT',
        data: {
            ...params
        }
    })
}

export async function contractsPermissions(params) {
    return request('/prod-api/an/gpt-contracts-permissions', {
        method: "GET",
        params: {
            ...params
        }
    })
}

// /an/add-contract-permission//新增修改权限



// .zhian-api.com/api/an/office-contract-detail/{id} 详情
// export async function officeContractDetail(id: number) {
//     return request(`/prod-api/an/office-document-detail/${id}`, {
//         method: 'GET'
//     })
// }

// 店铺管理
export async function getStoreListPage(params) {
    return request('/prod-api/an/supplier/getStoreListPage', {
        method: "GET",
        params: {
            ...params
        }
    })
}

export async function getReportList(params) {
    return request('/prod-api/an/supplier/getReportList', {
        method: "GET",
        params: params
    })
}

export async function getStoreFloorImgList(params) {
    return request('/prod-api/an/supplier/getStoreFloorImgList', {
        method: "GET",
        params: {
            ...params
        }
    })
}

export async function getDeviceTemplateInfo() {
    return request('/prod-api/an/supplier/getDeviceTemplateInfo', {
        method: 'GET'
    })
}

export async function getDeviceInfo(params) {
    return request('/prod-api/an/supplier/getDeviceInfo', {
        method: "GET",
        params: {
            ...params
        }
    })
}

export async function createOrUpdateDevice(params) {
    return request('/prod-api/an/supplier/createOrUpdateDevice', {
        method: "POST",
        data: {
            ...params
        }
    })
}

export async function batchAssign(params) {
    return request('/prod-api/an/supplier/batch-assign', {
        method: "POST",
        data: {
            ...params
        }
    })
}

export async function createOrUpdateStore(params) {
    return request('/prod-api/an/supplier/createOrUpdateStore', {
        method: 'POST',
        data: {
            ...params
        }
    })
}

export async function getStoreInfo(params) {
    return request('/prod-api/an/supplier/getStoreInfo', {
        method: "GET",
        params: {
            ...params
        }
    })
}

export async function brandShopTemplate() {
    return request('/prod-api/brand/brand-shop-template', {
        method: "GET",
        responseType: 'arraybuffer'
    })
}

export async function assignWorkerPermissions(params) {
    return request('/prod-api/an/gpt-assign-worker-permissions', {
        method: "POST",
        data: {
            ...params
        }
    })
}

export async function getAssignWorkerPermissions(id) {
    return request(`/prod-api/an/gpt-get-assign-worker-permissions/${id}`, {
        method: "GET",
    })
}

export async function floorPlansCreate(params, id) {
    return request(`/prod-api/an/gpt-floor-plans-create/${id}`, {
        method: "POST",
        data: {
            ...params
        }
    })
}

export async function floorPlansByShop(id) {
    return request(`/prod-api/an/gpt-floor-plans-by-shop/${id}`)
}

export async function getWorkerScoreInfo(params) {
    return request('/prod-api/an/supplier/getWorkerScoreInfo', {
        method: "GET",
        params: {
            ...params
        }
    })
}


// 员工管理
export async function getEmployeeListPage(params) {
    return request('/prod-api/an/supplier/getEmployeeListPage', {
        method: "GET",
        params: {
            ...params
        }
    })
}

export async function getEmployeeInfo(id: any) {
    return request(`/prod-api/an/supplier/employee-info/${id}`, {
        method: "GET"
    })
}


export async function addEmployeeStore(params) {
    return request('/prod-api/an/supplier/employee-store', {
        method: "POST",
        data: {
            ...params
        }
    })
}

export async function departmentList(params) {
    return request('/prod-api/an/supplier/department/list', {
        method: "GET",
        params: {
            ...params
        }
    })
}

export async function saveEmployee(params) {
    return request('/prod-api/an/supplier/saveEmployee', {
        method: "POST",
        data: {
            ...params
        }
    })
}

export async function delEmployee(params) {
    return request('/prod-api/an/supplier/delEmployee', {
        method: 'POST',
        data: {
            ...params
        }
    })
}

export async function updateResignation(params) {
    return request('/prod-api/an/supplier/updateResignation', {
        method: "POST",
        data: {
            ...params
        }
    })
}

export async function exportEmployeeTmpl(params) {
    return request('/prod-api/an/supplier/exportEmployeeTmpl', {
        method: "GET",
        params: {
            ...params
        }
    })
}

export async function exportEmployee(params) {
    return request('/prod-api/an/supplier/exportEmployee', {
        method: "GET",
        params: {
            ...params
        }
    })
}

export async function importEmployee(params) {
    return request('/prod-api/an/supplier/importEmployee', {
        method: "POST",
        data: {
            ...params
        }
    })
}

export async function tmpToken(params) {
    return request('/prod-api/an/supplier/tmpToken', {
        method: "GET",
        params: {
            ...params
        }
    })
}

/**
 * 获取员工信息
 * @param params
 */
export async function getEmployee(params) {
    return request('/prod-api/an/supplier/getEmployee', {
        method: "GET",
        params: {
            ...params
        }
    })
}


