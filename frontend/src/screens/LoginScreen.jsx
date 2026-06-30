import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import { useLoginMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { getAuthRedirectPath } from '../utils/authUtils';
import { toast } from 'react-toastify';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const { search } = useLocation();
  const redirect = new URLSearchParams(search).get('redirect') || '/';

  useEffect(() => {
    if (userInfo) navigate(getAuthRedirectPath(userInfo, redirect));
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
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
          <h2 className='auth-visual__title'>Welcome Back</h2>
          <p className='auth-visual__text'>
            Sign in to access your orders, wishlist, and exclusive member deals.
          </p>
        </div>
      </div>
      <div className='auth-page__form'>
        <FormContainer title='Sign In' subtitle='Enter your credentials to continue'>
          <Form onSubmit={submitHandler}>
            <Form.Group className='mb-3'>
              <Form.Label>Email</Form.Label>
              <Form.Control type='email' className='form-control-modern' placeholder='you@example.com' value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete='email' />
            </Form.Group>
            <Form.Group className='mb-4'>
              <Form.Label>Password</Form.Label>
              <Form.Control type='password' className='form-control-modern' placeholder='Enter password' value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete='current-password' />
            </Form.Group>
            <button type='submit' className='btn-primary-custom w-100' disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
            {isLoading && <Loader size='small' />}
          </Form>
          <p className='mt-4 text-center text-muted-custom'>
            New customer?{' '}
            <Link to={redirect ? `/register?redirect=${redirect}` : '/register'} className='text-link'>
              Create an account
            </Link>
          </p>
        </FormContainer>
      </div>
    </div>
  );
};

export default LoginScreen;
