import provider from '../provider/provider.js';
import { isHexString } from 'ethers';

export const getLatestBlock = async (req, res) => {
  try {
    const block = await provider.getBlock('latest', true);

    res.status(200).json({
      message: 'Block gotten successfully',
      data: block,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const getLastSixBlocks = async (req, res) => {
  try {
    const latestBlockNumber = await provider.getBlockNumber();

    const blockPromises = [];

    for (let i = 0; i < 6; i++) {
      blockPromises.push(provider.getBlock(latestBlockNumber - i, false));
    }

    const blocks = await Promise.all(blockPromises);

    res.status(200).json({
      message: 'Last six blocks fetched successfully',
      data: blocks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const getBlockBySearch = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullTx } = req.query;

    const includeTransactions = fullTx === 'true';

    let block;

    if (isHexString(id, 32)) {
      block = await provider.getBlock(id, includeTransactions);
    } else if (!isNaN(id)) {
      block = await provider.getBlock(Number(id), includeTransactions);
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid block identifier',
      });
    }

    if (!block) {
      return res.status(404).json({
        success: false,
        message: 'Block not found',
      });
    }

    res.status(200).json({
      message: 'Block fetched successfully',
      data: block,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
