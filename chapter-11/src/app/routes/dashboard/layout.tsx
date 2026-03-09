import { LayoutDashboard, Home, MessageSquare } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { NavLink, Outlet } from 'react-router';

import { protectedMiddleware } from '@/app/middleware/protected';
import { cn } from '@/lib/utils';

export const middleware = [protectedMiddleware];

export default function DashboardLayout() {
  const { t } = useTranslation(['dashboard']);

  const dashboardNavItems = [
    {
      href: '/dashboard',
      label: t('dashboard:navigation.dashboard'),
      icon: LayoutDashboard,
    },
    {
      href: '/dashboard/ideas',
      label: t('dashboard:navigation.myIdeas'),
      icon: Home,
    },
    {
      href: '/dashboard/reviews',
      label: t('dashboard:navigation.myReviews'),
      icon: MessageSquare,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <nav className="mb-6">
          <div className="flex gap-2 border-b">
            {dashboardNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.href}
                  to={item.href}
                  end={item.href === '/dashboard'}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-2 px-4 py-2 border-b-2 transition-colors',
                      isActive
                        ? 'border-primary text-primary font-medium'
                        : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted',
                    )
                  }
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              );
            })}
          </div>
        </nav>
        <Outlet />
      </div>
    </div>
  );
}
