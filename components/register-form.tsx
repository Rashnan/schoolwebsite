"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { toast } from "sonner";
import { User } from "lucide-react";

// Helper function for email validation
const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

interface RegistrationData {
    category: string;
    runner: {
        fullName: string;
        email: string;
        phoneNumber: string;
        tshirtSize: string;
    };
    totalPrice: number;
}

interface RegistrationFormProps {
  onSubmit?: (data: RegistrationData) => void;
  initialData?: any;
}

export default function RegistrationPageContent({
  onSubmit,
  initialData,
}: RegistrationFormProps) {
  const [formErrors, setFormErrors] = useState<
    Record<string, string | undefined>
  >({});
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [formState, setFormState] = useState({
    category: "",
    runner: {
      fullName: "",
      email: "",
      phoneNumber: "",
      tshirtSize: "",
    },
  });

  // Race category prices (T-shirt included)
  const racePrices: Record<string, { regular: number; earlyBird: number }> = {
    "kids-dash": { regular: 200, earlyBird: 150 },
    "5k-race": { regular: 350, earlyBird: 280 },
    "10k-race": { regular: 400, earlyBird: 320 },
    "half-marathon": { regular: 500, earlyBird: 400 },
    "full-marathon": { regular: 600, earlyBird: 480 },
  };

  // Early bird deadline (example: 30 days before event)
  const earlyBirdDeadline = new Date("2024-12-31"); // Set your actual deadline
  const isEarlyBird = new Date() <= earlyBirdDeadline;

  // Populate form with initial data for editing
  useEffect(() => {
    if (initialData) {
      console.log("Initial data for editing:", initialData); // Debug log
      setFormState({
        category: initialData.category || "",
        runner: {
          fullName: initialData.runner?.fullName || "",
          email: initialData.runner?.email || "",
          phoneNumber: initialData.runner?.phoneNumber || "",
          tshirtSize:
            initialData.runner?.tshirtSize === "N/A"
              ? ""
              : initialData.runner?.tshirtSize || "",
        },
      });
      setSelectedCategory(initialData.category || "");
      console.log("Form state after setting initial data:", {
        category: initialData.category || "",
        runner: {
          fullName: initialData.runner?.fullName || "",
          email: initialData.runner?.email || "",
          phoneNumber: initialData.runner?.phoneNumber || "",
          tshirtSize:
            initialData.runner?.tshirtSize === "N/A"
              ? ""
              : initialData.runner?.tshirtSize || "",
        },
      }); // Debug log
    } else {
      // Reset form when no initial data
      setFormState({
        category: "",
        runner: {
          fullName: "",
          email: "",
          phoneNumber: "",
          tshirtSize: "",
        },
      });
      setSelectedCategory("");
    }
  }, [initialData]);

  // Calculate total price
  const calculateTotalPrice = (): number => {
    if (!selectedCategory) return 0;
    const categoryPrices = racePrices[selectedCategory];
    if (!categoryPrices) return 0;

    const basePrice = isEarlyBird
      ? categoryPrices.earlyBird
      : categoryPrices.regular;
    return basePrice;
  };

  const validateField = (
    name: string,
    value: string | undefined
  ): string | undefined => {
    switch (name) {
      case "fullName":
        return !value || value.trim() === ""
          ? "Full name is required."
          : undefined;
      case "email":
        return !value || !isValidEmail(value)
          ? "Invalid email address."
          : undefined;
      case "phoneNumber":
        return !value || value.length < 7 || value.length > 10
          ? "Phone number must be 7-10 digits."
          : undefined;
      case "tshirtSize":
        // T-shirt size is always required now
        if (!value || value === "") {
          return "Please select a T-shirt size.";
        }
        return undefined;
      case "category":
        return !value || value === ""
          ? "Please select a race category."
          : undefined;
      default:
        return undefined;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormState((prev) => ({
      ...prev,
      runner: {
        ...prev.runner,
        [name]: value,
      },
    }));

    setFormErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  const handleSelectChange = (value: string, name: string) => {
    if (name === "category") {
      setSelectedCategory(value);
      setFormState((prev) => ({ ...prev, category: value }));
    } else if (name === "tshirtSize") {
      setFormState((prev) => ({
        ...prev,
        runner: {
          ...prev.runner,
          tshirtSize: value,
        },
      }));
    }
    setFormErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  const handleClearForm = () => {
    setFormState({
      category: "",
      runner: {
        fullName: "",
        email: "",
        phoneNumber: "",
        tshirtSize: "",
      },
    });
    setFormErrors({});
    setSelectedCategory("");
    toast("Form Cleared", {
      description: "The form has been reset.",
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const currentErrors: Record<string, string | undefined> = {};
    let isValid = true;

    // Validate runner fields
    const fields = ["fullName", "email", "phoneNumber", "tshirtSize"];
    fields.forEach((field) => {
              const error = validateField(
          field,
          formState.runner[field as keyof typeof formState.runner]
        );
      if (error) {
        currentErrors[field] = error;
        isValid = false;
      }
    });

    // Validate category
    const categoryError = validateField(
      "category",
      selectedCategory
    );
    if (categoryError) {
      currentErrors.category = categoryError;
      isValid = false;
    }

    setFormErrors(currentErrors);

    if (isValid) {
      // Create registration data object
      const registrationData: RegistrationData = {
        category: selectedCategory,
        runner: {
          fullName: formState.runner.fullName,
          email: formState.runner.email,
          phoneNumber: formState.runner.phoneNumber,
          tshirtSize: formState.runner.tshirtSize,
        },
        totalPrice: calculateTotalPrice(),
      };

      // Call onSubmit function if provided
      if (onSubmit) {
        onSubmit(registrationData);
      } else {
        // Default behavior: store in localStorage and redirect
        localStorage.setItem(
          "registrationData",
          JSON.stringify(registrationData)
        );
      }
    } else {
      toast.error("Validation Failed", {
        description: "Please correct the errors in the form.",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl sm:text-3xl font-bold text-center">
          {initialData ? "Edit Runner" : "Runner Registration"}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        <form
          id="registration-form"
          onSubmit={handleSubmit}
          className="space-y-4 sm:space-y-6"
        >
          {/* Category Selection */}
          <Card className="mb-4 sm:mb-6">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">
                Race Category
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 px-4 sm:px-6">
              <Label htmlFor="category" className="text-sm sm:text-base">
                Select Race Category
              </Label>
              <Select
                name="category"
                required
                value={formState.category}
                onValueChange={(value) => handleSelectChange(value, "category")}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Choose category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kids-dash">
                    Kids Dash (Ages 12 & under) - MVR{" "}
                    {isEarlyBird
                      ? racePrices["kids-dash"].earlyBird
                      : racePrices["kids-dash"].regular}
                    {isEarlyBird ? " (Early Bird!)" : ""}
                  </SelectItem>
                  <SelectItem value="5k-race">
                    5K Race - MVR{" "}
                    {isEarlyBird
                      ? racePrices["5k-race"].earlyBird
                      : racePrices["5k-race"].regular}
                    {isEarlyBird ? " (Early Bird!)" : ""}
                  </SelectItem>
                  <SelectItem value="10k-race">
                    10K Race - MVR{" "}
                    {isEarlyBird
                      ? racePrices["10k-race"].earlyBird
                      : racePrices["10k-race"].regular}
                    {isEarlyBird ? " (Early Bird!)" : ""}
                  </SelectItem>
                  <SelectItem value="half-marathon">
                    Half Marathon - MVR{" "}
                    {isEarlyBird
                      ? racePrices["half-marathon"].earlyBird
                      : racePrices["half-marathon"].regular}
                    {isEarlyBird ? " (Early Bird!)" : ""}
                  </SelectItem>
                  <SelectItem value="full-marathon">
                    Full Marathon - MVR{" "}
                    {isEarlyBird
                      ? racePrices["full-marathon"].earlyBird
                      : racePrices["full-marathon"].regular}
                    {isEarlyBird ? " (Early Bird!)" : ""}
                  </SelectItem>
                </SelectContent>
              </Select>
              {formErrors.category && (
                <p className="text-red-500 text-xs sm:text-sm">
                  {formErrors.category}
                </p>
              )}
              <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-green-800 font-medium">
                  ✓ T-shirt included with all registrations
                </p>
                <p className="text-xs text-green-700 mt-1">
                  All race entries include a commemorative t-shirt at no
                  additional cost.
                </p>
              </div>

              {/* Race Category Details Button */}
              <div className="flex justify-end mt-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      type="button"
                      className="text-xs sm:text-sm"
                    >
                      View Race Category Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent
                    className="max-w-[95vw] sm:max-w-[700px] max-h-[90vh]"
                    showCloseButton={true}
                    style={{
                      padding: "0px",
                    }}
                  >
                    <div className="max-h-[90vh] overflow-y-auto p-6">
                      <DialogHeader className="px-0 pb-4">
                        <DialogTitle className="text-lg sm:text-xl">
                          Race Category Details
                        </DialogTitle>
                        <DialogDescription className="text-xs sm:text-sm">
                          Complete information about each race category
                          including prizes and details.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4 px-0">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="text-xs sm:text-sm font-semibold min-w-[80px]">
                                Race
                              </TableHead>
                              <TableHead className="text-xs sm:text-sm font-semibold min-w-[60px]">
                                Distance
                              </TableHead>
                              <TableHead className="text-xs sm:text-sm font-semibold min-w-[70px]">
                                Regular Fee
                              </TableHead>
                              <TableHead className="text-xs sm:text-sm font-semibold min-w-[70px]">
                                Early Bird
                              </TableHead>
                              <TableHead className="text-xs sm:text-sm font-semibold min-w-[100px]">
                                Prize Money
                              </TableHead>
                              <TableHead className="text-xs sm:text-sm font-semibold min-w-[70px]">
                                Start Time
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell className="text-xs sm:text-sm font-medium">
                                Kids Dash
                              </TableCell>
                              <TableCell className="text-xs sm:text-sm">
                                1 km
                              </TableCell>
                              <TableCell className="text-xs sm:text-sm">
                                MVR {racePrices["kids-dash"].regular}
                              </TableCell>
                              <TableCell className="text-xs sm:text-sm text-green-600 font-medium">
                                MVR {racePrices["kids-dash"].earlyBird}
                              </TableCell>
                              <TableCell className="text-xs sm:text-sm">
                                <span className="block sm:inline">Medals</span>
                                <span className="block sm:inline text-[10px] sm:text-xs text-gray-600">
                                  {" "}
                                  for all finishers
                                </span>
                              </TableCell>
                              <TableCell className="text-xs sm:text-sm">
                                08:30 AM
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="text-xs sm:text-sm font-medium">
                                5K Race
                              </TableCell>
                              <TableCell className="text-xs sm:text-sm">
                                5 km
                              </TableCell>
                              <TableCell className="text-xs sm:text-sm">
                                MVR {racePrices["5k-race"].regular}
                              </TableCell>
                              <TableCell className="text-xs sm:text-sm text-green-600 font-medium">
                                MVR {racePrices["5k-race"].earlyBird}
                              </TableCell>
                              <TableCell className="text-xs sm:text-sm">
                                <span className="block sm:inline">
                                  MVR 3,000
                                </span>
                                <span className="block sm:inline text-[10px] sm:text-xs text-gray-600">
                                  {" "}
                                  for top 3
                                </span>
                              </TableCell>
                              <TableCell className="text-xs sm:text-sm">
                                09:00 AM
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="text-xs sm:text-sm font-medium">
                                10K Race
                              </TableCell>
                              <TableCell className="text-xs sm:text-sm">
                                10 km
                              </TableCell>
                              <TableCell className="text-xs sm:text-sm">
                                MVR {racePrices["10k-race"].regular}
                              </TableCell>
                              <TableCell className="text-xs sm:text-sm text-green-600 font-medium">
                                MVR {racePrices["10k-race"].earlyBird}
                              </TableCell>
                              <TableCell className="text-xs sm:text-sm">
                                <span className="block sm:inline">
                                  MVR 5,000
                                </span>
                                <span className="block sm:inline text-[10px] sm:text-xs text-gray-600">
                                  {" "}
                                  for top 3
                                </span>
                              </TableCell>
                              <TableCell className="text-xs sm:text-sm">
                                09:45 AM
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="text-xs sm:text-sm font-medium">
                                Half Marathon
                              </TableCell>
                              <TableCell className="text-xs sm:text-sm">
                                21.1 km
                              </TableCell>
                              <TableCell className="text-xs sm:text-sm">
                                MVR {racePrices["half-marathon"].regular}
                              </TableCell>
                              <TableCell className="text-xs sm:text-sm text-green-600 font-medium">
                                MVR {racePrices["half-marathon"].earlyBird}
                              </TableCell>
                              <TableCell className="text-xs sm:text-sm">
                                <span className="block sm:inline">
                                  MVR 7,500
                                </span>
                                <span className="block sm:inline text-[10px] sm:text-xs text-gray-600">
                                  {" "}
                                  for top 3
                                </span>
                              </TableCell>
                              <TableCell className="text-xs sm:text-sm">
                                10:30 AM
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="text-xs sm:text-sm font-medium">
                                Full Marathon
                              </TableCell>
                              <TableCell className="text-xs sm:text-sm">
                                42.2 km
                              </TableCell>
                              <TableCell className="text-xs sm:text-sm">
                                MVR {racePrices["full-marathon"].regular}
                              </TableCell>
                              <TableCell className="text-xs sm:text-sm text-green-600 font-medium">
                                MVR {racePrices["full-marathon"].earlyBird}
                              </TableCell>
                              <TableCell className="text-xs sm:text-sm">
                                <span className="block sm:inline">
                                  MVR 10,000
                                </span>
                                <span className="block sm:inline text-[10px] sm:text-xs text-gray-600">
                                  {" "}
                                  for top 3
                                </span>
                              </TableCell>
                              <TableCell className="text-xs sm:text-sm">
                                11:00 AM
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                        <div className="mt-4 space-y-3">
                          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                            <p className="text-xs sm:text-sm text-green-800">
                              <strong>Early Bird Pricing:</strong> Register
                              before {earlyBirdDeadline.toLocaleDateString()} to
                              get discounted rates! Early bird prices are shown
                              in green.
                            </p>
                          </div>
                          <div className="p-3 bg-blue-50 rounded-lg">
                            <p className="text-xs sm:text-sm text-blue-800">
                              <strong>Note:</strong> All races include
                              commemorative t-shirt for participants, finisher
                              medals, water stations on course, and medical
                              support available.
                            </p>
                            <p className="text-xs sm:text-sm text-blue-800 mt-2">
                              <strong>Kids Dash:</strong> Open to children ages
                              12 & under. Parental consent required. All
                              finishers receive medals and t-shirts.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>

          {/* Runner Details */}
          <Card className="mb-4 sm:mb-6">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl flex items-center">
                <User className="w-4 h-4 mr-2" />
                Runner Details
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-sm sm:text-base">
                    Full Name
                  </Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    placeholder="Ahmed mohamed"
                    required
                    value={formState.runner.fullName}
                    onChange={handleInputChange}
                  />
                  {formErrors.fullName && (
                    <p className="text-red-500 text-xs sm:text-sm">
                      {formErrors.fullName}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm sm:text-base">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="ahmed@example.com"
                    required
                    value={formState.runner.email}
                    onChange={handleInputChange}
                  />
                  {formErrors.email && (
                    <p className="text-red-500 text-xs sm:text-sm">
                      {formErrors.email}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber" className="text-sm sm:text-base">
                    Phone Number
                  </Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    placeholder="960-0000000"
                    required
                    value={formState.runner.phoneNumber}
                    onChange={handleInputChange}
                  />
                  {formErrors.phoneNumber && (
                    <p className="text-red-500 text-xs sm:text-sm">
                      {formErrors.phoneNumber}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tshirtSize" className="text-sm sm:text-base">
                    T-shirt Size
                  </Label>
                  <Select
                    name="tshirtSize"
                    value={formState.runner.tshirtSize}
                    onValueChange={(value) =>
                      handleSelectChange(value, "tshirtSize")
                    }
                  >
                    <SelectTrigger id="tshirtSize">
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="XS">XS</SelectItem>
                      <SelectItem value="S">S</SelectItem>
                      <SelectItem value="M">M</SelectItem>
                      <SelectItem value="L">L</SelectItem>
                      <SelectItem value="XL">XL</SelectItem>
                      <SelectItem value="XXL">XXL</SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors.tshirtSize && (
                    <p className="text-red-500 text-xs sm:text-sm">
                      {formErrors.tshirtSize}
                    </p>
                  )}
                </div>
              </div>

              {/* T-shirt Size Chart Button */}
              <div className="flex justify-end mt-4 pb-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      type="button"
                      className="text-xs sm:text-sm"
                    >
                      View T-shirt Size Chart
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-lg sm:text-xl">
                        T-shirt Size Chart
                      </DialogTitle>
                      <DialogDescription className="text-xs sm:text-sm">
                        Refer to this chart to find your perfect T-shirt size.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-sm font-medium text-left">Size</TableHead>
                          <TableHead className="text-sm font-medium text-center">Chest (cm)</TableHead>
                          <TableHead className="text-sm font-medium text-center">Length (cm)</TableHead>
                          <TableHead className="text-sm font-medium text-center">Shoulder (cm)</TableHead>
                          <TableHead className="text-sm font-medium text-center">Sleeve (cm)</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium text-left">XS</TableCell>
                          <TableCell className="text-center">86</TableCell>
                          <TableCell className="text-center">64</TableCell>
                          <TableCell className="text-center">38</TableCell>
                          <TableCell className="text-center">18</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium text-left">S</TableCell>
                          <TableCell className="text-center">91</TableCell>
                          <TableCell className="text-center">66</TableCell>
                          <TableCell className="text-center">41</TableCell>
                          <TableCell className="text-center">19</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium text-left">M</TableCell>
                          <TableCell className="text-center">97-102</TableCell>
                          <TableCell className="text-center">69</TableCell>
                          <TableCell className="text-center">43</TableCell>
                          <TableCell className="text-center">20</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium text-left">L</TableCell>
                          <TableCell className="text-center">107-112</TableCell>
                          <TableCell className="text-center">71</TableCell>
                          <TableCell className="text-center">46</TableCell>
                          <TableCell className="text-center">21.5</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium text-left">XL</TableCell>
                          <TableCell className="text-center">117-122</TableCell>
                          <TableCell className="text-center">74</TableCell>
                          <TableCell className="text-center">48</TableCell>
                          <TableCell className="text-center">23</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium text-left">2XL</TableCell>
                          <TableCell className="text-center">127-132</TableCell>
                          <TableCell className="text-center">76</TableCell>
                          <TableCell className="text-center">51</TableCell>
                          <TableCell className="text-center">24</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium text-left">3XL</TableCell>
                          <TableCell className="text-center">137-142</TableCell>
                          <TableCell className="text-center">79</TableCell>
                          <TableCell className="text-center">53</TableCell>
                          <TableCell className="text-center">25.5</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>

                    <div className="py-4">
                      <Image
                        src="/images/tshirt-size.png"
                        alt="T-shirt Size Chart"
                        width={500}
                        height={500}
                        className="mx-auto w-fit h-auto object-contain"
                      />
                    </div>

                    <p className="text-xs text-gray-600 mt-3">
                      <strong>Note:</strong> Measurements are approximate. For the best fit, measure your chest circumference and compare with the chart above.
                    </p>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>

          {/* Price Summary */}
          {selectedCategory && (
            <Card className="mb-4 sm:mb-6 bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-base sm:text-lg text-blue-800">
                  Price Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 sm:px-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-gray-700">
                      Registration Fee (includes T-shirt):
                    </span>
                    <span className="text-xs sm:text-sm font-medium">
                      MVR{" "}
                      {selectedCategory
                        ? isEarlyBird
                          ? racePrices[selectedCategory].earlyBird
                          : racePrices[selectedCategory].regular
                        : 0}
                    </span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between items-center text-base sm:text-lg font-bold text-blue-800">
                      <span>Total:</span>
                      <span>MVR {calculateTotalPrice()}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    ✓ Commemorative T-shirt included
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleClearForm}
              className="text-xs sm:text-sm"
            >
              Clear Form
            </Button>
            <Button type="submit" className="text-xs sm:text-sm">
              {initialData ? "Update Runner" : "Add Runner to Cart"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
