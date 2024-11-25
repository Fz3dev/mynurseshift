import type { Meta, StoryObj } from '@storybook/react';
import { Toast } from './toast';
import { Button } from './button';

const meta = {
  title: 'UI/Toast',
  component: Toast,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'success', 'warning', 'nurse'],
    },
  },
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Notification',
  },
};

export const Success: Story = {
  args: {
    variant: 'success',
    children: 'Garde créée avec succès',
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    children: 'Modification de la garde en cours',
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Erreur lors de la création de la garde',
  },
};

export const Nurse: Story = {
  args: {
    variant: 'nurse',
    children: 'Nouvelle garde disponible',
  },
};

export const WithAction: Story = {
  args: {
    children: (
      <div className="flex items-center justify-between">
        <div>
          <div className="font-semibold">Nouvelle garde</div>
          <div className="text-sm">Service des urgences - 12/03/2024</div>
        </div>
        <Button variant="outline" size="sm">Voir</Button>
      </div>
    ),
  },
};
