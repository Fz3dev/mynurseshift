import React from 'react';
import { Toaster } from '../src/components/ui/toaster';
import { ToastProvider } from '../src/components/ui/toast';
import '../src/index.css';
import '../src/App.css';

export const StoryDecorator = (Story: React.ComponentType) => {
  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <div className="relative flex min-h-screen flex-col">
        <ToastProvider>
          <div className="flex-1">
            <Story />
          </div>
          <Toaster />
        </ToastProvider>
      </div>
    </div>
  );
};
