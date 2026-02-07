import { Router } from "express";
import { getRecentTxn, getTxnBySearch } from "../controllers/txn.controller.js";

const txnRouter = Router()

txnRouter.get("/recent", getRecentTxn)
txnRouter.get("/:hash", getTxnBySearch)

export default txnRouter;