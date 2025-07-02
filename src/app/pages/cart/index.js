import { motion } from 'framer-motion';

export default function Cart({ cart, total, onCheckout, onAddToCart, onRemoveFromCart }) {
    return (
        <motion.div
            className="bg-gray-800 p-6 rounded-lg shadow-lg"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h2 className="text-2xl font-bold mb-6">Keranjang Belanja</h2>
            {cart.length === 0 ? (
                <p className="text-gray-400">Keranjang Anda kosong.</p>
            ) : (
                <>
                    <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                        {cart.map(item => (
                            <div key={item.id} className="bg-gray-700 p-4 rounded-lg">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-white">{item.name}</h3>
                                        <p className="text-sm text-gray-300">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.price)}</p>
                                        <p className="text-xs text-gray-400">
                                            Stok tersedia: {item.stock} unit
                                            {item.quantity >= item.stock && (
                                                <span className="text-yellow-400 ml-2">• Maksimal tercapai</span>
                                            )}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center">
                                    <div className="flex items-center space-x-3 bg-gray-600 rounded-lg p-1">
                                        <button
                                            onClick={() => onRemoveFromCart(item.id)}
                                            className={`w-8 h-8 flex items-center justify-center text-white rounded transition-colors duration-200 font-bold ${item.quantity === 1
                                                ? 'bg-red-600 hover:bg-red-700'
                                                : 'bg-red-500 hover:bg-red-600'
                                                }`}
                                            title={item.quantity === 1 ? "Hapus dari keranjang" : "Kurangi quantity"}
                                        >
                                            {item.quantity === 1 ? '×' : '−'}
                                        </button>
                                        <span className="font-semibold text-white min-w-[2rem] text-center">{item.quantity}</span>
                                        <button
                                            onClick={() => onAddToCart(item)}
                                            disabled={item.quantity >= item.stock}
                                            className="w-8 h-8 flex items-center justify-center bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors duration-200 font-bold"
                                            title={item.quantity >= item.stock ? "Stok maksimal tercapai" : "Tambah quantity"}
                                        >
                                            +
                                        </button>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-300">Subtotal:</p>
                                        <p className="font-bold text-white">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.price * item.quantity)}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="border-t border-gray-700 pt-4">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-lg font-semibold">Total:</span>
                            <span className="text-xl font-bold text-green-400">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(total)}</span>
                        </div>
                        <button
                            onClick={onCheckout}
                            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 font-bold text-lg transform hover:scale-105"
                        >
                            Checkout ({cart.length} item{cart.length > 1 ? 's' : ''})
                        </button>
                    </div>
                </>
            )}
        </motion.div>
    );
}
