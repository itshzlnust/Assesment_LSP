'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';

export default function PaymentPage() {
    const router = useRouter();
    const params = useParams();
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentData, setPaymentData] = useState(null);

    useEffect(() => {
        // Extract order info from token (simulation)
        const token = params.token;
        const orderInfo = token.split('_');
        if (orderInfo.length >= 3) {
            setPaymentData({
                orderId: orderInfo[1],
                timestamp: orderInfo[2]
            });
        }
    }, [params.token]);

    const handlePayment = (status) => {
        setIsProcessing(true);

        // Simulate payment processing
        setTimeout(() => {
            if (status === 'success') {
                alert('✅ Pembayaran berhasil! Terima kasih atas pembelian Anda.');
                router.push('/user?payment=success');
            } else if (status === 'failed') {
                alert('❌ Pembayaran gagal! Silakan coba lagi.');
                router.push('/user?payment=failed');
            } else {
                alert('⏳ Pembayaran dibatalkan.');
                router.push('/user');
            }
            setIsProcessing(false);
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
            <motion.div
                className="bg-gray-800 rounded-lg p-8 max-w-md w-full shadow-2xl"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2">Simulasi Pembayaran</h1>
                    <p className="text-gray-400">Payment Gateway Demo</p>
                </div>

                {paymentData && (
                    <div className="bg-gray-700 rounded-lg p-4 mb-6">
                        <h3 className="font-semibold mb-2">Detail Pesanan</h3>
                        <p className="text-sm text-gray-300">Order ID: {paymentData.orderId}</p>
                        <p className="text-sm text-gray-300">Waktu: {new Date(parseInt(paymentData.timestamp)).toLocaleString('id-ID')}</p>
                    </div>
                )}

                <div className="space-y-4">
                    <div className="text-center mb-6">
                        <p className="text-gray-300 mb-4">Pilih simulasi hasil pembayaran:</p>
                    </div>

                    <button
                        onClick={() => handlePayment('success')}
                        disabled={isProcessing}
                        className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isProcessing ? '⏳ Memproses...' : '✅ Simulasi Pembayaran Berhasil'}
                    </button>

                    <button
                        onClick={() => handlePayment('failed')}
                        disabled={isProcessing}
                        className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isProcessing ? '⏳ Memproses...' : '❌ Simulasi Pembayaran Gagal'}
                    </button>

                    <button
                        onClick={() => handlePayment('cancel')}
                        disabled={isProcessing}
                        className="w-full bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isProcessing ? '⏳ Memproses...' : '🚫 Batalkan Pembayaran'}
                    </button>
                </div>

                <div className="mt-8 text-center text-sm text-gray-400">
                    <p>⚠️ Ini adalah simulasi payment gateway untuk demo</p>
                    <p>Tidak ada transaksi nyata yang terjadi</p>
                </div>
            </motion.div>
        </div>
    );
}
