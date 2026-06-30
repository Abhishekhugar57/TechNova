import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import Loader from '../../components/Loader';
import ProductImage from '../../components/ProductImage';
import { toast } from 'react-toastify';
import {
  useCreateProductMutation,
  useUploadProductImageMutation,
} from '../../slices/productsApiSlice';
import { PRODUCT_CATEGORIES } from '../../constants/productCategories';

const ProductCreateScreen = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('/images/products/fallback.webp');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('Smartphones');
  const [countInStock, setCountInStock] = useState('');
  const [description, setDescription] = useState('');

  const [createProduct, { isLoading: loadingCreate }] = useCreateProductMutation();
  const [uploadProductImage, { isLoading: loadingUpload }] =
    useUploadProductImageMutation();

  const navigate = useNavigate();

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message);
      setImage(res.image);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await createProduct({
        name,
        price: Number(price),
        image,
        brand,
        category,
        countInStock: Number(countInStock),
        description,
      }).unwrap();
      toast.success('Product created successfully');
      navigate('/admin/productlist');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <Link to='/admin/productlist' className='btn-outline-custom page-back-link'>
        &larr; Back to Products
      </Link>
      <div className='card-surface card-surface--flat card-surface__body' style={{ maxWidth: 720 }}>
        <h1 className='page-title'>Add Product</h1>
        <p className='page-subtitle mb-4'>
          Fill in the details below to add a new product to the catalog.
        </p>

        {(loadingCreate || loadingUpload) && <Loader size='small' />}

        <Form onSubmit={submitHandler}>
          <Form.Group controlId='name' className='mb-3'>
            <Form.Label>Product Name</Form.Label>
            <Form.Control
              type='text'
              className='form-control-modern'
              placeholder='e.g. iPhone 15 Pro'
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId='price' className='mb-3'>
            <Form.Label>Price ($)</Form.Label>
            <Form.Control
              type='number'
              min='0'
              step='0.01'
              className='form-control-modern'
              placeholder='0.00'
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId='image' className='mb-3'>
            <Form.Label>Image</Form.Label>
            <Form.Control
              type='text'
              className='form-control-modern mb-2'
              placeholder='Image URL or upload below'
              value={image}
              onChange={(e) => setImage(e.target.value)}
              required
            />
            <Form.Control
              type='file'
              accept='image/*'
              className='form-control-modern'
              onChange={uploadFileHandler}
            />
            {image && (
              <ProductImage
                src={image}
                alt='Preview'
                className='table-thumb mt-2'
                width={80}
                height={80}
              />
            )}
          </Form.Group>

          <Form.Group controlId='brand' className='mb-3'>
            <Form.Label>Brand</Form.Label>
            <Form.Control
              type='text'
              className='form-control-modern'
              placeholder='e.g. Apple, Sony'
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId='category' className='mb-3'>
            <Form.Label>Category</Form.Label>
            <Form.Select
              className='form-control-modern'
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              {PRODUCT_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group controlId='countInStock' className='mb-3'>
            <Form.Label>Stock Quantity</Form.Label>
            <Form.Control
              type='number'
              min='0'
              className='form-control-modern'
              placeholder='0'
              value={countInStock}
              onChange={(e) => setCountInStock(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId='description' className='mb-4'>
            <Form.Label>Description</Form.Label>
            <Form.Control
              as='textarea'
              rows={4}
              className='form-control-modern'
              placeholder='Describe the product features and specifications...'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </Form.Group>

          <div className='d-flex gap-2 flex-wrap'>
            <button type='submit' className='btn-primary-custom' disabled={loadingCreate}>
              {loadingCreate ? 'Creating...' : 'Add Product'}
            </button>
            <Link to='/admin/productlist' className='btn-outline-custom'>
              Cancel
            </Link>
          </div>
        </Form>
      </div>
    </>
  );
};

export default ProductCreateScreen;
