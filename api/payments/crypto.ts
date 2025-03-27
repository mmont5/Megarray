import { NextApiRequest, NextApiResponse } from 'next';
import { createCryptoPayment, validateCryptoAddress, verifyCryptoPayment } from '../services/crypto';
import dbConnect from '../db/connect';
import Payment from '../models/Payment';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === 'POST') {
    try {
      const { amount, currency, walletAddress, userId } = req.body;

      // Validate wallet address
      if (!validateCryptoAddress(walletAddress, currency)) {
        return res.status(400).json({ error: 'Invalid wallet address' });
      }

      // Create crypto payment
      const paymentDetails = await createCryptoPayment(amount, currency, walletAddress);

      // Create payment record
      const payment = await Payment.create({
        userId,
        type: 'crypto',
        amount,
        currency,
        cryptoWalletAddress: walletAddress,
        status: 'pending',
      });

      return res.status(200).json({
        paymentId: payment._id,
        ...paymentDetails,
      });
    } catch (error) {
      console.error('Error processing crypto payment:', error);
      return res.status(500).json({ error: 'Crypto payment processing failed' });
    }
  } else if (req.method === 'POST' && req.url?.endsWith('/verify')) {
    try {
      const { transactionHash, network, paymentId } = req.body;

      const verification = await verifyCryptoPayment(transactionHash, network);
      
      if (verification.confirmed) {
        const payment = await Payment.findById(paymentId);
        if (!payment) {
          return res.status(404).json({ error: 'Payment not found' });
        }

        payment.status = 'completed';
        payment.cryptoTransactionHash = transactionHash;
        await payment.save();

        return res.status(200).json({ success: true });
      }

      return res.status(400).json({ error: 'Transaction not confirmed' });
    } catch (error) {
      console.error('Error verifying crypto payment:', error);
      return res.status(500).json({ error: 'Payment verification failed' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}