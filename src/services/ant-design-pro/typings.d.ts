// @ts-ignore
/* eslint-disable */

declare namespace API {
  type ResponseData = {
    code?: number;
    data?: {
      code?: number
      data?: any,
      msg?: string
    };
    msg?: string;
  }

  type CurrentUser = {
    id?: number;
    username?: string;
    username_en?: string;
    user_state?: string;
    tel?: string;
    role_id?: string;
    qy_wx_code?: string;
    position_en?: string;
    position?: string;
    is_email_receive?: number;
    gender?: string;
    e_id?: number;
    address?: string;
    address_en?: string;
    avatar?: string;
  };

  type LoginResult = {
    code?: number;
    data?: {
      code?: number
      data?: any,
      msg?: string
    };
    msg?: string;
  };

  type PageParams = {
    current: number;
    pageSize: number;
  };

  type ReimbursementListItem = {
    bill_ids?: any
    id?: number,
    back_id?: number
    reim_id?: number
    reim_status_value?: string
    reim_status_color?: string
    reim_back_id?: number,
    reim_no?: string
    create_at?: string,
    is_completed?: string,
    completed_at?: string,
    brand_id?: number,
    brand_en?: string,
    city_cn?: string,
    market_cn?: string,
    store_cn?: string,
    ma_type_cn?: string,
    ma_remark?: string,
    worker_price?: number,
    leader_price: number,
    sub_total?: number,
    reim_detail_list?: Array<any>,
    remark?: string,
    approve_remark?: string,
    pre_quote_status?: number,
    sign_file_list?: Array<any>,
    bill_file_list?: Array<any>,
    status?: string,
    is_advance?: string,
    completed_at?: string
  }

  type LeadingProfitStatisParams = {
    create_at?: string
  }
  type WorkerProfitStatisParams = {

  }

  type OrderListItem = {
    ma_item_id?: number
    details?: {
      ma_cate_cn?: string
      ma_item_supplier_id?: number
      ma_prob_desc?: string
    }
    assign?: {
      value: string
    }
    reim_info?: {
      reim_no: string
      value: string
      color: string
      completed_at: string
      reim_worker_detail_list: Array
    }
    report_list?: Array
    quo_no?: string
    quo_status?: string
    report?: {
      value?: string
    }
  }


  type QuotationParams = {
    appendix_no?: string
    class_type?: string
    status_color?: string
    create_at?: string
    completion_at?: string
    quo_back_id?: string
    is_merge: number
  }

  type FixedMonthlyParams = {

  }

  type ConstructionPersonnelInformationParams = {
    leader_name: string
    leader_mobile: string
    leader_id_card_no: string
  }

  type FinancialReimbursementParams = {
    create_uid: number
    create_palt_cn: string
    create_name_cn: string
    create_at: string
    approve_at: string
    department: string
    type: string
    trd_no: string
    status: string
    detail_list
  }

  type OfficeParams = {
    show_with_button: boolean
    show_without_button: boolean
    with_invoice_payment_at: string
    without_invoice_payment_at: string
    with_invoice_payment_list: Array
    without_invoice_payment_list: Array
  }

  type FileTableParams = {

  }

  type KpiWorkerParams = {
    info: {
      score_index: string
      rate: string
      content: string
    }[]
  }

  type UpdateStepSyncParams = {
    desc: string;
    image_after: string;
    image_before: string;
    image_list: string;
    report_detail_step_id: number;
    video_after: string;
    video_before: string;
    video_list: string;
  };

  type LockReportStatusParams = {
    report_id: number;
    report_lock_status: string;
  }

  type ReportListItem = {
    id?: number;
    report_no?: string;
    report_tid?: number;
    lock_status?: string;
    report_title?: string;
    href?: string;
    avatar?: string;
    name?: string;
    owner?: string;
    desc?: string;
    callNo?: number;
    status?: number;
    updatedAt?: string;
    createdAt?: string;
    progress?: number;
    supplier_order_no?: string,
    store_cn?: string,
    brand_en?: string,
    appo_task_id?: number;
  };

  type AggregateQuotesParams = {
    quo_merge_id?: number
    total_price_sum?: string
    total_profit_price?: string
    brand_id?: number
    type?: string
    gucci_free_20?: number
    create_at?: string
  }

  type WarningEventParams = {
    center: any
    is_clear: number
    created_at: string
    update_at: string
  }

  type PQI = {
    center: any
  }

  type WaterLeakageRecordsParams = {
    report_at: string
    brand: {
      brand_en: string
    }
    city: {
      city: string
    }
    store: {
      name: string
    }
    worker: {
      name: string
    }
  }

  type EmployeeManagementParams = {
    id: number
    entry_at: string
    logs: {}[]
  }

  type EventSendingParams = {
    center: any
  }


  type ClientAccountManagement = {
    center: any
    status: any
  }

  type StoreAccountManagement = {
    center: any
  }

  type StoreManagement = {

  }

  type ProductManagement = {
    center: any
  }

  type WarehouseManagement = {
    center: any
  }

  type LnventoryRequisition = {
    center: any
  }

  type ProcessControl = {
    center: any
  }

  type LnventoryList = {
    center: any
  }

