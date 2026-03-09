import { vi } from 'vitest';

import { render, screen, userEvent, waitFor } from 'testing/test-utils';

import { LoginForm, type LoginFormProps } from '../login-form';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'auth:email': 'Email',
        'auth:password': 'Password',
        'auth:loggingIn': 'Logging in...',
        'navigation:login': 'Log in',
      };
      return translations[key] || key;
    },
  }),
}));

const renderLoginForm = (props: Partial<LoginFormProps> = {}) => {
  const defaultProps: LoginFormProps = {
    onSubmit: vi.fn(),
    error: null,
    isPending: false,
    ...props,
  };

  return {
    ...render(<LoginForm {...defaultProps} />),
    props: defaultProps,
  };
};

describe('LoginForm', () => {
  describe('rendering', () => {
    it('should render email and password inputs', () => {
      renderLoginForm();

      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByLabelText('Password')).toBeInTheDocument();
    });

    it('should render submit button with login text', () => {
      renderLoginForm();

      expect(
        screen.getByRole('button', { name: 'Log in' }),
      ).toBeInTheDocument();
    });

    it('should render submit button with loading text when isPending', () => {
      renderLoginForm({ isPending: true });

      expect(
        screen.getByRole('button', { name: 'Logging in...' }),
      ).toBeInTheDocument();
    });

    it('should disable submit button when isPending', () => {
      renderLoginForm({ isPending: true });

      expect(
        screen.getByRole('button', { name: 'Logging in...' }),
      ).toBeDisabled();
    });
  });

  describe('form submission', () => {
    it('should call onSubmit with form data when submitted with valid data', async () => {
      const user = userEvent.setup();
      const { props } = renderLoginForm();

      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Password');

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(screen.getByRole('button', { name: 'Log in' }));

      await waitFor(() => {
        expect(props.onSubmit).toHaveBeenCalledWith(
          { email: 'test@example.com', password: 'password123' },
          expect.anything(),
        );
      });
    });

    it('should not call onSubmit when submitted with empty fields', async () => {
      const user = userEvent.setup();
      const { props } = renderLoginForm();

      await user.click(screen.getByRole('button', { name: 'Log in' }));

      await waitFor(() => {
        expect(props.onSubmit).not.toHaveBeenCalled();
      });
    });

    it('should not call onSubmit with invalid email', async () => {
      const user = userEvent.setup();
      const { props } = renderLoginForm();

      await user.type(screen.getByLabelText('Email'), 'invalid-email');
      await user.type(screen.getByLabelText('Password'), 'password123');
      await user.click(screen.getByRole('button', { name: 'Log in' }));

      await waitFor(() => {
        expect(props.onSubmit).not.toHaveBeenCalled();
      });
    });
  });

  describe('error handling', () => {
    it('should display error message when error prop is provided', () => {
      const error = new Error('Invalid credentials');
      renderLoginForm({ error });

      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });

    it('should not display error message when error is null', () => {
      renderLoginForm({ error: null });

      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });
});
