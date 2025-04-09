import { useState, useEffect } from 'react';
import { getTranslations } from '../../i18n/utils';
import { getAllCateringOrders, updateCateringOrderStatus } from '../../lib/admin';

export default function CateringOrdersManager({ locale }) {
  const t = getTranslations(locale);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0
  });
  const [statusFilter, setStatusFilter] = useState('');
  const [error, setError] = useState('');
  
  // Load orders on component mount and when pagination or filter changes
  useEffect(() => {
    loadOrders();
  }, [pagination.page, statusFilter]);
  
  const loadOrders = async () => {
    setLoading(true);
    setError('');
    
    try {
      const { success, data, pagination: paginationData, error } = await getAllCateringOrders(
        pagination.page,
        pagination.pageSize,
        statusFilter || null
      );
      
      if (!success) {
        throw new Error(error);
      }
      
      setOrders(data || []);
      setPagination(paginationData);
    } catch (err) {
      setError(locale === 'ar' 
        ? 'فشل تحميل طلبات التموين. يرجى المحاولة مرة أخرى.' 
        : 'Failed to load catering orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleStatusChange = async (orderId, newStatus) => {
    setError('');
    
    try {
      const { success, error } = await updateCateringOrderStatus(orderId, newStatus);
      
      if (!success) {
        throw new Error(error);
      }
      
      // Update order status in the local state
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (err) {
      setError(locale === 'ar' 
        ? 'فشل تحديث حالة الطلب. يرجى المحاولة مرة أخرى.' 
        : 'Failed to update order status. Please try again.');
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  const getStatusLabel = (status) => {
    const statusLabels = {
      pending: locale === 'ar' ? 'قيد الانتظار' : 'Pending',
      confirmed: locale === 'ar' ? 'مؤكد' : 'Confirmed',
      preparing: locale === 'ar' ? 'قيد التحضير' : 'Preparing',
      ready: locale === 'ar' ? 'جاهز' : 'Ready',
      delivered: locale === 'ar' ? 'تم التوصيل' : 'Delivered',
      cancelled: locale === 'ar' ? 'ملغي' : 'Cancelled'
    };
    
    return statusLabels[status] || status;
  };
  
  const getStatusColor = (status) => {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      preparing: 'bg-purple-100 text-purple-800',
      ready: 'bg-green-100 text-green-800',
      delivered: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-nile-blue">
        {locale === 'ar' ? 'إدارة طلبات التموين' : 'Catering Orders Management'}
      </h2>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {/* Filters */}
      <div className="mb-6">
        <label className="block text-gray-700 mb-2">
          {locale === 'ar' ? 'تصفية حسب الحالة' : 'Filter by Status'}
        </label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nile-blue"
        >
          <option value="">{locale === 'ar' ? 'جميع الطلبات' : 'All Orders'}</option>
          <option value="pending">{locale === 'ar' ? 'قيد الانتظار' : 'Pending'}</option>
          <option value="confirmed">{locale === 'ar' ? 'مؤكد' : 'Confirmed'}</option>
          <option value="preparing">{locale === 'ar' ? 'قيد التحضير' : 'Preparing'}</option>
          <option value="ready">{locale === 'ar' ? 'جاهز' : 'Ready'}</option>
          <option value="delivered">{locale === 'ar' ? 'تم التوصيل' : 'Delivered'}</option>
          <option value="cancelled">{locale === 'ar' ? 'ملغي' : 'Cancelled'}</option>
        </select>
      </div>
      
      {/* Orders Table */}
      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-600">
            {locale === 'ar' ? 'جاري التحميل...' : 'Loading...'}
          </p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">
            {locale === 'ar' ? 'لا توجد طلبات تموين' : 'No catering orders found'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {locale === 'ar' ? 'رقم الطلب' : 'Order ID'}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {locale === 'ar' ? 'العميل' : 'Customer'}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {locale === 'ar' ? 'التاريخ' : 'Date'}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {locale === 'ar' ? 'المبلغ' : 'Amount'}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {locale === 'ar' ? 'الحالة' : 'Status'}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {locale === 'ar' ? 'الإجراءات' : 'Actions'}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{order.id.substring(0, 8)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.customer_name}
                    <div className="text-xs text-gray-400">{order.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(order.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.total_amount} SAR
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="px-2 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-nile-blue"
                      disabled={order.status === 'cancelled' || order.status === 'delivered'}
                    >
                      <option value="pending">{locale === 'ar' ? 'قيد الانتظار' : 'Pending'}</option>
                      <option value="confirmed">{locale === 'ar' ? 'مؤكد' : 'Confirmed'}</option>
                      <option value="preparing">{locale === 'ar' ? 'قيد التحضير' : 'Preparing'}</option>
                      <option value="ready">{locale === 'ar' ? 'جاهز' : 'Ready'}</option>
                      <option value="delivered">{locale === 'ar' ? 'تم التوصيل' : 'Delivered'}</option>
                      <option value="cancelled">{locale === 'ar' ? 'ملغي' : 'Cancelled'}</option>
                    </select>
                    
                    <button
                      className="ml-2 text-nile-blue hover:text-blue-700"
                      onClick={() => {
                        // View order details (would open a modal in a real implementation)
                        alert(`Order details for #${order.id}`);
                      }}
                    >
                      {locale === 'ar' ? 'عرض' : 'View'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Pagination */}
      {!loading && orders.length > 0 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-700">
            {locale === 'ar' 
              ? `عرض ${(pagination.page - 1) * pagination.pageSize + 1} إلى ${Math.min(pagination.page * pagination.pageSize, pagination.total)} من إجمالي ${pagination.total} طلب` 
              : `Showing ${(pagination.page - 1) * pagination.pageSize + 1} to ${Math.min(pagination.page * pagination.pageSize, pagination.total)} of ${pagination.total} orders`}
          </div>
          
          <div className="flex space-x-2 rtl:space-x-reverse">
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
              disabled={pagination.page === 1}
              className={`px-3 py-1 rounded-md ${
                pagination.page === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-nile-blue text-white hover:bg-blue-700'
              }`}
            >
              {locale === 'ar' ? 'السابق' : 'Previous'}
            </button>
            
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
              disabled={pagination.page === pagination.totalPages}
              className={`px-3 py-1 rounded-md ${
                pagination.page === pagination.totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-nile-blue text-white hover:bg-blue-700'
              }`}
            >
              {locale === 'ar' ? 'التالي' : 'Next'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
