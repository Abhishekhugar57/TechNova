import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';
import { useGetUserDetailsQuery, useUpdateUserMutation } from '../../slices/usersApiSlice';

const UserEditScreen = () => {
  const { id: userId } = useParams();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('user');
  const { data: user, isLoading, error, refetch } = useGetUserDetailsQuery(userId);
  const [updateUser, { isLoading: loadingUpdate }] = useUpdateUserMutation();
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updateUser({ userId, name, email, role });
      toast.success('User updated successfully');
      refetch();
      navigate('/admin/userlist');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setRole(user.role || 'user');
    }
  }, [user]);

  return (
    <>
      <Link to='/admin/userlist' className='btn-outline-custom page-back-link'>
        &larr; Back to Users
      </Link>
      <div className='card-surface card-surface--flat card-surface__body page-narrow'>
        <h1 className='page-title'>Edit User</h1>
        {loadingUpdate && <Loader size='small' />}
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error?.data?.message || error.error}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group className='mb-3'>
              <Form.Label>Name</Form.Label>
              <Form.Control type='text' className='form-control-modern' value={name} onChange={(e) => setName(e.target.value)} />
            </Form.Group>
            <Form.Group className='mb-3'>
              <Form.Label>Email</Form.Label>
              <Form.Control type='email' className='form-control-modern' value={email} onChange={(e) => setEmail(e.target.value)} />
            </Form.Group>
            <Form.Group className='mb-4'>
              <Form.Label>Role</Form.Label>
              <Form.Select className='form-control-modern' value={role} onChange={(e) => setRole(e.target.value)}>
                <option value='user'>User</option>
                <option value='admin'>Admin</option>
              </Form.Select>
            </Form.Group>
            <button type='submit' className='btn-primary-custom'>Update User</button>
          </Form>
        )}
      </div>
    </>
  );
};

export default UserEditScreen;
