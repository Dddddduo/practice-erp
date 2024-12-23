/**
 * @name umi 的路由配置
 * @description 只支持 path,component,routes,redirect,wrappers,name,icon 的配置
 * @param path  path 只支持两种占位符配置，第一种是动态参数 :id 的形式，第二种是 * 通配符，通配符只能出现路由字符串的最后。
 * @param component 配置 location 和 path 匹配后用于渲染的 React 组件路径。可以是绝对路径，也可以是相对路径，如果是相对路径，会从 src/pages 开始找起。
 * @param routes 配置子路由，通常在需要为多个路径增加 layout 组件时使用。
 * @param redirect 配置路由跳转
 * @param wrappers 配置路由组件的包装组件，通过包装组件可以为当前的路由组件组合进更多的功能。 比如，可以用于路由级别的权限校验
 * @param name 配置路由的标题，默认读取国际化文件 menu.ts 中 menu.xxxx 的值，如配置 name 为 login，则读取 menu.ts 中 menu.login 的取值作为标题
 * @param icon 配置路由的图标，取值参考 https://ant.design/components/icon-cn， 注意去除风格后缀和大小写，如想要配置图标为 <StepBackwardOutlined /> 则取值应为 stepBackward 或 StepBackward，如想要配置图标为 <UserOutlined /> 则取值应为 user 或者 User
 * @doc https://umijs.org/docs/guides/routes
 */
