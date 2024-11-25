import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RegistrationStep1, RegistrationStep2 } from '@/types/user';

const Step1Form = ({
  data,
  onSubmit,
  onChange,
}: {
  data: RegistrationStep1;
  onSubmit: () => void;
  onChange: (field: keyof RegistrationStep1, value: any) => void;
}) => (
  <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-4">
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="firstName">Prénom</Label>
        <Input
          id="firstName"
          value={data.firstName}
          onChange={(e) => onChange('firstName', e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="lastName">Nom</Label>
        <Input
          id="lastName"
          value={data.lastName}
          onChange={(e) => onChange('lastName', e.target.value)}
          required
        />
      </div>
    </div>

    <div className="space-y-2">
      <Label htmlFor="email">Email professionnel</Label>
      <Input
        id="email"
        type="email"
        value={data.email}
        onChange={(e) => onChange('email', e.target.value)}
        required
      />
    </div>

    <div className="space-y-2">
      <Label htmlFor="phone">Téléphone</Label>
      <Input
        id="phone"
        type="tel"
        value={data.phone}
        onChange={(e) => onChange('phone', e.target.value)}
        required
      />
    </div>

    <div className="space-y-2">
      <Label htmlFor="department">Pôle</Label>
      <Select
        value={data.department}
        onValueChange={(value) => onChange('department', value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Sélectionnez un pôle" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="surgery">Pôle Chirurgie</SelectItem>
          <SelectItem value="medicine">Pôle Médecine</SelectItem>
          <SelectItem value="emergency">Pôle Urgences</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <div className="space-y-2">
      <Label htmlFor="service">Service</Label>
      <Select
        value={data.service}
        onValueChange={(value) => onChange('service', value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Sélectionnez un service" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="POOL">POOL (Suppléance)</SelectItem>
          <SelectItem value="cardiology">Cardiologie</SelectItem>
          <SelectItem value="neurology">Neurologie</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <div className="space-y-2">
      <Label>Type d'affectation</Label>
      <Select
        value={data.workingHours.type}
        onValueChange={(value: 'full_time' | 'part_time') => 
          onChange('workingHours', { 
            ...data.workingHours, 
            type: value,
            percentage: value === 'full_time' ? undefined : data.workingHours.percentage 
          })
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Sélectionnez le type d'affectation" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="full_time">Temps plein</SelectItem>
          <SelectItem value="part_time">Temps partiel</SelectItem>
        </SelectContent>
      </Select>

      {data.workingHours.type === 'part_time' && (
        <div className="mt-2">
          <Label htmlFor="percentage">Pourcentage</Label>
          <Select
            value={data.workingHours.percentage?.toString()}
            onValueChange={(value) => 
              onChange('workingHours', { 
                ...data.workingHours, 
                percentage: parseInt(value) 
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez le pourcentage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="80">80%</SelectItem>
              <SelectItem value="70">70%</SelectItem>
              <SelectItem value="60">60%</SelectItem>
              <SelectItem value="50">50%</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>

    <Button type="submit" className="w-full">
      Continuer
    </Button>
  </form>
);

const Step2Form = ({
  data,
  onSubmit,
  onChange,
}: {
  data: RegistrationStep2;
  onSubmit: () => void;
  onChange: (field: keyof RegistrationStep2, value: any) => void;
}) => (
  <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-4">
    <div className="space-y-2">
      <Label>Type de poste</Label>
      <Select
        value={data.position?.type}
        onValueChange={(value: 'nurse' | 'auxiliary_nurse' | 'other') =>
          onChange('position', { ...data.position, type: value })
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Sélectionnez votre poste" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="nurse">Infirmier(e)</SelectItem>
          <SelectItem value="auxiliary_nurse">Aide-soignant(e)</SelectItem>
          <SelectItem value="other">Autre</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <div className="space-y-2">
      <Label htmlFor="internalId">Identifiant interne (optionnel)</Label>
      <Input
        id="internalId"
        value={data.position?.internalId || ''}
        onChange={(e) =>
          onChange('position', { ...data.position, internalId: e.target.value })
        }
      />
    </div>

    <div className="space-y-2">
      <Label>Notifications</Label>
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="emailNotif"
          checked={data.preferences?.notifications.email}
          onChange={(e) =>
            onChange('preferences', {
              ...data.preferences,
              notifications: {
                ...data.preferences?.notifications,
                email: e.target.checked,
              },
            })
          }
        />
        <Label htmlFor="emailNotif">Email</Label>

        <input
          type="checkbox"
          id="pushNotif"
          checked={data.preferences?.notifications.push}
          onChange={(e) =>
            onChange('preferences', {
              ...data.preferences,
              notifications: {
                ...data.preferences?.notifications,
                push: e.target.checked,
              },
            })
          }
        />
        <Label htmlFor="pushNotif">Push</Label>
      </div>
    </div>

    <div className="space-y-2">
      <Label>Vue par défaut</Label>
      <Select
        value={data.preferences?.defaultView}
        onValueChange={(value: 'weekly' | 'monthly') =>
          onChange('preferences', { ...data.preferences, defaultView: value })
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Sélectionnez votre vue préférée" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="weekly">Hebdomadaire</SelectItem>
          <SelectItem value="monthly">Mensuelle</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <Button type="submit" className="w-full">
      Terminer l'inscription
    </Button>
  </form>
);

export const RegisterStepForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const { signUp, error, loading } = useAuthStore();

  const [step1Data, setStep1Data] = useState<RegistrationStep1>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
    service: '',
    workingHours: {
      type: 'full_time',
    },
  });

  const [step2Data, setStep2Data] = useState<RegistrationStep2>({
    position: {
      type: 'nurse',
    },
    preferences: {
      notifications: {
        email: true,
        push: false,
      },
      defaultView: 'weekly',
    },
  });

  const handleStep1Submit = () => {
    setStep(2);
  };

  const handleStep2Submit = async () => {
    try {
      await signUp({
        ...step1Data,
        ...step2Data,
      });
      navigate('/registration-pending');
    } catch (error) {
      toast({
        title: "Erreur lors de l'inscription",
        description: "Une erreur est survenue lors de la création de votre compte. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  const handleStep1Change = (field: keyof RegistrationStep1, value: any) => {
    setStep1Data((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleStep2Change = (field: keyof RegistrationStep2, value: any) => {
    setStep2Data((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Créer votre compte
        </h1>
        <p className="text-sm text-muted-foreground">
          {step === 1
            ? "Commencez par renseigner vos informations de base"
            : "Complétez votre profil professionnel"}
        </p>
      </div>

      <Card className="w-full overflow-hidden">
        <CardHeader>
          <CardTitle>Création de compte</CardTitle>
          <CardDescription>
            {step === 1
              ? 'Étape 1 : Informations principales'
              : 'Étape 2 : Informations complémentaires'}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          {step === 1 ? (
            <Step1Form
              data={step1Data}
              onSubmit={handleStep1Submit}
              onChange={handleStep1Change}
            />
          ) : (
            <Step2Form
              data={step2Data}
              onSubmit={handleStep2Submit}
              onChange={handleStep2Change}
            />
          )}
        </CardContent>

        <CardFooter className="flex justify-between">
          {step === 2 && (
            <Button
              variant="outline"
              onClick={() => setStep(1)}
            >
              Retour
            </Button>
          )}
          <Button
            variant="link"
            className="ml-auto"
            onClick={() => navigate('/login')}
          >
            Déjà un compte ? Se connecter
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};
