'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [cart, setCart] = useState([]);

    useEffect(() => {
        // Load cart from localStorage
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }

        // Fetch product detail
        async function fetchProduct() {
            try {
                const res = await fetch(`/api/products/${params.id}`);
                if (!res.ok) {
                    throw new Error('Product not found');
                }
                const data = await res.json();
                setProduct(data);
            } catch (error) {
                console.error('Error fetching product:', error);
                router.push('/user'); // Redirect back if product not found
            } finally {
                setIsLoading(false);
            }
        }

        if (params.id) {
            fetchProduct();
        }
    }, [params.id, router]);

    const addToCart = () => {
        if (!product) return;

        // Check if product is out of stock
        if (product.stock === 0) {
            alert('Maaf, produk sedang habis stok!');
            return;
        }

        const updatedCart = [...cart];
        const existingItem = updatedCart.find(item => item.id === product.id);

        // Calculate total quantity in cart + new quantity
        const currentCartQuantity = existingItem ? existingItem.quantity : 0;
        const totalQuantity = currentCartQuantity + quantity;

        // Check if total quantity exceeds stock
        if (totalQuantity > product.stock) {
            const availableToAdd = product.stock - currentCartQuantity;
            if (availableToAdd <= 0) {
                alert(`Anda sudah menambahkan maksimal stok yang tersedia (${product.stock} unit) ke keranjang!`);
                return;
            } else {
                alert(`Hanya tersisa ${availableToAdd} unit yang bisa ditambahkan ke keranjang!`);
                return;
            }
        }

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            updatedCart.push({ ...product, quantity });
        }

        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));

        // Show success message with remaining stock info
        const remainingStock = product.stock - totalQuantity;
        alert(`${product.name} berhasil ditambahkan ke keranjang! (Sisa stok: ${remainingStock} unit)`);
    };

    const handleQuantityChange = (change) => {
        if (!product) return;

        const newQuantity = quantity + change;
        const existingItem = cart.find(item => item.id === product.id);
        const currentCartQuantity = existingItem ? existingItem.quantity : 0;
        const maxAllowedQuantity = product.stock - currentCartQuantity;

        if (newQuantity >= 1 && newQuantity <= maxAllowedQuantity) {
            setQuantity(newQuantity);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p>Memuat detail produk...</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Produk Tidak Ditemukan</h1>
                    <Link href="/user" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        Kembali ke Katalog
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <div className="container mx-auto px-4 py-8">
                {/* Back Button */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mb-6"
                >
                    <Link href="/user" className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Kembali ke Katalog
                    </Link>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Product Image */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="relative"
                    >
                        <div className="relative h-96 lg:h-[500px] bg-gray-800 rounded-2xl overflow-hidden shadow-2xl">
                            <Image
                                src={product.imageUrl || '/placeholder.svg'}
                                alt={product.name}
                                width={600}
                                height={500}
                                className="w-full h-full object-contain"
                                priority
                                onError={(e) => {
                                    e.currentTarget.src = '/placeholder.svg';
                                }}
                            />
                        </div>
                    </motion.div>

                    {/* Product Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="flex flex-col justify-center"
                    >
                        <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-500">
                            {product.name}
                        </h1>

                        <div className="mb-6">
                            <span className="text-3xl font-bold text-green-400">
                                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(product.price)}
                            </span>
                        </div>

                        {product.description && (
                            <div className="mb-8">
                                <h3 className="text-xl font-semibold mb-3">Deskripsi Produk</h3>
                                <p className="text-gray-300 leading-relaxed">{product.description}</p>
                            </div>
                        )}

                        <div className="mb-8">
                            <h3 className="text-xl font-semibold mb-3">Stok Tersedia</h3>
                            <div className="flex items-center">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${product.stock > 10 ? 'bg-green-600 text-green-100' :
                                    product.stock > 0 ? 'bg-yellow-600 text-yellow-100' :
                                        'bg-red-600 text-red-100'
                                    }`}>
                                    {product.stock > 0 ? `${product.stock} unit tersedia` : 'Stok habis'}
                                </span>
                            </div>
                        </div>

                        {/* Quantity Selector */}
                        <div className="mb-8">
                            <h3 className="text-xl font-semibold mb-3">Jumlah</h3>
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center bg-gray-800 rounded-lg">
                                    <button
                                        onClick={() => handleQuantityChange(-1)}
                                        disabled={quantity <= 1}
                                        className="px-4 py-2 text-white hover:bg-gray-700 rounded-l-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        -
                                    </button>
                                    <span className="px-6 py-2 bg-gray-700 text-white font-semibold">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={() => handleQuantityChange(1)}
                                        disabled={(() => {
                                            const existingItem = cart.find(item => item.id === product.id);
                                            const currentCartQuantity = existingItem ? existingItem.quantity : 0;
                                            const maxAllowedQuantity = product.stock - currentCartQuantity;
                                            return quantity >= maxAllowedQuantity;
                                        })()}
                                        className="px-4 py-2 text-white hover:bg-gray-700 rounded-r-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        +
                                    </button>
                                </div>
                                <div className="text-gray-400 text-sm">
                                    <div>Max: {(() => {
                                        const existingItem = cart.find(item => item.id === product.id);
                                        const currentCartQuantity = existingItem ? existingItem.quantity : 0;
                                        const maxAllowedQuantity = product.stock - currentCartQuantity;
                                        return maxAllowedQuantity;
                                    })()} unit</div>
                                    {(() => {
                                        const existingItem = cart.find(item => item.id === product.id);
                                        const currentCartQuantity = existingItem ? existingItem.quantity : 0;
                                        return currentCartQuantity > 0 ? (
                                            <div className="text-yellow-400">
                                                Di keranjang: {currentCartQuantity} unit
                                            </div>
                                        ) : null;
                                    })()}
                                </div>
                            </div>
                        </div>

                        {/* Add to Cart Button */}
                        <div className="space-y-4">
                            <button
                                onClick={addToCart}
                                disabled={(() => {
                                    if (product.stock === 0) return true;
                                    const existingItem = cart.find(item => item.id === product.id);
                                    const currentCartQuantity = existingItem ? existingItem.quantity : 0;
                                    const maxAllowedQuantity = product.stock - currentCartQuantity;
                                    return maxAllowedQuantity <= 0;
                                })()}
                                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 rounded-lg font-bold text-lg hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
                            >
                                {(() => {
                                    if (product.stock === 0) return 'Stok Habis';
                                    const existingItem = cart.find(item => item.id === product.id);
                                    const currentCartQuantity = existingItem ? existingItem.quantity : 0;
                                    const maxAllowedQuantity = product.stock - currentCartQuantity;

                                    if (maxAllowedQuantity <= 0) {
                                        return 'Maksimal Stok Tercapai';
                                    }

                                    return `Tambahkan ke Keranjang - ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(product.price * quantity)}`;
                                })()}
                            </button>

                            <Link href="/user" className="block w-full text-center bg-gray-700 text-white py-3 rounded-lg hover:bg-gray-600 transition-colors">
                                Lanjut Belanja
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
