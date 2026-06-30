const TableSkeleton = ({ rows = 5, cols = 5 }) => (
  <div className='admin-table-wrap'>
    <div className='admin-table-toolbar'>
      <div className='skeleton' style={{ height: 40, width: 280, borderRadius: 10 }} />
    </div>
    <div className='p-3'>
      {Array.from({ length: rows }).map((_, row) => (
        <div key={row} className='d-flex gap-3 align-items-center mb-3'>
          {Array.from({ length: cols }).map((__, col) => (
            <div
              key={col}
              className='skeleton flex-grow-1'
              style={{ height: 20, borderRadius: 6, maxWidth: col === 0 ? 180 : 100 }}
            />
          ))}
        </div>
      ))}
    </div>
  </div>
);

export default TableSkeleton;
