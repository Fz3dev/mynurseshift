import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/useAuthStore';
import { getUserProfile, updateUserProfile, updateUserPreferences } from '@/lib/firebase/users';

export const ProfilePage = () => {
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: () => getUserProfile(user?.id || ''),
    enabled: !!user?.id,
  });

  const updateProfileMutation = useMutation({
    mutationFn: (updates: any) => updateUserProfile(user?.id || '', updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
      setIsEditing(false);
    },
  });

  const updatePreferencesMutation = useMutation({
    mutationFn: (preferences: any) => updateUserPreferences(user?.id || '', preferences),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
    },
  });

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Mon profil</h1>
        <Button variant="nurse" onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? 'Annuler' : 'Modifier'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Informations personnelles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Nom complet</label>
              <input
                type="text"
                className="w-full p-2 mt-1 border rounded-md"
                value={profile?.displayName || ''}
                disabled={!isEditing}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                className="w-full p-2 mt-1 border rounded-md"
                value={profile?.email || ''}
                disabled
              />
            </div>
            <div>
              <label className="text-sm font-medium">Service</label>
              <input
                type="text"
                className="w-full p-2 mt-1 border rounded-md"
                value={profile?.service || ''}
                disabled={!isEditing}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Préférences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Thème</label>
              <select
                className="w-full p-2 mt-1 border rounded-md"
                value={profile?.preferences?.theme || 'system'}
                onChange={(e) =>
                  updatePreferencesMutation.mutate({
                    ...profile?.preferences,
                    theme: e.target.value,
                  })
                }
              >
                <option value="light">Clair</option>
                <option value="dark">Sombre</option>
                <option value="system">Système</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Notifications</label>
              <div className="flex items-center mt-1">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={profile?.preferences?.notifications || false}
                  onChange={(e) =>
                    updatePreferencesMutation.mutate({
                      ...profile?.preferences,
                      notifications: e.target.checked,
                    })
                  }
                />
                <span className="text-sm text-muted-foreground">
                  Recevoir des notifications pour les changements de planning
                </span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Temps partiel</label>
              <div className="flex items-center mt-1">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={profile?.workingHours?.partTime || false}
                  disabled={!isEditing}
                />
                {profile?.workingHours?.partTime && (
                  <input
                    type="number"
                    className="w-20 p-2 ml-2 border rounded-md"
                    value={profile?.workingHours?.percentage || 100}
                    min={1}
                    max={100}
                    disabled={!isEditing}
                  />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
