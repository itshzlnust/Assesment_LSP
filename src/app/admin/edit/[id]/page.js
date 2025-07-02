'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export default function EditProductPage({ params }) {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        imageUrl: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (params.id) {
            fetchProduct();
        }
    }, [params.id]);

    const fetchProduct = async () => {
        try {
            const response = await fetch(`/api/admin/products/${params.id}`);
            if (response.ok) {
                const product = await response.json();
                setFormData({
                    name: product.name,
                    description: product.description || '',
                    price: product.price.toString(),
                    stock: product.stock.toString(),
                    imageUrl: product.imageUrl || ''
                });
                setImagePreview(product.imageUrl || '');
            } else {
                setMessage('❌ Produk tidak ditemukan');
            }
        } catch (error) {
            setMessage('❌ Gagal memuat data produk');
        } finally {
            setIsFetching(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');

        try {
            // Validasi form
            if (!formData.name || !formData.price || !formData.stock) {
                throw new Error('Nama produk, harga, dan stok wajib diisi');
            }

            if (formData.name.trim().length < 3) {
                throw new Error('Nama produk minimal 3 karakter');
            }

            if (parseFloat(formData.price) <= 0) {
                throw new Error('Harga harus lebih dari 0');
            }

            if (parseInt(formData.stock) < 0) {
                throw new Error('Stok tidak boleh negatif');
            }

            let imageUrl = formData.imageUrl;

            // Upload gambar jika ada file yang dipilih
            if (imageFile) {
                const uploadFormData = new FormData();
                uploadFormData.append('image', imageFile);

                const uploadResponse = await fetch('/api/upload', {
                    method: 'POST',
                    body: uploadFormData,
                });

                if (!uploadResponse.ok) {
                    throw new Error('Gagal mengupload gambar');
                }

                const uploadResult = await uploadResponse.json();
                imageUrl = uploadResult.imageUrl;
            }

            // Update data produk
            const productData = {
                name: formData.name,
                description: formData.description,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock),
                imageUrl: imageUrl
            };

            const response = await fetch(`/api/admin/products/${params.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Gagal mengupdate produk');
            }

            const result = await response.json();
            setMessage('✅ Produk berhasil diupdate!');

            // Redirect ke halaman admin products setelah 2 detik
            setTimeout(() => {
                router.push('/admin/products');
            }, 2000);

        } catch (error) {
            setMessage(`❌ Error: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
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
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-500">
                            Edit Produk
                        </h1>
                        <div className="space-x-4">
                            <Link href="/admin/products" className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors">
                                Kembali ke Kelola Produk
                            </Link>
                            <Link href="/admin" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                                Tambah Produk Baru
                            </Link>
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                            <h2 className="text-2xl font-bold mb-6">Edit Informasi Produk</h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Nama Produk */}
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Nama Produk <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                                        placeholder="Masukkan nama produk"
                                        required
                                    />
                                </div>

                                {/* Deskripsi */}
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Deskripsi Produk
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows={4}
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                                        placeholder="Masukkan deskripsi produk"
                                    />
                                </div>

                                {/* Harga dan Stok */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Harga (IDR) <span className="text-red-400">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleInputChange}
                                            min="0"
                                            step="1000"
                                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                                            placeholder="0"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Stok <span className="text-red-400">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            name="stock"
                                            value={formData.stock}
                                            onChange={handleInputChange}
                                            min="0"
                                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                                            placeholder="0"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Upload Gambar */}
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Gambar Produk
                                    </label>
                                    <div className="space-y-4">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                                        />
                                        <p className="text-sm text-gray-400">
                                            Atau masukkan URL gambar:
                                        </p>
                                        <input
                                            type="url"
                                            name="imageUrl"
                                            value={formData.imageUrl}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                                            placeholder="https://example.com/image.jpg"
                                        />
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg font-bold text-lg hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all duration-300"
                                >
                                    {isLoading ? '⏳ Mengupdate Produk...' : '✏️ Update Produk'}
                                </button>

                                {/* Message */}
                                {message && (
                                    <div className={`p-4 rounded-lg ${message.includes('✅') ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'
                                        }`}>
                                        {message}
                                    </div>
                                )}
                            </form>
                        </div>
                    </motion.div>

                    {/* Preview */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                            <h2 className="text-2xl font-bold mb-6">Preview Produk</h2>

                            <div className="bg-gray-700 rounded-lg overflow-hidden">
                                {/* Preview Image */}
                                <div className="relative h-48 bg-gray-600">
                                    {imagePreview || formData.imageUrl ? (
                                        <Image
                                            src={imagePreview || formData.imageUrl}
                                            alt="Preview"
                                            width={400}
                                            height={200}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.currentTarget.src = '/placeholder.svg';
                                            }}
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-gray-400">
                                            <div className="text-center">
                                                <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <p>Preview Gambar</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Preview Info */}
                                <div className="p-4">
                                    <h3 className="text-xl font-semibold mb-2">
                                        {formData.name || 'Nama Produk'}
                                    </h3>
                                    <p className="text-gray-300 mb-4 text-sm">
                                        {formData.description || 'Deskripsi produk akan muncul di sini...'}
                                    </p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-2xl font-bold text-green-400">
                                            {formData.price ?
                                                new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(formData.price)
                                                : 'Rp 0'
                                            }
                                        </span>
                                        <span className="text-sm text-gray-400">
                                            Stok: {formData.stock || '0'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
