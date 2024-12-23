import React, { useCallback, useEffect, useRef } from 'react';
import {
  ClickEnum,
  DetailBoxData,
  PlaneImgDevice,
  PlaneImgShapeData,
} from '@/viewModel/Project/useMachineControl';
import { produce } from 'immer';
import DevicePoint from '@/pages/Project/MachineControl/components/StorePlane/DevicePoint';
import DeviceCard from '@/pages/Project/MachineControl/components/StorePlane/DeviceCard';

interface Props {
  planeImgShapeData: PlaneImgShapeData;
  planeImgDeviceList: PlaneImgDevice[];
  planeImgDeviceCard: DetailBoxData;
  handleOnChange: (path: string, value: any) => void;
  deviceState: boolean;
}

const StorePlane: React.FC<Props> = (props) => {
  const { planeImgShapeData, planeImgDeviceList, planeImgDeviceCard, handleOnChange , deviceState } = props;
  const [dragInfo, setDragInfo] = React.useState({
    position: { x: 0, y: 0 },
    scale: 1,
    isDragging: false,
    dragStart: { x: 0, y: 0 },
  });

  const isDraggingRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    setDragInfo(
      produce((draft) => {
        draft.dragStart = {
          x: e.clientX - draft.position.x,
          y: e.clientY - draft.position.y,
        };
      }),
    );
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDraggingRef.current) {
      setDragInfo(
        produce((draft) => {
          draft.position = {
            x: e.clientX - draft.dragStart.x,
            y: e.clientY - draft.dragStart.y,
          };
        }),
      );
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false;
  }, []);

  const handleWheel = useCallback((e: WheelEvent) => {
    if (containerRef.current && containerRef.current.contains(e.target as Node)) {
      e.preventDefault();
      setDragInfo(
        produce((draft) => {
          draft.scale = Math.max(0.1, draft.scale - e.deltaY * 0.001);
        }),
      );
    }
  }, []);

  const changeScale = useCallback((delta: number) => {
    setDragInfo(
      produce((draft) => {
        draft.scale = Math.max(0.1, draft.scale + delta);
      }),
    );
  }, []);

  useEffect(() => {
    /**
     * 全局滚轮事件监听器
     * @param e
     */
    const handleGlobalWheel = (e: WheelEvent) => {
      if (containerRef.current && containerRef.current.contains(e.target as Node)) {
        e.preventDefault();
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('wheel', handleGlobalWheel, { passive: false });
    document.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('wheel', handleGlobalWheel);
      document.removeEventListener('wheel', handleWheel);
    };
  }, [handleMouseMove, handleMouseUp, handleWheel]);

  return (
    <>
      <div
        className={`relative flex justify-center items-center overflow-hidden`}
        style={{
          width: planeImgShapeData.containW,
          height: planeImgShapeData.containH,
        }}
      >
        {planeImgShapeData.imageW ? <></> : <>数据加载中...</>}
        <div
          ref={containerRef}
          className={'absolute cursor-move'}
          style={{
            width: planeImgShapeData.imageW,
            height: planeImgShapeData.imageH,
            transformOrigin: 'center',
            transform: `translate(${dragInfo.position.x}px, ${dragInfo.position.y}px) scale(${dragInfo.scale})`,
          }}
          onMouseDown={handleMouseDown}
        >
          {/*平面图*/}
          <img
            alt={'plane'}
            src={planeImgShapeData.planImgSource}
            style={{
              pointerEvents: 'none',
              width: planeImgShapeData.imageW,
              height: planeImgShapeData.imageH,
            }}
          />
          {/*设备标记点*/}
          {planeImgDeviceList.map((item, index) => {
            // console.log('设备标记点', item);
            return (
              <div
                key={index}
                style={{
                  position: 'absolute',
                  top: item.y,
                  left: item.x,
                }}
              >
                <DevicePoint
                  planeImgDevice={item}
                  handleOnChange={() => {
                    //在线时执行 离线状态下不可点击
                    if(deviceState) {
                      handleOnChange('onOpenDevice', item)
                    }
                  }}
                  status={deviceState}
                />
              </div>
            );
          })}
          {/*设备详情*/}
          {planeImgDeviceCard.showDetailBox && deviceState && (
            <div
              style={{
                position: 'absolute',
                top: planeImgDeviceCard.y,
                left: planeImgDeviceCard.x,
              }}
            >
              <DeviceCard
                type={planeImgDeviceCard.type}
                aloneData={planeImgDeviceCard.aloneData}
                groupData={planeImgDeviceCard.groupsData}
                onClick={(arg) => {
                  handleOnChange('openCardDetail', arg);
                }}
                onClose={() => {
                  handleOnChange('openCardDetail',false);
                }}
              ></DeviceCard>
            </div>
          )}
        </div>
      </div>
      {/* 缩放按钮 */}
      <div className="fixed bottom-4 right-4 flex gap-2">
        {/* eslint-disable-next-line react/button-has-type */}
        <button className="bg-gray-200 p-2 rounded" onClick={() => changeScale(0.1)}>
          放大
        </button>
        {/* eslint-disable-next-line react/button-has-type */}
        <button className="bg-gray-200 p-2 rounded" onClick={() => changeScale(-0.1)}>
          缩小
        </button>
      </div>
    </>
  );
};

export default StorePlane;
