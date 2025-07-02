'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export default function AdminProductsPage() {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch('/api/admin/products');
            if (response.ok) {
                const data = await response.json();
                setProducts(data);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const deleteProduct = async (productId) => {
        if (!confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
            return;
        }

        try {
            const response = await fetch(`/api/admin/products/${productId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setProducts(products.filter(p => p.id !== productId));
                alert('Produk berhasil dihapus!');
            } else {
                alert('Gagal menghapus produk');
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Terjadi kesalahan saat menghapus produk');
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p>Memuat data produk...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <motion.h1
                        className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-500"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        Kelola Produk ({products.length})
                    </motion.h1>
                    <div className="space-x-4">
                        <Link href="/admin/dashboard" className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                            🏠 Dashboard
                        </Link>
                        <Link href="/admin" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                            ➕ Tambah Produk
                        </Link>
                        <Link href="/user" className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors">
                            Kembali ke Katalog
                        </Link>
                    </div>
                </div>

                {/* Products Grid */}
                {products.length === 0 ? (
                    <motion.div
                        className="text-center py-16"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="text-6xl mb-4">📦</div>
                        <h2 className="text-2xl font-bold mb-2">Belum ada produk</h2>
                        <p className="text-gray-400 mb-6">Mulai tambahkan produk pertama Anda</p>
                        <Link href="/admin" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                            Tambah Produk Pertama
                        </Link>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map((product, index) => (
                            <motion.div
                                key={product.id}
                                className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-blue-500/50 transition-all duration-300"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                {/* Product Image */}
                                <div className="relative h-48">
                                    <Image
                                        src={product.imageUrl || '/placeholder.svg'}
                                        alt={product.name}
                                        width={300}
                                        height={200}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.currentTarget.src = '/placeholder.svg';
                                        }}
                                    />
                                    {/* Stock Badge */}
                                    <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${product.stock > 10 ? 'bg-green-600 text-green-100' :
                                            product.stock > 0 ? 'bg-yellow-600 text-yellow-100' :
                                                'bg-red-600 text-red-100'
                                        }`}>
                                        Stok: {product.stock}
                                    </div>
                                </div>

                                {/* Product Info */}
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold mb-2 line-clamp-2">{product.name}</h3>
                                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                                        {product.description || 'Tidak ada deskripsi'}
                                    </p>
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-xl font-bold text-green-400">
                                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(product.price)}
                                        </span>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex space-x-2">
                                        <Link
                                            href={`/product/${product.id}`}
                                            className="flex-1 bg-blue-600 text-white text-center py-2 px-3 rounded hover:bg-blue-700 transition-colors text-sm"
                                        >
                                            👁️ Lihat
                                        </Link>
                                        <Link
                                            href={`/admin/edit/${product.id}`}
                                            className="bg-yellow-600 text-white py-2 px-3 rounded hover:bg-yellow-700 transition-colors text-sm"
                                        >
                                            ✏️
                                        </Link>
                                        <button
                                            onClick={() => deleteProduct(product.id)}
                                            className="bg-red-600 text-white py-2 px-3 rounded hover:bg-red-700 transition-colors text-sm"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>

                                {/* Creation Date */}
                                <div className="px-4 pb-3 text-xs text-gray-500">
                                    Dibuat: {new Date(product.createdAt).toLocaleDateString('id-ID')}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
