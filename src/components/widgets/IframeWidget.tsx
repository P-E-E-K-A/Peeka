import React, { useState, useRef, useEffect } from 'react';
import { ResizableBox } from 'react-resizable';
import type { Widget } from '../../indifycore/types';
import 'react-resizable/css/styles.css';

interface IframeWidgetProps {
  widget: Widget;
  onRemove: (widgetId: string) => void;
}

export const IframeWidget: React.FC<IframeWidgetProps> = ({ widget, onRemove }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 400, height: 300 });
  const [isResizing, setIsResizing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const widgetRef = useRef<HTMLDivElement>(null);

  // Handle iframe load to set initial size based on content
  const handleLoad = (event: React.SyntheticEvent<HTMLIFrameElement>) => {
    setIsLoading(false);
    try {
      const iframe = event.currentTarget;
      const contentHeight = iframe.contentWindow?.document.body.scrollHeight;
      const contentWidth = iframe.contentWindow?.document.body.scrollWidth;

      if (contentHeight && contentWidth) {
        setDimensions({
          width: Math.min(contentWidth + 20, window.innerWidth - 40),
          height: Math.min(contentHeight + 20, window.innerHeight - 40),
        });
      }
    } catch (error) {
      console.error('Error getting iframe content size:', error);
    }
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  // Handle resize events
  const handleResizeStart = () => {
    setIsResizing(true);
  };

  const handleResizeStop = (_: React.SyntheticEvent, { size }: { size: { width: number; height: number } }) => {
    setDimensions({ width: size.width, height: size.height });
    setIsResizing(false);
  };

  // Handle right-click context menu
  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setShowMenu(true);

    // Calculate position relative to the widget's bounding box
    const widgetRect = widgetRef.current?.getBoundingClientRect();
    if (widgetRect) {
      const x = event.clientX - widgetRect.left;
      const y = event.clientY - widgetRect.top;

      // Ensure menu stays within widget boundaries
      const menuWidth = 120; // Approximate menu width
      const menuHeight = 50; // Approximate menu height
      const maxX = widgetRect.width - menuWidth;
      const maxY = widgetRect.height - menuHeight;
      setMenuPosition({
        x: Math.max(0, Math.min(x, maxX)),
        y: Math.max(0, Math.min(y, maxY)),
      });
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (widgetRef.current && !widgetRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('contextmenu', (e) => {
      if (widgetRef.current && !widgetRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    });
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('contextmenu', handleClickOutside);
    };
  }, []);

  return (
    <div
      className="masonry-item relative"
      style={{ marginBottom: '16px' }}
      onContextMenu={handleContextMenu}
      ref={widgetRef}
    >
      {/* Overlay to capture right-clicks over iframe */}
      <div
        className="absolute inset-0 z-10"
        style={{ pointerEvents: isLoading || hasError ? 'none' : 'auto' }}
        onContextMenu={handleContextMenu}
      />
      <ResizableBox
        width={dimensions.width}
        height={dimensions.height}
        minConstraints={[200, 150]}
        maxConstraints={[window.innerWidth - 40, window.innerHeight - 40]}
        onResizeStart={handleResizeStart}
        onResizeStop={handleResizeStop}
        handle={
          <span className="custom-resize-handle absolute bottom-0 right-0 w-4 h-4 bg-gray-300 dark:bg-gray-600 cursor-se-resize rounded-full" />
        }
        className={`iframe-widget bg-white dark:bg-gray-50 rounded-lg shadow-sm overflow-hidden flex flex-col border-2 ${
          isResizing ? 'border-dotted border-gray-400 dark:border-gray-600' : 'border-transparent'
        }`}
      >
        <div className="widget-content flex-1 relative" style={{ width: '100%', height: '100%' }}>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-gray-50">
              <div className="flex flex-col items-center gap-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-600"></div>
                <span className="text-sm text-gray-500">Loading...</span>
              </div>
            </div>
          )}

          {hasError && (
            <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-gray-50 p-4">
              <div className="text-center">
                <svg className="w-10 h-10 mx-auto text-red-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-500 text-sm font-medium mb-2">Failed to load widget</p>
                <a
                  href={widget.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-800 text-sm"
                >
                  Open in new tab
                </a>
              </div>
            </div>
          )}

          <iframe
            src={widget.url}
            title={widget.name}
            className="w-full h-full border-0"
            style={{ display: hasError ? 'none' : 'block' }}
            onLoad={handleLoad}
            onError={handleError}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            loading="lazy"
          />
        </div>

        {showMenu && (
          <div
            className="absolute z-20 bg-white dark:bg-gray-100 rounded-md shadow-lg py-1 border border-gray-200 dark:border-gray-300"
            style={{ top: menuPosition.y, left: menuPosition.x }}
          >
            <button
              onClick={() => {
                onRemove(widget.id);
                setShowMenu(false);
              }}
              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-800 hover:bg-gray-100 dark:hover:bg-gray-200 w-full text-left"
            >
              Close Widget
            </button>
          </div>
        )}
      </ResizableBox>
    </div>
  );
};

export default IframeWidget;