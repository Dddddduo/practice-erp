import React, { useEffect, useState } from "react"
import { Graph, Shape } from '@antv/x6';
import { Stencil } from '@antv/x6-plugin-stencil'
import insertCss from 'insert-css'
import { Transform } from '@antv/x6-plugin-transform'
import { Selection } from '@antv/x6-plugin-selection'
import { Snapline } from '@antv/x6-plugin-snapline'
import { Keyboard } from '@antv/x6-plugin-keyboard'
import { History } from '@antv/x6-plugin-history'
import { difference, isEmpty } from "lodash";

interface Props {
  floor: string
  currentImg: string
  handleAddCell: (node: any, width: number, height: number) => void
  deviceNameList: {
    device_name: string
    device_location: {
      location_x: number
      location_y: number
    }
  }[]
  cell: any[]
}

const MarkImage: React.FC<Props> = ({
  floor,
  currentImg,
  handleAddCell,
  deviceNameList,
  cell
}) => {
  let tempWidth = 0, tempHeight = 0

  const preWork = async () => {
    const container = document.getElementById('container')!
    const stencilContainer = document.createElement('div')
    stencilContainer.id = 'stencil'
    const graphContainer = document.createElement('div')
    graphContainer.id = 'graph'
    container.appendChild(stencilContainer)
    container.appendChild(graphContainer)

    const img = new Image()
    img.crossOrigin = "Anonymous";
    img.src = currentImg
    img.onload = () => {
      // 图像加载完成后执行的操作
      if (img.width > 0 && img.height > 0) {
        if (img.width / img.height >= 1) {
          if (img.width > 1400) {
            tempWidth = 1400
            tempHeight = (img.height * 700) / img.width
          } else {
            tempWidth = 1400
            tempHeight = 700
          }
        } else {
          if (img.height > 700) {
            tempHeight = 700;
            tempWidth = (img.width * 1400) / img.height;
          } else {
            tempWidth = img.width;
            tempHeight = img.height;
          }
        }
      }
      initCanvas()
    };

    insertCss(`
      #container {
        display: flex;
        border: 1px solid #dfe3e8;
        box-sizing: border-box;
      }
      #stencil {
        width: 300px;
        height: 700px;
        position: relative;
        border-right: 1px solid #dfe3e8;
      }
      #graph-container {
        width: calc(100% - 180px);
        height: 100%;
      }
      .x6-widget-stencil  {
        background-color: #fff;
      }
      .x6-widget-stencil-title {
        background-color: #fff;
      }
      .x6-widget-stencil-group-title {
        background-color: #fff !important;
      }
      .x6-widget-transform {
        margin: -1px 0 0 -1px;
        padding: 0px;
        border: 1px solid #239edd;
      }
      .x6-widget-transform > div {
        border: 1px solid #239edd;
      }
      .x6-widget-transform > div:hover {
        background-color: #3dafe4;
      }
      .x6-widget-transform-active-handle {
        background-color: #3dafe4;
      }
      .x6-widget-transform-resize {
        border-radius: 0;
      }
      .x6-widget-selection-inner {
        border: 1px solid #239edd;
      }
      .x6-widget-selection-box {
        opacity: 0;
      }
    `)
  }

  const init = async () => {
    await preWork()
  }

  const initCanvas = () => {
    let allShareList = []
    const graph = new Graph({
      container: document.getElementById('graph')!,
      width: tempWidth,
      height: tempHeight,
      grid: {
        size: 1,
        visible: currentImg ? false : true
      },
      background: { image: currentImg, size: 'contain' },
      connecting: {
        router: 'manhattan',
        connector: {
          name: 'rounded',
          args: {
            radius: 8,
          },
        },
        anchor: 'center',
        connectionPoint: 'anchor',
        allowBlank: false,
        snap: {
          radius: 20,
        },
        createEdge() {
          return new Shape.Edge({
            attrs: {
              line: {
                stroke: '#A2B1C3',
                strokeWidth: 2,
                targetMarker: {
                  name: 'block',
                  width: 12,
                  height: 8,
                },
              },
            },
            zIndex: 0,
          })
        },
        validateConnection({ targetMagnet }) {
          return !!targetMagnet
        },
      },
      highlighting: {
        magnetAdsorbed: {
          name: 'stroke',
          args: {
            attrs: {
              fill: '#5F95FF',
              stroke: '#5F95FF',
            },
          },
        },
      },
    })

    graph
      // .use(
      //   new Transform({
      //     resizing: true,
      //     rotating: true,
      //   }),
      // )
      .use(
        new Selection({
          rubberband: true,
          showNodeSelectionBox: true,
        }),
      )
      .use(new Snapline())
      .use(new Keyboard())
      .use(new History())

    // #region 初始化 stencil
    const stencil = new Stencil({
      title: '设备列表',
      target: graph,
      stencilGraphWidth: 320,
      stencilGraphHeight: 600,
      collapsable: false,
      groups: [
        {
          title: '设备列表',
          name: 'group',
        },
      ],
      layoutOptions: {
        columns: 4,
        columnWidth: 68,
        rowHeight: 36,
      },
    })
    document.getElementById('stencil')!.appendChild(stencil.container)

    const ports = {
      groups: {
        top: {
          position: 'top',
          attrs: {
            circle: {
              r: 3,
              magnet: true,
              stroke: '#5F95FF',
              strokeWidth: 1,
              fill: '#fff',
            },
          },
        },
        right: {
          position: 'right',
          attrs: {
            circle: {
              r: 3,
              magnet: true,
              stroke: '#5F95FF',
              strokeWidth: 1,
              fill: '#fff',
            },
          },
        },
        bottom: {
          position: 'bottom',
          attrs: {
            circle: {
              r: 3,
              magnet: true,
              stroke: '#5F95FF',
              strokeWidth: 1,
              fill: '#fff',
            },
          },
        },
        left: {
          position: 'left',
          attrs: {
            circle: {
              r: 3,
              magnet: true,
              stroke: '#5F95FF',
              strokeWidth: 1,
              fill: '#fff',
            },
          },
        },
      },
      items: [
        {
          group: 'top',
        },
        {
          group: 'right',
        },
        {
          group: 'bottom',
        },
        {
          group: 'left',
        },
      ],
    }

    Graph.registerNode(
      'custom-rect',
      {
        inherit: 'rect',
        width: 56,
        height: 24,
        attrs: {
          body: {
            strokeWidth: 1,
            stroke: '#5F95FF',
            fill: '#EFF4FF80',
          },
          text: {
            fontSize: 12,
            fill: '#262626',
          },
        },
        ports: { ...ports },
      },
      true,
    )

    let shareList: any = []
    let list = !isEmpty(cell[floor]) ? cell[floor] : deviceNameList
    console.log(list)
    deviceNameList.map(item => {
      shareList.push(
        graph.createNode({
          shape: 'custom-rect',
          label: item.device_name,
          attrs: {
            body: {
              rx: 10,
              ry: 10,
            },
          },
        })
      )
    })
    list.map(item => {
      if (item?.device_name) {
        if (!isEmpty(item.device_location)) {
          graph.addNode({
            shape: 'custom-rect', // 指定使用何种图形，默认值为 'rect'
            x: item.device_location?.location_x,
            y: item.device_location?.location_y,
            width: 56,
            height: 24,
            attrs: {
              body: {
                rx: 10,
                ry: 10,
              },
              label: {
                text: item?.device_name,
              },
            },
          })
        }
      } else {
        graph.addNode({
          shape: 'custom-rect', // 指定使用何种图形，默认值为 'rect'
          x: item.position?.x,
          y: item.position?.y,
          width: 56,
          height: 24,
          attrs: {
            body: {
              rx: 10,
              ry: 10,
            },
            label: {
              text: item?.attrs?.text?.text ?? item?.attrs?.label?.text,
            },
          },
        })
      }
    })

    if (!isEmpty(shareList) || !isEmpty(graph.toJSON()?.cells)) {
      let formatShare: any = []
      const allShare = shareList?.map(share => share.attrs?.text?.text ?? share.attrs?.label?.text)
      const markShare = graph.toJSON()?.cells?.map(cell => cell.attrs?.label?.text ?? cell.attrs?.text?.text)
      console.log(difference(allShare, markShare))
      difference(allShare, markShare)?.map(item => {
        formatShare.push(
          graph.createNode({
            shape: 'custom-rect',
            label: item,
            attrs: {
              body: {
                rx: 10,
                ry: 10,
              },
            },
          })
        )
      })
      stencil.load(formatShare, 'group')
      allShareList = formatShare
    }

    graph.bindKey(['meta+c', 'ctrl+c'], () => {
      const cells = graph.getSelectedCells()
      if (cells.length) {
        graph.copy(cells)
      }
      return false
    })
    graph.bindKey(['meta+x', 'ctrl+x'], () => {
      const cells = graph.getSelectedCells()
      if (cells.length) {
        graph.cut(cells)
      }
      return false
    })
    graph.bindKey(['meta+v', 'ctrl+v'], () => {
      if (!graph.isClipboardEmpty()) {
        const cells = graph.paste({ offset: 32 })
        graph.cleanSelection()
        graph.select(cells)
      }
      return false
    })

    // undo redo
    graph.bindKey(['meta+z', 'ctrl+z'], () => {
      if (graph.canUndo()) {
        graph.undo()
      }
      return false
    })

    // select all
    graph.bindKey(['meta+a', 'ctrl+a'], () => {
      const nodes = graph.getNodes()
      if (nodes) {
        graph.select(nodes)
      }
    })

    // delete
    graph.bindKey('backspace', () => {
      const cells = graph.getSelectedCells()
      if (cells.length) {
        graph.removeCells(cells)
        graph.createNode({
          shape: 'custom-rect',
          label: cells[0]?.attrs?.label?.text ?? cells[0]?.attrs?.text?.text,
          attrs: {
            body: {
              rx: 10,
              ry: 10,
            },
          },
        })
        const newShare = [...allShareList, ...cells]
        stencil.load(newShare, 'group')
        allShareList = newShare
      }
      handleAddCell(graph.toJSON().cells, tempWidth, tempHeight)
    })

    graph.on('node:added', (e) => {
      handleAddCell(graph.toJSON().cells, tempWidth, tempHeight)
      const allShare = shareList.map(item => item.attrs.text.text ?? item.attrs.text.label)
      const marketShare = graph.toJSON().cells.map(item => item.attrs?.text?.text ?? item.attrs?.label?.text)

      let newShare: any = []
      difference(allShare, marketShare)?.map(item => {
        newShare.push(
          graph.createNode({
            shape: 'custom-rect',
            label: item,
            attrs: {
              body: {
                rx: 10,
                ry: 10,
              },
            },
          })
        )
      })
      stencil.load(newShare, 'group')
      allShareList = newShare
    })
    graph.on('node:mouseup', (e) => {
      handleAddCell(graph.toJSON().cells, tempWidth, tempHeight)
    })
  }

  useEffect(() => {
    init()
  }, [])

  return (
    // <Image id="graph" src={currentImg} preview={false} width={550} />
    <div
      id="container"
      style={{
        display: 'flex',
        justifyContent: 'space-between',
      }}
    ></div>
  )
}

export default MarkImage
