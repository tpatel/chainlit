import { useFormik } from 'formik';
import * as yup from 'yup';

import { Button, Link } from '@mui/material';

import { TextInput } from '../inputs/TextInput';
import { AuthTemplate } from './AuthTemplate';

interface AuthResetPasswordProps {
  onGoBack: () => void;
  onContinue: (value: string) => void;
}

const AuthResetPassword = ({
  onGoBack,
  onContinue
}: AuthResetPasswordProps): JSX.Element => {
  const formik = useFormik({
    initialValues: {
      email: ''
    },
    validationSchema: yup.object({
      email: yup.string().required()
    }),
    onSubmit: async () => undefined
  });

  return (
    <AuthTemplate title="Enter your email address and we will send you instructions to reset your password.">
      <TextInput
        id="email"
        placeholder="Email adress"
        size="medium"
        value={formik.values.email}
        hasError={!!formik.errors.email}
        description={formik.errors.email}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          formik.setFieldValue('email', e.target.value)
        }
      />
      <Button
        variant="contained"
        sx={{ marginTop: 1 }}
        onClick={() => onContinue(formik.values.email)}
      >
        Continue
      </Button>
      <Link component="button" marginTop={1} onClick={onGoBack}>
        Go Back
      </Link>
    </AuthTemplate>
  );
};

export { AuthResetPassword };
