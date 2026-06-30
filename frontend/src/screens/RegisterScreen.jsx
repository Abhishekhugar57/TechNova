import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import { useRegisterMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { getAuthRedirectPath } from '../utils/authUtils';
import { toast } from 'react-toastify';
import { SITE_NAME } from '../constants/site';

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const redirect = new URLSearchParams(useLocation().search).get('redirect') || '/';

  useEffect(() => {
    if (userInfo) navigate(getAuthRedirectPath(userInfo, redirect));
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      const res = await register({ name, email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(getAuthRedirectPath(res, redirect));
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className='auth-page animate-in'>
      <div className='auth-page__visual'>
        <div>
          <h2 className='auth-visual__title'>Join {SITE_NAME}</h2>
          <p className='auth-visual__text'>
            Create an account for faster checkout, order tracking, and personalized recommendations.
          </p>
        </div>
      </div>
      <div className='auth-page__form'>
        <FormContainer title='Create Account' subtitle='Fill in your details to get started'>
          <Form onSubmit={submitHandler}>
            <Form.Group className='mb-3'>
              <Form.Label>Name</Form.Label>
              <Form.Control type='text' className='form-control-modern' value={name} onChange={(e) => setName(e.target.value)} required autoComplete='name' />
            </Form.Group>
            <Form.Group className='mb-3'>
              <Form.Label>Email</Form.Label>
              <Form.Control type='email' className='form-control-modern' value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete='email' />
            </Form.Group>
            <Form.Group className='mb-3'>
              <Form.Label>Password</Form.Label>
              <Form.Control type='password' className='form-control-modern' value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete='new-password' />
            </Form.Group>
            <Form.Group className='mb-4'>
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control type='password' className='form-control-modern' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required autoComplete='new-password' />
            </Form.Group>
            <button type='submit' className='btn-primary-custom w-100' disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Register'}
            </button>
            {isLoading && <Loader size='small' />}
          </Form>
          <p className='mt-4 text-center text-muted-custom'>
            Already have an account?{' '}
            <Link to={redirect ? `/login?redirect=${redirect}` : '/login'} className='text-link'>
              Sign in
            </Link>
          </p>
        </FormContainer>
      </div>
    </div>
  );
};

export default RegisterScreen;
