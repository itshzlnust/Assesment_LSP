import Link from 'next/link';
import Image from 'next/image'; // Import Image component
import { motion } from 'framer-motion';

export default function ProductList({ products, addToCart }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map(product => (
                <motion.div
                    key={product.id}
                    className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-blue-500/50 transition-shadow duration-300 flex flex-col"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Link href={`/product/${product.id}`} className="block relative w-full h-48 overflow-hidden bg-gray-700">
                        <Image
                            src={product.imageUrl || '/placeholder.svg'}
                            alt={product.name}
                            width={300}
                            height={200}
                            className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                                e.currentTarget.src = '/placeholder.svg';
                            }}
                        />
                    </Link>
                    <div className="p-5 flex-grow">
                        <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
                        <p className="text-gray-400 mb-2">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(product.price)}</p>
                        <div className="flex items-center justify-between">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.stock > 10 ? 'bg-green-600 text-green-100' :
                                    product.stock > 0 ? 'bg-yellow-600 text-yellow-100' :
                                        'bg-red-600 text-red-100'
                                }`}>
                                Stok: {product.stock}
                            </span>
                        </div>
                    </div>
                    <div className="p-5 mt-auto">
                        <button
                            onClick={() => addToCart(product)}
                            disabled={product.stock === 0}
                            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-300">
                            {product.stock === 0 ? 'Stok Habis' : '+ Tambah ke Keranjang'}
                        </button>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
