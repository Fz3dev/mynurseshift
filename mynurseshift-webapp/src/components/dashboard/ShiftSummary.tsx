import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const ShiftSummary = () => {
  // Ces données viendront de Firestore plus tard
  const currentMonth = new Date().toLocaleDateString('fr-FR', { month: 'long' });
  const shiftStats = {
    total: 15,
    completed: 8,
    remaining: 7,
    overtime: 2,
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Résumé des gardes - {currentMonth}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total des gardes</p>
              <p className="text-2xl font-bold">{shiftStats.total}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Gardes effectuées</p>
              <p className="text-2xl font-bold text-green-600">{shiftStats.completed}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Gardes restantes</p>
              <p className="text-2xl font-bold text-nurse-600">{shiftStats.remaining}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Heures supp.</p>
              <p className="text-2xl font-bold text-orange-600">{shiftStats.overtime}</p>
            </div>
          </div>
          
          <div className="w-full bg-secondary rounded-full h-2.5">
            <div
              className="bg-nurse-600 h-2.5 rounded-full"
              style={{ width: `${(shiftStats.completed / shiftStats.total) * 100}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
