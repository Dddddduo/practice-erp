import React, { RefObject, useEffect, useState } from "react"
import { ProCard } from "@ant-design/pro-components"
import { useIntl } from "@umijs/max"
import type { ActionType } from '@ant-design/pro-components';
import { Button, Breadcrumb, Typography, Modal, List, Image, Space, Drawer, Table } from "antd";
import { FolderOutlined, ExclamationCircleFilled, FilePdfOutlined, FileImageOutlined } from "@ant-design/icons";
import { officeDocumentChildren, deleteDocument, destroyDocumentAnnexes } from "@/services/ant-design-pro/system";
import CreateFolder from "./CreateFolder";
import PermissionBinding from "./PermissionBinding";
import { includes } from "lodash";
import DeleteButton from "@/components/Buttons/DeleteButton";

interface ItemListProps {
  actionRef: RefObject<ActionType>;
  success: (text: string) => void
  error: (text: string) => void
}

const ItemList: React.FC<ItemListProps> = ({
  actionRef,
  success,
  error
}) => {
  const { confirm } = Modal;
  const [visible, setVisible] = useState(false)
  const [imageUrl, setImageUrl] = useState('')

  const { Text } = Typography;
  const intl = useIntl()
  const [showList, setShowList] = useState(false)
  const [showDelFile, setShowDelFile] = useState(false)
  const [currentItem, setCurrentItem] = useState({
    name: 'Home',
    id: 0
  })
  const [fileZip, setFileZip] = useState<any>([])
  const [breadcrumb, setBreadcrumb] = useState([{
    id: 0, title: <a onClick={() => {
      changeBreadcrumb({ id: 0, name: 'Home' })
      setPid(0)
    }}>Home</a>
  }])
  const [showCreateFolder, setShowCreateFolder] = useState(false)
  const [folder, setFolder] = useState<any>({
    id: 0,
    url: ''
  })
  const [pid, setPid] = useState(0)
  const [currentFolder, setCurrentFolder] = useState<any>([])
  const [file, setFile] = useState('')
  const [pictureUrl, setPictureUrl] = useState('')
  const [showPicture, setShowPicture] = useState(false)
  const [title, setTitle] = useState('')
  const [showBind, setShowBind] = useState(false)
  const [showStoreFile, setShowStoreFile] = useState(false)
  const [isUpload, setIsUpload] = useState(false)
  const [permissions, setPermissions] = useState({})

  const contentList = [
    {
      id: 1,
      title: '修改',
      isShow: permissions.is_admin
    },
    {
      id: 2,
      title: '删除',
      isShow: permissions.is_admin
    },
    {
      id: 3,
      title: '制度绑定',
      isShow: permissions.is_admin
    },
    {
      id: 4,
      title: '文件上传',
      isShow: permissions.can_upload
    }
  ]
  const fileList = [
    {
      id: 1,
      title: '下载'
    },
    {
      id: 2,
      title: '删除'
    }
  ]

  const contextMenuList = (id: number) => {
    if (id === 1) {
      setShowCreateFolder(true)
      setTitle('修改文件夹')
      setCurrentFolder(folder)
      setShowList(false)
    }
    if (id === 2) {
      setShowList(false)
      deleteDocument(folder.id).then(res => {
        if (res.success) {
          openFileZip({
            id: currentItem.parent_id,
            name: currentItem.name,
          }, 'open')
          success('删除成功')
          return
        }
        error(res.message)
      })
    }
    if (id === 3) {
      setShowList(false)
      setShowBind(true)
    }
    if (id === 4) {
      setShowList(false)
      setShowCreateFolder(true)
      setFile('file')
      setTitle('添加文件')
    }
  }

  const fileContentMenu = (id: number) => {
    if (id === 1) {
      success('提交下载成功，请等待')
      setShowDelFile(false)
      // window.open(folder?.url)
      const link = document.createElement('a');
      link.href = folder?.path;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    if (id === 2) {
      setShowDelFile(false)
      destroyDocumentAnnexes(folder.id).then(res => {
        if (res.success) {
          openFileZip(currentItem, 'open')
          success('删除成功')
          return
        }
        error(res.message)
      })
    }
  }

  const content = () => {
    const content: any = []
    contentList.map(item => {
      if (item.isShow) {
        content.push(item)
      }
    })
    return <List
      style={{ width: 100 }}
      dataSource={content}
      renderItem={(item: any, index) => (
        <List.Item key={item.id}>
          <List.Item.Meta
            title={
              <div style={{ cursor: 'pointer' }} onClick={() => contextMenuList(item.id)}>{item.title}</div>
            }
          />
        </List.Item>
      )}
    />
  }

  const fileContent = (
    <List
      style={{ width: 100 }}
      dataSource={fileList}
      renderItem={(item, index) => (
        <List.Item key={item.id}>
          <List.Item.Meta
            title={
              <div style={{ cursor: 'pointer' }} onClick={() => fileContentMenu(item.id)}>{item.title}</div>
            }
          />
        </List.Item>
      )}
    />
  )

  const updateBreadcrumb = (item: any) => {
    setBreadcrumb(preState => {
      const index = preState.findIndex(pre => pre.id === item.id)
      if (index !== -1) {
        preState.splice(index + 1)
        return preState
      }
      if (!preState.find(pre => pre.id === item.id)) {
        return [
          ...preState,
          {
            id: item.id,
            title: <a>{item.name}</a>,
            onClick: () => {
              changeBreadcrumb(item)
            }
          }
        ]
      }
      return preState
    })
  }

  const openFileZip = (
    item: any,
    type: string
  ) => {
    if (item.storeStatus) {
      setIsUpload(true)
    }
    let tmpId
    if (type === 'open') {
      tmpId = item.id
    } else {
      tmpId = item.parent_id
    }
    setCurrentItem(item)
    setPid(tmpId)
    officeDocumentChildren(tmpId).then(res => {
      if (res.success) {
        setPermissions(res.data)
        let folders = res.data.folders
        let files = res.data.files
        console.log([...folders, ...files], type, item);
        setFileZip([...folders, ...files])
        if (type === 'open') {
          updateBreadcrumb(item)
        }
      }
    })
  }

  const changeBreadcrumb = (item: any) => {
    openFileZip(item, 'open')
  }

  const handleCloseCreateFolder = () => {
    setShowCreateFolder(false)
    setCurrentFolder({})
    setFile('')
  }

  const isImageURL = (url: string) => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.JPG', '.PNG', '.JPEG', 'gif', '.GIF'];
    const extension = url.substring(url.lastIndexOf('.')).toLowerCase();
    return imageExtensions.includes(extension);
  }

  const handleClosePicture = () => {
    setShowPicture(false)
    setPictureUrl('')
  }

  const handleCloseBind = () => {
    setShowBind(false)
    // setIsUpload(false)
  }

  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      align: 'center',
      width: 400,
      render: (dom, entity) => {
        return (
          <div
            style={{
              display: "flex",
              alignItems: 'center',
              cursor: 'pointer'
            }}
            onClick={() => {
              if (!entity.original_file_name) {
                openFileZip(entity, 'open')
                return
              }
              const imageSuffix = ['jpg', 'jpeg', 'png', 'gif'];
              const suffix = entity.original_file_name.split('.')[entity.original_file_name.split('.').length - 1]
              if (includes(imageSuffix, suffix.toLowerCase())) {
                setVisible(true)
                setImageUrl(entity.path)
              } else {
                window.open(entity.path, 'blank')
              }
              // if (suffix === 'pdf' || suffix === 'PDF') {
              //
              // }
            }}
          >
            {
              entity.original_file_name ?
                <div>
                  {
                    (
                      entity.original_file_name.split('.')[entity.original_file_name.split('.').length - 1] === 'pdf' ||
                      entity.original_file_name.split('.')[entity.original_file_name.split('.').length - 1] === 'PDF'
                    ) ?
                      <FilePdfOutlined style={{ color: 'pink', fontSize: 18 }} /> :
                      // <Image
                      //   preview={
                      //     <FileImageOutlined style={{ color: 'green', fontSize: 18 }} />
                      //   }
                      // />
                      <FileImageOutlined style={{ color: 'green', fontSize: 18 }} />
                  }
                </div> :
                <div>
                  <FolderOutlined style={{ color: 'skyblue', fontSize: 18 }} />
                </div>
            }
            <span style={{ marginLeft: 10 }}>{entity.name}</span>
          </div>
        )
      }
    },
    {
      title: '创建时间',
      width: 300,
      align: 'center',
      dataIndex: 'created_at',
    },
    {
      title: '操作',
      dataIndex: '',
      align: 'center',
      render: (dom, entity) => {
        return (
          <Space>
            {/*{*/}
            {/*  entity.original_file_name &&*/}
            {/*  DownloadLink(entity.path)*/}
            {/*}*/}
            <Button
              type="primary"
              onClick={() => {
                setShowCreateFolder(true)
                setTitle('修改文件夹')
                setCurrentFolder(entity)
              }}
            >
              修改
            </Button>
            <Button
              type="primary"
              onClick={() => {
                setShowBind(true)
                setFolder(entity)
              }}
            >
              制度分配
            </Button>
            <Button
              type="primary"
              onClick={() => {
                setShowCreateFolder(true)
                setFile('file')
                setTitle('添加文件')
                setCurrentItem(entity)
              }}
            >
              文件上传
            </Button>
            {/* <Button danger onClick={() => showConfirm(entity)}>
              删除
            </Button> */}
            <DeleteButton danger onConfirm={() => showConfirm(entity)}>删除</DeleteButton>
          </Space>
        )
      }
    }
  ]

  const DownloadLink = (fielUrl) => {
    return (
      <a href={fielUrl} target="_blank" rel="noreferrer" download>下载</a>
    )
  }

  const showConfirm = (item) => {
    if (item.original_file_name) {
      destroyDocumentAnnexes(item.id).then(res => {
        if (res.success) {
          openFileZip({
            id: item.folder_id,
            name: item.name,
          }, 'open')
          success('删除成功')
          return
        }
        error(res.message)
      })
      return
    }
    // 
    deleteDocument(item.id).then(res => {
      if (res.success) {
        openFileZip({
          id: item.parent_id,
          name: item.name,
        }, 'open')
        success('删除成功')
        return
      }
      error(res.message)
    })
  };

  useEffect(() => {
    officeDocumentChildren(0).then(res => {
      if (res.success) {
        setPermissions(res.data)
        setFileZip(res.data.folders)
        if (res.data.storeStatus) {
          setIsUpload(true)
        }
      }
    })
  }, [])

  return (
    <>
      <ProCard
        title={
          <Breadcrumb>
            {
              breadcrumb.map((item: any) => {
                return (
                  <Breadcrumb.Item onClick={item.onClick}>{item.title}</Breadcrumb.Item>
                )
              })
            }
          </Breadcrumb>
        }
        headerBordered
        extra={
          <>
            {
              <Space>
                {
                  pid !== 0 && permissions.can_upload &&
                  <Button
                    type="primary"
                    onClick={() => {
                      setShowCreateFolder(true)
                      setFile('file')
                      setTitle('创建文件')
                    }}
                  >
                    新建文件
                  </Button>
                }
                {
                  permissions.is_admin &&
                  <Button
                    type="primary"
                    onClick={() => {
                      setShowCreateFolder(true)
                      setTitle('创建文件夹')
                    }}
                  >
                    新建文件夹
                  </Button>
                }
              </Space>
            }
          </>
        }
      >
        <Table
          pagination={false}
          dataSource={fileZip}
          columns={columns}
        />
        <Image
          width={200}
          style={{ display: 'none' }}
          src={imageUrl}
          preview={{
            visible,
            src: imageUrl,
            onVisibleChange: (value) => {
              setVisible(value);
            },
          }}
        />
      </ProCard>

      <Modal
        width={600}
        title={title}
        open={showCreateFolder}
        destroyOnClose={true}
        onCancel={handleCloseCreateFolder}
        footer={null}
      >
        <CreateFolder
          handleCloseCreateFolder={handleCloseCreateFolder}
          success={success}
          error={error}
          currentItem={currentItem}
          openFileZip={openFileZip}
          currentFolder={currentFolder}
          file={file}
        />
      </Modal>

      <Modal
        width={550}
        open={showPicture}
        destroyOnClose={true}
        onCancel={handleClosePicture}
        footer={null}
      >
        <Image src={pictureUrl} />
      </Modal>

      <Drawer
        width={800}
        open={showBind}
        destroyOnClose={true}
        onClose={handleCloseBind}
        title="权限分配"
      >
        <PermissionBinding
          folder={folder}
          handleCloseBind={handleCloseBind}
          success={success}
          error={error}
          currentItem={currentItem}
          openFileZip={openFileZip}
          isUpload={isUpload}
        />
      </Drawer>
    </>
  )
}

export default ItemList
