import { useState, useCallback, useEffect } from 'react';
import Masonry from 'react-masonry-css';
import { WelcomeCard } from '../components/WelcomCard';
import { CustomButton } from '../components/CustomButton';
import GoalsSummary from '../sections/GoalsSummary';
import { pluginManager } from '../indifycore/PluginManager';
import type { Widget } from '../indifycore/types';
import IframeWidget from '../components/widgets/IframeWidget';
import { useAuth } from '../contexts/AuthContext';

// CSS for masonry layout
const masonryStyles = `
  .my-masonry-grid {
    display: flex;
    margin-left: -16px; /* gutter size */
    width: auto;
  }
  .my-masonry-grid_column {
    padding-left: 16px; /* gutter size */
    background-clip: padding-box;
  }
  .my-masonry-grid_column > div {
    margin-bottom: 16px;
  }
`;

export function DashboardContent() {
  const [importedWidgets, setImportedWidgets] = useState<Widget[]>([]);
  const { user } = useAuth();

  const loadWidgets = useCallback(async () => {
    if (!user) return;

    try {
      const widgets = await pluginManager.loadWidgets(user.id);
      setImportedWidgets(widgets.filter((w) => w.enabled));
    } catch (error) {
      console.error('Failed to load widgets:', error);
    }
  }, [user]);

  useEffect(() => {
    loadWidgets();
  }, [loadWidgets]);

  const handleRemoveWidget = useCallback(async (widgetId: string) => {
    try {
      await pluginManager.removeWidget(widgetId);
      await loadWidgets();
    } catch (error) {
      console.error('Failed to remove widget:', error);
    }
  }, [loadWidgets]);

  // Define responsive breakpoints for masonry columns
  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    700: 1,
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        <WelcomeCard />
      </h1>
      <div className="flex flex-col space-y-6">
        <div>
          <GoalsSummary />
        </div>

        {/* Imported Widgets Section */}
        {importedWidgets.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-white">Imported Widgets</h2>
            <style>{masonryStyles}</style>
            <Masonry
              breakpointCols={breakpointColumnsObj}
              className="my-masonry-grid"
              columnClassName="my-masonry-grid_column"
            >
              {importedWidgets.map((widget) => (
                <IframeWidget key={widget.id} widget={widget} onRemove={handleRemoveWidget} />
              ))}
            </Masonry>
          </div>
        )}

        <div className="bg-neutral-800 p-6 rounded-lg border border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h3 className="text-lg font-semibold mb-2 text-white">Quick Stats</h3>
              <p className="text-gray-400">View your latest metrics here.</p>
            </div>
            <CustomButton variant="primary" size="sm">
              View Details
            </CustomButton>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-700 last:border-b-0">
              <span className="text-gray-400">Active Goals</span>
              <span className="text-white font-medium">12</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-700 last:border-b-0">
              <span className="text-gray-400">Tasks Due Today</span>
              <span className="text-white font-medium">3</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-700 last:border-b-0">
              <span className="text-gray-400">Documents</span>
              <span className="text-white font-medium">24</span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-gray-400">Revenue</span>
              <span className="text-white font-medium">$2,450</span>
            </div>
          </div>
        </div>
        <div className="bg-neutral-800 p-6 rounded-lg border border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h3 className="text-lg font-semibold mb-2 text-white">Recent Activity</h3>
              <p className="text-gray-400">See what's been happening.</p>
            </div>
            <CustomButton variant="primary" size="sm">
              View All
            </CustomButton>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-3 border-b border-gray-700 last:border-b-0">
              <span className="text-gray-400">Task completed</span>
              <span className="text-gray-500">2h ago</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-700 last:border-b-0">
              <span className="text-gray-400">Goal updated</span>
              <span className="text-gray-500">1d ago</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-700 last:border-b-0">
              <span className="text-gray-400">Document added</span>
              <span className="text-gray-500">3d ago</span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-gray-400">Meeting scheduled</span>
              <span className="text-gray-500">5d ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}