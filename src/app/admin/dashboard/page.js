'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0,
        lowStockProducts: 0
    });
    const [recentProducts, setRecentProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            // Fetch products
            const productsResponse = await fetch('/api/admin/products');
            const products = await productsResponse.json();

            setRecentProducts(products.slice(0, 4)); // Show 4 recent products

            // Calculate stats
            const lowStock = products.filter(p => p.stock < 5).length;

            setStats({
                totalProducts: products.length,
                totalOrders: 0, // TODO: Implement order counting
                totalRevenue: 0, // TODO: Implement revenue calculation
                lowStockProducts: lowStock
            });
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p>Memuat dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-500">
                            🏠 Admin Dashboard
                        </h1>
                        <Link href="/user" className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors">
                            Kembali ke Katalog
                        </Link>
                    </div>
                </motion.div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 rounded-lg shadow-lg"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-200 text-sm font-medium">Total Produk</p>
                                <p className="text-3xl font-bold text-white">{stats.totalProducts}</p>
                            </div>
                            <div className="text-blue-200">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-gradient-to-r from-green-600 to-green-700 p-6 rounded-lg shadow-lg"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-200 text-sm font-medium">Total Pesanan</p>
                                <p className="text-3xl font-bold text-white">{stats.totalOrders}</p>
                            </div>
                            <div className="text-green-200">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="bg-gradient-to-r from-purple-600 to-purple-700 p-6 rounded-lg shadow-lg"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-200 text-sm font-medium">Total Pendapatan</p>
                                <p className="text-3xl font-bold text-white">
                                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(stats.totalRevenue)}
                                </p>
                            </div>
                            <div className="text-purple-200">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="bg-gradient-to-r from-red-600 to-red-700 p-6 rounded-lg shadow-lg"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-red-200 text-sm font-medium">Stok Rendah</p>
                                <p className="text-3xl font-bold text-white">{stats.lowStockProducts}</p>
                            </div>
                            <div className="text-red-200">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="bg-gray-800 p-6 rounded-lg shadow-lg"
                    >
                        <h2 className="text-2xl font-bold mb-6">🚀 Aksi Cepat</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Link href="/admin" className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition-colors text-center">
                                <div className="text-2xl mb-2">➕</div>
                                <div className="font-semibold">Tambah Produk</div>
                            </Link>
                            <Link href="/admin/products" className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 transition-colors text-center">
                                <div className="text-2xl mb-2">📦</div>
                                <div className="font-semibold">Kelola Produk</div>
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        className="bg-gray-800 p-6 rounded-lg shadow-lg"
                    >
                        <h2 className="text-2xl font-bold mb-6">📊 Produk Terbaru</h2>
                        <div className="space-y-3">
                            {recentProducts.length > 0 ? (
                                recentProducts.map((product) => (
                                    <div key={product.id} className="flex items-center space-x-3 p-2 bg-gray-700 rounded-lg">
                                        <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                                            <Image
                                                src={product.imageUrl || '/placeholder.svg'}
                                                alt={product.name}
                                                width={48}
                                                height={48}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.currentTarget.src = '/placeholder.svg';
                                                }}
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-sm">{product.name}</p>
                                            <p className="text-xs text-gray-400">
                                                Stok: {product.stock} | {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(product.price)}
                                            </p>
                                        </div>
                                        <Link
                                            href={`/admin/edit/${product.id}`}
                                            className="text-blue-400 hover:text-blue-300 text-sm"
                                        >
                                            Edit
                                        </Link>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-400 text-center py-4">Belum ada produk</p>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* Navigation Links */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                    className="bg-gray-800 p-6 rounded-lg shadow-lg"
                >
                    <h2 className="text-2xl font-bold mb-6">🔗 Navigasi</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Link href="/admin" className="text-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
                            <div className="text-2xl mb-2">📝</div>
                            <div className="text-sm font-medium">Form Produk</div>
                        </Link>
                        <Link href="/admin/products" className="text-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
                            <div className="text-2xl mb-2">📋</div>
                            <div className="text-sm font-medium">Kelola Produk</div>
                        </Link>
                        <Link href="/user" className="text-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
                            <div className="text-2xl mb-2">🛍️</div>
                            <div className="text-sm font-medium">Katalog User</div>
                        </Link>
                        <div className="text-center p-4 bg-gray-700 rounded-lg opacity-50 cursor-not-allowed">
                            <div className="text-2xl mb-2">📈</div>
                            <div className="text-sm font-medium">Laporan</div>
                            <div className="text-xs text-gray-400 mt-1">Coming Soon</div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
