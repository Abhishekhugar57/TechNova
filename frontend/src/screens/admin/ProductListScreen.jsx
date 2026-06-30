import { useState } from 'react';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import { Link, useParams, useLocation } from 'react-router-dom';
import Message from '../../components/Message';
import TableSkeleton from '../../components/ui/TableSkeleton';
import Paginate from '../../components/Paginate';
import ConfirmModal from '../../components/ConfirmModal';
import AdminToolbar from '../../components/ui/AdminToolbar';
import ProductImage from '../../components/ProductImage';
import {
  useGetProductsQuery,
  useDeleteProductMutation,
} from '../../slices/productsApiSlice';
import { toast } from 'react-toastify';

const ProductListScreen = () => {
  const { pageNumber } = useParams();
  const location = useLocation();
  const [search, setSearch] = useState(location.state?.search || '');
  const [deleteId, setDeleteId] = useState(null);

  const { data, isLoading, error, refetch } = useGetProductsQuery({ pageNumber });
  const [deleteProduct, { isLoading: loadingDelete }] = useDeleteProductMutation();

  const filtered = data?.products?.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand?.toLowerCase().includes(search.toLowerCase())
  );

  const deleteHandler = async () => {
    try {
      await deleteProduct(deleteId).unwrap();
      toast.success('Product deleted');
      setDeleteId(null);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <div className='d-flex justify-content-end mb-3'>
        <Link to='/admin/product/create' className='btn-primary-custom'>
          <FaPlus /> Add Product
        </Link>
      </div>

      {isLoading ? (
        <TableSkeleton rows={6} cols={6} />
      ) : error ? (
        <Message variant='danger'>{error.data.message}</Message>
      ) : (
        <div className='admin-table-wrap'>
          <AdminToolbar
            placeholder='Search products...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            count={filtered?.length}
            countLabel='products'
          />
          <div className='table-responsive'>
            <table className='table mb-0'>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Category</th>
                  <th>Brand</th>
                  <th>Stock</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered?.map((product) => (
                  <tr key={product._id}>
                    <td>
                      <div className='d-flex align-items-center gap-2'>
                        <ProductImage src={product.image} alt={product.name} className='table-thumb' width={48} height={48} />
                        <span className='fw-semibold'>{product.name}</span>
                      </div>
                    </td>
                    <td className='fw-semibold'>${product.price}</td>
                    <td>{product.category}</td>
                    <td>{product.brand}</td>
                    <td>{product.countInStock}</td>
                    <td>
                      <div className='d-flex gap-2'>
                        <Link to={`/admin/product/${product._id}/edit`} className='btn-outline-custom btn-icon-only btn-xs-custom'>
                          <FaEdit />
                        </Link>
                        <button type='button' className='btn-danger-custom btn-icon-only btn-xs-custom' onClick={() => setDeleteId(product._id)} aria-label='Delete product'>
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className='p-3'>
            <Paginate pages={data.pages} page={data.page} isAdmin={true} />
          </div>
        </div>
      )}

      <ConfirmModal
        show={Boolean(deleteId)}
        title='Delete Product'
        message='Are you sure you want to delete this product?'
        isLoading={loadingDelete}
        onConfirm={deleteHandler}
        onCancel={() => setDeleteId(null)}
      />
    </>
  );
};

export default ProductListScreen;
