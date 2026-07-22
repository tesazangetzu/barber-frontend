import React, { useState } from "react";
import { Trash2, Edit2, Plus } from "lucide-react";

export default function DataTable({
  title,
  columns,
  data,
  onAdd,
  onEdit,
  onDelete,
  loading = false,
}) {
  const hasActions = onEdit || onDelete;
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return data;

    const sorted = [...data].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return -1;
      if (a[sortConfig.key] > b[sortConfig.key]) return 1;
      return 0;
    });

    return sortConfig.direction === "asc" ? sorted : sorted.reverse();
  }, [data, sortConfig]);

  return (
    <div className="bg-[#131b2d] border border-[#1e1e1e] rounded-lg shadow-md">
      <div className="p-3 md:p-6 border-b border-[#1e1e1e] flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-0">
        <h2 className="text-xl md:text-2xl font-bold text-white">{title}</h2>
        {onAdd && (
          <button
            onClick={onAdd}
            className="flex items-center gap-2 bg-[#d4af37] hover:bg-[#d4af37]/90 text-[#0a0f1a] px-3 md:px-4 py-2 rounded-lg transition-colors duration-200 text-sm md:text-base w-full md:w-auto justify-center md:justify-start font-bold"
          >
            <Plus size={18} />
            Nuevo
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-[#0a0f1a] border-b border-[#1e1e1e]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && handleSort(col.key)}
                  className={`px-6 py-3 text-left text-gray-300 font-semibold ${
                    col.sortable ? "cursor-pointer hover:bg-[#1e1e1e]" : ""
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {col.label}
                    {col.sortable && sortConfig.key === col.key && (
                      <span className="text-xs">
                        {sortConfig.direction === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              {hasActions && (
                <th className="px-6 py-3 text-left text-gray-300 font-semibold">
                  Acciones
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length + (hasActions ? 1 : 0)}
                  className="px-6 py-4 text-center text-gray-500"
                >
                  Cargando...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (hasActions ? 1 : 0)}
                  className="px-6 py-4 text-center text-gray-500"
                >
                  No hay datos
                </td>
              </tr>
            ) : (
              sortedData.map((row) => (
                <tr
                  key={row.id ?? row[columns[0]?.key]}
                  className="border-b border-[#1e1e1e] hover:bg-[#1e1e1e]/50 transition-colors duration-150"
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-6 py-4 text-gray-300">
                      {col.render
                        ? col.render(row[col.key], row)
                        : row[col.key]}
                    </td>
                  ))}
                  {hasActions && (
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {onEdit && (
                          <button
                            onClick={() => onEdit(row)}
                            className="p-2 text-[#d4af37] hover:bg-[#d4af37]/10 rounded-lg transition-colors duration-200"
                            title="Editar"
                          >
                            <Edit2 size={18} />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(row.id)}
                            className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors duration-200"
                            title="Eliminar"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
