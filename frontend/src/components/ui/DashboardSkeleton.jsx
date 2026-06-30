const DashboardStatSkeleton = () => (
  <div className='dash-stat'>
    <div className='d-flex justify-content-between mb-3'>
      <div className='skeleton' style={{ width: 52, height: 52, borderRadius: 14 }} />
      <div className='skeleton' style={{ width: 56, height: 24, borderRadius: 999 }} />
    </div>
    <div className='skeleton mb-2' style={{ height: 14, width: '50%' }} />
    <div className='skeleton mb-2' style={{ height: 32, width: '70%' }} />
    <div className='skeleton' style={{ height: 12, width: '40%' }} />
  </div>
);

const DashboardWidgetSkeleton = () => (
  <div className='dash-card'>
    <div className='dash-card__header'>
      <div className='skeleton' style={{ height: 18, width: 140 }} />
    </div>
    <div className='dash-card__body dash-card__body--flush'>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className='dash-list-item'>
          <div className='skeleton' style={{ width: 40, height: 40, borderRadius: 10 }} />
          <div className='flex-grow-1'>
            <div className='skeleton mb-1' style={{ height: 14, width: '60%' }} />
            <div className='skeleton' style={{ height: 12, width: '40%' }} />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const DashboardStatsSkeleton = () => (
  <div className='dashboard-stats'>
    {Array.from({ length: 4 }).map((_, i) => (
      <DashboardStatSkeleton key={i} />
    ))}
  </div>
);

export const DashboardChartSkeleton = () => (
  <div className='dash-card'>
    <div className='dash-card__header'>
      <div className='skeleton' style={{ height: 18, width: 200 }} />
    </div>
    <div className='dash-card__body'>
      <div className='skeleton' style={{ height: 300, borderRadius: 12 }} />
    </div>
  </div>
);

export const DashboardWidgetsSkeleton = () => (
  <div className='dashboard-widgets'>
    {Array.from({ length: 4 }).map((_, i) => (
      <DashboardWidgetSkeleton key={i} />
    ))}
  </div>
);