  type RecordsOfOperations = {
    center: any
  }
  type WorkerManagement = {
    center: any
    certificate_list: {
      id_card: string
      health_report: string
      bank_info: string
      electrician_certificate: string
      high_altitude_certificate: string
      refrigeration_certificate: string
      policy: string
    }
    worker_score_list: {
      count: number
      wxzl: number
      wxsd: number
      fwtd: number
      smzsd: number
      yryb: number
    }
    worker_status: number
  }
  type WorkersContracts = {
    center: any
  }
  type TypeManagement = {
    center: any
  }
  type WorkType = {
    center: any
  }
  type BrandManagement = {
    center: any
    contacts: any
    logo_url: string
    logo_original_name: string
    brandname: string
    brandname_en: string
    brand: string
    brand_en_all: string
    address: string
    address_en: string
    administrative_cost_rate: string
    profit_rate_warn: string
  }
  type MallManagement = {
    center: any
  }
  type ConstructionHead = {
    center: any
  }
  type ContractManagement = {
    // center:any
    number: string
    start_date: string
    end_date: string
    signing_date: string
  }
  type FeeBreakdown = {
    center: any
  }
  type CorporateGovernance = {
    center: any;
  }
  type SupplierManagement = {
    center: any
  }
  type VendorAccount = {
    center: any
  }
  type CityManagement = {
    center: any
  }
  type WorkPlan = {
    center: any
  }

  type RuleListItem = {
    id?: number,
    key?: number;
    disabled?: boolean;
    href?: string;
    avatar?: string;
    name?: string;
    owner?: string;
    desc?: string;
    callNo?: number;
    status?: number;
    updatedAt?: string;
    createdAt?: string;
    progress?: number;
    cost?: string;
    ex_total_price?: string;
    profit_price?: string
  };

  type RuleList = {
    data?: RuleListItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type FakeCaptcha = {
    code?: number;
    status?: string;
  };

  type FormattedResponse = {
    data?: any;
    success?: boolean;
    message?: string;
  }

  type LoginParams = {
    username?: string;
    password?: string;
    autoLogin?: boolean;
    type?: string;
  };

  type ErrorResponse = {
    /** 业务约定的错误码 */
    errorCode: string;
    /** 业务上的错误信息 */
    errorMessage?: string;
    /** 业务上的请求是否成功 */
    success?: boolean;
  };

  type NoticeIconList = {
    data?: NoticeIconItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type NoticeIconItemType = 'notification' | 'message' | 'event';

  type NoticeIconItem = {
    id?: string;
    extra?: string;
    key?: string;
    read?: boolean;
    avatar?: string;
    title?: string;
    status?: string;
    datetime?: string;
    description?: string;
    type?: NoticeIconItemType;
  };

  type ScanCurrentMessage = {
    id?: number;
    brand_id?: number,
    brand_en?: string;
    city_id?: number,
    city_cn?: string;
    market_id?: number,
    market_cn?: string;
    store_id?: number,
    store_cn?: string;
    store_area?: string;
    url?: string;
    bg_file_id: number,
    bg_file_url_thumb: string,
    bg_file_url_enough: string,
    status?: number;
    scan_at?: string;
    completed_at?: string;
  }

  type UserManagement = {
    user_id?: number;
    username?: string;
    username_en?: string;
    gender?: string;
    user_role?: Array;
    position?: string;
    department?: string;
    tel?: string;
    email?: string;
    is_email_receive?: number;
    id_number?: string;
    address?: string;
    hire_date?: string;
    due_date?: string;
    user_state?: number;
  };

  type UserListItem = {
    user_id?: number;
    username?: string;
    username_en?: string;
    gender?: string;
    user_role?: Array;
    position?: string;
    department?: string;
    tel?: string;
    email?: string;
    is_email_receive?: number;
    id_number?: string;
    address?: string;
    hire_date?: string;
    due_date?: string;
    user_state?: number;
    qy_wx_code?: string;
  };

  type MaintenanceDepartmentParams = {
    detail_list: {
      id: number
      company_name: string
      seller_company_cn: string
      amount: number
      coll_yes_or_no: string
      income_at: string
      guess_income_at: string
      invoice_at: string
      invoice_no: string
    }[]
    type: string
    tax_rate: string
    trd_no: string
    status_cn: string
    create_at: string
  }
  type ReimbursementStatisticsParams = {

  }

  type MenusListParams = {

  }

  type SimParams = {
    status: number
  }

  type CorporatePaymentParams = {
    payment_at: string
    trd_no: string
    index: number
    coll_name: string
    rowSpan: number
    remark: string
    tax_rate: string
    file_ids: string
    payment_file_ids: string
    company: {
      cn: string
    }
    coll_company: {
      bank_name: string
      bank_no: string
    }
  }

  type WeeklyListItem = {
    id?: number
    brand_id?: number
    brand_en?: string
    city_cn?: string
    market_cn?: string
    store_cn?: string
    project_start_at?: string
    project_end_at?: string
    create_at?: string
  }
}

declare namespace HANDLE {
  type ImageBeforeAfter = {
    sourceType: string;
    workerUid?: number;
    detailId?: number;
    stepId?: number;
    stepSortIndex?: number;
    detailTitle?: string;
  }
}
