'use client';

export type SortField = 'createdAt' | 'favoritesCount';
export type SortOrder = 'asc' | 'desc';

interface Props {
  sortField: SortField;
  sortOrder: SortOrder;
  setSortField: (field: SortField) => void;
  setSortOrder: (order: SortOrder) => void;
}

export default function SortBar({
  sortField,
  sortOrder,
  setSortField,
  setSortOrder,
}: Props) {
  return (
    <div className="flex items-center gap-4 px-4 py-2 bg-white rounded-md justify-end">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">Sort by:</label>
        <select
          className="border border-gray-100 rounded px-2 py-1"
          value={sortField}
          onChange={(e) => setSortField(e.target.value as SortField)}
        >
          <option value="createdAt">Created At</option>
          <option value="favoritesCount">Favorite</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">Order:</label>
        <select
          className="border border-gray-100 rounded px-2 py-1"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as SortOrder)}
        >
          <option value="asc">ASC</option>
          <option value="desc">DESC</option>
        </select>
      </div>
    </div>
  );
}