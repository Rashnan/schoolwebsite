"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";

const BASE_PRICE = 50;
const ADDON_PRICE = 25;

const categories = [
  {
    id: "standard",
    name: "Standard",
    price: 0,
    description: "Access to main event sessions.",
  },
  {
    id: "premium",
    name: "Premium",
    price: 50,
    description: "Standard access plus premium seating and networking.",
  },
  {
    id: "vip",
    name: "VIP",
    price: 150,
    description:
      "All premium benefits plus exclusive lounge access and speaker meet-and-greet.",
  },
];

export default function RegistrationPortal() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(categories[0].id);
  const [includeAddon, setIncludeAddon] = useState(false);
  const [totalPrice, setTotalPrice] = useState(BASE_PRICE);

  useEffect(() => {
    const categoryPrice =
      categories.find((cat) => cat.id === selectedCategory)?.price || 0;
    const addonCost = includeAddon ? ADDON_PRICE : 0;
    setTotalPrice(BASE_PRICE + categoryPrice + addonCost);
  }, [selectedCategory, includeAddon]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the registration data to a backend
    console.log({
      name,
      email,
      password,
      selectedCategory,
      includeAddon,
      totalPrice,
    });
    alert(`Registration successful for ${name}! Total price: $${totalPrice}`);
  };

  return (
    <Card className="w-full max-w-md bg-white text-darkGrey shadow-lg rounded-lg">
      <CardHeader className="bg-deepBlue text-white rounded-t-lg p-6">
        <CardTitle className="text-3xl font-bold">Event Registration</CardTitle>
        <CardDescription className="text-white/80">
          Register for the event and select your preferred options.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-darkGrey">
              Name
            </Label>
            <Input
              id="name"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="border-darkGrey/30 focus:border-deepBlue"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-darkGrey">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="john.doe@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border-darkGrey/30 focus:border-deepBlue"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-darkGrey">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border-darkGrey/30 focus:border-deepBlue"
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-darkGrey">
              Select Category
            </h3>
            <RadioGroup
              defaultValue={selectedCategory}
              onValueChange={setSelectedCategory}
              className="grid gap-4 md:grid-cols-3"
            >
              {categories.map((category) => (
                <div key={category.id}>
                  <RadioGroupItem
                    value={category.id}
                    id={category.id}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={category.id}
                    className="flex flex-col items-start justify-between rounded-md border-2 border-darkGrey/20 bg-white p-4 hover:bg-deepBlue/5 peer-data-[state=checked]:border-deepBlue peer-data-[state=checked]:bg-deepBlue/10 cursor-pointer transition-colors"
                  >
                    <span className="font-medium text-darkGrey">
                      {category.name}
                    </span>
                    <span className="text-sm text-darkGrey/70">
                      ${category.price} extra
                    </span>
                    <span className="text-xs text-darkGrey/60 mt-1">
                      {category.description}
                    </span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="flex items-center justify-between space-x-2 pt-4">
            <Label
              htmlFor="addon-switch"
              className="flex flex-col text-darkGrey"
            >
              <span className="font-medium">Workshop Access</span>
              <span className="text-sm text-darkGrey/70">
                Includes exclusive workshop sessions (+${ADDON_PRICE})
              </span>
            </Label>
            <Switch
              id="addon-switch"
              checked={includeAddon}
              onCheckedChange={setIncludeAddon}
              className="data-[state=checked]:bg-deepBlue"
            />
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 p-6 border-t border-darkGrey/10">
        <div className="flex justify-between w-full text-lg font-bold text-darkGrey">
          <span>Total Price:</span>
          <span>${totalPrice}</span>
        </div>
        <Button
          type="submit"
          onClick={handleSubmit}
          className="w-full bg-accentGold text-darkGrey hover:bg-accentGold/90 font-semibold py-2 rounded-md transition-colors"
        >
          Register Now
        </Button>
      </CardFooter>
    </Card>
  );
}
