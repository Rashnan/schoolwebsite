"use client";

import React, { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, ArrowUp, ArrowDown, Filter, X } from "lucide-react";

export interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  filterType?: "text" | "select";
  filterOptions?: string[];
  render?: (value: any, row: any) => React.ReactNode;
}

interface DataTableProps {
  data: any[];
  columns: Column[];
  emptyMessage?: string;
}

type SortDirection = "asc" | "desc" | null;

export default function DataTable({
  data,
  columns,
  emptyMessage = "No data available",
}: DataTableProps) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [showFilters, setShowFilters] = useState(false);

  // Handle sorting
  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(
        sortDirection === "asc" ? "desc" : sortDirection === "desc" ? null : "asc"
      );
      if (sortDirection === "desc") {
        setSortKey(null);
      }
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  // Handle filtering
  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === "__all__" ? "" : value
    }));
  };

  const clearFilter = (key: string) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  };

  const clearAllFilters = () => {
    setFilters({});
  };

  // Process data: filter and sort
  const processedData = useMemo(() => {
    let result = [...data];

    // Apply column filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        result = result.filter(row => {
          const cellValue = row[key]?.toString().toLowerCase();
          return cellValue?.includes(value.toLowerCase());
        });
      }
    });

    // Apply sorting
    if (sortKey && sortDirection) {
      result.sort((a, b) => {
        const aValue = a[sortKey];
        const bValue = b[sortKey];
        
        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, filters, sortKey, sortDirection, columns]);

  const getSortIcon = (key: string) => {
    if (sortKey !== key) return <ArrowUpDown className="h-4 w-4 opacity-50" />;
    if (sortDirection === "asc") return <ArrowUp className="h-4 w-4" />;
    if (sortDirection === "desc") return <ArrowDown className="h-4 w-4" />;
    return <ArrowUpDown className="h-4 w-4 opacity-50" />;
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* Filter Controls */}
      <div className="flex items-center justify-end">
        <div className="flex items-center gap-2">
          <Button
            variant={showFilters || activeFiltersCount > 0 ? "default" : "outline"}
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge variant={showFilters || activeFiltersCount > 0 ? "secondary" : "outline"} className="ml-1 px-1 min-w-[1.25rem] h-5">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
          
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="flex items-center gap-1"
            >
              <X className="h-4 w-4" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Filter Controls */}
      {showFilters && (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <div className="mb-6">
            <h3 className="text-base font-semibold text-gray-900">
              Filter Options
            </h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {columns
              .filter(col => col.filterable)
              .map(col => (
                <div key={col.key} className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center justify-between">
                    <span>{col.label}</span>
                    {filters[col.key] && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => clearFilter(col.key)}
                        className="h-6 w-6 p-0 hover:bg-red-50 hover:text-red-600"
                        title={`Clear ${col.label} filter`}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </label>
                  {col.filterType === "select" && col.filterOptions ? (
                    <Select
                      value={filters[col.key] || "__all__"}
                      onValueChange={(value) => handleFilterChange(col.key, value)}
                    >
                      <SelectTrigger className="h-9 bg-gray-50 border-gray-200 hover:bg-white focus:bg-white">
                        <SelectValue placeholder="All" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__all__">All</SelectItem>
                        {col.filterOptions.map(option => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      placeholder={`Filter ${col.label.toLowerCase()}...`}
                      value={filters[col.key] || ""}
                      onChange={(e) => handleFilterChange(col.key, e.target.value)}
                      className="h-9 bg-gray-50 border-gray-200 hover:bg-white focus:bg-white"
                    />
                  )}
                </div>
              ))}
          </div>
          
          {/* Filter Actions */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
            <div className="text-sm text-gray-500">
              {activeFiltersCount > 0 ? (
                <span>{activeFiltersCount} filter{activeFiltersCount !== 1 ? 's' : ''} active</span>
              ) : (
                <span>No filters applied</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(false)}
              >
                Close
              </Button>
              {activeFiltersCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAllFilters}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  Clear All
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Data Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              {columns.map(col => (
                <TableHead
                  key={col.key}
                  className={`font-medium text-gray-900 ${
                    col.sortable ? "cursor-pointer hover:bg-gray-100" : ""
                  }`}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div className="flex items-center space-x-2">
                    <span>{col.label}</span>
                    {col.sortable && getSortIcon(col.key)}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {processedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-gray-500"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              processedData.map((row, index) => (
                <TableRow key={index} className="hover:bg-gray-50">
                  {columns.map(col => (
                    <TableCell key={col.key}>
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Results Summary */}
      {data.length > 0 && (
        <div className="text-sm text-gray-500 text-center">
          Showing {processedData.length} of {data.length} results
          {activeFiltersCount > 0 && " (filtered)"}
        </div>
      )}
    </div>
  );
}
