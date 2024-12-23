import React, { useState, useEffect } from 'react';
import { Button, Form, Input, Select, Space, Upload } from 'antd';
import { SelectProps } from 'antd';
import { DatePicker } from 'antd';
import ProjectContent from './ProjectContent';
import CreateDevice from './CreateDevice';
import CreateBudget from './CreateBudget';
import Apppp from './Practice';
import { createOrUpdateProject, getProjectInfo } from '@/services/ant-design-pro/project';
import { UploadOutlined } from '@ant-design/icons';
import { getUploadToken } from '@/services/ant-design-pro/api';
import GkUpload from '@/components/UploadImage/GkUpload';
import BidAction from './BidAction';


interface ItemListProps {
    handleClose: () => void
    actionRef
    success: (text: string) => void
    error: (text: string) => void
    brandList
    typeList
    statusList
    currentMsg
}
const AddPQI: React.FC<ItemListProps> = ({
    handleClose,
    actionRef,
    success,
    error,
    brandList,
    typeList,
    statusList,
    currentMsg
}) => {

    const [form] = Form.useForm()
    const [PQIdata, setPQIdata] = useState({})

    const [project, setProject] = useState({
        project_no: '',
        brand_id: '',
        project_name: '',
        project_type_id: '',
        project_status_id: '',
        time_ranges: [],
        weekDay: 0,
        area: '',
        area_unit: 'spm',
        floor: '',
        unit: '1',
    })

    const [vat, setVat] = useState(0.09)

    const [equipment_list, setEquipment_list] = useState([])

    const [budget, setBudget] = useState<any>({})
    const [fileIds, setFileIds] = useState()

    const handleProject = (data) => {
        setProject(preState => {
            return {
                ...preState,
                ...data
            }
        })
    }

    const handleBudget = (data) => {
        setBudget(preState => {
            return {
                ...preState,
                ...data
            }
        })
    }

    const handleEquipmentList = (data) => {
        setEquipment_list(preState => {
            return data
        })
    }

    const handleChangeFile = (files) => {
        setFileIds(files.map(file => file.id).join(','))
    }

    const handleFinsh = () => {
        let params = {
            area: project.area ?? '',
            area_unit: project.area_unit ?? '',
            brand_id: project.brand_id ?? '',
            floor: project.floor ?? '',
            project_name: project.project_name ?? '',
            project_no: project.project_no ?? '',
            project_status_id: project.project_status_id ?? '',
            project_type_id: project.project_type_id ?? '',
            unit: project.unit ?? '',
            weekDay: project.weekDay ?? '',
            time_ranges: project.time_ranges ?? [],
            equipment_list: equipment_list ?? [],
            cost_price: budget.cost_price ?? '',
            final_account_list: budget.final_account_list ?? [],
            profit_rate_list: budget.profit_rate_list ?? [],
            reverse_calculate: budget.reverse_calculate ?? [],
            file_ids: fileIds ?? '',
        }
        console.log(params);

        if (currentMsg) {
            params = {
                ...params,
                id: currentMsg.id
            }
        }
        createOrUpdateProject(params).then((res) => {
            if (res.success) {
                handleClose()
                actionRef.current.reload()
                success('处理成功')
                return
            }
            error(res.message)
        })
    }
    useEffect(() => {
        console.log(currentMsg)
        if (!currentMsg) {
            return
        }
        getProjectInfo({ project_id: currentMsg.id }).then(res => {
            if (res.success) {
                setPQIdata(res.data)
            }
        })
    }, [])
    return (
        <>
            <ProjectContent
                handleClose={handleClose}
                actionRef={actionRef}
                success={success}
                brandList={brandList}
                error={error}
                typeList={typeList}
                statusList={statusList}
                onSetProject={handleProject}
                project={project}
                setVat={setVat}
                currentMsg={currentMsg}
                PQIdata={PQIdata}
            />
            <CreateDevice
                setEquipment_list={handleEquipmentList}
                handleClose={handleClose}
                actionRef={actionRef}
                success={success}
                error={error}
                currentMsg={currentMsg}
            />
            <CreateBudget
                project={project.weekDay}
                handleClose={handleClose}
                actionRef={actionRef}
                success={success}
                error={error}
                vat={vat}
                currentMsg={currentMsg}
                handleBudget={handleBudget}
            />
            <div style={{ margin: '30px 0', display: 'flex', alignItems: 'center' }}>
                <div style={{ width: 120 }}>上传合同/附件：</div>
                <GkUpload value={PQIdata.file_list} onChange={handleChangeFile} />
            </div>
            <Space>
                <Button type='primary' onClick={handleFinsh}>保存</Button>
            </Space>

            {
                currentMsg &&
                <BidAction
                    currentMsg={currentMsg}
                    vat={vat}
                    success={success}
                    error={error}
                />
            }


        </>
    )
}
export default AddPQI