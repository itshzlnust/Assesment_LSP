'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function EditProductPage() {
    const router = useRouter();
    const params = useParams();
    const { id } = params;

    const [product, setProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
    });
    const [imageFile, setImageFile] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [imagePreview, setImagePreview] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (id) {
            fetchProduct(id);
        }
    }, [id]); const fetchProduct = async (productId) => {
        try {
            setIsLoading(true);
            const response = await fetch(`/api/admin/products/${productId}`);
            if (response.ok) {
                const data = await response.json();
                setProduct(data);
                setFormData({
                    name: data.name,
                    description: data.description || '',
                    price: data.price.toString(),
                    stock: data.stock.toString(),
                });
                setImageUrl(data.imageUrl || '');
                setImagePreview(data.imageUrl || '/placeholder.svg');
            } else {
                setError('Produk tidak ditemukan.');
            }
        } catch (err) {
            setError('Gagal memuat data produk.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
            setImageUrl(''); // Clear image URL if a file is selected
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsUpdating(true);
        setError(null);

        let uploadedImageUrl = product.imageUrl;

        if (imageFile) {
            const formData = new FormData();
            formData.append('file', imageFile);

            try {
                const uploadResponse = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });

                if (!uploadResponse.ok) {
                    throw new Error('Gagal mengupload gambar');
                }

                const uploadResult = await uploadResponse.json();
                uploadedImageUrl = uploadResult.url;
            } catch (err) {
                setError(err.message);
                setIsUpdating(false);
                return;
            }
        } else if (imageUrl) {
            uploadedImageUrl = imageUrl;
        }

        const productData = {
            ...formData,
            price: parseInt(formData.price, 10),
            stock: parseInt(formData.stock, 10),
            imageUrl: uploadedImageUrl,
        };

        try {
            const response = await fetch(`/api/admin/products/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData),
            });

            if (response.ok) {
                alert('Produk berhasil diperbarui!');
                router.push('/admin/products');
            } else {
                const result = await response.json();
                setError(result.message || 'Gagal memperbarui produk');
            }
        } catch (err) {
            setError('Terjadi kesalahan pada server');
            console.error(err);
        } finally {
            setIsUpdating(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p>Memuat editor produk...</p>
                </div>
            </div>
        );
    }

    if (error && !product) {
        return (
            <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
                <div className="text-center bg-gray-800 p-8 rounded-lg">
                    <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
                    <p className="text-gray-300 mb-6">{error}</p>
                    <button
                        onClick={() => router.push('/admin/products')}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Kembali ke Daftar Produk
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
            <motion.div
                className="w-full max-w-2xl bg-gray-800 p-8 rounded-xl shadow-2xl shadow-blue-500/20"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-3xl font-bold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-500">
                    Edit Produk
                </h1>
                <p className="text-center text-gray-400 mb-8">Perbarui detail untuk produk: {product?.name}</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Nama Produk</label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-300 mb-2">Harga (IDR)</label>
                            <input
                                type="number"
                                name="price"
                                id="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">Deskripsi</label>
                        <textarea
                            name="description"
                            id="description"
                            rows="4"
                            value={formData.description}
                            onChange={handleInputChange}
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        ></textarea>
                    </div>

                    <div>
                        <label htmlFor="stock" className="block text-sm font-medium text-gray-300 mb-2">Stok</label>
                        <input
                            type="number"
                            name="stock"
                            id="stock"
                            value={formData.stock}
                            onChange={handleInputChange}
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            required
                        />
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Gambar Produk</label>
                        <div className="mt-2 flex items-center space-x-6 bg-gray-700 border border-gray-600 rounded-lg p-4">
                            <div className="shrink-0">
                                <Image
                                    src={imagePreview || '/placeholder.svg'}
                                    alt="Image preview"
                                    width={80}
                                    height={80}
                                    className="h-20 w-20 rounded-md object-cover bg-gray-600"
                                    onError={(e) => { e.currentTarget.src = '/placeholder.svg'; }}
                                />
                            </div>
                            <div className="w-full">
                                <label htmlFor="file-upload" className="relative cursor-pointer bg-blue-600 rounded-md font-medium text-white hover:bg-blue-700 px-4 py-2 transition">
                                    <span>Ganti Gambar</span>
                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                                </label>
                                <p className="text-xs text-gray-400 mt-2">Atau tempel URL gambar di bawah.</p>
                            </div>
                        </div>
                        <input
                            type="text"
                            placeholder="https://example.com/image.png"
                            value={imageUrl}
                            onChange={(e) => {
                                setImageUrl(e.target.value);
                                if (e.target.value) {
                                    setImagePreview(e.target.value);
                                    setImageFile(null); // Clear file if URL is entered
                                }
                            }}
                            className="mt-4 w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end space-x-4 pt-4">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                            disabled={isUpdating}
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center disabled:opacity-50"
                            disabled={isUpdating}
                        >
                            {isUpdating ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Memperbarui...
                                </>
                            ) : (
                                'Simpan Perubahan'
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
