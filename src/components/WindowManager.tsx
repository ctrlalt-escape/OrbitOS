
import { useState, useRef } from 'react';
import { useOrbitOS, Window } from '../context/OrbitOSContext';
import { X, Minus, Maximize } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Position {
  x: number;
  y: number;
}

interface Size {
  width: number;
  height: number;
}

const WindowManager = () => {
  const { windows, closeWindow, minimizeWindow, focusWindow } = useOrbitOS();
  const [dragging, setDragging] = useState<string | null>(null);
  const [resizing, setResizing] = useState<string | null>(null);
  const [startDragPos, setStartDragPos] = useState<Position>({ x: 0, y: 0 });
  const [startResizePos, setStartResizePos] = useState<Position>({ x: 0, y: 0 });
  const [startWindowPos, setStartWindowPos] = useState<Position>({ x: 0, y: 0 });
  const [startWindowSize, setStartWindowSize] = useState<Size>({ width: 0, height: 0 });
  const windowRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const handleDragStart = (e: React.MouseEvent, window: Window) => {
    e.preventDefault();
    focusWindow(window.id);
    setDragging(window.id);
    setStartDragPos({ x: e.clientX, y: e.clientY });
    setStartWindowPos({ x: window.x, y: window.y });
  };

  const handleResizeStart = (e: React.MouseEvent, window: Window) => {
    e.preventDefault();
    e.stopPropagation();
    focusWindow(window.id);
    setResizing(window.id);
    setStartResizePos({ x: e.clientX, y: e.clientY });
    setStartWindowSize({ width: window.width, height: window.height });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragging) {
      const window = windows.find(w => w.id === dragging);
      if (!window) return;

      const deltaX = e.clientX - startDragPos.x;
      const deltaY = e.clientY - startDragPos.y;
      
      const newX = Math.max(0, startWindowPos.x + deltaX);
      const newY = Math.max(0, startWindowPos.y + deltaY);
      
      const windowElem = windowRefs.current[window.id];
      if (windowElem) {
        windowElem.style.transform = `translate(${newX}px, ${newY}px)`;
      }
    }
    
    if (resizing) {
      const window = windows.find(w => w.id === resizing);
      if (!window) return;

      const deltaX = e.clientX - startResizePos.x;
      const deltaY = e.clientY - startResizePos.y;
      
      const newWidth = Math.max(300, startWindowSize.width + deltaX);
      const newHeight = Math.max(200, startWindowSize.height + deltaY);
      
      const windowElem = windowRefs.current[window.id];
      if (windowElem) {
        windowElem.style.width = `${newWidth}px`;
        windowElem.style.height = `${newHeight}px`;
      }
    }
  };

  const handleMouseUp = () => {
    if (!dragging && !resizing) return;
    
    if (dragging) {
      const window = windows.find(w => w.id === dragging);
      if (window) {
        const windowElem = windowRefs.current[window.id];
        if (windowElem) {
          const transform = windowElem.style.transform;
          // Extract translation values from transform
          const match = transform.match(/translate\(([^,]+)px,\s*([^)]+)px\)/);
          if (match) {
            const x = parseFloat(match[1]);
            const y = parseFloat(match[2]);
            window.x = x;
            window.y = y;
          }
        }
      }
      setDragging(null);
    }
    
    if (resizing) {
      const window = windows.find(w => w.id === resizing);
      if (window) {
        const windowElem = windowRefs.current[window.id];
        if (windowElem) {
          window.width = windowElem.offsetWidth;
          window.height = windowElem.offsetHeight;
        }
      }
      setResizing(null);
    }
  };

  return (
    <div 
      className="absolute inset-0 overflow-hidden" 
      onMouseMove={handleMouseMove} 
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {windows.map((window) => (
        window.isMinimized ? null : (
          <div
            key={window.id}
            ref={el => (windowRefs.current[window.id] = el)}
            className={`orbit-window absolute animate-scale-in`}
            style={{
              width: window.width,
              height: window.height,
              transform: `translate(${window.x}px, ${window.y}px)`,
              zIndex: window.zIndex,
              boxShadow: window.isActive 
                ? '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' 
                : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            }}
            onClick={() => focusWindow(window.id)}
          >
            {/* Window Header */}
            <div 
              className="orbit-window-header cursor-move"
              onMouseDown={(e) => handleDragStart(e, window)}
              onDoubleClick={() => minimizeWindow(window.id)}
            >
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-red-500 hover:bg-red-600 cursor-pointer" onClick={(e) => {e.stopPropagation(); closeWindow(window.id);}}></span>
                  <span className="h-3 w-3 rounded-full bg-yellow-500 hover:bg-yellow-600 cursor-pointer" onClick={(e) => {e.stopPropagation(); minimizeWindow(window.id);}}></span>
                  <span className="h-3 w-3 rounded-full bg-green-500 hover:bg-green-600 cursor-pointer" onClick={(e) => {e.stopPropagation(); toast.info("Maximize feature coming soon");}}></span>
                </div>
                <span className="text-sm font-medium ml-2">{window.title}</span>
              </div>
            </div>
            
            {/* Window Content */}
            <div className="orbit-window-content">
              {window.component}
            </div>
            
            {/* Resize Handle */}
            <div 
              className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize"
              onMouseDown={(e) => handleResizeStart(e, window)}
            />
          </div>
        )
      ))}
    </div>
  );
};

export default WindowManager;
