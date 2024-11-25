import { useAuthStore } from '@/store/useAuthStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShiftSummary } from './ShiftSummary';
import { TeamOverview } from './TeamOverview';
import { UpcomingShifts } from './UpcomingShifts';

export const DashboardPage = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Bonjour, {user?.displayName || 'Infirmier(e)'}</h1>
        <Button variant="nurse">Voir mon planning</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ShiftSummary />
        <TeamOverview />
        <UpcomingShifts />
      </div>
    </div>
  );
};
