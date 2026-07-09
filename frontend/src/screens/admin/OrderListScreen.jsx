import { useState } from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Message from '../../components/Message';
import TableSkeleton from '../../components/ui/TableSkeleton';
import AdminToolbar from '../../components/ui/AdminToolbar';
import { useGetOrdersQuery } from '../../slices/ordersApiSlice';
import TrackingStatusBadge from '../../components/TrackingStatusBadge';
import { formatPrice } from '../../utils/currencyUtils';

const OrderListScreen = () => {
  const { data: orders, isLoading, error } = useGetOrdersQuery();
  const [search, setSearch] = useState('');

  const filtered = orders?.filter(
    (o) =>
      o._id.includes(search) ||
      o.user?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {isLoading ? (
        <TableSkeleton rows={6} cols={8} />
      ) : error ? (
        <Message variant='danger'>{error?.data?.message || error.error}</Message>
      ) : (
        <div className='admin-table-wrap'>
          <AdminToolbar
            placeholder='Search by ID or customer...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            count={filtered?.length}
            countLabel='orders'
          />
          <div className='table-responsive'>
            <table className='table mb-0'>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Paid</th>
                  <th>Delivered</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered?.map((order) => (
                  <tr key={order._id}>
                    <td className='text-muted-custom' style={{ fontSize: '0.8125rem' }}>
                      {order._id.substring(0, 12)}...
                    </td>
                    <td>{order.user?.name}</td>
                    <td>{order.createdAt.substring(0, 10)}</td>
                    <td className='fw-semibold'>{formatPrice(order.totalPrice)}</td>
                    <td>
                      <TrackingStatusBadge status={order.trackingStatus} />
                    </td>
                    <td>
                      {order.isPaid ? (
                        <span className='badge-pill badge-pill--success'>{order.paidAt.substring(0, 10)}</span>
                      ) : (
                        <span className='badge-pill badge-pill--danger'><FaTimes /></span>
                      )}
                    </td>
                    <td>
                      {order.isDelivered ? (
                        <span className='badge-pill badge-pill--success'><FaCheck /></span>
                      ) : (
                        <span className='badge-pill badge-pill--neutral'><FaTimes /></span>
                      )}
                    </td>
                    <td>
                      <Link to={`/order/${order._id}`} className='btn-outline-custom btn-xs-custom'>
                        Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderListScreen;
