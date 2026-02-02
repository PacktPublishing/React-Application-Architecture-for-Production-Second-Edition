import { Outlet, useNavigate } from 'react-router';

import { Navigation } from '@/components/navigation';
import { useLogoutUserMutation } from '@/features/auth/api/logout';
import { useUser } from '@/features/auth/hooks/use-user';

export default function Layout() {
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
    <div>
      <Navigation user={user} onLogout={handleLogout} />
      <main className="min-h-screen bg-background">
        <Outlet />
      </main>
    </div>
  );
}
