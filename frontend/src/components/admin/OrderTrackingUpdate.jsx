import { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import Loader from '../Loader';
import { useUpdateOrderTrackingMutation } from '../../slices/ordersApiSlice';
import { getNextStatuses } from '../../constants/orderTracking';

const OrderTrackingUpdate = ({ orderId, currentStatus, onUpdated }) => {
  const nextOptions = getNextStatuses(currentStatus);
  const [status, setStatus] = useState(nextOptions[0] || '');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [updateTracking, { isLoading }] = useUpdateOrderTrackingMutation();

  useEffect(() => {
    setStatus(getNextStatuses(currentStatus)[0] || '');
  }, [currentStatus]);

  if (nextOptions.length === 0) {
    return null;
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!status) {
      toast.error('Please select a tracking status');
      return;
    }

    try {
      await updateTracking({
        orderId,
        status,
        description: description.trim() || undefined,
        location: location.trim() || undefined,
      }).unwrap();
      toast.success(`Order updated to "${status}"`);
      setDescription('');
      setLocation('');
      onUpdated?.();
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to update tracking status');
    }
  };

  return (
    <div className='order-tracking-admin'>
      <h6 className='order-tracking-admin__title'>Update Tracking Status</h6>
      <Form onSubmit={submitHandler}>
        <Form.Group className='mb-3'>
          <Form.Label>Next Status</Form.Label>
          <Form.Select
            className='form-control-modern'
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {nextOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className='mb-3'>
          <Form.Label>Description (optional)</Form.Label>
          <Form.Control
            as='textarea'
            rows={2}
            className='form-control-modern'
            placeholder='Custom update message for the customer'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>

        <Form.Group className='mb-3'>
          <Form.Label>Location (optional)</Form.Label>
          <Form.Control
            type='text'
            className='form-control-modern'
            placeholder='e.g. Mumbai Hub, In Transit'
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </Form.Group>

        {isLoading && <Loader size='small' />}
        <button type='submit' className='btn-accent w-100' disabled={isLoading}>
          Update Status
        </button>
      </Form>
    </div>
  );
};

export default OrderTrackingUpdate;
