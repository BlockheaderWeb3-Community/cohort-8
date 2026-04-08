import { config } from 'dotenv';

config({ path: '.env' });

export const { RPC_URL, PORT } = process.env;
