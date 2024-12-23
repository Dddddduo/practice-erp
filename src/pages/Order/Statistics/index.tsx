import {getByRules, getTags} from '@/services/ant-design-pro/project';
import {getBrandList} from '@/services/ant-design-pro/report';
import {DatePicker, Divider, Select, Space} from 'antd';
import * as echarts from 'echarts';
import {produce} from 'immer';
import {isEmpty} from 'lodash';
import React, {useEffect, useRef, useState} from 'react';
import dayjs from "dayjs";

const Statistics: React.FC = ({}) => {
  const chartRefRight = useRef();
  const chartRefLeft = useRef();

  const [searchArgument, setSearchArgument] = useState<any>({
    startTime: '',
    endTime: '',
    brandId: 0,
    type: '',
    tagId: 0,
    tagSubId: undefined,
  });

  const [optionMap, setOptionMap] = useState<any>({
    brandOption: [],
    typeOption: [
      {value: 'urgent', label: '紧急'},
      {value: 'not_urgent', label: '固定'},
    ],
    tagOption: [],
    tagSubOption: [],
    originTag: [],
  });

  const optionRight = {
    title: {
      text: '总价与成本',
    },
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: [],
      show: true,
    },
    // x轴
    xAxis: [
      {
        type: 'category',
        data: ['报价单总价', '成本'],
      },
    ],
    // y轴
    yAxis: [
      {
        type: 'value',
      },
    ],
    series: [
      {
        data: [0, 0],
        type: 'bar',
      },
    ],
  };

  const optionLeft = {
    title: {
      text: '总数与利率',
    },
    tooltip: {
      trigger: 'axis',
      formatter: function (params) {
        let result = params[0].name + '<br/>';
        params.forEach(function (item) {
          if (item.name === '利率') {
            result += item.data + '%' + '<br/>';
          } else {
            result += item.data + '<br/>';
          }
        });
        return result;
      },
    },
    legend: {
      data: [],
      show: true,
    },
    // x轴
    xAxis: [
      {
        type: 'category',
        data: ['报价单总数', '利率'],
      },
    ],
    // y轴
    yAxis: [
      {
        type: 'value',
      },
    ],
    series: [
      {
        data: [0, 0],
        type: 'bar',
      },
    ],
  };

  const getData = (params: any) => {
    getByRules(params).then((value) => {
      if (value?.success && !isEmpty(value?.data)) {
        optionRight.series[0].data = [
          value?.data?.totalPrice ?? 0,
          value?.data?.cost ?? 0,
        ];

        const chartRight = echarts.init(chartRefRight.current);
        chartRight.setOption(optionRight);

        optionLeft.series[0].data = [
          value?.data?.quoNum ?? 0,
          value?.data?.rate ?? 0,
        ];

        const chartLeft = echarts.init(chartRefLeft.current);
        chartLeft.setOption(optionLeft);
      }
    });
  };

  const getBrand = () => {
    getBrandList().then((value) => {
      if (value?.success) {
        const list = value?.data.map((brand) => {
          return {
            value: brand.id,
            label: brand.brand_en,
          };
        });

        setOptionMap((pre) =>
          produce(pre, (draft) => {
            draft.brandOption = list;
          }),
        );
      }
    });
  };

  const onFirstTagChange = (tagId: any) => {
    const list = optionMap.originTag
      .filter((tag) => tag.pid === tagId)
      .map((tag) => ({value: tag.id, label: tag.name}));

    setOptionMap((pre) =>
      produce(pre, (draft) => {
        draft.tagSubOption = list;
      }),
    );
  };

  const getFirstLevelTags = (origins: any) => {
    return origins
      .filter((tag) => tag.pid === 0)
      .map((tag) => {
        return {
          value: tag.id,
          label: tag.name,
        };
      });
  };

  const getTagData = () => {
    getTags().then((value) => {
      if (value?.success) {
        setOptionMap((pre) =>
          produce(pre, (draft) => {
            draft.originTag = value?.data;
            draft.tagOption = getFirstLevelTags(value?.data);
          }),
        );
      }
    });
  };

  const getFirstDayOfMonthWithTime = () => {
    // 获取当前日期
    const currentDate = new Date();

    // 获取当前年和月
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // 创建一个新的日期对象，表示本月的第一天
    const firstDayOfMonth = new Date(year, month, 1);

    // 设置时间为08:00
    firstDayOfMonth.setHours(8, 0, 0, 0);

    // 格式化日期为"YYYY-MM-DD HH:MM"
    const formattedDate = firstDayOfMonth.toISOString().slice(0, 16).replace('T', ' ');

    return formattedDate;
  }

  useEffect(() => {
    const chartRight = echarts.init(chartRefRight.current);
    chartRight.setOption(optionRight);

    const chartLeft = echarts.init(chartRefLeft.current);
    chartLeft.setOption(optionLeft);

    const params = {
      ...searchArgument,
      startTime: getFirstDayOfMonthWithTime(),
    };

    getData(params);

    setSearchArgument((pre) =>
      produce(pre, (draft) => {
        draft.startTime = getFirstDayOfMonthWithTime()
      }));

    getBrand();
    getTagData();
  }, []);

  return (
    <>
      <Space>
        <Space>
          <div>开始时间：</div>
          {
            !isEmpty(searchArgument.startTime) &&
            <DatePicker
              defaultValue={dayjs(searchArgument.startTime, 'YYYY-MM-DD HH:mm')}
              format={'YYYY-MM-DD HH:mm'}
              showTime
              onOk={(date) => {
                const params = {
                  ...searchArgument,
                  startTime: date.format('YYYY-MM-DD HH:mm'),
                };
                getData(params);

                setSearchArgument((pre) =>
                  produce(pre, (draft) => {
                    draft.startTime = date.format('YYYY-MM-DD HH:mm');
                  }),
                );
              }}
            />
          }

        </Space>

        <Space>
          <div>结束时间：</div>
          <DatePicker
            format={'YYYY-MM-DD HH:mm'}
            showTime
            onOk={(date) => {
              const params = {
                ...searchArgument,
                endTime: date.format('YYYY-MM-DD HH:mm'),
              };
              getData(params);

              setSearchArgument((pre) =>
                produce(pre, (draft) => {
                  draft.endTime = date.format('YYYY-MM-DD HH:mm');
                }),
              );
            }}
          />
        </Space>
      </Space>

      <Space style={{marginTop: 12}}>
        <Space>
          <div>选择品牌：</div>
          <Select
            allowClear
            showSearch
            style={{minWidth: 120}}
            options={optionMap.brandOption}
            onChange={(id) => {
              const params = {
                ...searchArgument,
                brandId: id,
              };
              getData(params);

              setSearchArgument((pre) =>
                produce(pre, (draft) => {
                  draft.brandId = id;
                }),
              );
            }}
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
          />
        </Space>

        <Space>
          <div>选择类型：</div>
          <Select
            allowClear
            showSearch
            style={{minWidth: 120}}
            options={optionMap.typeOption}
            onChange={(value) => {
              const params = {
                ...searchArgument,
                typeId: value,
              };
              getData(params);

              setSearchArgument((pre) =>
                produce(pre, (draft) => {
                  draft.typeId = value;
                }),
              );
            }}
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
          />
        </Space>
      </Space>

      <Space style={{marginTop: 12}}>
        <Space>
          <div>一级标签：</div>
          <Select
            allowClear
            showSearch
            style={{minWidth: 120}}
            options={optionMap.tagOption}
            onChange={(id) => {
              const params = {
                ...searchArgument,
                tagId: id,
                tagSubId: undefined,
              };
              getData(params);

              setSearchArgument((pre) =>
                produce(pre, (draft) => {
                  draft.tagId = id;
                  draft.tagSubId = undefined;
                }),
              );

              onFirstTagChange(id);
            }}
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
          />
        </Space>

        <Space>
          <div>二级标签：</div>
          <Select
            allowClear
            showSearch
            style={{minWidth: 120}}
            options={optionMap.tagSubOption}
            onChange={(id) => {
              const params = {
                ...searchArgument,
                tagSubId: id,
              };
              getData(params);

              setSearchArgument((pre) =>
                produce(pre, (draft) => {
                  draft.tagSubId = id;
                }),
              );
            }}
            value={searchArgument.tagSubId}
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
          />
        </Space>
      </Space>

      <Divider/>

      <Space>
        <div style={{width: 400, height: 400}} ref={chartRefRight}></div>

        <div style={{width: 400, height: 400}} ref={chartRefLeft}></div>
      </Space>
    </>
  );
};

export default Statistics;
