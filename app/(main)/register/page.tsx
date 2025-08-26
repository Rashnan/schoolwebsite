"use client";

import React from "react";
import RegisterForm from "@/components/register-form";
import { updatePageTitle } from "@/lib/metadata";
import { useRegistration } from "@/contexts/RegistrationContext";
import { toast } from "sonner";
import { setOrderState } from "@/components/backplug";//contains code to communicate with api endpoints
import Link from "next/link";
import { 
  ArrowLeft, 
  ArrowUp, 
  CheckCircle, 
  Lock, 
  X, 
  Mail, 
  Phone, 
  Tag, 
  Shirt, 
  DollarSign, 
  Edit, 
  Trash2, 
  ShoppingCart 
} from "lucide-react";
import { Button } from "@/components/ui/button";

function RegistrationPageContent() {
  const { 
    runners, 
    addRunner, 
    removeRunner, 
    updateRunner,
    getTotalAmount,
    registrationName,
    setRegistrationName,
    prepareCheckoutData
  } = useRegistration();
  const [showForm, setShowForm] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<any>(null);
  const [expandedItems, setExpandedItems] = React.useState<Set<string>>(new Set());
  const [showRegistrationNameForm, setShowRegistrationNameForm] = React.useState(false);

  // Set page title
  React.useEffect(() => {
    updatePageTitle("Race Registration");
  }, []);

  // Auto-populate registration name with first runner's name
  React.useEffect(() => {
    if (runners.length > 0 && !registrationName) {
      setRegistrationName(runners[0].runner.fullName);
    }
  }, [runners, registrationName]);

  const handleFormSubmit = (data: any) => {
    if (editingItem) {
      // Update existing runner
      updateRunner(editingItem.id, data);
      toast.success("Runner Updated", {
        description: "Your runner has been updated successfully.",
      });
    } else {
      // Add new runner
      const newRegistration = {
        id: Date.now().toString(),
        ...data
      };
      addRunner(newRegistration);
      toast.success("Runner Added to Cart", {
        description: "Your runner has been added to your cart.",
      });
    }
    
    // Reset editing state and hide form
    setEditingItem(null);
    setShowForm(false);
  };

  const handleEditItem = (item: any) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleRemoveItem = (id: string) => {
    removeRunner(id);
    toast.success("Runner Removed", {
      description: "Runner has been removed from your cart.",
    });
  };

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

      const getCategoryDisplayName = (category: string) => {
        const categoryMap: Record<string, string> = {
            "kids-dash": "Kids Dash",
            "5k-race": "5K Race",
            "10k-race": "10K Race",
            "half-marathon": "Half Marathon",
            "full-marathon": "Full Marathon"
        };
        return categoryMap[category] || category;
    };

  const handleProceedToCheckout = () => {
    if (runners.length === 0) {
      toast.error("Cart is Empty", {
        description: "Please add at least one runner before proceeding to checkout.",
      });
      return;
    }
    
    // Prepare checkout data using context method
    const checkoutData = prepareCheckoutData();
    setOrderState(JSON.stringify(checkoutData))//Send cart data to server
    window.location.href = '/payments';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-6 md:py-12 max-w-7xl">
        <div className="text-center mb-6 md:mb-12">
          <h1 className="text-2xl sm:text-5xl font-bold text-gray-900 mb-4">Race Registration</h1>
          <p className="text-sm sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Join thousands of runners in our premier racing events. Add runners to your cart and proceed to checkout!
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-6">
          {/* Left Side - Registration Form */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden" id="registration-form">
            {!showForm ? (
              <div className="p-12 text-center">
                <div className="mb-8">
                  <button
                    onClick={() => {
                      setEditingItem(null);
                      setShowForm(true);
                    }}
                    className="group relative inline-flex items-center justify-center w-20 h-20 bg-[#1e3a8a] hover:bg-[#1e40af] text-white rounded-2xl text-4xl font-bold shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-3xl"
                  >
                    <span className="group-hover:scale-110 transition-transform duration-200">+</span>
                  </button>
                </div>
                <h2 className="text-xl sm:text-3xl font-bold text-gray-900 mb-4">Add New Runner</h2>
                <p className="text-sm sm:text-lg text-gray-600 mb-8 max-w-sm mx-auto">
                  Click the button above to add a new runner to your cart
                </p>
                <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Quick & Easy</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Lock className="w-4 h-4" />
                    <span>Secure</span>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="bg-[#1e3a8a] px-8 py-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg sm:text-2xl font-bold text-white">
                      {editingItem ? "Edit Runner" : "New Runner"}
                    </h2>
                    <button
                      onClick={() => {
                        setShowForm(false);
                        setEditingItem(null);
                      }}
                      className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white hover:text-white transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <RegisterForm 
                  onSubmit={handleFormSubmit} 
                  initialData={editingItem}
                />
              </div>
            )}
          </div>

          {/* Right Side - Cart Summary */}
          <div className="space-y-6" id="cart-summary">
            {runners.length > 0 ? (
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl sm:text-3xl font-bold text-gray-900">Your Cart</h2>
                  <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-semibold">
                    {runners.length} {runners.length === 1 ? 'Runner' : 'Runners'}
                  </div>
                </div>

                {/* Registration Name Section */}
                <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-slate-900">Registration Name</h3>
                    <Button
                      onClick={() => setShowRegistrationNameForm(!showRegistrationNameForm)}
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-full"
                    >
                      {showRegistrationNameForm ? <X className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                    </Button>
                  </div>
                  
                  {showRegistrationNameForm ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={registrationName}
                        onChange={(e) => setRegistrationName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter registration name"
                      />
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => setShowRegistrationNameForm(false)}
                          size="sm"
                        >
                          Save
                        </Button>
                        <Button
                          onClick={() => {
                            setRegistrationName(runners[0]?.runner.fullName || "");
                            setShowRegistrationNameForm(false);
                          }}
                          variant="outline"
                          size="sm"
                        >
                          Reset to First Runner
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-slate-800 font-medium">
                      {registrationName || "No registration name set"}
                    </p>
                  )}
                  <p className="text-xs text-slate-600 mt-2">
                    This name will be used for your entire registration group
                  </p>
                </div>
                
                <div className="space-y-4">
                  {runners.map((item) => (
                    <div key={item.id} className="border border-gray-200 rounded-xl p-6 bg-gray-50 hover:bg-white hover:shadow-md transition-all duration-200">
                      <div 
                        className="flex justify-between items-center cursor-pointer"
                        onClick={() => toggleExpanded(item.id)}
                      >
                        {/* meta */}
                        <div className="flex items-center md:space-x-6 space-x-2">
                          <div className="hidden md:flex w-12 h-12 bg-gradient-to-r from-[#1e3a8a] to-[#1e40af] rounded-full items-center justify-center text-white font-bold text-lg">
                            {item.runner.fullName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-semibold text-md sm:text-lg text-gray-900">
                              {item.runner.fullName}
                            </span>
                            <div className="text-xs sm:text-sm text-gray-600 mt-1 flex items-center space-x-3">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {getCategoryDisplayName(item.category)}
                              </span>
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                MVR {item.totalPrice}
                              </span>
                            </div>
                          </div>
                        </div>
                        {/* actions */}
                        <div className="flex items-center space-x-2">
                          <button className="w-8 h-8 rounded-full bg-blue-100 hover:bg-blue-200 flex items-center justify-center text-blue-600 hover:text-blue-800 transition-colors">
                            {expandedItems.has(item.id) ? '−' : '+'}
                          </button>
                        </div>
                      </div>
                      
                      {expandedItems.has(item.id) && (
                        <div className="mt-6 pt-6 border-t border-gray-200">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Mail className="w-4 h-4 text-blue-600" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">Email</p>
                                <p className="text-sm text-gray-600">{item.runner.email}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Phone className="w-4 h-4 text-blue-600" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">Phone</p>
                                <p className="text-sm text-gray-600">{item.runner.phoneNumber}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Tag className="w-4 h-4 text-blue-600" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">Category</p>
                                <p className="text-sm text-gray-600">{getCategoryDisplayName(item.category)}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Shirt className="w-4 h-4 text-blue-600" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">T-shirt</p>
                                <p className="text-sm text-gray-600">
                                  Yes ({item.runner.tshirtSize})
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3 md:col-span-2">
                              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                <DollarSign className="w-4 h-4 text-green-600" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">Subtotal</p>
                                <p className="text-sm sm:text-lg font-bold text-green-600">MVR {item.totalPrice}</p>
                              </div>
                            </div>
                          </div>
                          {/* Actions row */}
                          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 md:col-span-2">
                            <div className="w-fit ms-auto me-0 flex items-center space-x-2">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditItem(item);
                                }}
                                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveItem(item.id);
                                }}
                                className="w-8 h-8 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center text-red-600 hover:text-red-800 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="mt-6">
                  <button
                    onClick={handleProceedToCheckout}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>Proceed to Checkout - MVR {getTotalAmount()}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShoppingCart className="w-12 h-12 text-blue-400" />
                </div>
                <h2 className="text-xl sm:text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h2>
                <p className="text-sm sm:text-lg text-gray-600 mb-8 max-w-md mx-auto">
                  <span className="block md:hidden">
                    {/* mobile view */}
                    Start building your race registration by adding runners using the form above.
                  </span>
                  <span className="hidden md:block">
                    {/* desktop view */}
                    Start building your race registration by adding runners using the form on the left.
                  </span>
                </p>
                <div className="inline-flex items-center text-blue-600 font-medium">
                  <Link href="#registration-form" className="flex items-center">
                    {/* desktop view */}
                    <ArrowLeft className="w-4 h-4 mr-2 hidden md:block" />
                    
                    {/* desktop view */}
                    <span className="hidden md:block">Get started with the form on the left</span>
                    {/* mobile view */}
                    <span className="block md:hidden">Get started with the form above</span>
                    
                    {/* mobile view */}
                    <ArrowUp className="w-4 h-4 ml-2 block md:hidden" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegistrationPage() {
  return <RegistrationPageContent />;
}
