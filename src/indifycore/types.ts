// src/core/types.ts
export interface Widget {
  id: string;
  name: string;
  type: 'iframe-embed' | 'native';
  source: 'indify' | 'widgetbox' | 'generic' | 'native';
  url?: string;
  metadata: {
    provider: string;
    providerUrl?: string;
    widgetType?: string;
    externalId?: string;
    importedAt: string;
  };
  config: {
    resizable: boolean;
    defaultSize: { w: number; h: number };
    position?: { x: number; y: number };
  };
  enabled: boolean;
  installedAt: string;
}

export interface PluginAPI {
  dashboard: {
    addWidget: (component: React.ComponentType<unknown>, config: unknown) => void;
    removeWidget: (widgetId: string) => void;
  };
  widgets: {
    remove: (widgetId: string) => void;
  };
}