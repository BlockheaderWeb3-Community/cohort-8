import provider from '../provider/provider.js';

export const getRecentTxn = async (req, res) => {
  try {
    const latestBlockNumber = await provider.getBlockNumber();

    const txns = [];
    let currentBlockNumber = latestBlockNumber;

    while (txns.length < 6 && currentBlockNumber >= 0) {
      const block = await provider.getBlock(currentBlockNumber, true);

      if (block && block.transactions.length) {
        for (let i = block.transactions.length - 1; i >= 0; i--) {
          txns.push(block.transactions[i]);

          if (txns.length === 6) break;
        }
      }

      currentBlockNumber--;
    }

    res.status(200).json({
      message: 'Last six txns fetched successfully',
      data: txns,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const getTxnBySearch = async (req, res) => {
  try {
    const { hash } = req.params;

    if (!hash || !hash.startsWith('0x') || hash.length !== 66) {
      return res.status(400).json({
        success: false,
        message: 'Invalid transaction hash',
      });
    }

    const tx = await provider.getTransaction(hash);

    if (!tx) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    const receipt = await provider.getTransactionReceipt(hash);

    const block = tx.blockNumber ? await provider.getBlock(tx.blockNumber) : null;

    let effectiveFee = null;
    if (receipt && receipt.gasUsed != null && receipt.effectiveGasPrice != null) {
      effectiveFee = (BigInt(receipt.gasUsed) * BigInt(receipt.effectiveGasPrice)).toString();
    }

    const enrichedTx = {
      hash: tx.hash,
      from: tx.from,
      to: tx.to,
      value: tx.value.toString(),
      gasLimit: tx.gasLimit.toString(),
      gasUsed: receipt ? receipt.gasUsed.toString() : null,
      maxFeePerGas: tx.maxFeePerGas ? tx.maxFeePerGas.toString() : null,
      maxPriorityFeePerGas: tx.maxPriorityFeePerGas
        ? tx.maxPriorityFeePerGas.toString()
        : null,
      gasPrice: tx.gasPrice ? tx.gasPrice.toString() : null,
      blockNumber: tx.blockNumber,
      transactionIndex: tx.transactionIndex,
      feeRecipient: block ? block.miner : null,
      effectiveFeePaid: effectiveFee,
      status: receipt ? receipt.status : null,
    };

    res.status(200).json({
      message: 'Transaction fetched successfully',
      data: enrichedTx,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
