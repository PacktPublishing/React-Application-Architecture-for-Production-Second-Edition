import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';

import { Seo } from '@/components/seo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRegisterUserMutation } from '@/features/auth/api/register';
import { RegisterForm } from '@/features/auth/components/register-form';
import type { RegisterUserData } from '@/types/generated/types.gen';

export default function RegisterPage() {
  const { t } = useTranslation(['auth', 'navigation']);
  const navigate = useNavigate();

  const registerUserMutation = useRegisterUserMutation();

  const onSubmit = (data: RegisterUserData['body']) => {
    registerUserMutation.mutate(data, {
      onSuccess: () => {
        navigate('/dashboard');
      },
    });
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <Seo
        title={t('auth:meta.register.title')}
        description={t('auth:meta.register.description')}
      />
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              {t('auth:registerTitle')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RegisterForm
              onSubmit={onSubmit}
              error={registerUserMutation.error}
              isPending={registerUserMutation.isPending}
            />
            <div className="text-center mt-4">
              <p className="text-sm text-muted-foreground">
                {t('auth:alreadyHaveAccount')}{' '}
                <Link to="/auth/login" className="text-primary hover:underline">
                  {t('navigation:login')}
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
