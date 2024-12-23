
import ItemList from "./ItemList"
import { Button, Form, Input, Select, InputNumber, Radio, Space, Calendar, Card } from 'antd';
import { getBrandList, getCityList, getMarketList, getShopList } from "@/services/ant-design-pro/report";
import { useState } from "react";
import { SelectProps } from "antd/lib";
import { useEffect } from "react";
import { DatePicker } from "antd";
import GkUpload from "@/components/UploadImage/GkUpload";
import { values } from "lodash";

interface ItemListProps {
    success: (text: string) => void
    error: (text: string) => void

}

const AddSystem: React.FC<ItemListProps> = ({
    success,
    error
}) => {

    const [form] = Form.useForm()
    // 品牌
    const [brandList, setBrandList]: any = useState([])
    const [brandId, setBrandId]: any = useState('')
    // 城市
    const [cityList, setCityList]: any = useState([])
    const [cityId, setCityId]: any = useState('')
    // 商场
    const [marketList, setMarketList]: any = useState([])
    const [markId, setMarkId]: any = useState('')
    // 店铺
    const [shopList, setShopList]: any = useState([])

    const [textboxes, setTextboxes] = useState([{ id: 1, value: '' }]);

    // D.Site Photos
    const [textFields, setTextFields] = useState([]);


    // 品牌
    const optionsBrand: SelectProps['options'] = brandList.map((item) => {
        return {
            value: item.id,
            label: item.brand_en,
        };
    });
    // 城市
    const optionscity: SelectProps['options'] = cityList.map((item) => {
        return {
            value: item.id,
            label: item.city_cn,
        };
    });
    // 商场
    const optionsmarket: SelectProps['options'] = marketList.map((item) => {
        return {
            value: item.id,
            label: item.market_cn,
        };
    });
    // 店铺
    const optionsShop: SelectProps['options'] = shopList.map((item) => {
        return {
            value: item.id,
            label: item.name_cn,
        };
    });



    const handleChangeBrand = (e) => {
        setBrandId(e)
        form.setFieldsValue({ shop: undefined })
        getShopList({ brand_id: e, city_id: cityId, market_id: markId }).then(res => {
            setShopList(res.data)
            // console.log(res.data)
        })
    }



    const handleChangeCity = (e) => {
        setCityId(e)
        form.setFieldsValue({ market: undefined })
        getMarketList({ city_id: e }).then(res => {
            setMarketList(res.data)
            // console.log(res.data)
        })
        form.setFieldsValue({ shop: undefined })
        getShopList({ brand_id: brandId, city_id: e, market_id: markId }).then(res => {
            setShopList(res.data)
            // console.log(res.data)
        })
    }
    const handleChangeMarket = (e) => {
        setMarkId(e)
        // form.setFieldsValue({shop: undefined})
        getShopList({ brand_id: brandId, city_id: cityId, market_id: e }).then(res => {
            setShopList(res.data)
            // console.log(res.data)
        })
    }

    // 复制文本框
    const handleAddTextbox = () => {
        const newTextbox = { id: textboxes.length + 1, value: '' };
        setTextboxes([...textboxes, newTextbox]);
    };
    // 移除文本框
    const handleRemoveTextbox = (id) => {
        const updatedTextboxes = textboxes.filter((textbox) => textbox.id !== id);
        setTextboxes(updatedTextboxes);
    };
    // 更新文本框的值
    const handleChange = (id, value) => {
        const updatedTextboxes = textboxes.map((textbox) => {
            if (textbox.id === id) {
                return { ...textbox, value };
            }
            return textbox;
        });
        setTextboxes(updatedTextboxes);
    };

    useEffect(() => {
        getBrandList().then(res => {
            setBrandList(Object.keys(res.data).map(key => res.data[key]))
        })
        getCityList().then(res => {
            setCityList(res.data)
            console.log(res.data)
        })

    }, [])

    // D.Site Photos
    const handleTextFieldChange = (index, value) => {
        const updatedTextFields = [...textFields];
        updatedTextFields[index] = value;
        setTextFields(updatedTextFields);
    };
    const deleteTextField = (index) => {
        const updatedTextFields = [...textFields];
        updatedTextFields.splice(index, 1);
        setTextFields(updatedTextFields);
    };
    const addTextField = () => {
        setTextFields([...textFields, ""]);
    };

    return (
        <Form
            form={form}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
        >
            <Form.Item label="品牌" name="brand">
                <Select options={optionsBrand} onChange={handleChangeBrand}></Select>
            </Form.Item>
            <Form.Item label="城市" name="city">
                <Select options={optionscity} onChange={handleChangeCity}></Select>
            </Form.Item>
            <Form.Item label="商场" name="market">
                <Select options={optionsmarket} onChange={handleChangeMarket}></Select>
            </Form.Item>
            <Form.Item label="店铺" name="shop">
                <Select options={optionsShop}></Select>
            </Form.Item>
            <Form.Item label="开工日期" name="start">
                <DatePicker />
            </Form.Item>
            <Form.Item label="完工日期" name="completion">
                <DatePicker />
            </Form.Item>
            <Form.Item label="报告开始时间" name="reportStart">
                <DatePicker />
            </Form.Item>
            <Form.Item label="报告结束时间" name="reportEnd">
                <DatePicker />
            </Form.Item>
            <Form.Item label="标题" name="title">
                <Input />
            </Form.Item>
            <Form.Item label="编号" name="numbering">
                <Input />
            </Form.Item>
            <Form.Item label="报告类型" name="Report">
                <Input />
            </Form.Item>

            <Form.Item name="Drawing" colon={false}>
                <Input bordered={false} defaultValue="A. Drawing" style={{ borderBottom: '1px solid #f00', borderRadius: 0 }} />
                {textboxes.map((texbox) => (
                    <Card style={{ width: 800 }}>
                        <Button style={{ marginLeft: 400 }} onClick={handleAddTextbox}>+</Button>
                        <Card style={{ width: 350 }}>
                            <GkUpload />
                            <Input type="text" />
                        </Card>
                        {
                            textboxes.length > 1 &&
                            <Button style={{ marginLeft: 400 }} onClick={() => handleRemoveTextbox(texbox.id)}>-</Button>
                        }
                    </Card>
                ))}
            </Form.Item>
            <Form.Item name="Schedule" colon={false}>
                <Input bordered={false} defaultValue="B. Construction Schedule" style={{ borderBottom: '1px solid #f00', borderRadius: 0 }} />
                <Card style={{ width: 800 }}>
                    <GkUpload />
                </Card>
            </Form.Item>
            <Form.Item name="Date" colon={false}>
                <Input bordered={false} defaultValue="C. Milestone Date" style={{ borderBottom: '1px solid #f00', borderRadius: 0 }} />
                <Card style={{ width: 800 }}>
                    <div>能否按照计划执行</div>
                    <Radio.Group style={{ marginTop: 30 }}>
                        <Radio value="N">N</Radio>
                        <Radio value="Y">Y</Radio>
                    </Radio.Group>
                </Card>
                <Card style={{ marginTop: 20, width: 800 }}>

                </Card>
            </Form.Item>
            <Form.Item name="Photos" colon={false}>

            {textFields.map((texbox) => (
                    <>
                       
                        <Input bordered={false} defaultValue="D.Site Photos" style={{ borderBottom: '1px solid #f00', borderRadius: 0 }}

                        />
                         <Button style={{ marginLeft: 400 }} onClick={addTextField}>+</Button>
                        <Card style={{ width: 800 }}>
                            <GkUpload />
                            <div style={{ marginTop: 10 }}>Location</div>
                            <Input style={{ width: 200, marginTop: 5 }} />
                            <div style={{ marginTop: 10 }}>Item</div>
                            <Input style={{ width: 200 }} />
                            <div style={{ marginTop: 10 }}>Description</div>
                            <Input style={{ width: 300 }} />
                        </Card>
                        {
                            textFields.length > 1 &&
                            <Button style={{ marginLeft: 400 }} onClick={() => deleteTextField(texbox.id)}>-</Button>
                        }
                    </>

                ))} 




            </Form.Item>
            <Form.Item>
                <Space style={{ marginLeft: 300 }}>
                    <Button type="primary" htmlType='submit'>保存</Button>
                    <Button type="primary">预览</Button>
                    <Button type="primary" danger ghost>返回</Button>
                </Space>
            </Form.Item>
        </Form>
    )
}

export default AddSystem