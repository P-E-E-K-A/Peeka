import { useState } from 'react'
import { Responsive, WidthProvider } from 'react-grid-layout'
import type { Layout, Layouts } from 'react-grid-layout'

const ResponsiveGridLayout = WidthProvider(Responsive)

interface Widget {
  id: string
  component: React.ComponentType
  title: string
}

interface DashboardGridProps {
  widgets: Widget[]
}

export function DashboardGrid({ widgets }: DashboardGridProps) {
  // Generate layouts for all widgets dynamically
  const generateInitialLayouts = (): Layouts => {
    const layouts: Layouts = {
      lg: [],
      md: [],
      sm: [],
      xs: []
    }
    
    widgets.forEach((widget, index) => {
      // 🎯 CUSTOMIZE MINIMUM WIDTHS HERE based on widget type
      let minW_lg = 3
      let minH_lg = 2
      let w_lg = 4
      let h_lg = 3
      
      // Set specific sizes for different widget types
      switch (widget.id) {
        case 'clock':
          minW_lg = 4  // Clock needs more width (4/24 = 16.7% minimum)
          minH_lg = 2
          w_lg = 6     // Default width (6/24 = 25%)
          h_lg = 3
          break
        
        case 'weather':
          minW_lg = 5  // Weather needs even more width
          minH_lg = 3
          w_lg = 6
          h_lg = 4
          break
        
        case 'stats':
        case 'chart':
          minW_lg = 6  // Analytics widgets need substantial space
          minH_lg = 4
          w_lg = 8     // Default 33% width
          h_lg = 5
          break
        
        case 'todo':
        case 'tasks':
        case 'sdk-todo':
          minW_lg = 4  // Task widgets
          minH_lg = 3
          w_lg = 6
          h_lg = 5
          break
        
        default:
          // Default sizes for extensions or unknown widgets
          minW_lg = 3
          minH_lg = 2
          w_lg = 4
          h_lg = 3
      }
      
      // Large screens - 24 columns total
      layouts.lg.push({
        i: widget.id,
        x: (index % 3) * 8,  // Adjusted for 24 cols
        y: Math.floor(index / 3) * h_lg,
        w: w_lg,
        h: h_lg,
        minW: minW_lg,  // 🎯 MINIMUM WIDTH SET HERE
        minH: minH_lg,  // 🎯 MINIMUM HEIGHT SET HERE
        maxW: 12,       // Maximum width (50% of screen)
        maxH: 8         // Maximum height
      })
      
      // Medium screens - 20 columns total
      layouts.md.push({
        i: widget.id,
        x: (index % 2) * 10,
        y: Math.floor(index / 2) * 3,
        w: Math.min(w_lg + 2, 10),  // Slightly wider on medium screens
        h: h_lg,
        minW: Math.min(minW_lg + 1, 8),  // Adjusted minimum for medium
        minH: minH_lg,
        maxW: 15,
        maxH: 8
      })
      
      // Small screens - 12 columns total
      layouts.sm.push({
        i: widget.id,
        x: 0,
        y: index * 3,
        w: 12,  // Full width on small screens
        h: h_lg,
        minW: 8,  // Minimum 66% width on small
        minH: minH_lg,
        maxW: 12,
        maxH: 8
      })
      
      // Extra small screens - 8 columns total
      layouts.xs.push({
        i: widget.id,
        x: 0,
        y: index * 3,
        w: 8,  // Full width on mobile
        h: h_lg,
        minW: 8,  // Full width minimum on mobile
        minH: minH_lg,
        maxW: 8,
        maxH: 8
      })
    })
    
    return layouts
  };

const [layouts, setLayouts] = useState<Layouts>(() => {
  const saved = localStorage.getItem('dashboard-layouts');
  if (saved) {
    try {
      const parsedLayouts = JSON.parse(saved) as Layouts;
      // Validate and update saved layouts with new constraints
      const initialLayouts = generateInitialLayouts();
      
      // Merge saved positions with new size constraints
      (Object.keys(parsedLayouts) as Array<keyof Layouts>).forEach((breakpoint) => {
        parsedLayouts[breakpoint] = parsedLayouts[breakpoint].map((item: Layout) => {
          const defaultItem = initialLayouts[breakpoint].find((d: Layout) => d.i === item.i);
          if (defaultItem) {
            return {
              ...item,
              minW: defaultItem.minW,
              minH: defaultItem.minH,
              maxW: defaultItem.maxW,
              maxH: defaultItem.maxH,
              w: Math.max(item.w, defaultItem.minW || 1),
              h: Math.max(item.h, defaultItem.minH || 1),
            };
          }
          return item;
        });
      });
      
      return parsedLayouts;
    } catch (e) {
      console.error('Failed to parse saved layouts:', e);
      return generateInitialLayouts();
    }
  }
  return generateInitialLayouts();
});

  const onLayoutChange = (_: Layout[], allLayouts: Layouts) => {
    setLayouts(allLayouts)
    localStorage.setItem('dashboard-layouts', JSON.stringify(allLayouts))
  };

  const resetLayout = () => {
    const newLayouts = generateInitialLayouts()
    setLayouts(newLayouts)
    localStorage.setItem('dashboard-layouts', JSON.stringify(newLayouts))
  };

  return (
    <div className="w-full">
      {/* Reset button */}
      <div className="mb-4 flex justify-end">
        <button
          onClick={resetLayout}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors flex items-center gap-2"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
          Reset Layout
        </button>
      </div>
      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        onLayoutChange={onLayoutChange}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 24, md: 20, sm: 12, xs: 8, xxs: 4 }}
        rowHeight={50}
        isDraggable={true}
        isResizable={true}
        draggableHandle=".drag-handle"
        containerPadding={[0, 0]}
        margin={[16, 16]}
        useCSSTransforms={true}
        autoSize={true}
        compactType="vertical"
        preventCollision={false}
      >
        {widgets.map((widget) => (
          <div 
            key={widget.id}
            className="bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-xl overflow-hidden flex flex-col h-full border border-gray-700/50 hover:border-purple-500/30 transition-all duration-200"
          >
            <div 
              className="text-white bg-gradient-to-r from-gray-800 to-gray-900 font-semibold text-sm flex items-center justify-between select-none px-3 py-2 border-b border-gray-700/50"
            >
              <div className="flex items-center gap-2">
                <span 
                  className="drag-handle cursor-move hover:bg-white/10 rounded px-2 py-1 transition-colors"
                  title="Drag to move"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="opacity-50 hover:opacity-100">
                    <rect x="8" y="4" width="2" height="2" rx="1" />
                    <rect x="14" y="4" width="2" height="2" rx="1" />
                    <rect x="8" y="10" width="2" height="2" rx="1" />
                    <rect x="14" y="10" width="2" height="2" rx="1" />
                    <rect x="8" y="16" width="2" height="2" rx="1" />
                    <rect x="14" y="16" width="2" height="2" rx="1" />
                  </svg>
                </span>
                <span className="text-gray-200">{widget.title}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-400">
                <span className="text-xs opacity-60" title="Resize">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 8l4 4-4 4M6 8l-4 4 4 4M8 18l4 4 4-4M8 6l4-4 4 4" />
                  </svg>
                </span>
              </div>
            </div>
            <div className="flex-1 overflow-auto relative">
              <widget.component />
            </div>
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  )
}