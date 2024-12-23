import React, { useEffect } from "react"


interface ItemListProps {
    detail: any,
    group: any,
    type: string,
    onTapDetail: () => void // 假设回调函数没有参数且没有返回值
}

const Intro: React.FC<ItemListProps> = ({
    detail,
    group,
    type,
    onTapDetail
}) => {

    useEffect(() => {
        console.log('Intro页面，需要实时请求 <-----------------------------------------');

    }, [detail, group])

    // 状态判断
    const checkStatus = (data: any): string => {
        let status = '--'

        if (data['status']['warning'] == 'water_lacking') {
            status = '漏水报警';
        } else if (data['status']['warning'] == 'warning') {
            status = '报警';
        } else if (data['status']['desc'] == 'stop') {
            status = '停止';
        } else if (data['status']['desc'] == 'running') {
            status = '运行';
        }

        return status;
    }

    const renderAhu = (data: any) => {
        return (
            <div>
                <div style={{ fontSize: '20px' }}>
                    <span>{data.name}</span>
                    <span style={{ fontSize: '20px', marginLeft: '10px', color: 'grey' }}>状态:{checkStatus(data)}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px' }}>
                    <div style={{ color: 'grey' }}>回风温度:</div>
                    <div>{data['wind_return_temperature']['format_val']}</div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px' }}>
                    <div style={{ color: 'grey' }}>频率给定:</div>
                    <div>{data['speed_giving']['format_val']}</div>
                </div>


                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px' }}>
                    <div style={{ color: 'grey' }}>频率反馈:</div>
                    <div>{data['speed_feedback']['format_val']}</div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px' }}>
                    <div style={{ color: 'grey' }}>当前速度:</div>
                    <div>{data['current_speed']['format_val']}</div>
                </div>
            </div>
        )
    }

    const renderFcuVrv = (data: any) => {
        return (
            <div>
                <div style={{ fontSize: '20px' }}>
                    <span>{data.name}</span>
                    <span style={{ fontSize: '20px', marginLeft: '10px', color: 'grey' }}>状态:{checkStatus(data)}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px' }}>
                    <div style={{ color: 'grey' }}>回风温度:</div>
                    <div>{data['wind_return_temperature']['format_val']}</div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px' }}>
                    <div style={{ color: 'grey' }}>模式反馈:</div>
                    <div>{data['mode']['format_val']}</div>
                </div>


                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px' }}>
                    <div style={{ color: 'grey' }}>当前速度:</div>
                    <div>{data['current_speed']['format_val']}</div>
                </div>
            </div>
        )
    }

    return (
        <>
            {
                type == 'fcu' &&
                renderFcuVrv(detail)
            }

            {
                type == 'vrv' &&
                renderFcuVrv(detail)
            }

            {
                type == 'ahu' &&
                renderAhu(detail)
            }

            {
                type == 'ahuvrv' &&
                <div style={{ display: 'flex' }}>
                    {
                        Object.keys(group).map(key => {
                            if (group[key].device_type == 'ahu') {
                                return <div key={group[key]}>{renderAhu(group[key])}</div>
                            }
                        })
                    }

                    <div style={{ borderRight: '1px solid grey', height: '140px', color: 'grey', marginLeft: '20px', marginRight: '20px', }}></div>

                    {
                        Object.keys(group).map(key => {
                            if (group[key].device_type == 'vrv') {
                                return <div key={group[key]}>{renderFcuVrv(group[key])}</div>
                            }
                        })
                    }
                </div>
            }

            <div
                style={{ color: 'green', fontSize: '16px', textAlign: 'right', cursor: 'pointer' }}
                onClick={() => onTapDetail()}
            >
                详情
            </div>

        </>
    )
}

export default Intro