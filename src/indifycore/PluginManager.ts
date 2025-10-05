// src/core/PluginManager.ts
import { supabase } from '../lib/supabase';
import type { Widget } from './types';

class PluginManager {
  private widgets: Map<string, Widget> = new Map();

  async importFromURL(url: string, userId: string): Promise<Widget> {
    // Validate URL
    if (!this.isValidURL(url)) {
      throw new Error('Invalid URL format');
    }

    if (!url.startsWith('https://')) {
      throw new Error('Only HTTPS URLs are allowed');
    }

    // Detect provider
    const provider = this.detectProvider(url);

    // Create widget based on provider
    let widget: Widget;

    if (provider === 'indify') {
      widget = this.createIndifyWidget(url);
    } else if (provider === 'widgetbox') {
      widget = this.createWidgetBoxWidget(url);
    } else {
      widget = this.createGenericWidget(url);
    }

    // Save to Supabase
    await this.saveWidget(widget, userId);

    // Register in memory
    this.widgets.set(widget.id, widget);

    return widget;
  }

  private isValidURL(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  private detectProvider(url: string): 'indify' | 'widgetbox' | 'generic' {
    if (url.includes('indify.co')) return 'indify';
    if (url.includes('widgetbox.app')) return 'widgetbox';
    return 'generic';
  }

  private createIndifyWidget(url: string): Widget {
    const match = url.match(/indify\.co\/widgets\/live\/([^ /]+)\/(.+)/);
    const widgetType = match ? match[1] : 'unknown';
    const widgetId = match ? match[2] : this.generateId();

    return {
      id: `indify-${widgetId}`,
      name: `Indify ${this.capitalize(widgetType)}`,
      type: 'iframe-embed',
      source: 'indify',
      url: url,
      metadata: {
        provider: 'Indify',
        providerUrl: 'https://indify.co',
        widgetType: widgetType,
        externalId: widgetId,
        importedAt: new Date().toISOString()
      },
      config: {
        resizable: true,
        defaultSize: { w: 2, h: 2 }
      },
      enabled: true,
      installedAt: new Date().toISOString()
    };
  }

  private createWidgetBoxWidget(url: string): Widget {
    const widgetId = this.generateId();

    return {
      id: `widgetbox-${widgetId}`,
      name: 'WidgetBox Widget',
      type: 'iframe-embed',
      source: 'widgetbox',
      url: url,
      metadata: {
        provider: 'WidgetBox',
        providerUrl: 'https://widgetbox.app',
        importedAt: new Date().toISOString()
      },
      config: {
        resizable: true,
        defaultSize: { w: 2, h: 2 }
      },
      enabled: true,
      installedAt: new Date().toISOString()
    };
  }

  private createGenericWidget(url: string): Widget {
    const widgetId = this.generateId();

    return {
      id: `embed-${widgetId}`,
      name: 'External Widget',
      type: 'iframe-embed',
      source: 'generic',
      url: url,
      metadata: {
        provider: 'External',
        importedAt: new Date().toISOString()
      },
      config: {
        resizable: true,
        defaultSize: { w: 3, h: 3 }
      },
      enabled: true,
      installedAt: new Date().toISOString()
    };
  }

  private async saveWidget(widget: Widget, userId: string): Promise<void> {
    const { error } = await supabase.from('widgets').insert({
      id: widget.id,
      user_id: userId,
      name: widget.name,
      type: widget.type,
      source: widget.source,
      url: widget.url,
      metadata: widget.metadata,
      config: widget.config,
      enabled: widget.enabled,
      installed_at: widget.installedAt
    });

    if (error) {
      throw new Error(`Failed to save widget: ${error.message}`);
    }
  }

  async loadWidgets(userId: string): Promise<Widget[]> {
    const { data, error } = await supabase
      .from('widgets')
      .select('*')
      .eq('user_id', userId)
      .eq('enabled', true);

    if (error) {
      throw new Error(`Failed to load widgets: ${error.message}`);
    }

    return data || [];
  }

  async removeWidget(widgetId: string): Promise<void> {
    const { error } = await supabase
      .from('widgets')
      .delete()
      .eq('id', widgetId);

    if (error) {
      throw new Error(`Failed to remove widget: ${error.message}`);
    }

    this.widgets.delete(widgetId);
  }

  async toggleWidget(widgetId: string, enabled: boolean): Promise<void> {
    const { error } = await supabase
      .from('widgets')
      .update({ enabled })
      .eq('id', widgetId);

    if (error) {
      throw new Error(`Failed to toggle widget: ${error.message}`);
    }
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

export const pluginManager = new PluginManager();