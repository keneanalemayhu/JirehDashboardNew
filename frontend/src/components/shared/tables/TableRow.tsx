/* eslint-disable @typescript-eslint/no-explicit-any */
// @/components/shared/tables/TableRow

import React from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Ban, CreditCard } from "lucide-react";
import type { InventoryItem } from "@/types/features/inventory";
import type { OperationItem } from "@/types/features/operation";
import type { TransactionItem } from "@/types/features/transaction";
import type { TableRowProps } from "@/types/shared/table";
import { useCalendar } from "@/hooks/shared/useCalendar";
import { cn } from "@/lib/utils";

export function TableRow<
  T extends InventoryItem | OperationItem | TransactionItem
>({ row, columns, onEdit, onDelete, onAction, onRowClick }: TableRowProps<T>) {
  const { toEthiopian } = useCalendar();

  // Type guard to check if the row is a TransactionItem
  const isTransactionItem = (item: any): item is TransactionItem => {
    return "orderNumber" in item && "paymentStatus" in item;
  };

  const handleRowClick = () => {
    if (isTransactionItem(row) && onRowClick) {
      onRowClick(row);
    }
  };

  // Render action buttons based on item type and status
  const renderActions = () => {
    if (isTransactionItem(row)) {
      return (
        <div className="flex gap-2">
          {/* Order action buttons */}
          {row.status !== "cancelled" && (
            <>
              {row.paymentStatus === "pending" && onAction && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onAction(row, "mark_paid")}
                  className="h-8 w-8 p-0 text-green-600 hover:text-green-700"
                  title="Mark as Paid"
                >
                  <CreditCard className="h-4 w-4" />
                </Button>
              )}
              {onAction && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onAction(row, "cancel")}
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                  title="Cancel Order"
                >
                  <Ban className="h-4 w-4" />
                </Button>
              )}
            </>
          )}
          {/* Standard edit/delete buttons for orders */}
          {onEdit && row.status === "pending" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(row)}
              className="h-8 w-8 p-0"
              title="Edit Order"
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
          {onDelete && row.status === "pending" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(row)}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
              title="Delete Order"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      );
    }

    // Default action buttons for non-order items
    return (
      <div className="flex gap-2">
        {onEdit && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(row)}
            className="h-8 w-8 p-0"
            title="Edit"
          >
            <Edit className="h-4 w-4" />
          </Button>
        )}
        {onDelete && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(row)}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    );
  };

  return (
    <tr
      className={cn(
        "transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800",
        isTransactionItem(row) && "cursor-pointer"
      )}
      onClick={handleRowClick}
    >
      {columns.map((column) => {
        const value = column.accessorKey
          ? row[column.accessorKey as keyof T]
          : "";

        return (
          <td
            key={column.id || column.accessorKey}
            className="px-4 py-3 text-sm text-neutral-900 dark:text-neutral-100"
          >
            {column.id === "actions"
              ? renderActions()
              : column.cell
              ? column.cell({ row: { original: row } })
              : column.accessorKey?.includes("At") ||
                column.accessorKey?.includes("Date")
              ? toEthiopian(new Date(value as string))
              : (value as React.ReactNode)}
          </td>
        );
      })}
    </tr>
  );
}
