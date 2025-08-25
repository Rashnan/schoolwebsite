"use client";

import { Search, User, Trash2, Circle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

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
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [adminUsers, setAdminUsers] = useState(initialAdminUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<{
    show: boolean;
    userIndex: number | null;
  }>({
    show: false,
    userIndex: null,
  });

  const filteredRunners = runners.filter((runner) => {
    const query = searchQuery.toLowerCase();
    return (
      runner.fullName.toLowerCase().includes(query) ||
      runner.id.toLowerCase().includes(query) ||
      runner.invoiceId.toLowerCase().includes(query) ||
      runner.date.toLowerCase().includes(query)
    );
  });

  const filteredAdminUsers = adminUsers.filter((user) => {
    const query = searchQuery.toLowerCase();
    return (
      user.userName.toLowerCase().includes(query) ||
      user.id.toLowerCase().includes(query) ||
      user.userId.toLowerCase().includes(query) ||
      user.date.toLowerCase().includes(query)
    );
  });

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
    <div className="min-h-screen bg-gray-50">
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

      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="relative w-80 hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search"
              className="pl-10 bg-gray-50 border-gray-200 rounded-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="md:hidden p-2"
            onClick={() => setShowMobileSearch(!showMobileSearch)}
          >
            {showMobileSearch ? (
              <Circle className="h-5 w-5 text-gray-600 fill-current" />
            ) : (
              <Search className="h-5 w-5 text-gray-600" />
            )}
          </Button>

          <h1
            className={`font-semibold text-[#1C398E] transition-all duration-200 ${
              showMobileSearch ? "hidden" : "block text-sm md:text-xl"
            }`}
          >
            {activeTab === "admin"
              ? "MNU Marathon Admin"
              : "MNU Marathon Runners"}
          </h1>

          {showMobileSearch && (
            <div className="relative flex-1 mx-4 md:hidden">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search"
                className="pl-10 bg-gray-50 border-gray-200 rounded-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          )}

          {/* Navigation and Profile */}
          <div className="flex items-center gap-4">
            <div className="flex bg-gray-100 rounded-full p-1">
              <Button
                variant="ghost"
                className={`px-3 md:px-6 py-2 text-xs md:text-sm rounded-full transition-colors ${
                  activeTab === "admin"
                    ? "bg-[#1C398E] text-white hover:bg-[#1C398E]/90"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => setActiveTab("admin")}
              >
                Admin
              </Button>
              <Button
                className={`px-3 md:px-6 py-2 text-xs md:text-sm rounded-full transition-colors ${
                  activeTab === "runners"
                    ? "bg-[#1C398E] text-white hover:bg-[#1C398E]/90"
                    : "bg-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-200"
                }`}
                onClick={() => setActiveTab("runners")}
              >
                Runners
              </Button>
            </div>

            {/* User Avatar */}
            <Avatar className="h-8 w-8 md:h-10 md:w-10">
              <AvatarImage src="/user-profile-illustration.png" />
              <AvatarFallback>
                <User className="h-4 w-4 md:h-5 md:w-5" />
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
          {activeTab === "runners" ? (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-medium text-gray-900">#</TableHead>
                  <TableHead className="font-medium text-gray-900">
                    Invoice Id
                  </TableHead>
                  <TableHead className="font-medium text-gray-900">
                    Full name
                  </TableHead>
                  <TableHead className="font-medium text-gray-900">
                    Email
                  </TableHead>
                  <TableHead className="font-medium text-gray-900">
                    Phone number
                  </TableHead>
                  <TableHead className="font-medium text-gray-900">
                    Date
                  </TableHead>
                  <TableHead className="font-medium text-gray-900">
                    T-shirt size
                  </TableHead>
                  <TableHead className="font-medium text-gray-900">
                    Race category
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRunners.map((runner, index) => (
                  <TableRow key={index} className="hover:bg-gray-50 h-12">
                    <TableCell className="font-medium">{runner.id}</TableCell>
                    <TableCell>{runner.invoiceId}</TableCell>
                    <TableCell>{runner.fullName}</TableCell>
                    <TableCell>{runner.email}</TableCell>
                    <TableCell>{runner.phoneNumber}</TableCell>
                    <TableCell>{runner.date}</TableCell>
                    <TableCell>{runner.tshirtSize}</TableCell>
                    <TableCell>{runner.raceCategory}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-medium text-gray-900">#</TableHead>
                  <TableHead className="font-medium text-gray-900">
                    User Id
                  </TableHead>
                  <TableHead className="font-medium text-gray-900">
                    User name
                  </TableHead>
                  <TableHead className="font-medium text-gray-900">
                    Email
                  </TableHead>
                  <TableHead className="font-medium text-gray-900">
                    Date
                  </TableHead>
                  <TableHead className="font-medium text-gray-900">
                    Password
                  </TableHead>
                  <TableHead className="font-medium text-gray-900">
                    Status
                  </TableHead>
                  <TableHead className="font-medium text-gray-900">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAdminUsers.map((user, index) => (
                  <TableRow key={index} className="hover:bg-gray-50 h-12">
                    <TableCell className="font-medium">{user.id}</TableCell>
                    <TableCell>{user.userId}</TableCell>
                    <TableCell>{user.userName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.date}</TableCell>
                    <TableCell>{user.password}</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDeleteClick(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </main>
    </div>
  );
}
