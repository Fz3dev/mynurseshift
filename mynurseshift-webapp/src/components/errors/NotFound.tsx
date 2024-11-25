import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="space-y-4">
          <h1 className="text-9xl font-bold text-blue-900">404</h1>
          <h2 className="text-2xl font-semibold tracking-tight">
            Page non trouvée
          </h2>
          <p className="text-muted-foreground">
            Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
          </p>
        </div>
        
        <div className="space-y-4">
          <Button 
            onClick={() => navigate("/login")} 
            className="w-full"
          >
            Retour à la page de connexion
          </Button>
          <p className="text-sm text-muted-foreground">
            Si vous pensez qu'il s'agit d'une erreur, veuillez contacter le support technique.
          </p>
        </div>
      </div>
    </div>
  );
};
