import { Router } from 'express';
import { getBlockBySearch, getLastSixBlocks, getLatestBlock } from '../controllers/block.controller.js';

const blockRouter = Router();

blockRouter.get('/latest', getLatestBlock);
blockRouter.get('/recent', getLastSixBlocks);
blockRouter.get('/:id', getBlockBySearch);

export default blockRouter;
