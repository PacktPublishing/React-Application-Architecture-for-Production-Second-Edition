import type { Meta, StoryObj } from '@storybook/react-vite';

import { Alert, AlertDescription, AlertTitle } from './alert';

const meta = {
  title: 'UI/Alert',
  component: Alert,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive'],
    },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Alert className="w-[450px]">
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        You can add components to your app using the cli.
      </AlertDescription>
    </Alert>
  ),
};

export const Destructive: Story = {
  render: () => (
    <Alert variant="destructive" className="w-[450px]">
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        Your session has expired. Please log in again.
      </AlertDescription>
    </Alert>
  ),
};

export const WithTitleOnly: Story = {
  render: () => (
    <Alert className="w-[450px]">
      <AlertTitle>Important Notice</AlertTitle>
    </Alert>
  ),
};

export const WithDescriptionOnly: Story = {
  render: () => (
    <Alert className="w-[450px]">
      <AlertDescription>
        This is an alert with only a description and no title.
      </AlertDescription>
    </Alert>
  ),
};

export const DestructiveWithTitleOnly: Story = {
  render: () => (
    <Alert variant="destructive" className="w-[450px]">
      <AlertTitle>Action Required</AlertTitle>
    </Alert>
  ),
};

export const LongContent: Story = {
  render: () => (
    <Alert className="w-[450px]">
      <AlertTitle>System Maintenance</AlertTitle>
      <AlertDescription>
        We will be performing scheduled maintenance on our servers from 2:00 AM
        to 4:00 AM EST on December 15th. During this time, you may experience
        brief interruptions in service. We apologize for any inconvenience this
        may cause.
      </AlertDescription>
    </Alert>
  ),
};

export const DestructiveLongContent: Story = {
  render: () => (
    <Alert variant="destructive" className="w-[450px]">
      <AlertTitle>Account Security Alert</AlertTitle>
      <AlertDescription>
        We detected a login attempt from an unrecognized device. If this was
        you, no action is needed. If you don&apos;t recognize this activity,
        please change your password immediately and review your account security
        settings.
      </AlertDescription>
    </Alert>
  ),
};
