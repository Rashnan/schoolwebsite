"use client";

import type React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RegistrationForm from "@/components/registration-form";

// Helper function for email validation
const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Helper component for participant fields
function ParticipantFields({
  prefix = "",
  title = "Participant Details",
  errors = {},
  onInputChange,
  onSelectChange,
  includeTshirt,
}: {
  prefix?: string;
  title?: string;
  errors?: Record<string, string | undefined>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (value: string, name: string) => void;
  includeTshirt: boolean;
}) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={`${prefix}fullName`}>Full Name</Label>
          <Input
            id={`${prefix}fullName`}
            name={`${prefix}fullName`}
            placeholder="Ahmed mohamed"
            required
            onChange={onInputChange}
          />
          {errors[`${prefix}fullName`] && (
            <p className="text-red-500 text-sm">
              {errors[`${prefix}fullName`]}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${prefix}email`}>Email</Label>
          <Input
            id={`${prefix}email`}
            name={`${prefix}email`}
            type="email"
            placeholder="ahmed@example.com"
            required
            onChange={onInputChange}
          />
          {errors[`${prefix}email`] && (
            <p className="text-red-500 text-sm">{errors[`${prefix}email`]}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${prefix}phoneNumber`}>Phone Number</Label>
          <Input
            id={`${prefix}phoneNumber`}
            name={`${prefix}phoneNumber`}
            type="tel"
            placeholder="960-0000000"
            required
            onChange={onInputChange}
          />
          {errors[`${prefix}phoneNumber`] && (
            <p className="text-red-500 text-sm">
              {errors[`${prefix}phoneNumber`]}
            </p>
          )}
        </div>
        {includeTshirt && (
          <div className="space-y-2">
            <Label htmlFor={`${prefix}tshirtSize`}>T-shirt Size</Label>
            <Select
              name={`${prefix}tshirtSize`}
              onValueChange={(value) =>
                onSelectChange(value, `${prefix}tshirtSize`)
              }
            >
              <SelectTrigger id={`${prefix}tshirtSize`}>
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
            {errors[`${prefix}tshirtSize`] && (
              <p className="text-red-500 text-sm">
                {errors[`${prefix}tshirtSize`]}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function RegistrationPage() {
  return <RegistrationForm />;
}
