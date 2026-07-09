import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { formatPrice } from '../../../utils/currencyUtils';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div
      style={{
        background: 'var(--admin-card)',
        border: '1px solid var(--admin-border)',
        borderRadius: 10,
        padding: '12px 16px',
        boxShadow: 'var(--admin-shadow-hover)',
        fontSize: '0.8125rem',
      }}
    >
      <p style={{ fontWeight: 700, margin: '0 0 8px', color: 'var(--admin-text)' }}>{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} style={{ margin: '4px 0', color: entry.color }}>
          {entry.name}: {entry.name === 'Revenue' ? formatPrice(entry.value) : entry.value}
        </p>
      ))}
    </div>
  );
};

const RevenueChart = ({ data }) => (
  <div className='dash-card'>
    <div className='dash-card__header'>
      <h3 className='dash-card__title'>Revenue & Orders Overview</h3>
      <span className='dash-card__link'>Last 6 months</span>
    </div>
    <div className='dash-card__body'>
      <div className='dash-chart'>
        <ResponsiveContainer width='100%' height='100%'>
          <ComposedChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
            <CartesianGrid strokeDasharray='3 3' stroke='var(--admin-chart-grid)' vertical={false} />
            <XAxis
              dataKey='month'
              tick={{ fill: 'var(--admin-text-muted)', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              yAxisId='revenue'
              tick={{ fill: 'var(--admin-text-muted)', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => formatPrice(v)}
            />
            <YAxis
              yAxisId='orders'
              orientation='right'
              tick={{ fill: 'var(--admin-text-muted)', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
              formatter={(value) => <span style={{ color: 'var(--admin-text-muted)' }}>{value}</span>}
            />
            <Bar
              yAxisId='revenue'
              dataKey='revenue'
              name='Revenue'
              fill='url(#revenueGradient)'
              radius={[6, 6, 0, 0]}
              maxBarSize={48}
            />
            <Line
              yAxisId='orders'
              type='monotone'
              dataKey='orders'
              name='Orders'
              stroke='#7c3aed'
              strokeWidth={2.5}
              dot={{ fill: '#7c3aed', r: 4 }}
              activeDot={{ r: 6 }}
            />
            <defs>
              <linearGradient id='revenueGradient' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='0%' stopColor='#2563eb' stopOpacity={0.9} />
                <stop offset='100%' stopColor='#3b82f6' stopOpacity={0.4} />
              </linearGradient>
            </defs>
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
);

export default RevenueChart;
