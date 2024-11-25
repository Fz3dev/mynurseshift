import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './button';

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link', 'nurse'],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Button',
    variant: 'default',
  },
  render: (args) => <Button {...args} />,
};

export const Nurse: Story = {
  args: {
    children: 'Nurse Button',
    variant: 'nurse',
  },
  render: (args) => <Button {...args} />,
};

export const Destructive: Story = {
  args: {
    children: 'Delete',
    variant: 'destructive',
  },
  render: (args) => <Button {...args} />,
};

export const Outline: Story = {
  args: {
    children: 'Outline',
    variant: 'outline',
  },
  render: (args) => <Button {...args} />,
};

export const Secondary: Story = {
  args: {
    children: 'Secondary',
    variant: 'secondary',
  },
  render: (args) => <Button {...args} />,
};

export const Ghost: Story = {
  args: {
    children: 'Ghost',
    variant: 'ghost',
  },
  render: (args) => <Button {...args} />,
};

export const Link: Story = {
  args: {
    children: 'Link',
    variant: 'link',
  },
  render: (args) => <Button {...args} />,
};

export const Small: Story = {
  args: {
    children: 'Small',
    size: 'sm',
  },
  render: (args) => <Button {...args} />,
};

export const Large: Story = {
  args: {
    children: 'Large',
    size: 'lg',
  },
  render: (args) => <Button {...args} />,
};

export const Icon: Story = {
  args: {
    children: '🔍',
    size: 'icon',
  },
  render: (args) => <Button {...args} />,
};
