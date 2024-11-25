import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Shift = {
  id: string;
  date: Date;
  startTime: string;
  endTime: string;
  service: string;
  type: 'day' | 'night';
};

export const UpcomingShifts = () => {
  // Ces données viendront de Firestore plus tard
  const shifts: Shift[] = [
    {
      id: '1',
      date: new Date(2024, 0, 15),
      startTime: '07:00',
      endTime: '19:00',
      service: 'Cardiologie',
      type: 'day',
    },
    {
      id: '2',
      date: new Date(2024, 0, 16),
      startTime: '19:00',
      endTime: '07:00',
      service: 'Urgences',
      type: 'night',
    },
    {
      id: '3',
      date: new Date(2024, 0, 18),
      startTime: '07:00',
      endTime: '19:00',
      service: 'Réanimation',
      type: 'day',
    },
  ];

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Prochaines gardes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {shifts.map((shift) => (
            <div
              key={shift.id}
              className="flex items-center p-3 rounded-lg hover:bg-accent transition-colors"
            >
              <div className="flex-1">
                <p className="font-medium capitalize">{formatDate(shift.date)}</p>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <span>{shift.startTime} - {shift.endTime}</span>
                  <span>•</span>
                  <span>{shift.service}</span>
                </div>
              </div>
              <div
                className={`px-2 py-1 rounded text-xs font-medium ${
                  shift.type === 'night'
                    ? 'bg-nurse-100 text-nurse-800'
                    : 'bg-orange-100 text-orange-800'
                }`}
              >
                {shift.type === 'night' ? 'Nuit' : 'Jour'}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
