'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import ProductList from '../pages/products';
import Cart from '../pages/cart';

export default function UserPage() {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        // Load cart from localStorage
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }

        fetch('/api/products')
            .then(res => res.json())
            .then(data => setProducts(data));

        // Check if returning from successful payment
        const urlParams = new URLSearchParams(window.location.search);
        const paymentStatus = urlParams.get('payment');
        if (paymentStatus === 'success') {
            setCart([]); // Clear cart on successful payment
            localStorage.removeItem('cart'); // Clear localStorage too
            // Remove the query parameter from URL
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, []);

    useEffect(() => {
        const newTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
        setTotal(newTotal);
    }, [cart]);

    const addToCart = (product) => {
        // Check if product is out of stock
        if (product.stock === 0) {
            alert('Maaf, produk sedang habis stok!');
            return;
        }

        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product.id);
            let newCart;

            if (existingItem) {
                // Check if adding one more would exceed stock
                if (existingItem.quantity >= product.stock) {
                    alert(`Stok maksimal untuk ${product.name} adalah ${product.stock} unit!`);
                    return prevCart; // Return unchanged cart
                }

                newCart = prevCart.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            } else {
                newCart = [...prevCart, { ...product, quantity: 1 }];
            }

            // Save to localStorage
            localStorage.setItem('cart', JSON.stringify(newCart));
            return newCart;
        });
    };

    const removeFromCart = (productId) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === productId);
            let newCart;

            if (existingItem) {
                if (existingItem.quantity > 1) {
                    // Reduce quantity by 1
                    newCart = prevCart.map(item =>
                        item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
                    );
                } else {
                    // Remove item completely if quantity is 1 or less
                    newCart = prevCart.filter(item => item.id !== productId);
                }
            } else {
                // Item not found, return unchanged cart
                newCart = prevCart;
            }

            // Save to localStorage
            localStorage.setItem('cart', JSON.stringify(newCart));
            return newCart;
        });
    };

    const handleCheckout = async () => {
        try {
            if (cart.length === 0) {
                alert('Keranjang belanja kosong!');
                return;
            }

            console.log('Sending cart to checkout:', cart);

            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ cart }),
            });

            console.log('Checkout response status:', response.status);

            const data = await response.json();
            console.log('Checkout response data:', data);

            if (!response.ok) {
                console.error('Checkout failed:', data);
                throw new Error(data.error || `HTTP ${response.status}: Checkout failed`);
            }

            if (data.success && data.paymentUrl) {
                console.log('Redirecting to payment page:', data.paymentUrl);
                // Redirect to our custom payment page
                window.location.href = data.paymentUrl;
            } else {
                throw new Error('Payment URL tidak ditemukan dalam response');
            }
        } catch (error) {
            console.error('Checkout error details:', error);
            alert(`Checkout Error: ${error.message}`);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <main className="container mx-auto px-4 py-8">
                {/* Header with Admin Link */}
                <div className="flex justify-between items-center mb-8">
                    <motion.h1
                        className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-500"
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                    >
                        E-Catalog
                    </motion.h1>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                    >
                        <Link href="/admin/dashboard" className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-2 rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all duration-300 font-semibold">
                            👑 Admin Panel
                        </Link>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <ProductList products={products} addToCart={addToCart} />
                    </div>
                    <div>
                        <Cart
                            cart={cart}
                            total={total}
                            onCheckout={handleCheckout}
                            onAddToCart={addToCart}
                            onRemoveFromCart={removeFromCart}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}
