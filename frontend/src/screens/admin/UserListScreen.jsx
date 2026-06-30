import { useState } from 'react';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Message from '../../components/Message';
import TableSkeleton from '../../components/ui/TableSkeleton';
import ConfirmModal from '../../components/ConfirmModal';
import AdminToolbar from '../../components/ui/AdminToolbar';
import { useDeleteUserMutation, useGetUsersQuery } from '../../slices/usersApiSlice';
import { toast } from 'react-toastify';

const UserListScreen = () => {
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();
  const [deleteUser, { isLoading: deleting }] = useDeleteUserMutation();
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  const filtered = users?.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const deleteHandler = async () => {
    try {
      await deleteUser(deleteId).unwrap();
      toast.success('User removed');
      setDeleteId(null);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      {isLoading ? (
        <TableSkeleton rows={5} cols={4} />
      ) : error ? (
        <Message variant='danger'>{error?.data?.message || error.error}</Message>
      ) : (
        <div className='admin-table-wrap'>
          <AdminToolbar
            placeholder='Search users...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            count={filtered?.length}
            countLabel='users'
          />
          <div className='table-responsive'>
            <table className='table mb-0'>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered?.map((user) => (
                  <tr key={user._id}>
                    <td className='fw-semibold'>{user.name}</td>
                    <td><a href={`mailto:${user.email}`} className='text-link'>{user.email}</a></td>
                    <td>
                      <span className={`badge-pill ${user.role === 'admin' ? 'badge-pill--success' : 'badge-pill--neutral'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      {user.role !== 'admin' && (
                        <div className='d-flex gap-2'>
                          <Link to={`/admin/user/${user._id}/edit`} className='btn-outline-custom btn-icon-only btn-xs-custom'>
                            <FaEdit />
                          </Link>
                          <button type='button' className='btn-danger-custom btn-icon-only btn-xs-custom' onClick={() => setDeleteId(user._id)} aria-label='Delete user'>
                            <FaTrash />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmModal
        show={Boolean(deleteId)}
        title='Delete User'
        message='Are you sure you want to remove this user?'
        isLoading={deleting}
        onConfirm={deleteHandler}
        onCancel={() => setDeleteId(null)}
      />
    </>
  );
};

export default UserListScreen;
