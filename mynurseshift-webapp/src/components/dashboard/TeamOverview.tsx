import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type TeamMember = {
  id: string;
  name: string;
  role: string;
  status: 'available' | 'onShift' | 'offDuty';
  avatar?: string;
};

export const TeamOverview = () => {
  // Ces données viendront de Firestore plus tard
  const teamMembers: TeamMember[] = [
    { id: '1', name: 'Sophie Martin', role: 'Infirmière', status: 'onShift' },
    { id: '2', name: 'Lucas Bernard', role: 'Infirmier', status: 'available' },
    { id: '3', name: 'Emma Dubois', role: 'Infirmière', status: 'offDuty' },
    { id: '4', name: 'Thomas Petit', role: 'Infirmier', status: 'onShift' },
  ];

  const getStatusColor = (status: TeamMember['status']) => {
    switch (status) {
      case 'available':
        return 'bg-green-500';
      case 'onShift':
        return 'bg-nurse-600';
      case 'offDuty':
        return 'bg-gray-400';
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusText = (status: TeamMember['status']) => {
    switch (status) {
      case 'available':
        return 'Disponible';
      case 'onShift':
        return 'En garde';
      case 'offDuty':
        return 'Repos';
      default:
        return status;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Équipe</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {teamMembers.map((member) => (
            <div key={member.id} className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                {member.avatar ? (
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-full h-full rounded-full"
                  />
                ) : (
                  <span className="text-lg font-medium">{member.name[0]}</span>
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium">{member.name}</p>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-2.5 h-2.5 rounded-full ${getStatusColor(member.status)}`} />
                <span className="text-sm text-muted-foreground">
                  {getStatusText(member.status)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
