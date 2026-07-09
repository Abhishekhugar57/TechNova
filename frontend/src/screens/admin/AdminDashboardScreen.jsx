import { lazy, Suspense } from 'react';
import { FaBox, FaShoppingBag, FaUsers, FaRupeeSign } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useGetOrdersQuery } from '../../slices/ordersApiSlice';
import { useGetProductsQuery } from '../../slices/productsApiSlice';
import { useGetUsersQuery } from '../../slices/usersApiSlice';
import StatCard from '../../components/admin/dashboard/StatCard';
import QuickActions from '../../components/admin/dashboard/QuickActions';
import RecentOrdersWidget from '../../components/admin/dashboard/RecentOrdersWidget';
import TopProductsWidget from '../../components/admin/dashboard/TopProductsWidget';
import RecentActivityWidget from '../../components/admin/dashboard/RecentActivityWidget';
import LowStockWidget from '../../components/admin/dashboard/LowStockWidget';
import {
  DashboardStatsSkeleton,
  DashboardChartSkeleton,
  DashboardWidgetsSkeleton,
} from '../../components/ui/DashboardSkeleton';
import {
  getMonthlyAnalytics,
  getPeriodStats,
  getRecentOrders,
  getTopSellingProducts,
  getRecentActivity,
  getLowStockProducts,
  getGrowthPercent,
} from '../../utils/dashboardUtils';
import { formatPrice } from '../../utils/currencyUtils';

const RevenueChart = lazy(() => import('../../components/admin/dashboard/RevenueChart'));

const AdminDashboardScreen = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { data: orders, isLoading: loadingOrders } = useGetOrdersQuery();
  const { data: products, isLoading: loadingProducts } = useGetProductsQuery({ pageNumber: 1 });
  const { data: users, isLoading: loadingUsers } = useGetUsersQuery();

  const ordersReady = !loadingOrders && orders;
  const productsReady = !loadingProducts && products;
  const usersReady = !loadingUsers && users;

  const totalRevenue = orders?.reduce((sum, o) => sum + (o.isPaid ? o.totalPrice : 0), 0) || 0;
  const paidOrders = orders?.filter((o) => o.isPaid).length || 0;
  const productCount = products?.products?.length || 0;
  const userCount = users?.length || 0;

  const { revenueGrowth, ordersGrowth } = getPeriodStats(orders || []);
  const monthlyData = getMonthlyAnalytics(orders || []);
  const recentOrders = getRecentOrders(orders || []);
  const topProducts = getTopSellingProducts(orders || []);
  const activities = getRecentActivity(orders || []);
  const lowStock = getLowStockProducts(products?.products || []);

  const usersGrowth = getGrowthPercent(userCount, Math.max(userCount - 1, 0));
  const productsGrowth = getGrowthPercent(productCount, Math.max(productCount - 2, 0));

  return (
    <div className='dashboard-grid'>
      <div className='dash-welcome'>
        <h2 className='dash-welcome__title'>
          Welcome back, {userInfo?.name?.split(' ')[0]}
        </h2>
        <p className='dash-welcome__sub'>
          Here&apos;s what&apos;s happening with your store today.
        </p>
      </div>

      {!ordersReady || !productsReady || !usersReady ? (
        <DashboardStatsSkeleton />
      ) : (
        <div className='dashboard-stats'>
          <StatCard
            variant='revenue'
            label='Total Revenue'
            value={formatPrice(totalRevenue)}
            growth={revenueGrowth}
            growthLabel='vs last 30 days'
            icon={FaRupeeSign}
          />
          <StatCard
            variant='orders'
            label='Total Orders'
            value={orders?.length || 0}
            growth={ordersGrowth}
            growthLabel={`${paidOrders} paid orders`}
            icon={FaShoppingBag}
          />
          <StatCard
            variant='products'
            label='Products'
            value={productCount}
            growth={productsGrowth}
            growthLabel={`${products?.pages || 1} catalog pages`}
            icon={FaBox}
          />
          <StatCard
            variant='users'
            label='Users'
            value={userCount}
            growth={usersGrowth}
            growthLabel='Registered accounts'
            icon={FaUsers}
          />
        </div>
      )}

      <div className='dashboard-main'>
        {!ordersReady ? (
          <DashboardChartSkeleton />
        ) : (
          <Suspense fallback={<DashboardChartSkeleton />}>
            <RevenueChart data={monthlyData} />
          </Suspense>
        )}
        <QuickActions />
      </div>

      {!ordersReady || !productsReady ? (
        <DashboardWidgetsSkeleton />
      ) : (
        <div className='dashboard-widgets'>
          <RecentOrdersWidget orders={recentOrders} />
          <TopProductsWidget products={topProducts} />
          <RecentActivityWidget activities={activities} />
          <LowStockWidget products={lowStock} />
        </div>
      )}
    </div>
  );
};

export default AdminDashboardScreen;
