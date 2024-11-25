import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/useAuthStore';
import { createShift, updateShift, type Shift } from '@/lib/firebase/shifts';
import { Timestamp } from 'firebase/firestore';

interface ShiftDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate?: Date;
  selectedShift?: Shift;
}

export const ShiftDialog = ({ isOpen, onClose, selectedDate, selectedShift }: ShiftDialogProps) => {
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();
  const isEditing = !!selectedShift;

  const [formData, setFormData] = useState({
    startTime: selectedShift?.startTime.toDate().toISOString().slice(0, 16) ||
      (selectedDate && new Date(selectedDate.setHours(7, 0)).toISOString().slice(0, 16)),
    endTime: selectedShift?.endTime.toDate().toISOString().slice(0, 16) ||
      (selectedDate && new Date(selectedDate.setHours(19, 0)).toISOString().slice(0, 16)),
    service: selectedShift?.service || user?.service || '',
    type: selectedShift?.type || 'day',
    notes: selectedShift?.notes || '',
  });

  const createShiftMutation = useMutation({
    mutationFn: (newShift: Omit<Shift, 'id'>) => createShift(newShift),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shifts'] });
      onClose();
    },
  });

  const updateShiftMutation = useMutation({
    mutationFn: ({ shiftId, updates }: { shiftId: string; updates: Partial<Shift> }) =>
      updateShift(shiftId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shifts'] });
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const shiftData = {
      userId: user?.id || '',
      startTime: Timestamp.fromDate(new Date(formData.startTime)),
      endTime: Timestamp.fromDate(new Date(formData.endTime)),
      service: formData.service,
      type: formData.type as 'day' | 'night',
      status: 'pending' as const,
      notes: formData.notes,
    };

    if (isEditing && selectedShift) {
      updateShiftMutation.mutate({
        shiftId: selectedShift.id,
        updates: shiftData,
      });
    } else {
      createShiftMutation.mutate(shiftData);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Modifier la garde' : 'Nouvelle garde'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Date et heure de début</label>
            <input
              type="datetime-local"
              className="w-full p-2 border rounded-md"
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Date et heure de fin</label>
            <input
              type="datetime-local"
              className="w-full p-2 border rounded-md"
              value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Service</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              value={formData.service}
              onChange={(e) => setFormData({ ...formData, service: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Type de garde</label>
            <select
              className="w-full p-2 border rounded-md"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as 'day' | 'night' })}
              required
            >
              <option value="day">Jour</option>
              <option value="night">Nuit</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Notes</label>
            <textarea
              className="w-full p-2 border rounded-md"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" variant="nurse">
              {isEditing ? 'Modifier' : 'Créer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
