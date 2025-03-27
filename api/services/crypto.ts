import { ethers } from 'ethers';

export const validateCryptoAddress = (address: string, network: string) => {
  try {
    return ethers.isAddress(address);
  } catch (error) {
    console.error('Error validating crypto address:', error);
    return false;
  }
};

export const createCryptoPayment = async (
  amount: number,
  currency: string,
  walletAddress: string
) => {
  try {
    // Generate payment details
    const paymentDetails = {
      amount,
      currency,
      walletAddress,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
    };

    return paymentDetails;
  } catch (error) {
    console.error('Error creating crypto payment:', error);
    throw error;
  }
};

export const verifyCryptoPayment = async (transactionHash: string, network: string) => {
  try {
    // In production, verify the transaction on the blockchain
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const transaction = await provider.getTransaction(transactionHash);
    
    if (!transaction) {
      throw new Error('Transaction not found');
    }

    // Wait for confirmation
    const receipt = await transaction.wait();
    
    return {
      confirmed: true,
      receipt,
    };
  } catch (error) {
    console.error('Error verifying crypto payment:', error);
    throw error;
  }
};