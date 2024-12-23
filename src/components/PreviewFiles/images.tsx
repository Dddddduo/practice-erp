import React, { useState } from 'react';
import './ImageGallery.css'; // Make sure the path matches where your CSS file is
import { RotateLeftOutlined, RotateRightOutlined, ZoomInOutlined, ZoomOutOutlined } from '@ant-design/icons';


const ImageGallery = ({
  images = [],
                      }) => {
  const [previewImage, setPreviewImage] = useState({
    file_url_enough: ''
  });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  const openPreview = (image) => {
    setPreviewImage(image);
    setZoom(1);
    setRotation(0);
  };

  const closePreview = () => {
    setPreviewImage(null);
  };

  const zoomIn = () => {
    setZoom(zoom + 0.1);
  };

  const zoomOut = () => {
    if (zoom > 1) setZoom(zoom - 0.1);
  };

  const rotateRight = (e) => {
    e.stopPropagation()
    setRotation(rotation + 90);
  };

  const rotateLeft = () => {
    setRotation(rotation - 90);
  };

  return (
    <div>
      <div className="image-list">
        {images.map((image, index) => (
          <img
            key={index}
            src={image.file_url_enough}
            alt={`Gallery ${index}`}
            onClick={() => openPreview(image)}
          />
        ))}
      </div>
      {previewImage && (
        <div className="preview-modal" onClick={closePreview}>
          <div>
            <div className={'preview-image-container'}>
              <img
                className={'preview-image'}
                src={previewImage.file_url_enough}
                alt="Preview"
                style={{ transform: `scale(${zoom}) rotate(${rotation}deg)` }}
              />
            </div>
            <div className="controls">
              <ZoomInOutlined onClick={zoomIn} />
              <ZoomOutOutlined onClick={zoomOut} />
              <RotateLeftOutlined onClick={rotateLeft} />
              <RotateRightOutlined onClick={e => rotateRight(e)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageGallery;
