import {
  Menu,
  Lightbulb,
  User as UserIcon,
  LogOut,
  LogIn,
  UserPlus,
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
import { cn } from '@/lib/utils';
import type { User } from '@/types/generated/types.gen';

export type NavigationProps = {
  user: User | null;
  onLogout: () => void;
};

export function Navigation({ user, onLogout }: NavigationProps) {
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

  const authButtons = user ? (
    <Button
      variant="outline"
      size="sm"
      onClick={onLogout}
      className="flex items-center gap-2 w-full md:w-auto bg-transparent"
    >
      <LogOut className="h-4 w-4" /> Logout
    </Button>
  ) : (
    <>
      <NavLink to="/auth/login" className="w-full md:w-auto">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 w-full bg-transparent"
        >
          <LogIn className="h-4 w-4" /> Login
        </Button>
      </NavLink>
      <NavLink to="/auth/register" className="w-full md:w-auto">
        <Button size="sm" className="flex items-center gap-2 w-full">
          <UserPlus className="h-4 w-4" /> Register
        </Button>
      </NavLink>
    </>
  );

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold">
          AIdeas
        </Link>

        <div className="flex items-center space-x-2 md:hidden">
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
              <div className="flex flex-col space-y-4 grow">
                {navItems}
                <div className="pt-4 border-t border-border flex flex-col space-y-3 mt-auto px-4 pb-4">
                  {authButtons}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className=" items-center space-x-6 hidden md:flex">
          <div className="flex items-center space-x-4">{navItems}</div>
          <div className="flex items-center space-x-2">{authButtons}</div>
        </div>
      </div>
    </nav>
  );
}
