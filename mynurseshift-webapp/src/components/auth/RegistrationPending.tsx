import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

export const RegistrationPending = () => {
  const navigate = useNavigate();

  return (
    <Card className="w-[600px]">
      <CardHeader>
        <CardTitle>Inscription en attente de validation</CardTitle>
        <CardDescription>
          Votre compte a été créé avec succès et est en attente de validation par un administrateur.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center space-y-4">
          <p>
            Nous avons bien reçu votre demande d'inscription. Un administrateur va vérifier
            vos informations et valider votre compte dans les plus brefs délais.
          </p>
          <p>
            Vous recevrez un email de confirmation dès que votre compte sera validé.
            Vous pourrez alors vous connecter et accéder à toutes les fonctionnalités
            de MyNurseShift.
          </p>
          <div className="pt-4">
            <Button
              variant="link"
              onClick={() => navigate('/login')}
            >
              Retour à la page de connexion
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
