import type { Preview } from "@storybook/react";
import { StoryDecorator } from './StoryDecorator';
import '../src/index.css';
import '../src/App.css';

const preview: Preview = {
  decorators: [StoryDecorator],
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#ffffff',
        },
        {
          name: 'dark',
          value: '#1a1a1a',
        },
      ],
    },
    layout: 'centered',
  },
};

export default preview;
