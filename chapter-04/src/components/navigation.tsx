import {
  Menu,
  Lightbulb,
  User as UserIcon,
  LayoutDashboard,
} from 'lucide-react';
import { Link, NavLink } from 'react-router';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import { CURRENT_USER } from '@/lib/api';
import { cn } from '@/lib/utils';

export function Navigation() {
  const isMobile = useIsMobile();

  const user = CURRENT_USER;

  const navItems = (
    <>
      <NavLink
        to="/ideas"
        end
        className={({ isActive }) =>
          cn(
            'flex items-center gap-2 text-sm hover:text-primary px-3 py-2 rounded-md',
            isActive && 'font-semibold',
          )
        }
      >
        <Lightbulb className="h-4 w-4" /> Discover Ideas
      </NavLink>
      {user ? (
        <>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2 text-sm hover:text-primary px-3 py-2 rounded-md',
                isActive && 'font-semibold',
              )
            }
          >
            <LayoutDashboard className="h-4 w-4" /> Dashboard
          </NavLink>
          <NavLink
            to={`/profile/${user.username}`}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2 text-sm hover:text-primary px-3 py-2 rounded-md',
                isActive && 'font-semibold',
              )
            }
          >
            <UserIcon className="h-4 w-4" /> {user.username}
          </NavLink>
        </>
      ) : null}
    </>
  );

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold">
          AIdeas
        </Link>

        {isMobile ? (
          <div className="flex items-center space-x-2">
            <Sheet>
              <SheetTrigger
                render={
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle navigation menu</span>
                  </Button>
                }
              />
              <SheetContent
                side="right"
                className="w-[280px] sm:w-[320px] flex flex-col"
              >
                <SheetHeader className="mb-6">
                  <SheetTitle className="text-2xl font-bold">Menu</SheetTitle>
                  {user && (
                    <p className="text-sm text-muted-foreground">
                      Welcome, {user.username}!
                    </p>
                  )}
                </SheetHeader>
                <div className="flex flex-col space-y-4 grow">{navItems}</div>
              </SheetContent>
            </Sheet>
          </div>
        ) : (
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-4">{navItems}</div>
          </div>
        )}
      </div>
    </nav>
  );
}
