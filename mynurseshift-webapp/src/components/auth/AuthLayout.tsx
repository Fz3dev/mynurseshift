import { ReactNode } from "react";
import { Logo } from "@/components/ui/logo";

interface AuthLayoutProps {
  children: ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container relative flex min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white md:flex dark:border-r overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="/images/nurse-team.jpg"
              alt="Équipe médicale en discussion"
              className="object-cover w-full h-full brightness-[0.3]"
            />
          </div>
          <div className="absolute inset-0 bg-blue-900/40" />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <Logo className="h-8 w-auto mr-2" />
            MyNurseShift
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                "MyNurseShift a révolutionné la gestion de nos plannings. 
                C'est un outil indispensable pour notre équipe soignante."
              </p>
              <footer className="text-sm">Dr. Sophie Martin</footer>
            </blockquote>
          </div>
        </div>
        <div className="lg:p-8 w-full px-4">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px] max-w-[450px]">
            <div className="flex items-center justify-center md:hidden">
              <Logo className="h-12 w-auto text-blue-900 mb-8" />
            </div>
            {children}
            <p className="px-8 text-center text-sm text-muted-foreground">
              En continuant, vous acceptez nos{" "}
              <a
                href="#"
                className="underline underline-offset-4 hover:text-primary"
              >
                Conditions d'utilisation
              </a>{" "}
              et notre{" "}
              <a
                href="#"
                className="underline underline-offset-4 hover:text-primary"
              >
                Politique de confidentialité
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
