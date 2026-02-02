import { useTranslation } from 'react-i18next';
import { Outlet, useNavigate } from 'react-router';

import { Navigation } from '@/components/navigation';
import { useLogoutUserMutation } from '@/features/auth/api/logout';
import { useUser } from '@/features/auth/hooks/use-user';

export default function Layout() {
  const { t } = useTranslation(['navigation']);
  const user = useUser();
  const logoutUserMutation = useLogoutUserMutation();
  const navigate = useNavigate();
  const handleLogout = async () => {
    logoutUserMutation.mutate(undefined, {
      onSuccess: () => {
        navigate('/');
      },
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-background focus:text-foreground focus:px-4 focus:py-2 focus:border focus:rounded focus:ring-2 focus:ring-ring"
      >
        {t('navigation:skipToContent')}
      </a>
      <header>
        <Navigation user={user} onLogout={handleLogout} />
      </header>
      <main id="main-content" className="flex-1 bg-background">
        <Outlet />
      </main>
      <footer className="border-t py-6 px-4 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} AIdeas. All rights reserved.
      </footer>
    </div>
  );
}
