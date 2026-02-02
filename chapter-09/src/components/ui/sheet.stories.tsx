import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './sheet';

const meta = {
  title: 'UI/Sheet',
  component: Sheet,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Sheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Right: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger
        render={<Button variant="outline">Open Sheet (Right)</Button>}
      />
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Edit Profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" defaultValue="John Doe" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input
              id="username"
              defaultValue="@johndoe"
              className="col-span-3"
            />
          </div>
        </div>
        <SheetFooter>
          <Button type="submit">Save changes</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

export const Left: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger
        render={<Button variant="outline">Open Sheet (Left)</Button>}
      />
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Navigation</SheetTitle>
          <SheetDescription>Access your navigation menu here.</SheetDescription>
        </SheetHeader>
        <div className="py-4">
          <nav className="flex flex-col gap-2">
            <Button variant="ghost" className="justify-start">
              Home
            </Button>
            <Button variant="ghost" className="justify-start">
              Dashboard
            </Button>
            <Button variant="ghost" className="justify-start">
              Settings
            </Button>
            <Button variant="ghost" className="justify-start">
              Profile
            </Button>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  ),
};

export const Top: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger
        render={<Button variant="outline">Open Sheet (Top)</Button>}
      />
      <SheetContent side="top">
        <SheetHeader>
          <SheetTitle>Notification</SheetTitle>
          <SheetDescription>You have new notifications.</SheetDescription>
        </SheetHeader>
        <div className="py-4">
          <p>Your notification content goes here.</p>
        </div>
      </SheetContent>
    </Sheet>
  ),
};

export const Bottom: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger
        render={<Button variant="outline">Open Sheet (Bottom)</Button>}
      />
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>Cookie Settings</SheetTitle>
          <SheetDescription>Manage your cookie preferences.</SheetDescription>
        </SheetHeader>
        <div className="py-4">
          <p>Cookie settings content goes here.</p>
        </div>
        <SheetFooter>
          <Button>Accept All</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};
