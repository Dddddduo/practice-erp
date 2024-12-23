import SubmitButton from "@/components/Buttons/SubmitButton";
import UploadFiles from "@/components/UploadFiles";
import { addEmployeeStore, getEmployeeInfo, departmentAll } from "@/services/ant-design-pro/system";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Form, Tabs, Input, Radio, DatePicker, Select, Space, Button, InputNumber, Cascader, message, Card } from "antd";
import dayjs from "dayjs";
import { isEmpty } from "lodash";
import { useEffect, useState } from "react";
import { useLocation } from "umi";

interface Props {
  eID: number,
  actionRef: any;
  handleCloseCreateOrUpdate: () => void
}

const CreateOrUpdate: React.FC<Props> = ({
  eID,
  actionRef,
  handleCloseCreateOrUpdate,
}) => {
  const [messageApi, contextHolder] = message.useMessage();
  const { TextArea } = Input;
  const [form] = Form.useForm()
  const [tabKey, setTabKey] = useState('base_info')
  const dayFormat = 'YYYY-MM-DD'
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query_id = queryParams.get('id');
  const chineseZodiacList: any = [
    { value: '鼠', label: '鼠' },
    { value: '牛', label: '牛' },
    { value: '虎', label: '虎' },
    { value: '兔', label: '兔' },
    { value: '龙', label: '龙' },
    { value: '蛇', label: '蛇' },
    { value: '马', label: '马' },
    { value: '羊', label: '羊' },
    { value: '猴', label: '猴' },
    { value: '鸡', label: '鸡' },
    { value: '狗', label: '狗' },
    { value: '猪', label: '猪' },
  ]

  const birthStatus: any = [
    { value: '已育', label: '已育' },
    { value: '未育', label: '未育' }
  ]

  const zodiacList: any = [
    { value: '白羊座', label: '白羊座' },
    { value: '金牛座', label: '金牛座' },
    { value: '双子座', label: '双子座' },
    { value: '巨蟹座', label: '巨蟹座' },
    { value: '狮子座', label: '狮子座' },
    { value: '处女座', label: '处女座' },
    { value: '天秤座', label: '天秤座' },
    { value: '天蝎座', label: '天蝎座' },
    { value: '射手座', label: '射手座' },
    { value: '摩羯座', label: '摩羯座' },
    { value: '水瓶座', label: '水瓶座' },
    { value: '双鱼座', label: '双鱼座' },
  ];

  const manageCityList: any = [
    {
      value: '总部',
      label: '总部'
    },
    {
      value: '分城市',
      label: '分城市'
    },
  ]

  const contractTypeLList: any = [
    {
      value: '固定期限劳动合同',
      label: '固定期限劳动合同'
    },
    {
      value: '无固定期限劳动合同',
      label: '无固定期限劳动合同'
    },
    {
      value: '以完成一定工作任务为期限的劳动合同',
      label: '以完成一定工作任务为期限的劳动合同'
    },
    {
      value: '实习协议',
      label: '实习协议'
    },
    {
      value: '劳务合同',
      label: '劳务合同'
    },
    {
      value: '劳务派遺合同',
      label: '劳务派遺合同'
    },
    {
      value: '返聘协议',
      label: '返聘协议'
    },
    {
      value: '竞业协议',
      label: '竞业协议'
    },
    {
      value: '保密协议',
      label: '保密协议'
    },
  ]

  const contractStatusList: any = [
    {
      value: '未生效',
      label: '未生效',
    },
    {
      value: '履行中',
      label: '履行中',
    },
    {
      value: '过期',
      label: '过期',
    },
    {
      value: '中止',
      label: '中止',
    }
  ]

  const mainContractList: any = [
    {
      value: '是',
      label: '是',
    },
    {
      value: '否',
      label: '否',
    }
  ]

  const newContinueList: any = [
    {
      value: '新签',
      label: '新签',
    },
    {
      value: '续签',
      label: '续签',
    }
  ]

  const [departmentList, setDepartmentList] = useState([])

  const firstContractObject = [
    {
      value: '上海置安消防水电装修有限公司',
      label: '上海置安消防水电装修有限公司',
    },
    {
      value: '上海置安工程设备技术服务有限公司',
      label: '上海置安工程设备技术服务有限公司',
    },
    {
      value: '上海置安建筑装饰设计工程有限公司',
      label: '上海置安建筑装饰设计工程有限公司',
    },
    {
      value: '上海创升装饰设计工程有限公司',
      label: '上海创升装饰设计工程有限公司',
    },
    {
      value: '上海桉仁源系统服务有限公司',
      label: '上海桉仁源系统服务有限公司',
    },
  ]

  const becomeWorkerStatusList = [
    {
      value: '已转正',
      label: '已转正',
    },
    {
      value: '未转正',
      label: '未转正',
    }
  ]

  const statusList = [
    {
      value: '在职',
      label: '在职',
    },
    {
      value: '离职',
      label: '离职',
    },
  ]

  const educationModeList = [
    {
      value: '全日制',
      label: '全日制',
    },
    {
      value: '非全日制',
      label: '非全日制',
    }
  ]


  const tabList: any = [
    {
      key: 'base_info',
      label: '基本信息'
    },
    {
      key: 'communication_info',
      label: '通讯信息'
    },
    {
      key: 'account_info',
      label: '账号信息'
    },
    {
      key: 'educational_experience',
      label: '教育经历'
    },
    {
      key: 'work_experience',
      label: '工作经历'
    },
    {
      key: 'contact',
      label: '紧急联系人'
    },
    {
      key: 'children',
      label: '子女信息'
    },
    {
      key: 'job_info',
      label: '岗位信息'
    }
  ]

  const onTabChange = (e: any) => {
    console.log('打印', e);
    setTabKey(e)
  }

  const handleFinish = (value: any) => {
    const birthday = !isEmpty(value.birthday) ? dayjs(value.birthday).format(dayFormat) : ''
    const admission_at = !isEmpty(value.admission_at) ? dayjs(value.admission_at).format(dayFormat) : ''
    const exit_at = !isEmpty(value.exit_at) ? dayjs(value.exit_at).format(dayFormat) : ''

    let base_info = {
      name: value.name ?? '',
      gender: value.gender ?? '',
      en_name: value.en_name ?? '',
      nationality: value.nationality ?? '',
      country_of_birth: value.country_of_birth ?? '',
      id_card_imgs: value.id_card_imgs ?? '',
      birthday: birthday,
      chinese_zodiac: value.chinese_zodiac ?? '',
      national: value.national ?? '',
      birth_status: value.birth_status ?? '',
      admission_at: admission_at,
      si: value.si ?? '',
      marital_status: value.marital_status ?? '',
      resume_file_id: value.resume_file_id ?? '',
      img_id: value.img_id ?? '',
      id_card_no: value.id_card_no ?? '',
      native_place: value.native_place ?? '',
      zodiac: value.zodiac ?? '',
      politics_status: value.politics_status ?? '',
      illegal: value.illegal ?? '',
      exit_at: exit_at,
      medical_history: value.medical_history ?? '',
      rmo: value.rmo ?? ''
    }

    // console.log('打印base_info✅', base_info,);

    const residence_permit_at = !isEmpty(value.residence_permit_at) ? dayjs(value.residence_permit_at).format(dayFormat) : ''
    const residence_permit_end = !isEmpty(value.residence_permit_end) ? dayjs(value.residence_permit_end).format(dayFormat) : ''

    let communication_info = {
      qq: value.qq ?? '',
      wechat: value.wechat ?? '',
      email: value.email ?? '',
      mobile: value.mobile ?? '',
      address: value.address ?? '',
      residence_address: value.residence_address ?? '',
      residence_city: value.residence_city ?? '',
      residence_permit_at: residence_permit_at,
      residence_permit_end: residence_permit_end,
    }

    // console.log('打印communication_info✅', communication_info,);

    let account_info = {
      social_security_pc_no: value.social_security_pc_no ?? '',
      provident_fund_account: value.provident_fund_account ?? '',
      bank_card_no: value.bank_card_no ?? '',
      bank: value.bank ?? ''
    }

    // console.log('打印account_info✅', account_info,);

    let educational_experience = {
      highest_degree: !isEmpty(value.highest_degree) ? value.highest_degree : '',
      educational_experience: [],
      certs: []
    }

    if (!isEmpty(value.educational_experience)) {
      for (let i = 0; i < value.educational_experience.length; i++) {
        let item = value.educational_experience[i]

        item.id = item.id ?? ''
        item.graduate_school = item.graduate_school ?? ''
        item.graduate = item.graduate ?? ''
        item.education_background = item.education_background ?? ''
        item.education_mode = item.education_mode ?? ''
        item.is_highest = item.is_highest ?? ''
        item.first = item.first ?? ''

        item.graduation_at = !isEmpty(item.graduation_at) ? dayjs(item.graduation_at).format(dayFormat) : ''
        item.admission_at = !isEmpty(item.admission_at) ? dayjs(item.admission_at).format(dayFormat) : ''
        item.graduate_cert = item.graduate_cert ?? ''
        item.diploma = item.diploma ?? ''

        educational_experience.educational_experience.push(item)
      }
    }

    if (!isEmpty(value.certs)) {
      for (let i = 0; i < value.certs.length; i++) {
        let item = value.certs[i]

        item.id = item.id ?? ''
        item.name = item.name ?? ''
        item.no = item.no ?? ''
        item.remark = item.remark ?? ''

        item.begin = !isEmpty(item.begin) ? dayjs(item.begin).format(dayFormat) : ''
        item.end = !isEmpty(item.end) ? dayjs(item.end).format(dayFormat) : ''
        item.img_id = item.img_id ?? ''

        educational_experience.certs.push(item)
      }
    }

    // console.log('打印educational_experience✅', educational_experience,);


    let work_experience = {
      last_company: !isEmpty(value.last_company) ? value.last_company : '',
      work_experience: [],
    }

    if (!isEmpty(value.work_experience)) {
      for (let i = 0; i < value.work_experience.length; i++) {
        let item = value.work_experience[i]

        item.id = item.id ?? '';
        item.post = item.post ?? '';
        item.witness_tel = item.witness_tel ?? '';
        item.has_competition = item.has_competition ?? '';
        item.remark = item.remark ?? '';
        item.is_employed = item.is_employed ?? '';
        item.witness = item.witness ?? '';
        item.reason = item.reason ?? '';
        item.companny = item.companny ?? '';

        item.begin = !isEmpty(item.begin) ? dayjs(item.begin).format(dayFormat) : ''
        item.end = !isEmpty(item.end) ? dayjs(item.end).format(dayFormat) : ''
        work_experience.work_experience.push(item)
      }
    }

    // console.log('打印work_experience✅', work_experience,);

    let emergency_contact = {
      contact: [],
    }

    if (!isEmpty(value.contact)) {
      for (let i = 0; i < value.contact.length; i++) {
        let item = value.contact[i]

        item.name = item.name ?? '';
        item.tel = item.tel ?? '';
        item.is_urgent = item.is_urgent ?? '';
        item.job = item.job ?? '';
        item.company = item.company ?? '';
        item.relation = item.relation ?? '';

        emergency_contact.contact.push(item)
      }
    }


    // console.log('打印work_experience✅', work_experience,);

    let children_info = {
      children_info: []
    }

    if (!isEmpty(value.children_info)) {
      for (let i = 0; i < value.children_info.length; i++) {
        let item = value.children_info[i]

        item.name = item.name ?? '';
        item.gender = item.gender ?? '';
        item.birthday = !isEmpty(item.birthday) ? dayjs(item.birthday).format(dayFormat) : '';
        item.id_card_no = item.id_card_no ?? '';
        item.cert = item.cert ?? '';

        children_info.children_info.push(item)
      }
    }

    console.log('打印children_info✅', children_info,);

    const entry_at = !isEmpty(value.entry_at) ? dayjs(value.entry_at).format(dayFormat) : ''
    const probation_period_end = !isEmpty(value.probation_period_end) ? dayjs(value.probation_period_end).format(dayFormat) : ''
    const full_at = !isEmpty(value.full_at) ? dayjs(value.full_at).format(dayFormat) : ''

    let job_info = {
      entry_at: entry_at,
      work_email: value.work_email ?? '',
      probation_period_end: probation_period_end,
      full_at: full_at,
      full_status: value.full_status ?? '',
      status: value.status ?? '',
      department: value.department ?? '',
      post: value.post ?? '',
      manage_type: value.manage_type ?? '',
      job_no: value.job_no ?? '',
      report_to: value.report_to ?? '',
      hrbp: value.hrbp ?? '',
      mentor: value.mentor ?? '',
      level: value.level ?? '',
      cost_center: value.cost_center ?? '',
      serving_age: value.serving_age ?? '',
      work_city: value.work_city ?? '',
      tax_city: value.tax_city ?? '',
      contract: [],
      recruitment: {
        type: value.type ?? '',
        channel: value.channel ?? '',
        referrer: value.referrer ?? '',
        other_channel: value.other_channel ?? '',
      }
    }


    if (!isEmpty(value.contract)) {
      for (let i = 0; i < value.contract.length; i++) {
        let item = value.contract[i]

        item.no = item.no ?? '';
        item.main = item.main ?? '';
        item.first_type = item.first_type ?? '';
        item.first_subject = item.first_subject ?? '';
        item.time_limit = item.time_limit ?? '';
        item.status = item.status ?? '';
        item.num = item.num ?? '';
        item.sign_type = item.sign_type ?? '';
        item.remark = item.remark ?? '';
        item.file = item.file ?? '';


        item.first_begin = !isEmpty(item.first_begin) ? dayjs(item.first_begin).format(dayFormat) : ''
        item.first_end = !isEmpty(item.first_end) ? dayjs(item.first_end).format(dayFormat) : ''
        item.sign_at = !isEmpty(item.sign_at) ? dayjs(item.sign_at).format(dayFormat) : ''

        job_info.contract.push(item)
      }
    }

    console.log('打印job_info✅', job_info,);


    const params = {
      base_info: base_info,
      communication_info: communication_info,
      account_info: account_info,
      educational_experience: educational_experience,
      work_experience: work_experience,
      emergency_contact: emergency_contact,
      children_info: children_info,
      job_info: job_info
    }

    if (eID != null && eID != undefined && eID > 0) {
      params['id'] = eID
    }

    if (query_id != null && query_id != undefined && Number(query_id) > 0) {
      params['id'] = query_id
    }

    console.log('打印总✅', params);

    addEmployeeStore(params).then(res => {
      console.log('结果', res);

      if (res.success) {
        if (query_id != null && query_id != undefined && Number(query_id) > 0) {
          success('修改成功')
          return
        }

        handleCloseCreateOrUpdate() // 关闭
        actionRef.current?.reload()
        if (eID != null && eID != undefined && eID > 0) {
          success('修改成功')
        } else {
          success('添加成功')
        }
        return
      } else {
        error(res.message ?? '请求失败')
      }

    })
  }

  const success = (text: string) => {
    messageApi.open({
      type: 'success',
      content: text,
    });
  };


  const renderButtons = () => {

    const isQuery = query_id != null && query_id != undefined && Number(query_id) > 0

    return (
      <div style={{ textAlign: 'end', padding: isQuery ? 30 : 0 }}>
        <Space>
          <Button type="primary" onClick={handlePrevious} disabled={tabKey == 'base_info'}>上一页</Button>
          <Button type="primary" onClick={handleNext} disabled={tabKey == 'job_info'}>下一页</Button>
          <SubmitButton type="primary" form={form}>提交</SubmitButton>
        </Space>
      </div>
    )
  }

  const handlePrevious = () => {
    const index = tabList.findIndex(tab => tab.key === tabKey);
    if (index > 0) {
      setTabKey(tabList[index - 1].key)
    }
  }

  const handleNext = () => {
    console.log('点击下一页');

    const index = tabList.findIndex(tab => tab.key === tabKey);
    if (index != -1) {
      setTabKey(tabList[index + 1].key)
    }
  }

  const renderBasicInfo = () => {
    return (
      <div style={{ display: 'flex' }}>
        <div style={{ width: '40%' }}>
          <Form.Item label="名称" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item label="性别" name="gender">
            <Radio.Group>
              <Radio value={'male'}>男</Radio>
              <Radio value={'female'}>女</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="英文名" name="en_name">
            <Input />
          </Form.Item>

          <Form.Item label="国籍" name="nationality">
            <Input />
          </Form.Item>

          <Form.Item label="出生国家" name="country_of_birth">
            <Input />
          </Form.Item>

          <Form.Item label="身份证照" name="id_card_imgs">
            <UploadFiles fileLength={2} />
          </Form.Item>

          <Form.Item label="出生日期" name="birthday">
            <DatePicker />
          </Form.Item>

          <Form.Item label="属相" name="chinese_zodiac">
            <Select options={chineseZodiacList} />
          </Form.Item>

          <Form.Item label="民族" name="national">
            <Input />
          </Form.Item>

          <Form.Item label="生育状态" name="birth_status">
            <Select options={birthStatus} />
          </Form.Item>

          <Form.Item label="入党时间" name="admission_at">
            <DatePicker />
          </Form.Item>

          <Form.Item label="自我介绍" name="si">
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item label="有无重大病史" name="medical_history">
            <Input />
          </Form.Item>

          <Form.Item label="简历" name="resume_file_id">
            <UploadFiles fileLength={1} />
          </Form.Item>
        </div>

        <div style={{ width: '40%', marginLeft: '60px' }}>
          <Form.Item label="员工照片" name="img_id">
            <UploadFiles />
          </Form.Item>

          <Form.Item label="身份证号" name="id_card_no">
            <Input />
          </Form.Item>

          <Form.Item label="籍贯" name="native_place">
            <Input />
          </Form.Item>
          <Form.Item label="星座" name="zodiac">
            <Select options={zodiacList} />
          </Form.Item>

          <Form.Item label="婚姻状态" name="marital_status">
            <Input />
          </Form.Item>

          <Form.Item label="政治面貌" name="politics_status">
            <Input />
          </Form.Item>

          <Form.Item label="存档机构" name="rmo">
            <Input />
          </Form.Item>

          <Form.Item label="有无违法违纪行为" name="illegal">
            <Input />
          </Form.Item>

          <Form.Item label="离职时间" name="exit_at">
            <DatePicker />
          </Form.Item>

        </div>

      </div>

    )
  }

  const renderCommunicationInfo = () => {
    return (
      <div style={{ display: 'flex' }}>
        <div style={{ width: '40%' }}>
          <Form.Item label="QQ号" name="qq">
            <Input />
          </Form.Item>

          <Form.Item label="个人邮箱" name="email">
            <Input />
          </Form.Item>

          <Form.Item label="户籍地址" name="address">
            <Input />
          </Form.Item>

          <Form.Item label="居住证城市" name="residence_city">
            <Input />
          </Form.Item>

          <Form.Item label="居住证截止日期" name="residence_permit_end">
            <DatePicker />
          </Form.Item>
        </div>

        <div style={{ width: '40%', marginLeft: '60px' }}>
          <Form.Item label="微信号" name="wechat">
            <Input />
          </Form.Item>

          <Form.Item label="联系手机" name="mobile">
            <Input />
          </Form.Item>

          <Form.Item label="现居地" name="residence_address">
            <Input />
          </Form.Item>

          <Form.Item label="居住证办理日期" name="residence_permit_at">
            <DatePicker />
          </Form.Item>
        </div>
      </div >
    )
  }

  const renderAccountInfo = () => {
    return (
      <div style={{ display: 'flex' }}>
        <div style={{ width: '40%' }}>
          <Form.Item label="社保电脑号" name="social_security_pc_no">
            <Input />
          </Form.Item>

          <Form.Item label="银行卡号" name="bank_card_no">
            <Input />
          </Form.Item>
        </div>

        <div style={{ width: '40%', marginLeft: '60px' }}>
          <Form.Item label="公积金账号" name="provident_fund_account">
            <Input />
          </Form.Item>

          <Form.Item label="开户行" name="bank">
            <Input />
          </Form.Item>
        </div>
      </div>
    )
  }


  const renderEducationalExperience = () => {
    return (
      <div>
        <Form.Item label="最高学历" name="highest_degree" labelCol={{ span: 5 }} wrapperCol={{ span: 6 }}>
          <Input />
        </Form.Item>

        <Form.List
          name="educational_experience"
        >
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <div key={key} style={{ borderRadius: 8, boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)', paddingTop: 30, marginBottom: 30 }}>

                  <div style={{ display: 'flex', }}>
                    <div style={{ width: '40%', }}>
                      <Form.Item
                        {...restField}
                        name={[name, 'id']}
                        label='教育序号'
                      >
                        <Input />
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, 'graduate']}
                        label='专业'
                      >
                        <Input />
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, 'education_mode']}
                        label='教育方式'
                      >
                        <Select options={educationModeList} />
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, 'graduation_at']}
                        label='毕业时间'
                      >
                        <DatePicker />
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, 'diploma']}
                        label='学位证书'
                      >
                        <UploadFiles fileLength={1} />
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, 'first']}
                        label='第一学历'
                      >
                        <Radio.Group>
                          <Radio value={1}>是</Radio>
                          <Radio value={0}>否</Radio>
                        </Radio.Group>
                      </Form.Item>
                    </div>

                    <div style={{ width: '40%' }}>
                      <Form.Item
                        {...restField}
                        name={[name, 'graduate_school']}
                        label='毕业院校'
                      >
                        <Input />
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, 'education_background']}
                        label='学历'
                      >
                        <Input />
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, 'admission_at']}
                        label='入学时间'
                      >
                        <DatePicker />
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, 'is_highest']}
                        label='是否最高学历'
                      >
                        <Radio.Group>
                          <Radio value={1}>是</Radio>
                          <Radio value={0}>否</Radio>
                        </Radio.Group>
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, 'graduate_cert']}
                        label='毕业证书'
                      >
                        <UploadFiles fileLength={1} />
                      </Form.Item>

                    </div>

                    <Form.Item>
                      <MinusCircleOutlined onClick={() => remove(name)} style={{ marginLeft: 20, fontSize: 18, color: 'red' }} />
                    </Form.Item>
                  </div>
                </div>
              ))}


              <Form.Item>
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  添加
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <div>
          <div style={{ fontSize: 20, marginBottom: 20 }}>证书</div>
          <Form.List
            name="certs"
          >
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <div key={key} style={{ borderRadius: 8, boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)', paddingTop: 30, marginBottom: 30 }}>
                    <div style={{ display: 'flex', }}>
                      <div style={{ width: '40%' }}>
                        <Form.Item
                          {...restField}
                          name={[name, 'id']}
                          label='证书序号'
                        >
                          <Input />
                        </Form.Item>

                        <Form.Item
                          {...restField}
                          name={[name, 'no']}
                          label='证书编号'
                        >
                          <Input />
                        </Form.Item>

                        <Form.Item
                          {...restField}
                          name={[name, 'end']}
                          label='证书失效日期'
                        >
                          <DatePicker />
                        </Form.Item>

                        <Form.Item
                          {...restField}
                          name={[name, 'img_id']}
                          label='证书照片'
                        >
                          <UploadFiles fileLength={1} />
                        </Form.Item>
                      </div>

                      <div style={{ width: '40%' }}>
                        <Form.Item
                          {...restField}
                          name={[name, 'name']}
                          label='证书名称'
                        >
                          <Input />
                        </Form.Item>

                        <Form.Item
                          {...restField}
                          name={[name, 'begin']}
                          label='证书起始日期'
                        >
                          <DatePicker />
                        </Form.Item>

                        <Form.Item
                          {...restField}
                          name={[name, 'remark']}
                          label='证书备注'
                        >
                          <Input />
                        </Form.Item>
                      </div>

                      <Form.Item>
                        <MinusCircleOutlined onClick={() => remove(name)} style={{ marginLeft: 20, fontSize: 18, color: 'red' }} />
                      </Form.Item>
                    </div>
                  </div>
                ))}

                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    添加
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </div>
      </div>
    )
  }

  const renderWorkExperience = () => {
    return (
      <div>
        <Form.Item label="上家公司" name="last_company" labelCol={{ span: 5 }} wrapperCol={{ span: 6 }}>
          <Input />
        </Form.Item>

        <Form.List
          name="work_experience"
        >
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <div key={key} style={{ borderRadius: 8, boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)', paddingTop: 30, paddingLeft: 30, marginBottom: 30 }}>
                  <div style={{ display: 'flex' }}>
                    <div style={{ width: '40%' }}>
                      <Form.Item
                        {...restField}
                        name={[name, 'id']}
                        label='工作序号'
                      >
                        <Input />
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, 'post']}
                        label='曾任职位'
                      >
                        <Input />
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, 'end']}
                        label='受雇结束时间'
                      >
                        <DatePicker />
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, 'has_competition']}
                        label='有无竞业禁止'
                      >
                        <Radio.Group>
                          <Radio value={1}>是</Radio>
                          <Radio value={0}>否</Radio>
                        </Radio.Group>
                      </Form.Item>


                      <Form.Item
                        {...restField}
                        name={[name, 'witness_tel']}
                        label='证明人联系电话'
                      >
                        <Input />
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, 'remark']}
                        label='备注'
                      >
                        <Input />
                      </Form.Item>
                    </div>

                    <div style={{ width: '40%', marginLeft: 30 }}>
                      <Form.Item
                        {...restField}
                        name={[name, 'companny']}
                        label='曾受雇公司'
                      >
                        <Input />
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, 'begin']}
                        label='受雇开始时间'
                      >
                        <DatePicker />
                      </Form.Item>

                      {/* <Form.Item
                        {...restField}
                        name={[name, 'reason']}
                        label='更换工作原因'
                      >
                        <Input />
                      </Form.Item> */}

                      <Form.Item
                        {...restField}
                        name={[name, 'witness']}
                        label='证明人'
                      >
                        <Input />
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, 'is_employed']}
                        label='最后是否受雇佣'
                      >
                        <Radio.Group>
                          <Radio value={1}>是</Radio>
                          <Radio value={0}>否</Radio>
                        </Radio.Group>
                      </Form.Item>
                    </div>

                    <Form.Item>
                      <MinusCircleOutlined onClick={() => remove(name)} style={{ marginLeft: 20, fontSize: 18, color: 'red' }} />
                    </Form.Item>
                  </div>
                </div>
              ))}

              <Form.Item>
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  添加
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

      </div>
    )
  }

  const renderContact = () => {
    return (
      <div>
        <Form.List
          name="contact"
        >
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <div key={key} style={{ borderRadius: 8, boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)', paddingTop: 30, marginBottom: 30 }}>
                  <div style={{ display: 'flex' }}>
                    <div style={{ width: '40%' }}>
                      <Form.Item
                        {...restField}
                        name={[name, 'name']}
                        rules={[{ required: true }]}
                        label='联系人姓名'
                      >
                        <Input />
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, 'tel']}
                        rules={[{ required: true }]}
                        label='联系人电话'
                      >
                        <Input />
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, 'job']}
                        label='联系人职务'
                      >
                        <Input />
                      </Form.Item>

                    </div>

                    <div style={{ width: '40%', marginLeft: 30 }}>
                      <Form.Item
                        {...restField}
                        name={[name, 'relation']}
                        label='关系'
                      >
                        <Input />
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, 'company']}
                        label='联系人工作单位'
                      >
                        <Input />
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, 'is_urgent']}
                        label='是否是紧急联系人'
                      >
                        <Radio.Group>
                          <Radio value={1}>是</Radio>
                          <Radio value={0}>否</Radio>
                        </Radio.Group>
                      </Form.Item>
                    </div>

                    <Form.Item>
                      <MinusCircleOutlined onClick={() => remove(name)} style={{ marginLeft: 20, fontSize: 18, color: 'red' }} />
                    </Form.Item>
                  </div>
                </div>
              ))}

              <Form.Item>
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  添加
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </div>
    )
  }

  const renderChildren = () => {
    return (
      <div>
        <Form.List
          name="children_info"
        >
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <div key={key} style={{ borderRadius: 8, boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)', paddingTop: 30, marginBottom: 30 }}>
                  <div style={{ display: 'flex' }}>
                    <div style={{ width: '40%' }}>
                      <Form.Item
                        {...restField}
                        name={[name, 'name']}
                        label='子女姓名'
                      >
                        <Input />
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, 'birthday']}
                        label='出生日期'
                      >
                        <DatePicker />
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, 'cert']}
                        label='出生证明'
                      >
                        <UploadFiles />
                      </Form.Item>

                    </div>

                    <div style={{ width: '40%', }}>
                      <Form.Item
                        {...restField}
                        name={[name, 'gender']}
                        label='性别'
                      >
                        <Radio.Group>
                          <Radio value={'male'}>男</Radio>
                          <Radio value={'female'}>女</Radio>
                        </Radio.Group>
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, 'id_card_no']}
                        label='子女身份证号'
                      >
                        <Input />
                      </Form.Item>
                    </div>

                    <Form.Item>
                      <MinusCircleOutlined onClick={() => remove(name)} style={{ marginLeft: 20, fontSize: 18, color: 'red' }} />
                    </Form.Item>
                  </div>
                </div>
              ))}

              <Form.Item>
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  添加
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </div>
    )
  }

  const renderJobInfo = () => {
    return (
      <div>

        <div style={{ display: 'flex' }}>
          <div style={{ width: '40%' }}>
            <Form.Item label="入职时间" name="entry_at">
              <DatePicker />
            </Form.Item>

            <Form.Item label="试用期截止日" name="probation_period_end">
              <DatePicker />
            </Form.Item>


            <Form.Item label="转正状态" name="full_status">
              <Select options={becomeWorkerStatusList} />
            </Form.Item>

            {/* 多选的 */}
            <Form.Item label="部门" name="department" rules={[{ required: true }]}>
              <Select mode="multiple" options={departmentList} />
            </Form.Item>

            <Form.Item label="管理形式" name="manage_type">
              <Select options={manageCityList} />
            </Form.Item>

            <Form.Item label="汇报对象" name="report_to">
              <Input />
            </Form.Item>

            <Form.Item label="导师" name="mentor">
              <Input />
            </Form.Item>

            <Form.Item label="成本中心" name="cost_center">
              <Input />
            </Form.Item>

            <Form.Item label="工作城市" name="work_city">
              <Input />
            </Form.Item>
          </div>

          <div style={{ width: '40%', marginLeft: '60px' }}>
            <Form.Item label="工作邮箱" name="work_email">
              <Input />
            </Form.Item>

            <Form.Item label="转正日期" name="full_at">
              <DatePicker />
            </Form.Item>

            <Form.Item label="状态" name="status" rules={[{ required: true }]}>
              <Select options={statusList} />
            </Form.Item>

            <Form.Item label="岗位" name="post">
              <Input />
            </Form.Item>

            <Form.Item label="工号" name="job_no">
              <Input />
            </Form.Item>

            <Form.Item label="HRBP" name="hrbp">
              <Input />
            </Form.Item>

            <Form.Item label="职级" name="level">
              <Input />
            </Form.Item>

            <Form.Item label="司龄" name="serving_age">
              <InputNumber min={1} max={10} />
            </Form.Item>

            <Form.Item label="纳税城市" name="tax_city">
              <Input />
            </Form.Item>
          </div>
        </div>

        <Form.List
          name="contract"
        >
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <div key={key} style={{ borderRadius: 8, boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)', paddingTop: 30, paddingLeft: 30, marginBottom: 30 }}>
                  <div style={{ display: 'flex' }}>
                    <div style={{ width: '40%' }}>
                      <Form.Item
                        {...restField}
                        name={[name, 'no']}
                        label='合同编号'
                      >
                        <Input />
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, 'first_begin']}
                        label='首次合同开始日期'
                      >
                        <DatePicker />
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, 'first_type']}
                        label='首次合同类型'
                      >
                        <Select options={contractTypeLList} />
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, 'sign_at']}
                        label='合同签订日期'
                      >
                        <DatePicker />
                      </Form.Item>


                      <Form.Item
                        {...restField}
                        name={[name, 'status']}
                        label='合同状态'
                      >
                        <Select options={contractStatusList} />
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, 'num']}
                        label='劳动合同续签次数'
                      >
                        <InputNumber min={1} max={1000} />
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, 'file']}
                        label='合同文件'
                      >
                        <UploadFiles />
                      </Form.Item>
                    </div>

                    <div style={{ width: '40%', marginLeft: 30 }}>
                      <Form.Item
                        {...restField}
                        name={[name, 'main']}
                        label='主合同'
                      >
                        <Select options={mainContractList} />
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, 'first_end']}
                        label='首次合同结束日期'
                      >
                        <DatePicker />
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, 'first_subject']}
                        label='首次合同主体'
                      >
                        <Select options={firstContractObject} />
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, 'time_limit']}
                        label='合同期限'
                      >
                        <Input />
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, 'sign_type']}
                        label='新续签'
                      >
                        <Select options={newContinueList} />
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, 'remark']}
                        label='备注'
                      >
                        <Input />
                      </Form.Item>
                    </div>

                    <Form.Item>
                      <MinusCircleOutlined onClick={() => remove(name)} style={{ marginLeft: 20, fontSize: 18, color: 'red' }} />
                    </Form.Item>
                  </div>
                </div>
              ))}

              <Form.Item>
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  添加
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <div>
          <div style={{ fontSize: 20, marginBottom: 20 }}>招聘信息</div>

          <div style={{ display: 'flex' }}>
            <div style={{ width: '40%' }}>
              <Form.Item label="招聘渠道" name="channel">
                <Input />
              </Form.Item>

              <Form.Item label="推荐企业人" name="referrer">
                <Input />
              </Form.Item>
            </div>

            <div style={{ width: '40%', marginLeft: '60px' }}>
              <Form.Item label="社招/校招" name="type">

                <Radio.Group>
                  <Radio value={'social'}>社招</Radio>
                  <Radio value={'school'}>校招</Radio>
                </Radio.Group>

              </Form.Item>
              <Form.Item label="其他招聘渠道" name="other_channel">
                <Input />
              </Form.Item>
            </div>
          </div>

        </div>
      </div>
    )
  }

  const handleFinishFailed = (e: any) => {
    if (e.errorFields.length == 0) {
      return
    }
    let errList: any = []

    e.errorFields.forEach(item => {
      if (item.errors.length > 0) {
        errList.push(item.errors[0])
      }
    })

    error(errList.toString())
  }

  const error = (text: string) => {
    messageApi.open({
      type: 'error',
      content: text,
    });
  };

  useEffect(() => {
    console.log('打印query_id', query_id);

    // 请求部门列表
    departmentAll().then(res => {
      if (res.success && !isEmpty(res.data)) {
        const department = res.data.map(item => {
          return {
            value: item.id,
            label: item.name,
          }
        })
        setDepartmentList(department)
      }

    })

    if (eID != null && eID != undefined && eID > 0 || query_id != null && query_id != undefined && Number(query_id) > 0) {
      // 修改
      getEmployeeInfo(eID || query_id).then(res => {
        console.log('打印员工数据<----------------------->', res);
        if (res.success) {

          const baseInfo = res.data.base_info
          const communicationInfo = res.data.communication_info
          const accountInfo = res.data.account_info
          const educationalExperience = res.data.educational_experience
          const workExperience = res.data.work_experience
          const emergencyContact = res.data.contact
          const childrenInfo = res.data.children
          const jobInfo = res.data.job_info

          const birthday = baseInfo.birthday ? dayjs(baseInfo.birthday, dayFormat) : ''
          const admission_at = baseInfo.admission_at ? dayjs(baseInfo.admission_at, dayFormat) : ''
          const exit_at = baseInfo.exit_at ? dayjs(baseInfo.exit_at, dayFormat) : ''

          let base_info = {
            name: baseInfo.name ?? '',
            gender: baseInfo.gender ?? '',
            en_name: baseInfo.en_name ?? '',
            nationality: baseInfo.nationality ?? '',
            country_of_birth: baseInfo.country_of_birth ?? '',
            id_card_imgs: baseInfo.id_card_imgs ?? '',
            birthday: birthday,
            chinese_zodiac: baseInfo.chinese_zodiac ?? '',
            national: baseInfo.national ?? '',
            birth_status: baseInfo.birth_status ?? '',
            admission_at: admission_at,
            si: baseInfo.si ?? '',
            marital_status: baseInfo.marital_status ?? '',
            resume_file_id: baseInfo.resume_file_id ?? '',
            img_id: baseInfo.img_id ?? '',
            id_card_no: baseInfo.id_card_no ?? '',
            native_place: baseInfo.native_place ?? '',
            zodiac: baseInfo.zodiac ?? '',
            politics_status: baseInfo.politics_status ?? '',
            illegal: baseInfo.illegal ?? '',
            exit_at: exit_at,
            medical_history: baseInfo.medical_history ?? '',
            rmo: baseInfo.rmo ?? ''
          }

          const residence_permit_at = communicationInfo.residence_permit_at ? dayjs(communicationInfo.residence_permit_at, dayFormat) : ''
          const residence_permit_end = communicationInfo.residence_permit_end ? dayjs(communicationInfo.residence_permit_end, dayFormat) : ''

          let communication_info = {
            qq: communicationInfo.qq ?? '',
            wechat: communicationInfo.wechat ?? '',
            email: communicationInfo.email ?? '',
            mobile: communicationInfo.mobile ?? '',
            address: communicationInfo.address ?? '',
            residence_address: communicationInfo.residence_address ?? '',
            residence_city: communicationInfo.residence_city ?? '',
            residence_permit_at: residence_permit_at,
            residence_permit_end: residence_permit_end,
          };

          let account_info = {
            social_security_pc_no: accountInfo.social_security_pc_no ?? '',
            provident_fund_account: accountInfo.provident_fund_account ?? '',
            bank_card_no: accountInfo.bank_card_no ?? '',
            bank: accountInfo.bank ?? ''
          }

          // 教育经历
          let educational_experience = {
            highest_degree: educationalExperience.highest_degree ?? '',
            educational_experience: [],
            certs: []
          }

          if (!isEmpty(educationalExperience.educational_experience)) {
            for (let i = 0; i < educationalExperience.educational_experience.length; i++) {
              let item = educationalExperience.educational_experience[i]

              item.id = item.id ?? ''
              item.graduate_school = item.graduate_school ?? ''
              item.graduate = item.graduate ?? ''
              item.education_background = item.education_background ?? ''
              item.education_mode = item.education_mode ?? ''
              item.is_highest = item.is_highest ?? ''
              item.first = item.first ?? ''

              item.graduation_at = item.graduation_at ? dayjs(item.graduation_at, dayFormat) : ''
              item.admission_at = item.admission_at ? dayjs(item.admission_at, dayFormat) : ''
              item.graduate_cert = item.graduate_cert ? item.graduate_cert : ''
              item.diploma = item.diploma ?? ''

              educational_experience.educational_experience.push(item)
            }
          } else {
            const emptyJson = {
              id: '',
              graduate_school: '',
              graduate: '',
              education_background: '',
              education_mode: '',
              is_highest: '',
              first: '',
              graduation_at: '',
              admission_at: '',
              graduate_cert: '',
              diploma: ''
            }
            educational_experience.educational_experience.push(emptyJson)
          }

          if (!isEmpty(educationalExperience.certs)) {
            for (let i = 0; i < educationalExperience.certs.length; i++) {
              let item = educationalExperience.certs[i]

              item.id = item.id ?? ''
              item.name = item.name ?? ''
              item.no = item.no ?? ''
              item.remark = item.remark ?? ''

              item.begin = item.begin ? dayjs(item.begin, dayFormat) : ''
              item.end = item.end ? dayjs(item.end, dayFormat) : ''
              item.img_id = item.img_id ? item.img_id : ''

              educational_experience.certs.push(item)
            }
          } else {
            const emptyJson = {
              id: '',
              name: '',
              no: '',
              remark: '',
              begin: '',
              end: '',
              img_id: '',
            }

            educational_experience.certs.push(emptyJson)
          }

          console.log('打印教育经历', educational_experience);

          // 工作经历
          let work_experience = {
            last_company: !isEmpty(workExperience.last_company) ? workExperience.last_company : '',
            work_experience: [],
          }

          if (!isEmpty(workExperience.work_experience)) {
            for (let i = 0; i < workExperience.work_experience.length; i++) {
              let item = workExperience.work_experience[i]

              item.id = item.id ?? '';
              item.post = item.post ?? '';
              item.witness_tel = item.witness_tel ?? '';
              item.has_competition = item.has_competition ?? '';
              item.remark = item.remark ?? '';
              item.is_employed = item.is_employed ?? '';
              item.witness = item.witness ?? '';
              item.reason = item.reason ?? '';
              item.companny = item.companny ?? '';

              item.begin = item.begin ? dayjs(item.begin, dayFormat) : ''
              item.end = item.end ? dayjs(item.end, dayFormat) : ''
              work_experience.work_experience.push(item)
            }
          } else {
            let emptyJson = {
              id: '',
              post: '',
              witness_tel: '',
              has_competition: '',
              remark: '',
              is_employed: '',
              witness: '',
              reason: '',
              companny: '',
              begin: '',
              end: '',
            }
            work_experience.work_experience.push(emptyJson)
          }

          // 紧急联系人
          let emergency_contact = []

          if (!isEmpty(emergencyContact)) {
            for (let i = 0; i < emergencyContact.length; i++) {
              let item = emergencyContact[i]

              item.name = item.name ?? '';
              item.tel = item.tel ?? '';
              item.is_urgent = item.is_urgent ?? '';
              item.job = item.job ?? '';
              item.company = item.company ?? '';
              item.relation = item.relation ?? '';

              emergency_contact.push(item)
            }
          } else {
            const emptyJson = {
              name: '',
              tel: '',
              is_urgent: '',
              job: '',
              company: '',
              relation: '',
            }

            emergency_contact.push(emptyJson)
          }

          // 子女信息
          let children_info = []

          if (!isEmpty(childrenInfo)) {
            for (let i = 0; i < childrenInfo.length; i++) {
              let item = childrenInfo[i]

              item.name = item.name ?? '';
              item.gender = item.gender ?? '';
              item.birthday = item.birthday ? dayjs(item.birthday, dayFormat) : '';
              item.id_card_no = item.id_card_no ?? '';
              item.cert = item.cert ?? '';


              children_info.push(item)
            }
          } else {
            const emptyJson = {
              name: '',
              gender: '',
              birthday: '',
              id_card_no: '',
              cert: '',
            }

            children_info.push(emptyJson)
          }

          let department: any = []

          console.log('打印飞哥的数据', jobInfo.department);


          if (!isEmpty(jobInfo.department)) {
            jobInfo.department.forEach(item => {
              department.push(item.id)
            });
          }



          const entry_at = !isEmpty(jobInfo.entry_at) ? dayjs(jobInfo.entry_at, dayFormat) : ''
          const probation_period_end = !isEmpty(jobInfo.probation_period_end) ? dayjs(jobInfo.probation_period_end, dayFormat) : ''
          const full_at = !isEmpty(jobInfo.full_at) ? dayjs(jobInfo.full_at, dayFormat) : ''

          // 岗位信息
          let job_info = {
            entry_at: entry_at,
            work_email: jobInfo.work_email ?? '',
            probation_period_end: probation_period_end,
            full_at: full_at,
            full_status: jobInfo.full_status ?? '',
            status: jobInfo.status ?? '',
            department: department,
            post: jobInfo.post ?? '',
            manage_type: jobInfo.manage_type ?? '',
            job_no: jobInfo.job_no ?? '',
            report_to: jobInfo.report_to ?? '',
            hrbp: jobInfo.hrbp ?? '',
            mentor: jobInfo.mentor ?? '',
            level: jobInfo.level ?? '',
            cost_center: jobInfo.cost_center ?? '',
            serving_age: jobInfo.serving_age ?? '',
            work_city: jobInfo.work_city ?? '',
            tax_city: jobInfo.tax_city ?? '',
            contract: [],
            type: jobInfo.recruitment.type ?? '',
            channel: jobInfo.recruitment.channel ?? '',
            referrer: jobInfo.recruitment.referrer ?? '',
            other_channel: jobInfo.recruitment.other_channel ?? '',
          }

          if (!isEmpty(jobInfo.contract)) {
            for (let i = 0; i < jobInfo.contract.length; i++) {
              let item = jobInfo.contract[i]

              item.no = item.no ?? '';
              item.main = item.main ?? '';
              item.first_type = item.first_type ?? '';
              item.first_subject = item.first_subject ?? '';
              item.time_limit = item.time_limit ?? '';
              item.status = item.status ?? '';
              item.num = item.num ?? '';
              item.sign_type = item.sign_type ?? '';
              item.remark = item.remark ?? '';
              item.file = item.file ?? '';


              item.first_begin = !isEmpty(item.first_begin) ? dayjs(item.first_begin, dayFormat) : ''
              item.first_end = !isEmpty(item.first_end) ? dayjs(item.first_end, dayFormat) : ''
              item.sign_at = !isEmpty(item.sign_at) ? dayjs(item.sign_at, dayFormat) : ''

              job_info.contract.push(item)
            }
          } else {
            const emptyJson = {
              no: '',
              main: '',
              first_type: '',
              first_subject: '',
              time_limit: '',
              status: '',
              num: '',
              sign_type: '',
              remark: '',
              file: '',
              first_begin: '',
              first_end: '',
              sign_at: '',
            }

            job_info.contract.push(emptyJson)
          }

          form.setFieldsValue({
            ...base_info,
            ...communication_info,
            ...account_info,
            ...educational_experience,
            ...work_experience,
            contact: emergency_contact,
            children_info: children_info,
            ...job_info,
          })
        }
      })

    } else {
      const educational_experience_empty = {
        id: '',
        graduate_school: '',
        graduate: '',
        education_background: '',
        education_mode: '',
        is_highest: '',
        first: '',
        graduation_at: '',
        admission_at: '',
        graduate_cert: '',
        diploma: ''
      }
      const educational_experience = [
        educational_experience_empty
      ]

      const certs_empty = {
        id: '',
        name: '',
        no: '',
        remark: '',
        begin: '',
        end: '',
        img_id: '',
      }
      const certs = [
        certs_empty
      ]

      let work_experience_empty = {
        id: '',
        post: '',
        witness_tel: '',
        has_competition: '',
        remark: '',
        is_employed: '',
        witness: '',
        reason: '',
        companny: '',
        begin: '',
        end: '',
      }
      const work_experience = [
        work_experience_empty
      ]

      const contact_empty = {
        name: '',
        tel: '',
        is_urgent: '',
        job: '',
        company: '',
        relation: '',
      }
      const contact = [
        contact_empty
      ]

      const children_info_empty = {
        name: '',
        gender: '',
        birthday: '',
        id_card_no: '',
        cert: '',
      }
      const children_info = [
        children_info_empty
      ]

      const contract_empty = {
        no: '',
        main: '',
        first_type: '',
        first_subject: '',
        time_limit: '',
        status: '',
        num: '',
        sign_type: '',
        remark: '',
        file: '',
        first_begin: '',
        first_end: '',
        sign_at: '',
      }
      const contract = [
        contract_empty
      ]

      form.setFieldsValue({
        educational_experience: educational_experience,
        certs: certs,
        work_experience: work_experience,
        contact: contact,
        children_info: children_info,
        contract: contract,
      })
    }
  }, [])

  const formItemLayout = {
    labelCol: {
      xs: { span: 8 },
      sm: { span: 8 },
    },
    // wrapperCol: {
    //   xs: { span: 24 },
    //   sm: { span: 16 },
    // },
  };

  return (
    <>
      {contextHolder}
      <div>
        <Tabs
          activeKey={tabKey}
          onChange={onTabChange}
          type="card"
          items={tabList.map((item, index) => {
            return {
              label: item.label,
              key: item.key,
            };
          })}
        />
      </div>
      <Form
        {...formItemLayout}
        form={form}
        onFinish={handleFinish}
        layout={'horizontal'}
        onFinishFailed={handleFinishFailed}
      >
        <div style={{ display: tabKey === 'base_info' ? 'block' : 'none' }}>{renderBasicInfo()}</div>

        <div style={{ display: tabKey === 'communication_info' ? 'block' : 'none' }}>{renderCommunicationInfo()}</div>

        <div style={{ display: tabKey === 'account_info' ? 'block' : 'none' }}>{renderAccountInfo()}</div>

        <div style={{ display: tabKey === 'educational_experience' ? 'block' : 'none' }}>{renderEducationalExperience()}</div>

        <div style={{ display: tabKey === 'work_experience' ? 'block' : 'none' }}>{renderWorkExperience()}</div>

        <div style={{ display: tabKey === 'contact' ? 'block' : 'none' }}>{renderContact()}</div>

        <div style={{ display: tabKey === 'children' ? 'block' : 'none' }}>{renderChildren()}</div>

        <div style={{ display: tabKey === 'job_info' ? 'block' : 'none' }}>{renderJobInfo()}</div>

        {renderButtons()}
      </Form>
    </>
  )
}

export default CreateOrUpdate