export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './User/Login',
      },
    ],
  },
  {
    path: '/mobile',
    layout: false,
    routes: [
      {
        path: '/mobile/login',
        name: 'wxLogin',
        component: './Mobile/WXLogin',
      },
      {
        path: '/mobile/reimCount',
        name: 'reimCount',
        component: './Mobile/ReimCount',
      },
      {
        path: '/mobile/reimList',
        name: 'reimList',
        component: './Mobile/ReimList',
      },
      {
        path: '/mobile/reimInfo',
        name: 'reimInfo',
        component: './Mobile/ReimInfo',
      },
      {
        path: '/mobile/reportPDF',
        name: 'reportPDF',
        component: './Mobile/ReportPDF',
      },
    ],
  },
  {
    path: '/PDF',
    layout: false,
    routes: [
      {
        path: '/PDF/ReportPDF',
        name: 'report-pdf',
        component: './PDF/ReportPDF',
      },
      {
        path: '/PDF/quotation-summary-pdf',
        name: 'quotation-summary-pdf',
        component: './PDF/QuotationSummaryPdf',
      },
      {
        path: '/PDF/workerPDF',
        name: 'workerPDF',
        component: './PDF/WorkerPDF',
      },
      {
        path: '/PDF/PQIPDF',
        name: 'PQIPDF',
        component: './PDF/PQIPDF',
      },
      {
        path: '/PDF/quotation',
        name: 'quotationPdf',
        component: './PDF/QuotationPdf',
      },
    ],
  },
  {
    path: '/welcome',
    name: 'welcome',
    icon: 'smile',
    component: './Welcome',
  },
  // {
  //   path: '/contractManagementGpt',
  //   name: 'contractManagementGpt',
  //   component: './ContractManagement',
  // },
  {
    path: '/order',
    name: 'order',
    icon: 'table',
    routes: [
      // {
      //   path: '/order/Jdxhh',
      //   name: 'jdxhh',
      //   component: './Order/Jdxhh',
      // },
      {
        path: '/order/orderList',
        name: 'orderList',
        component: './Order/OrderList',
      },
      // 新的订单列表 完成报销单的处理
      {
        path: '/order/orderListNew',
        name: 'orderListNew',
        component: './Order/OrderListNew',
      },
      // 注释掉就找不到了
      {
        path: '/order/reimbursement',
        name: 'reimbursement',
        component: './Order/Reimbursement',
      },

      {
        path: '/order/reimbursementNew',
        name: 'reimbursementNew',
        component: './Order/ReimbursementNew',
      },

      {
        path: '/order/quotation',
        name: 'quotation',
        component: './Order/Quotation',
      },
      {
        path: '/order/report',
        name: 'report',
        component: './Order/Report',
      },
      {
        path: '/order/aggregateQuotes',
        name: 'aggregateQuotes',
        component: './Order/AggregateQuotes',
      },
      {
        path: '/order/fixedMonthly',
        name: 'fixedMonthly',
        component: './Order/FixedMonthly',
      },
      {
        path: '/order/constructionPersonnelInformation',
        name: 'constructionPersonnelInformation',
        component: './Order/ConstructionPersonnelInformation',
      },
      {
        path: '/order/MQI',
        name: 'MQI',
        component: './Order/MQI',
      },
      {
        path: '/order/workerStats',
        name: 'workerStats',
        component: './Order/WorkerStats',
      },
      {
        path: '/order/leadingProfitStatis',
        name: 'leadingProfitStatis',
        component: './Order/LeadingProfitStatis',
      },
      {
        path: '/order/workerProfitStatis',
        name: 'workerProfitStatis',
        component: './Order/WorkerProfitStatis',
      },
      {
        path: '/order/kpiWorker',
        name: 'kpiWorker',
        component: './Order/KpiWorker',
      },
      {
        path: '/order/waterLeakageRecords',
        name: 'waterLeakageRecords',
        component: './Order/WaterLeakageRecords',
      },
      {
        path: '/order/statistics',
        name: 'statistics',
        component: './Order/Statistics',
      },
    ],
  },

  {
    path: '/project',
    name: 'project',
    icon: 'table',
    routes: [
      {
        path: '/project/3DScan',
        name: 'scan3D',
        routes: [
          {
            path: '/project/3DScan/All',
            name: 'all',
            component: './Project/Scan3D/All',
          },
        ],
      },
      {
        path: '/project/mapOverview',
        name: 'mapOverview',
        routes: [
          {
            path: '/project/mapOverview/mapDetail',
            name: 'mapDetail',
            component: './Project/MapOverView/MapDetail',
          },
          {
            path: '/project/mapOverview/air',
            name: 'air',
            component: './Project/MapOverView/Air',
          },
        ],
      },
      {
        path: '/project/airConditioningControl',
        name: 'airConditioningControl',
        routes: [
          {
            path: '/project/airConditioningControl/warningEvent',
            name: 'warningEvent',
            component: './Project/AirConditioningControl/WarningEvent',
          },
          {
            path: '/project/airConditioningControl/eventSending',
            name: 'eventSending',
            component: './Project/AirConditioningControl/EventSending',
          },
        ],
      },
      {
        path: '/project/processControl',
        name: 'processControl',
        component: './Project/ProcessControl',
      },
      {
        path: '/project/PQI',
        name: 'PQI',
        component: './Project/PQI',
      },
      {
        path: '/project/projectPQI',
        name: 'projectPQI',
        component: './Project/ProjectPQI',
      },
      {
        path: '/project/fullPQI',
        name: 'fullPQI',
        component: './Project/FullPQI',
      },
      {
        path: '/project/weekly',
        name: 'weekly',
        component: './Project/Weekly',
      },
      {
        path: '/project/machineControl',
        name: 'machineControl',
        component: './Project/MachineControl',
      },
      {
        path: '/project/storeSelect',
        name: 'storeSelect',
        component: './Project/StoreSelect',
      }
    ],
  },

  {
    path: '/system',
    name: 'system',
    icon: 'user',
    routes: [
      {
        path: '/system/deviceManagement',
        name: 'deviceManagement',
        routes: [
          {
            path: '/system/deviceManagement/simCard',
            name: 'simCard',
            component: './System/DeviceManagement/SimCard',
          },
          {
            path: '/system/deviceManagement/simManagement',
            name: 'simManagement',
            component: './System/DeviceManagement/SimManagement',
          },
        ],
      },
      {
        path: '/system/clientAccountManagement',
        name: 'clientAccountManagement',
        component: './System/ClientAccountManagement',
      },
      {
        path: '/system/storeAccountManagement',
        name: 'storeAccountManagement',
        component: './System/StoreAccountManagement',
      },
      {
        path: '/system/lnventoryManagement',
        name: 'lnventoryManagement',
        routes: [
          {
            path: '/system/lnventoryManagement/productManagement',
            name: 'productManagement',
            component: './System/LnventoryManagement/ProductManagement',
          },
          {
            path: '/system/lnventoryManagement/warehouseManagement',
            name: 'warehouseManagement',
            component: './System/LnventoryManagement/WarehouseManagement',
          },
          {
            path: '/system/lnventoryManagement/lnventoryRequisition',
            name: 'lnventoryRequisition',
            component: './System/LnventoryManagement/LnventoryRequisition',
          },
          {
            path: '/system/lnventoryManagement/lnventoryList',
            name: 'lnventoryList',
            component: './System/LnventoryManagement/LnventoryList',
          },
          {
            path: '/system/lnventoryManagement/recordsOfOperations',
            name: 'recordsOfOperations',
            component: './System/LnventoryManagement/RecordsOfOperations',
          },
        ],
      },
      {
        path: '/system/workerManagement',
        name: 'workerManagement',
        component: './System/WorkerManagement',
      },
      {
        path: '/system/workersContracts',
        name: 'workersContracts',
        component: './System/WorkersContracts',
      },
      {
        path: '/system/typeManagement',
        name: 'typeManagement',
        component: './System/TypeManagement',
      },
      {
        path: '/system/workType',
        name: 'workType',
        component: './System/WorkType',
      },
      {
        path: '/system/brandManagement',
        name: 'brandManagement',
        component: './System/BrandManagement',
      },
      {
        path: '/system/mallManagement',
        name: 'mallManagement',
        component: './System/MallManagement',
      },
      {
        path: '/system/constructionHead',
        name: 'constructionHead',
        component: './System/ConstructionHead',
      },
      {
        path: '/system/feeBreakdown',
        name: 'feeBreakdown',
        component: './System/FeeBreakdown',
      },
      {
        path: '/system/corporateGovernance',
        name: 'corporateGovernance',
        component: './System/CorporateGovernance',
      },
      {
        path: '/system/supplierManagement',
        name: 'supplierManagement',
        component: './System/SupplierManagement',
      },
      {
        path: '/system/vendorAccount',
        name: 'vendorAccount',
        component: './System/VendorAccount',
      },
      {
        path: '/system/cityManagement',
        name: 'cityManagement',
        component: './System/CityManagement',
      },
      // WorkPlan
      {
        path: '/system/workPlan',
        name: 'workPlan',
        component: './System/WorkPlan',
      },
      {
        path: '/system/userManagement',
        name: 'userManagement',
        component: './System/UserManagement',
      },
      {
        path: '/system/pushManagement',
        name: 'pushManagement',
        routes: [
          {
            path: '/system/pushManagement/incidentManagement',
            name: 'incidentManagement',
            component: './System/PushManagement/IncidentManagement',
          },
          {
            path: '/system/pushManagement/userEventManagement',
            name: 'userEventManagement',
            component: './System/PushManagement/UserEventManagement',
          },
        ],
      },
      {
        path: '/system/storeManagement',
        name: 'storeManagement',
        component: './System/StoreManagement',
      },
    ],
  },

  {
    path: '/update',
    layout: false,
    component: './PersonnelManagement/EmployeeManagement/components/CreateOrUpdate',
  },

  {
    path: '/personnelManagement',
    name: 'personnelManagement',
    icon: 'table',
    routes: [
      {
        path: '/personnelManagement/performance',
        name: 'performance',
        routes: [
          {
            path: '/personnelManagement/performance/kpiAppraisalProject',
            name: 'kpiAppraisalProject',
            component: './PersonnelManagement/Performance/KPIAppraisalProject',
          },
          {
            path: '/personnelManagement/performance/kpiAssessmentForm',
            name: 'kpiAssessmentForm',
            component: './PersonnelManagement/Performance/KPIAssessmentForm',
          },
          {
            path: '/personnelManagement/performance/kpiScoring',
            name: 'kpiScoring',
            component: './PersonnelManagement/Performance/KPIScoring',
          },
          {
            path: '/personnelManagement/performance/kpiAllocationResults',
            name: 'kpiAllocationResults',
            component: './PersonnelManagement/Performance/KPIAllocationResults',
          },
        ],
      },
      {
        path: '/personnelManagement/employeeManagement',
        name: 'employeeManagement',
        component: './PersonnelManagement/EmployeeManagement',
      },
      {
        path: '/personnelManagement/contractManagement',
        name: 'contractManagement',
        component: './PersonnelManagement/ContractManagement',
      },
      {
        path: '/personnelManagement/systemManagement',
        name: 'systemManagement',
        routes: [
          {
            path: '/personnelManagement/systemManagement/documentList',
            name: 'documentList',
            component: './PersonnelManagement/SystemManagement/DocumentList',
          },
          {
            path: '/personnelManagement/systemManagement/permissionsManagement',
            name: 'permissionsManagement',
            component: './PersonnelManagement/SystemManagement/PermissionsManagement',
          },
        ],
      },
    ],
  },
  {
    path: '/personnelManagement/kpiScore',
    name: 'personKpiScore',
    layout: false,
    component: './PersonnelManagement/KpiScore',
  },
  {
    path: '/financialDepartment',
    name: 'financialDepartment',
    icon: 'table',
    routes: [
      {
        path: '/financialDepartment/reimbursementPayment',
        name: 'reimbursementPayment',
        routes: [
          {
            path: '/financialDepartment/reimbursementPayment/weekly',
            name: 'weekly',
            component: './FinancialDepartment/ReimbursementPayment',
          },
          {
            path: '/financialDepartment/reimbursementPayment/monthly',
            name: 'monthly',
            component: './FinancialDepartment/ReimbursementPayment',
          },
          {
            path: '/financialDepartment/reimbursementPayment/company',
            name: 'company',
            component: './FinancialDepartment/ReimbursementPayment',
          },
          {
            path: '/financialDepartment/reimbursementPayment/office',
            name: 'office',
            component: './FinancialDepartment/ReimbursementPayment',
          },
          {
            path: '/financialDepartment/reimbursementPayment/officeMonthlyReimbursement',
            name: 'officeMonthlyReimbursement',
            component: './FinancialDepartment/Office',
          },
        ],
      },
      {
        path: '/financialDepartment/corporatePayment',
        name: 'corporatePayment',
        component: './FinancialDepartment/CorporatePayment',
      },
      {
        path: '/financialDepartment/invoicingCollection',
        name: 'invoicingCollection',
        component: './FinancialDepartment/InvoicingCollection',
      },
      {
        path: '/financialDepartment/invoicingCollectionForFinance',
        name: 'invoicingCollectionForFinance',
        component: './FinancialDepartment/invoicingCollectionForFinance',
      },
      // {
      //   path: "/financialDepartment/officeMonthlyReimbursement",
      //   name: "officeMonthlyReimbursement",
      //   component: "./FinancialDepartment/Office"
      // },
    ],
  },

  {
    path: '/accessControl',
    name: 'accessControl',
    icon: 'control',
    routes: [
      {
        path: '/accessControl/menus',
        name: 'menus',
        // component: './AccessControl/Menus',
        component: './AccessControl/MenusReplace',
      },
      {
        path: '/accessControl/buttons',
        name: 'buttons',
        component: './AccessControl/Buttons',
      },
    ],
  },
  // {
  //   path: '/demo',
  //   name: 'demo',
  //   routes: [
  //     {
  //       path: '/demo/container',
  //       name: 'container',
  //       component: './Demo/Container'
  //     },
  //     {
  //       path: '/demo/drag',
  //       name: 'drag',
  //       routes: [
  //         {
  //           path: '/demo/drag/form',
  //           name: 'dragForm',
  //           component: './Demo/Drag/Form'
  //         },
  //         {
  //           path: '/demo/drag/state',
  //           name: 'dragState',
  //           component: './Demo/Drag/State'
  //         },
  //       ]
  //     }
  //   ]
  // },

  {
    path: '/',
    redirect: '/welcome',
  },
  {
    path: '*',
    layout: false,
    component: './404',
  },
];
