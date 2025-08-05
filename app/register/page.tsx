"use client";

import React from "react";
import RegisterForm from "@/components/register-form";
import Footer from "@/components/footer";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { setOrderState } from "@/components/backplug";//contains code to communicate with api endpoints

function RegistrationPageContent() {
  const { 
    cartItems, 
    addToCart, 
    removeFromCart, 
    updateCartItem,
    getCartTotal 
  } = useCart();
  const [showForm, setShowForm] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<any>(null);
  const [expandedItems, setExpandedItems] = React.useState<Set<string>>(new Set());

  const handleFormSubmit = (data: any) => {
    if (editingItem) {
      // Update existing cart item
      updateCartItem(editingItem.id, data);
      toast.success("Registration Updated", {
        description: "Your registration has been updated successfully.",
      });
    } else {
      // Add new cart item
      const newRegistration = {
        id: Date.now().toString(),
        ...data
      };
      addToCart(newRegistration);
      toast.success("Registration Added to Cart", {
        description: "Your registration has been added to your cart.",
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
    removeFromCart(id);
    toast.success("Registration Removed", {
      description: "Registration has been removed from your cart.",
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
      "5k-race": "5K Race",
      "10k-race": "10K Race",
      "half-marathon": "Half Marathon",
      "full-marathon": "Full Marathon"
    };
    return categoryMap[category] || category;
  };

  const handleProceedToCheckout = () => {
    if (cartItems.length === 0) {
      toast.error("Cart is Empty", {
        description: "Please add at least one registration before proceeding to checkout.",
      });
      return;
    }
    
    // Store cart items in localStorage for payments page
    localStorage.setItem('checkoutParticipants', JSON.stringify(cartItems));
    setOrderState(JSON.stringify(cartItems))//Send cart data to server
    window.location.href = '/payments';
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-12 max-w-7xl">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">Race Registration</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of runners in our premier racing events. Add registrations to your cart and proceed to checkout!
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Side - Cart Summary */}
            <div className="space-y-6">
              {cartItems.length > 0 ? (
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl font-bold text-gray-900">Your Cart</h2>
                    <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-semibold">
                      {cartItems.length} {cartItems.length === 1 ? 'Registration' : 'Registrations'}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.id} className="border border-gray-200 rounded-xl p-6 bg-gray-50 hover:bg-white hover:shadow-md transition-all duration-200">
                        <div 
                          className="flex justify-between items-center cursor-pointer"
                          onClick={() => toggleExpanded(item.id)}
                        >
                          <div className="flex items-center space-x-6">
                            <div className="w-12 h-12 bg-gradient-to-r from-[#1e3a8a] to-[#1e40af] rounded-full flex items-center justify-center text-white font-bold text-lg">
                              {item.participant.fullName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <span className="font-semibold text-lg text-gray-900">{item.participant.fullName}</span>
                              <div className="text-sm text-gray-600 mt-1 flex items-center space-x-3">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  {getCategoryDisplayName(item.category)}
                                </span>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  MVR {item.totalPrice}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditItem(item);
                              }}
                              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveItem(item.id);
                              }}
                              className="w-8 h-8 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center text-red-600 hover:text-red-800 transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
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
                                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                  </svg>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-900">Email</p>
                                  <p className="text-sm text-gray-600">{item.participant.email}</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                  </svg>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-900">Phone</p>
                                  <p className="text-sm text-gray-600">{item.participant.phoneNumber}</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                  </svg>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-900">Category</p>
                                  <p className="text-sm text-gray-600">{getCategoryDisplayName(item.category)}</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM7 3H5a2 2 0 00-2 2v12a4 4 0 004 4h2M9 3h10a2 2 0 012 2v12a4 4 0 01-4 4H9" />
                                  </svg>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-900">T-shirt</p>
                                  <p className="text-sm text-gray-600">
                                    {item.includeTshirt ? `Yes (${item.participant.tshirtSize})` : 'No'}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-3 md:col-span-2">
                                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                  </svg>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-900">Subtotal</p>
                                  <p className="text-lg font-bold text-green-600">MVR {item.totalPrice}</p>
                                </div>
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
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                      </svg>
                      <span>Proceed to Checkout - MVR {getCartTotal()}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                  <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h2>
                  <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
                    Start building your race registration by adding participants using the form on the right.
                  </p>
                  <div className="inline-flex items-center text-blue-600 font-medium">
                    <span>Get started with the form on the right</span>
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>
              )}
            </div>

            {/* Right Side - Registration Form */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
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
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Add New Registration</h2>
                  <p className="text-lg text-gray-600 mb-8 max-w-sm mx-auto">
                    Click the button above to add a new participant registration to your cart
                  </p>
                  <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Quick & Easy</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <span>Secure</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="bg-[#1e3a8a] px-8 py-6">
                    <div className="flex justify-between items-center">
                      <h2 className="text-2xl font-bold text-white">
                        {editingItem ? "Edit Registration" : "New Registration"}
                      </h2>
                      <button
                        onClick={() => {
                          setShowForm(false);
                          setEditingItem(null);
                        }}
                        className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white hover:text-white transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="p-8">
                    <RegisterForm 
                      onSubmit={handleFormSubmit} 
                      initialData={editingItem}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default function RegistrationPage() {
  return <RegistrationPageContent />;
}
