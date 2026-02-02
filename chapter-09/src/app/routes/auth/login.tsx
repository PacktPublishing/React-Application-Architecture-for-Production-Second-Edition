import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';

import { Seo } from '@/components/seo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLoginUserMutation } from '@/features/auth/api/login';
import { LoginForm } from '@/features/auth/components/login-form';
import type { LoginUserData } from '@/types/generated/types.gen';

export default function LoginPage() {
  const { t } = useTranslation(['auth', 'navigation']);
  const navigate = useNavigate();

  const loginUserMutation = useLoginUserMutation();

  const onSubmit = (data: LoginUserData['body']) => {
    loginUserMutation.mutate(data, {
      onSuccess: () => {
        navigate('/dashboard');
      },
    });
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <Seo
        title={t('auth:meta.login.title')}
        description={t('auth:meta.login.description')}
      />
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              {t('auth:loginTitle')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <LoginForm
              onSubmit={onSubmit}
              error={loginUserMutation.error}
              isPending={loginUserMutation.isPending}
            />
            <div className="text-center mt-4">
              <p className="text-sm text-muted-foreground">
                {t('auth:dontHaveAccount')}{' '}
                <Link
                  to="/auth/register"
                  className="text-primary hover:underline"
                >
                  {t('navigation:register')}
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
