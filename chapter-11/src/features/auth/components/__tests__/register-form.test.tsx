import { vi } from 'vitest';

import { render, screen, userEvent, waitFor } from 'testing/test-utils';

import { RegisterForm, type RegisterFormProps } from '../register-form';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'auth:username': 'Username',
        'auth:email': 'Email',
        'auth:password': 'Password',
        'auth:creatingAccount': 'Creating account...',
        'navigation:register': 'Register',
      };
      return translations[key] || key;
    },
  }),
}));

const renderRegisterForm = (props: Partial<RegisterFormProps> = {}) => {
  const defaultProps: RegisterFormProps = {
    onSubmit: vi.fn(),
    error: null,
    isPending: false,
    ...props,
  };

  return {
    ...render(<RegisterForm {...defaultProps} />),
    props: defaultProps,
  };
};

describe('RegisterForm', () => {
  describe('rendering', () => {
    it('should render username, email, and password inputs', () => {
      renderRegisterForm();

      expect(screen.getByLabelText('Username')).toBeInTheDocument();
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByLabelText('Password')).toBeInTheDocument();
    });

    it('should render submit button with register text', () => {
      renderRegisterForm();

      expect(
        screen.getByRole('button', { name: 'Register' }),
      ).toBeInTheDocument();
    });

    it('should render submit button with loading text when isPending', () => {
      renderRegisterForm({ isPending: true });

      expect(
        screen.getByRole('button', { name: 'Creating account...' }),
      ).toBeInTheDocument();
    });

    it('should disable submit button when isPending', () => {
      renderRegisterForm({ isPending: true });

      expect(
        screen.getByRole('button', { name: 'Creating account...' }),
      ).toBeDisabled();
    });
  });

  describe('form submission', () => {
    it('should call onSubmit with form data when submitted with valid data', async () => {
      const user = userEvent.setup();
      const { props } = renderRegisterForm();

      await user.type(
        screen.getByRole('textbox', { name: 'Username' }),
        'johndoe',
      );
      await user.type(
        screen.getByRole('textbox', { name: 'Email' }),
        'john@example.com',
      );
      await user.type(screen.getByLabelText('Password'), 'password123');
      await user.click(screen.getByRole('button', { name: 'Register' }));

      await waitFor(() => {
        expect(props.onSubmit).toHaveBeenCalledWith(
          {
            username: 'johndoe',
            email: 'john@example.com',
            password: 'password123',
            bio: '',
          },
          expect.anything(),
        );
      });
    });

    it('should not call onSubmit when submitted with empty fields', async () => {
      const user = userEvent.setup();
      const { props } = renderRegisterForm();

      await user.click(screen.getByRole('button', { name: 'Register' }));

      await waitFor(() => {
        expect(props.onSubmit).not.toHaveBeenCalled();
      });
    });

    it('should not call onSubmit with invalid email', async () => {
      const user = userEvent.setup();
      const { props } = renderRegisterForm();

      await user.type(
        screen.getByRole('textbox', { name: 'Username' }),
        'johndoe',
      );
      await user.type(
        screen.getByRole('textbox', { name: 'Email' }),
        'invalid-email',
      );
      await user.type(screen.getByLabelText('Password'), 'password123');
      await user.click(screen.getByRole('button', { name: 'Register' }));

      await waitFor(() => {
        expect(props.onSubmit).not.toHaveBeenCalled();
      });
    });

    it('should not call onSubmit with username too short', async () => {
      const user = userEvent.setup();
      const { props } = renderRegisterForm();

      await user.type(screen.getByRole('textbox', { name: 'Username' }), 'ab');
      await user.type(
        screen.getByRole('textbox', { name: 'Email' }),
        'john@example.com',
      );
      await user.type(screen.getByLabelText('Password'), 'password123');
      await user.click(screen.getByRole('button', { name: 'Register' }));

      await waitFor(() => {
        expect(props.onSubmit).not.toHaveBeenCalled();
      });
    });

    it('should not call onSubmit with password too short', async () => {
      const user = userEvent.setup();
      const { props } = renderRegisterForm();

      await user.type(
        screen.getByRole('textbox', { name: 'Username' }),
        'johndoe',
      );
      await user.type(
        screen.getByRole('textbox', { name: 'Email' }),
        'john@example.com',
      );
      await user.type(screen.getByLabelText('Password'), 'short');
      await user.click(screen.getByRole('button', { name: 'Register' }));

      await waitFor(() => {
        expect(props.onSubmit).not.toHaveBeenCalled();
      });
    });
  });

  describe('error handling', () => {
    it('should display error message when error prop is provided', () => {
      const error = new Error('Username already exists');
      renderRegisterForm({ error });

      expect(screen.getByText('Username already exists')).toBeInTheDocument();
    });

    it('should not display error message when error is null', () => {
      renderRegisterForm({ error: null });

      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });
});
