import type { Meta, StoryObj } from '@storybook/react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './dialog';
import { Button } from './button';

const meta = {
  title: 'UI/Dialog',
  component: Dialog,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <>
        <DialogTrigger asChild>
          <Button variant="outline">Ouvrir la modale</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Titre de la modale</DialogTitle>
            <DialogDescription>
              Description ou contenu de la modale.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </>
    ),
  },
};

export const CreateShift: Story = {
  args: {
    children: (
      <>
        <DialogTrigger asChild>
          <Button variant="nurse">Créer une garde</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nouvelle garde</DialogTitle>
            <DialogDescription>
              Créez une nouvelle garde en remplissant le formulaire ci-dessous.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Date et heure de début</label>
              <input
                type="datetime-local"
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Service</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                placeholder="Urgences"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline">Annuler</Button>
            <Button variant="nurse">Créer</Button>
          </div>
        </DialogContent>
      </>
    ),
  },
};
