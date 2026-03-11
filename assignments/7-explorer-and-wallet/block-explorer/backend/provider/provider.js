import {ethers} from 'ethers'
import { RPC_URL } from '../config/env.js'

const provider = new ethers.JsonRpcProvider(RPC_URL)

export default provider