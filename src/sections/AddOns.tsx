import React, { useState, useEffect, useCallback } from 'react';
import { pluginManager } from '../indifycore/PluginManager';
import type { Widget } from '../indifycore/types';
import { useAuth } from '../contexts/AuthContext';

export const AddOns: React.FC = () => {
  const [importUrl, setImportUrl] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Use useCallback to memoize loadWidgets to prevent unnecessary re-renders
  const loadWidgets = useCallback(async () => {
    if (!user) return;

    try {
      const loadedWidgets = await pluginManager.loadWidgets(user.id);
      setWidgets(loadedWidgets);
    } catch (err: unknown) {
      console.error('Failed to load widgets:', err);
    }
  }, [user]); // Add user as a dependency

  useEffect(() => {
    loadWidgets();
  }, [loadWidgets]); // Add loadWidgets as a dependency

  const handleImportFromURL = async () => {
    if (!user || !importUrl.trim()) return;

    setIsImporting(true);
    setError(null);

    try {
      await pluginManager.importFromURL(importUrl, user.id);
      setImportUrl('');
      await loadWidgets(); // Reload widgets
      alert('Widget imported successfully!');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to import widget';
      setError(errorMessage);
    } finally {
      setIsImporting(false);
    }
  };

  const handleRemove = async (widgetId: string) => {
    if (!confirm('Are you sure you want to remove this widget?')) return;

    try {
      await pluginManager.removeWidget(widgetId);
      await loadWidgets();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove widget';
      setError(errorMessage);
    }
  };

  const handleToggle = async (widgetId: string, enabled: boolean) => {
    try {
      await pluginManager.toggleWidget(widgetId, enabled);
      await loadWidgets();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to toggle widget';
      setError(errorMessage);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Add-ons & Widgets
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Import widgets from Indify, WidgetBox, and other embeddable widget sites
        </p>
      </div>

      {/* Import Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Import Widget from URL
        </h3>

        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="Paste widget URL (e.g., https://indify.co/widgets/...)"
              value={importUrl}
              onChange={(e) => setImportUrl(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                       bg-white dark:bg-gray-900 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleImportFromURL}
              disabled={!importUrl.trim() || isImporting}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 
                       text-white font-medium rounded-lg transition-colors
                       disabled:cursor-not-allowed"
            >
              {isImporting ? 'Importing...' : 'Import'}
            </button>
          </div>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Supported sites:
            </p>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Indify (indify.co) - Clock, weather, countdown, etc.</li>
              <li>• WidgetBox (widgetbox.app) - Calendar, habits, AI widgets</li>
              <li>• Any embeddable HTTPS URL</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Imported Widgets List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Imported Widgets ({widgets.length})
        </h3>

        {widgets.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            No widgets imported yet. Import your first widget above!
          </p>
        ) : (
          <div className="space-y-3">
            {widgets.map((widget) => (
              <div
                key={widget.id}
                className="flex items-center justify-between p-4 border border-gray-200 
                         dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/50
                         transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {widget.name}
                    </h4>
                    <span className="text-xs px-2 py-1 rounded bg-blue-100 dark:bg-blue-900 
                                   text-blue-800 dark:text-blue-200">
                      {widget.metadata.provider}
                    </span>
                  </div>
                  <a
                    href={widget.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    View original →
                  </a>
                </div>

                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={widget.enabled}
                      onChange={(e) => handleToggle(widget.id, e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Enabled</span>
                  </label>

                  <button
                    onClick={() => handleRemove(widget.id)}
                    className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 
                             rounded transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddOns;