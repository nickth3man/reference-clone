import React from 'react';
import { TableSchema, COLUMN_METADATA, ColumnKey, ColumnDef } from '../lib/tableSchema';

interface TableProps {
  schema: TableSchema;
  data: any[];
  title?: string;
  className?: string;
}

const formatValue = (value: any, type: ColumnDef['type']): React.ReactNode => {
  if (value === null || value === undefined) return '';
  if (React.isValidElement(value)) return value;
  
  switch (type) {
    case 'percent':
      if (typeof value === 'number') {
        return `${(value * 100).toFixed(1)}%`;
      }
      return `${value}%`;
    case 'float':
      if (typeof value === 'number') {
        return value.toFixed(1);
      }
      return value;
    case 'int':
      if (typeof value === 'number') {
        return Math.round(value).toString();
      }
      return value;
    case 'ratio':
      if (typeof value === 'number') {
        return value.toFixed(3);
      }
      return value;
    case 'date':
      return new Date(value).toLocaleDateString();
    default:
      return String(value);
  }
};

const Table: React.FC<TableProps> = ({ schema, data, title, className }) => {
  const { columns, columnGroups } = schema;

  // Helper to get column definition
  const getColDef = (key: ColumnKey) => COLUMN_METADATA[key];

  return (
    <div className={`overflow-x-auto ${className || ''}`}>
      {title && <h3 className="text-lg font-bold mb-2">{title}</h3>}
      <table className="min-w-full border-collapse border border-gray-300 text-sm">
        <thead>
          {columnGroups ? (
            <>
              <tr className="bg-gray-100">
                {columnGroups.map((group, idx) => (
                  <th
                    key={idx}
                    colSpan={group.columns.length}
                    className="border border-gray-300 px-2 py-1 text-center font-semibold"
                  >
                    {group.title}
                  </th>
                ))}
              </tr>
              <tr className="bg-gray-100">
                {columnGroups.flatMap(group => group.columns).map(colKey => {
                  const colDef = getColDef(colKey);
                  return (
                    <th
                      key={colKey}
                      className="border border-gray-300 px-2 py-1 text-center font-semibold whitespace-nowrap"
                      title={colDef.description}
                    >
                      {colDef.label}
                    </th>
                  );
                })}
              </tr>
            </>
          ) : (
            <tr className="bg-gray-100">
              {columns.map((colKey) => {
                const colDef = getColDef(colKey);
                return (
                  <th
                    key={colKey}
                    className="border border-gray-300 px-2 py-1 text-center font-semibold whitespace-nowrap"
                    title={colDef.description}
                  >
                    {colDef.label}
                  </th>
                );
              })}
            </tr>
          )}
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              {columns.map((colKey) => {
                const colDef = getColDef(colKey);
                const value = row[colKey]; // Assumes data keys match ColumnKey
                return (
                  <td
                    key={colKey}
                    className={`border border-gray-300 px-2 py-1 whitespace-nowrap ${
                      colDef.align === 'left' ? 'text-left' : 
                      colDef.align === 'right' ? 'text-right' : 'text-center'
                    }`}
                  >
                    {formatValue(value, colDef.type)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
