import { Router } from "express";
import swapsController from "../controllers/swaps";
import agentController from "../controllers/agent";
import smartContract from "../model/smart_contract";
const router: Router = Router();

router.get("/agent/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const trades = await swapsController.getAgentTrades({id}, agentController, smartContract);
        res.json(trades); 
    } catch(err) {
        res.status(500).json({error: err});
    }
})

export default router;