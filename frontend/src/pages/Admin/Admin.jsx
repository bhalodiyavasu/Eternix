import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Image } from 'lucide-react';
import Input from '@/components/common/Form/Input';
import Select from '@/components/common/Form/Select';
import Checkbox from '@/components/common/Form/Checkbox';
import Textarea from '@/components/common/Form/Textarea';
import FileUpload from '@/components/common/Form/FileUpload';
import Button from '@/components/common/Button/Button';
import Loader from '@/components/common/Loader/Loader';
import Modal from '@/components/common/Modal/Modal';
import { useCreateProductMutation, useUpdateProductMutation, useGetProductsQuery, useDeleteProductMutation } from '@/store/actions/productActions';
import { useToast } from '@/contexts/ToastContext';
import './Admin.css';


export default function Admin() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const isLoading = isCreating || isUpdating || isDeleting;
  const [productToDelete, setProductToDelete] = useState(null);
  const { data: apiProductsData, isLoading: isProductsLoading, refetch } = useGetProductsQuery();

  const inventoryProducts = useMemo(() => {
    return apiProductsData?.products ?? [];
  }, [apiProductsData]);

  const [activeTab, setActiveTab] = useState('inventory');
  const [isCreateTabOpen, setIsCreateTabOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);

  const handleOpenCreateTab = () => {
    setEditingProductId(null);
    setUserInput({
      name: '',
      price: '',
      category: '',
      gender: '',
      description: '',
      status: '',
      image: null,
      sizes: [],
      colorsList: []
    });
    setImagePreview('');
    setIsCreateTabOpen(true);
    setActiveTab('create');
  };

  const handleCloseCreateTab = () => {
    setIsCreateTabOpen(false);
    setActiveTab('inventory');
    setEditingProductId(null);
  };

  const handleEditProduct = async (productId) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const res = await fetch(`${API_URL}/products/${productId}`, { credentials: 'include' });
      const data = await res.json();
      const product = data.product || data;
      setUserInput({
        name: product.name || '',
        price: product.price || '',
        category: product.category || '',
        gender: product.gender || '',
        description: product.description || '',
        status: product.status || '',
        image: null,
        sizes: product.sizes || [],
        colorsList: product.colors || []
      });
      setImagePreview(product.image || '');
      setEditingProductId(productId);
      setIsCreateTabOpen(true);
      setActiveTab('create');
    } catch (err) {
      showToast('error', err.data?.message || err.message || 'FAILED TO FETCH PRODUCT.');
    }
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    try {
      const res = await deleteProduct(productToDelete._id || productToDelete.id).unwrap();
      if (res && res.status === 'SUCCESS') {
        showToast('success', res.message || 'PRODUCT DELETED SUCCESSFULLY');
        refetch();
      } else {
        showToast('error', res?.message || 'FAILED TO DELETE PRODUCT.');
      }
    } catch (err) {
      showToast('error', err.data?.message || err.message || 'FAILED TO DELETE PRODUCT.');
    } finally {
      setProductToDelete(null);
    }
  };

  const [imagePreview, setImagePreview] = useState('');

  const [userInput, setUserInput] = useState({
    name: '',
    price: '',
    category: '',
    gender: '',
    description: '',
    status: '',
    image: null,
    sizes: [],
    colorsList: []
  });

  const [colorInput, setColorInput] = useState({ name: '', hex: '#363636' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInput(prev => ({ ...prev, [name]: value }));
  };

  const handleColorAdd = () => {
    if (!colorInput.name.trim()) return;
    const exists = userInput.colorsList.some(
      (c) => c.name.toUpperCase() === colorInput.name.trim().toUpperCase()
    );
    if (exists) {
      showToast('error', 'COLOR ALREADY ADDED.');
      return;
    }
    setUserInput(prev => ({
      ...prev,
      colorsList: [...prev.colorsList, { name: colorInput.name.toUpperCase(), hex: colorInput.hex }]
    }));
    setColorInput({ name: '', hex: '#363636' });
  };

  const handleColorRemove = (colorName) => {
    setUserInput(prev => ({
      ...prev,
      colorsList: prev.colorsList.filter(c => c.name !== colorName)
    }));
  };

  const handleSizeToggle = (size) => {
    setUserInput(prev => {
      const currentSizes = prev.sizes || [];
      const updatedSizes = currentSizes.includes(size)
        ? currentSizes.filter(s => s !== size)
        : [...currentSizes, size];
      return { ...prev, sizes: updatedSizes };
    });
  };

  const CATEGORY_OPTIONS = [
    { label: 'T-SHIRT', value: 'tshirt' },
    { label: 'SHIRT', value: 'shirt' },
    { label: 'JACKET', value: 'jacket' },
    { label: 'SHOES', value: 'shoes' }
  ];

  const GENDER_OPTIONS = [
    { label: 'MAN', value: 'man' },
    { label: 'WOMAN', value: 'woman' },
    { label: 'KIDS', value: 'kids' }
  ];

  const STATUS_OPTIONS = [
    { label: 'NEW IN', value: 'New In' },
    { label: 'BEST SELLER', value: 'Best Seller' },
    { label: 'SALE', value: 'Sale' }
  ];

  const FILTER_SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL'];

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('name', userInput.name);
      formData.append('price', userInput.price);
      formData.append('category', userInput.category);
      formData.append('gender', userInput.gender);
      formData.append('status', userInput.status);
      formData.append('description', userInput.description);
      formData.append('sizes', JSON.stringify(userInput.sizes));
      formData.append('colors', JSON.stringify(userInput.colorsList));
      if (userInput.image) {
        formData.append('image', userInput.image);
      }

      let res;
      if (editingProductId) {
        res = await updateProduct({ id: editingProductId, formData }).unwrap();
      } else {
        res = await createProduct(formData).unwrap();
      }

      if (res && res.status === 'SUCCESS') {
        showToast('success', res.message || (editingProductId ? 'PRODUCT UPDATED SUCCESSFULLY' : 'PRODUCT CREATED SUCCESSFULLY'));
        refetch();
        
        // Reset the form
        setUserInput({
          name: '',
          price: '',
          category: '',
          gender: '',
          description: '',
          status: '',
          image: null,
          sizes: [],
          colorsList: []
        });
        setImagePreview('');
        setEditingProductId(null);
        handleCloseCreateTab();
      } else {
        showToast('error', res?.message || (editingProductId ? 'FAILED TO UPDATE PRODUCT.' : 'FAILED TO CREATE PRODUCT.'));
      }
    } catch (err) {
      showToast('error', err.data?.message || err.message || (editingProductId ? 'FAILED TO UPDATE PRODUCT.' : 'FAILED TO CREATE PRODUCT.'));
    }
  };

  return (
    <div className="admin-page-container">
      {/* 50x50 Home Button */}
      <div className="admin-header-row">
        <button onClick={() => navigate('/')} className="admin-home-btn" aria-label="Go Home">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
          </svg>
        </button>
        <span className="admin-header-title">ADMIN PANEL</span>
      </div>

      {/* Tabs Header - Styled consistently like Checkout tabs */}
      <div className="admin-tabs-wrapper">
        <div className="admin-tabs-left">
          <button 
            type="button"
            className={`admin-tab-btn ${activeTab === 'inventory' ? 'active' : ''}`}
            onClick={() => setActiveTab('inventory')}
          >
            PRODUCT INVENTORY
          </button>
          
          {isCreateTabOpen && (
            <span className="admin-tab-btn-wrapper">
              <button 
                type="button"
                className={`admin-tab-btn ${activeTab === 'create' ? 'active' : ''}`}
                onClick={() => setActiveTab('create')}
              >
                {editingProductId ? 'EDIT PRODUCT' : 'CREATE PRODUCT'}
              </button>
              <button 
                type="button"
                className="admin-tab-close-icon"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCloseCreateTab();
                }}
                aria-label="Close Create Tab"
              >
                ✕
              </button>
            </span>
          )}
        </div>

        {!isCreateTabOpen && (
          <button 
            type="button"
            className="admin-tab-action-btn"
            onClick={handleOpenCreateTab}
          >
            ADD PRODUCT
          </button>
        )}
      </div>

      <div className="admin-content-area">
        {/* Form & Sidebar Preview Side-by-Side Layout */}
        {activeTab === 'create' && (
          <div className="admin-form-with-preview-layout">
            <form onSubmit={handleSubmit} className="admin-form-transparent">
            <div className="form-row-custom">
              <Input
                label="Product Name"
                name="name"
                value={userInput.name}
                onChange={handleInputChange}
                placeholder="e.g. LINEN CASUAL BLAZER"
                required
                disabled={isLoading}
              />
              <Input
                label="Price ($)"
                type="number"
                name="price"
                value={userInput.price}
                onChange={handleInputChange}
                placeholder="e.g. 149"
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-row-custom">
              <Select
                label="Category"
                name="category"
                value={userInput.category}
                onChange={handleInputChange}
                options={CATEGORY_OPTIONS}
                placeholder="SELECT CATEGORY"
                required
                disabled={isLoading}
              />
              <Select
                label="Gender"
                name="gender"
                value={userInput.gender}
                onChange={handleInputChange}
                options={GENDER_OPTIONS}
                placeholder="SELECT GENDER"
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-row-custom">
              <Select
                label="Product Status"
                name="status"
                value={userInput.status}
                onChange={handleInputChange}
                options={STATUS_OPTIONS}
                placeholder="SELECT STATUS"
                disabled={isLoading}
              />
              <FileUpload
                label="Product Image"
                onChange={(file) => {
                  setUserInput(prev => ({ ...prev, image: file }));
                  if (file) {
                    const objectUrl = URL.createObjectURL(file);
                    setImagePreview(objectUrl);
                  } else {
                    setImagePreview('');
                  }
                }}
                previewUrl={imagePreview}
                required
                disabled={isLoading}
              />
            </div>

            <Textarea
              label="Description"
              name="description"
              value={userInput.description}
              onChange={handleInputChange}
              placeholder="Describe the product material, fit details..."
              required
              disabled={isLoading}
            />

            {/* Checkboxes for size selection */}
            <div className="admin-form-group">
              <span className="input-label-custom">SELECT SIZES <span className="label-required-star">*</span></span>
              <div className="sizes-checkboxes-grid">
                {FILTER_SIZES.map(size => (
                  <Checkbox
                    key={size}
                    label={size}
                    name="sizes"
                    checked={userInput.sizes?.includes(size)}
                    onChange={() => handleSizeToggle(size)}
                    disabled={isLoading}
                  />
                ))}
              </div>
            </div>

            {/* Add Colors with Color Hex and Name */}
            <div className="admin-form-group">
              <div className="colors-adder-row">
                <div className="color-field-name">
                  <Input
                    label="Color Name"
                    name="colorName"
                    value={colorInput.name}
                    onChange={(e) => setColorInput(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. CHARCOAL"
                    disabled={isLoading}
                  />
                </div>
                <div className="color-field-hex">
                  <Input
                    label="Color Hex"
                    type="color"
                    name="colorHex"
                    value={colorInput.hex}
                    onChange={(e) => setColorInput(prev => ({ ...prev, hex: e.target.value }))}
                    disabled={isLoading}
                  />
                </div>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={handleColorAdd} 
                  className="add-color-action-btn"
                  disabled={isLoading}
                >
                  ADD COLOR
                </Button>
              </div>

              {/* Added Colors Tags */}
              {userInput.colorsList.length > 0 && (
                <div className="colors-preview-tags">
                  {userInput.colorsList.map((c, idx) => (
                    <span className="color-preview-tag" key={`${c.name}-${idx}`}>
                      <span className="tag-color-swatch" style={{ backgroundColor: c.hex }} />
                      <span className="tag-color-name">{c.name}</span>
                      <button 
                        type="button" 
                        onClick={() => !isLoading && handleColorRemove(c.name)}
                        className="color-tag-close-btn"
                        aria-label={`Remove color ${c.name}`}
                        disabled={isLoading}
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="admin-submit-btn-row">
              <Button type="submit" variant="solid" layout="split" disabled={isLoading}>
                <span>{isLoading ? (editingProductId ? 'UPDATING...' : 'CREATING...') : (editingProductId ? 'UPDATE PRODUCT' : 'CREATE PRODUCT')}</span>
                <svg width="40" height="12" viewBox="0 0 40 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 6H39M39 6L33 1M39 6L33 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Button>
            </div>
          </form>

          {/* Product Live Preview sidebar */}
          <div className="admin-product-preview-sidebar">
            <span className="input-label-custom">PRODUCT PREVIEW</span>
            {isLoading ? (
              <div className="preview-loader-container">
                <Loader />
              </div>
            ) : (userInput.name.trim() || userInput.price || userInput.category || userInput.gender || userInput.description.trim() || imagePreview || userInput.sizes.length > 0 || userInput.colorsList.length > 0) ? (
              <div className="collections-card-link">
                <div className="collections-card">
                  <div className="card-image-wrapper">
                    {imagePreview ? (
                      <img 
                        src={imagePreview} 
                        alt={userInput.name || 'Product Image'} 
                        className="card-product-image" 
                      />
                    ) : (
                      <div className="card-image-placeholder">
                        <Image size={48} strokeWidth={1} />
                      </div>
                    )}
                  </div>
                  <div className="card-details">
                    <div className="card-category">
                      {`${userInput.gender ? userInput.gender.toUpperCase() : 'SELECT GENDER'} / ${userInput.category ? userInput.category.toUpperCase() : 'SELECT CATEGORY'}`}
                    </div>
                    <h3 className="card-title">{userInput.name || 'PRODUCT NAME'}</h3>
                    <div className="card-price">${userInput.price || '0'}</div>

                    {/* Size preview */}
                    <div className="preview-spec-section">
                      <span className="preview-spec-label">SIZE:</span>
                      <span className="preview-spec-val">
                        {userInput.sizes && userInput.sizes.length > 0 ? userInput.sizes.join(', ') : '—'}
                      </span>
                    </div>

                    {/* Colors preview */}
                    {userInput.colorsList.length > 0 && (
                      <div className="preview-spec-section">
                        <span className="preview-spec-label">COLORS:</span>
                        <div className="preview-colors-row">
                          {userInput.colorsList.map((c, idx) => (
                            <span 
                              key={`${c.name}-${idx}`} 
                              className="preview-color-dot" 
                              style={{ backgroundColor: c.hex }} 
                              title={c.name}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Description preview */}
                    {userInput.description && (
                      <div className="preview-spec-section preview-desc-block">
                        <span className="preview-spec-label">DESCRIPTION:</span>
                        <p className="preview-desc-text">{userInput.description}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="preview-placeholder-container">
                <Image size={32} strokeWidth={1.5} className="preview-placeholder-icon" />
                <span className="preview-placeholder-text">Product Preview Not Available</span>
                <span className="preview-placeholder-subtext">Enter details to generate preview</span>
              </div>
            )}
          </div>
        </div>
        )}

        {activeTab === 'inventory' && (
          <div className="admin-table-container">
          {isProductsLoading ? (
            <div className="admin-inventory-empty">
              <Loader />
            </div>
          ) : inventoryProducts.length === 0 ? (
            <div className="admin-inventory-empty">
              <span className="admin-inventory-empty-text">NO PRODUCTS FOUND</span>
              <span className="admin-inventory-empty-sub">ADD A PRODUCT TO GET STARTED</span>
            </div>
          ) : (
          <table className="admin-inventory-table">
            <thead>
              <tr>
                <th className="col-image-header">IMAGE</th>
                <th>PRODUCT</th>
                <th>SPECS &amp; CATEGORY</th>
                <th>GENDER</th>
                <th className="col-actions-header">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {inventoryProducts.map(p => (
                <tr key={p._id || p.id}>
                  <td>
                    <div className="inventory-image-thumb">
                      <img src={p.image} alt="" />
                    </div>
                  </td>
                  <td>
                    <div className="inventory-name-col">
                      <div className="inventory-product-name">{p.name}</div>
                      <div className="inventory-product-desc">{p.description}</div>
                      <div className="inventory-product-price">${p.price}</div>
                    </div>
                  </td>
                  <td>
                    <div className="inventory-specs-col">
                      <div>
                        <span className="specs-label">SIZES:</span>{' '}
                        <span className="specs-val">
                          {p.sizes && p.sizes.length > 0 ? p.sizes.join(', ') : '—'}
                        </span>
                      </div>
                      <div>
                        <span className="specs-label">COLORS:</span>{' '}
                        <div className="specs-colors-row">
                          {p.colors && p.colors.map((c, idx) => (
                            <span 
                              key={`${c.name}-${idx}`} 
                              className="specs-color-dot" 
                              style={{ backgroundColor: c.hex }} 
                              title={c.name}
                            />
                          ))}
                          {(!p.colors || p.colors.length === 0) && <span className="specs-val">—</span>}
                        </div>
                      </div>
                      <div className="specs-category-badge">{p.category?.toUpperCase()}</div>
                    </div>
                  </td>
                  <td>
                    <span className="inventory-gender-val">
                      {p.gender ? p.gender.toUpperCase() : '—'}
                    </span>
                  </td>
                  <td className="cell-align-right">
                    <div className="inventory-actions-row">
                      <Button 
                        variant="unstyled"
                        onClick={() => handleEditProduct(p._id || p.id)}
                      >
                        EDIT
                      </Button>
                      <Button 
                        variant="unstyled-destructive"
                        onClick={() => handleDeleteClick(p)}
                        disabled={isLoading}
                      >
                        DELETE
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          )}
        </div>
        )}
      </div>

      {/* DELETE CONFIRMATION DIALOG MODAL */}
      {productToDelete && (
        <Modal title="CONFIRM DELETE" onClose={() => setProductToDelete(null)}>
          <div className="delete-confirm-dialog">
            <p className="dialog-message">
              ARE YOU SURE YOU WANT TO DELETE THE PRODUCT "{productToDelete.name.toUpperCase()}"? THIS ACTION CANNOT BE UNDONE.
            </p>
            
            <div className="dialog-actions-row">
              <Button
                type="button" 
                variant="outline"
                onClick={() => setProductToDelete(null)}
                disabled={isDeleting}
              >
                CANCEL
              </Button>
              <Button
                type="button" 
                variant="destructive"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'DELETING...' : 'DELETE'}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
