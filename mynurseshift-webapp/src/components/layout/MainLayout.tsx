import { Outlet } from 'react-router-dom';
import { NavigationMenu } from '../ui/navigation-menu';

export const MainLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <NavigationMenu />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
};
