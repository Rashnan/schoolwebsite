"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { updatePageTitle } from "@/lib/metadata";
import AdminNavbar from "@/components/admin-navbar";
import DataTable, { Column } from "@/components/data-table";
import Footer from "@/components/footer";

// Sample runner data
const runners = [
  {
    id: "01",
    invoiceId: "0001",
    fullName: "ahmed mohamed",
    email: "tesxt@gmail.com",
    phoneNumber: "9602515",
    date: "25 Jan 2025",
    tshirtSize: "M",
    raceCategory: "Half marathon - MVR 450",
  },
  // Duplicate entries to match the image
  ...Array(14)
    .fill(null)
    .map(() => ({
      id: "01",
      invoiceId: "0001",
      fullName: "ahmed mohamed",
      email: "tesxt@gmail.com",
      phoneNumber: "9602515",
      date: "25 Jan 2025",
      tshirtSize: "M",
      raceCategory: "Half marathon - MVR 450",
    })),
];

// Sample admin data
const initialAdminUsers = [
  {
    id: "01",
    userId: "0001",
    userName: "ahmed mohamed",
    email: "tesxt@gmail.com",
    date: "25 Jan 2025",
    password: "Password",
    status: "Active",
  },
  {
    id: "02",
    userId: "0002",
    userName: "rashnaan",
    email: "tesxt@gmail.com",
    date: "28 Dec 2025",
    password: "Password",
    status: "Active",
  },
  // Duplicate entries to match the image
  ...Array(13)
    .fill(null)
    .map((_, index) => ({
      id: String(index + 3).padStart(2, "0"),
      userId: String(index + 3).padStart(4, "0"),
      userName: "ahmed mohamed",
      email: "tesxt@gmail.com",
      date: "25 Jan 2025",
      password: "Password",
      status: "Active",
    })),
];

export default function AdminRunnersPage() {
  const [activeTab, setActiveTab] = useState<"admin" | "runners">("runners");
  const [adminUsers, setAdminUsers] = useState(initialAdminUsers);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    show: boolean;
    userIndex: number | null;
  }>({
    show: false,
    userIndex: null,
  });

  useEffect(() => {
    updatePageTitle("Admin Dashboard");
  }, []);

  // Define columns for runners table
  const runnersColumns: Column[] = [
    { key: "id", label: "#", sortable: true, filterable: true },
    { key: "invoiceId", label: "Invoice Id", sortable: true, filterable: true },
    { key: "fullName", label: "Full name", sortable: true, filterable: true },
    { key: "email", label: "Email", sortable: true, filterable: true },
    { key: "phoneNumber", label: "Phone number", sortable: true, filterable: true },
    { key: "date", label: "Date", sortable: true, filterable: true },
    { 
      key: "tshirtSize", 
      label: "T-shirt size", 
      sortable: true, 
      filterable: true,
      filterType: "select",
      filterOptions: ["XS", "S", "M", "L", "XL", "XXL"]
    },
    { key: "raceCategory", label: "Race category", sortable: true, filterable: true },
  ];

  // Define columns for admin users table
  const adminColumns: Column[] = [
    { key: "id", label: "#", sortable: true, filterable: true },
    { key: "userId", label: "User Id", sortable: true, filterable: true },
    { key: "userName", label: "User name", sortable: true, filterable: true },
    { key: "email", label: "Email", sortable: true, filterable: true },
    { key: "date", label: "Date", sortable: true, filterable: true },
    { key: "password", label: "Password", sortable: false, filterable: false },
    { 
      key: "status", 
      label: "Status", 
      sortable: true, 
      filterable: true,
      filterType: "select",
      filterOptions: ["Active", "Inactive"],
      render: (value) => (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          {value}
        </Badge>
      )
    },
    { 
      key: "actions", 
      label: "Action", 
      sortable: false, 
      filterable: false,
      render: (_, row) => (
        <Button
          variant="ghost"
          size="sm"
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
          onClick={() => {
            const index = adminUsers.findIndex(user => user.id === row.id);
            handleDeleteClick(index);
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )
    },
  ];

  const handleDeleteClick = (index: number) => {
    setDeleteConfirm({ show: true, userIndex: index });
  };

  const confirmDelete = () => {
    if (deleteConfirm.userIndex !== null) {
      const updatedUsers = adminUsers.filter(
        (_, index) => index !== deleteConfirm.userIndex
      );
      setAdminUsers(updatedUsers);
    }
    setDeleteConfirm({ show: false, userIndex: null });
  };

  const cancelDelete = () => {
    setDeleteConfirm({ show: false, userIndex: null });
  };

  return (
    <div className="flex-1 bg-gray-50">
      {deleteConfirm.show && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4 shadow-xl border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Delete User
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this admin user?
            </p>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={cancelDelete}>
                No
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={confirmDelete}
              >
                Yes
              </Button>
            </div>
          </div>
        </div>
      )}

      <AdminNavbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            {activeTab === "runners" ? "Marathon Runners" : "Admin Users"}
          </h1>
          <p className="text-gray-600">
            {activeTab === "runners" 
              ? "Manage and view all registered marathon participants"
              : "Manage administrative users and their permissions"
            }
          </p>
        </div>
        
        {activeTab === "runners" ? (
          <DataTable
            data={runners}
            columns={runnersColumns}
            emptyMessage="No runners found"
          />
        ) : (
          <DataTable
            data={adminUsers}
            columns={adminColumns}
            emptyMessage="No admin users found"
          />
        )}
      </main>
    </div>
  );
}
