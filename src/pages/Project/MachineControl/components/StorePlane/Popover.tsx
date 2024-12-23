import React,{useState , useEffect } from 'react';

interface Props {
  direction: string;
  content: string;
  backgroundColor: string;
  textColor: string;
  height: number;
  minWidth: number;
  maxWidth: number;
  borderRadius: number;
  arrowSizes: number;
  contentRef: any;
}

const Popover: React.FC<Props> = ({
  direction = 'top',
  content,
  backgroundColor = '#ffffff',
  textColor = '#000000',
  height = 40,
  minWidth = 100,
  maxWidth = 500,
  borderRadius = 8,
  arrowSizes = 10,
  contentRef,
}) => {
  const [width, setWidth] = useState(minWidth);
  useEffect(() => {
    if (contentRef?.current) {
      const contentWidth = contentRef.current.scrollWidth;

      // console.log('contentWidth', contentWidth, content)


      setWidth(Math.max(minWidth, Math.min(contentWidth, maxWidth)));
    }
  }, [content, minWidth, maxWidth]);

  const getPath = () => {
    const arrowSize = arrowSizes;
    const r = borderRadius;
    const w = width;
    const h = height;

    switch (direction) {
      case 'top':
        return `
          M${r},${arrowSize}
          H${w - r}
          A${r},${r} 0 0 1 ${w},${arrowSize + r}
          V${h + arrowSize - r}
          A${r},${r} 0 0 1 ${w - r},${h + arrowSize}
          H${r}
          A${r},${r} 0 0 1 0,${h + arrowSize - r}
          V${arrowSize + r}
          A${r},${r} 0 0 1 ${r},${arrowSize}
          Z
          M${w / 2 - arrowSize},${arrowSize}
          L${w / 2},0
          L${w / 2 + arrowSize},${arrowSize}`;
      case 'bottom':
        return `
          M${r},0
          H${w - r}
          A${r},${r} 0 0 1 ${w},${r}
          V${h - r}
          A${r},${r} 0 0 1 ${w - r},${h}
          H${r}
          A${r},${r} 0 0 1 0,${h - r}
          V${r}
          A${r},${r} 0 0 1 ${r},0
          Z
          M${w / 2 - arrowSize},${h}
          L${w / 2},${h + arrowSize}
          L${w / 2 + arrowSize},${h}`;
      case 'left':
        return `
          M${arrowSize + r},0
          H${w + arrowSize - r}
          A${r},${r} 0 0 1 ${w + arrowSize},${r}
          V${h - r}
          A${r},${r} 0 0 1 ${w + arrowSize - r},${h}
          H${arrowSize + r}
          A${r},${r} 0 0 1 ${arrowSize},${h - r}
          V${r}
          A${r},${r} 0 0 1 ${arrowSize + r},0
          Z
          M${arrowSize},${h / 2 - arrowSize}
          L0,${h / 2}
          L${arrowSize},${h / 2 + arrowSize}`;
      case 'right':
        return `
          M${r},0
          H${w - r}
          A${r},${r} 0 0 1 ${w},${r}
          V${h - r}
          A${r},${r} 0 0 1 ${w - r},${h}
          H${r}
          A${r},${r} 0 0 1 0,${h - r}
          V${r}
          A${r},${r} 0 0 1 ${r},0
          Z
          M${w},${h / 2 - arrowSize}
          L${w + arrowSize},${h / 2}
          L${w},${h / 2 + arrowSize}`;
      default:
        return '';
    }
  };


  return (
  <svg width={width + arrowSizes} height={height + arrowSizes} className="popover">
    <path d={getPath()} fill={backgroundColor} />
    <foreignObject
      x={direction === 'left' ? 10 : 0}
      y={direction === 'top' ? 10 : 0}
      width={width}
      height={height}
    >
      <div
        ref={contentRef}
        // @ts-ignore
        xmlns="http://www.w3.org/1999/xhtml"
        style={{
          color: textColor,
          padding: 10,
          boxSizing: 'border-box',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {content}
      </div>
    </foreignObject>
  </svg>
)};
export default Popover;
