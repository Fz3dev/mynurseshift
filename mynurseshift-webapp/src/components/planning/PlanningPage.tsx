import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/useAuthStore';
import { subscribeToUserShifts, type Shift } from '@/lib/firebase/shifts';
import { ShiftDialog } from './ShiftDialog';
import { useToast } from '@/components/ui/use-toast';

export const PlanningPage = () => {
  const user = useAuthStore((state) => state.user);
  const { toast } = useToast();
  const [view, setView] = useState<'dayGridMonth' | 'timeGridWeek'>('timeGridWeek');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedShift, setSelectedShift] = useState<Shift | undefined>();
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [previousShifts, setPreviousShifts] = useState<Shift[]>([]);

  useEffect(() => {
    if (!user?.id) return;

    const unsubscribe = subscribeToUserShifts(user.id, (updatedShifts) => {
      setPreviousShifts(shifts);
      setShifts(updatedShifts);
    });

    return () => unsubscribe();
  }, [user?.id]);

  useEffect(() => {
    if (!previousShifts.length) return;

    // Trouver les nouvelles gardes
    const newShifts = shifts.filter(
      (shift) => !previousShifts.some((prev) => prev.id === shift.id)
    );

    // Trouver les gardes modifiées
    const modifiedShifts = shifts.filter((shift) => {
      const prevShift = previousShifts.find((prev) => prev.id === shift.id);
      return prevShift && (
        prevShift.startTime.seconds !== shift.startTime.seconds ||
        prevShift.endTime.seconds !== shift.endTime.seconds ||
        prevShift.service !== shift.service ||
        prevShift.type !== shift.type ||
        prevShift.status !== shift.status
      );
    });

    // Trouver les gardes supprimées
    const deletedShifts = previousShifts.filter(
      (prev) => !shifts.some((shift) => shift.id === prev.id)
    );

    // Afficher les notifications
    newShifts.forEach((shift) => {
      toast({
        variant: "success",
        title: "Nouvelle garde créée",
        description: `${format(shift.startTime.toDate(), "dd/MM/yyyy HH:mm", { locale: fr })} - ${shift.service}`,
      });
    });

    modifiedShifts.forEach((shift) => {
      toast({
        variant: "warning",
        title: "Garde modifiée",
        description: `${format(shift.startTime.toDate(), "dd/MM/yyyy HH:mm", { locale: fr })} - ${shift.service}`,
      });
    });

    deletedShifts.forEach((shift) => {
      toast({
        variant: "destructive",
        title: "Garde supprimée",
        description: `${format(shift.startTime.toDate(), "dd/MM/yyyy HH:mm", { locale: fr })} - ${shift.service}`,
      });
    });
  }, [shifts]);

  const events = shifts.map((shift) => ({
    id: shift.id,
    title: `Garde - ${shift.service}`,
    start: shift.startTime.toDate(),
    end: shift.endTime.toDate(),
    backgroundColor: shift.type === 'night' ? '#4f46e5' : '#f59e0b',
    borderColor: shift.type === 'night' ? '#4338ca' : '#d97706',
    textColor: '#ffffff',
    extendedProps: {
      service: shift.service,
      type: shift.type,
      status: shift.status,
      shift,
    },
  }));

  const handleEventClick = (info: any) => {
    setSelectedShift(info.event.extendedProps.shift);
    setSelectedDate(undefined);
    setIsDialogOpen(true);
  };

  const handleDateSelect = (selectInfo: any) => {
    setSelectedDate(selectInfo.start);
    setSelectedShift(undefined);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedDate(undefined);
    setSelectedShift(undefined);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Planning des gardes</h1>
        <div className="space-x-2">
          <Button
            variant={view === 'timeGridWeek' ? 'nurse' : 'outline'}
            onClick={() => setView('timeGridWeek')}
          >
            Semaine
          </Button>
          <Button
            variant={view === 'dayGridMonth' ? 'nurse' : 'outline'}
            onClick={() => setView('dayGridMonth')}
          >
            Mois
          </Button>
        </div>
      </div>

      <Card className="p-4">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView={view}
          headerToolbar={false}
          locale="fr"
          firstDay={1}
          allDaySlot={false}
          slotMinTime="07:00:00"
          slotMaxTime="21:00:00"
          events={events}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          nowIndicator={true}
          height="auto"
          select={handleDateSelect}
          eventClick={handleEventClick}
        />
      </Card>

      <ShiftDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        selectedDate={selectedDate}
        selectedShift={selectedShift}
      />
    </div>
  );
};
