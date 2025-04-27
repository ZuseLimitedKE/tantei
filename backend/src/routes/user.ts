import { Router } from "express";
import { followAgentSchema, registerUserSchema } from "../schema/user";
import { Errors, MyError } from "../constants/errors";
import userController from "../controllers/user";
import agentModel from "../model/agents";
import agentController from "../controllers/agent";
import smartContract from "../model/smart_contract";
import pairsModel from "../model/pairs";
import tokenModel from "../model/tokens";
const router: Router = Router();

router.post("/register", async(req, res) => {
    try {
        const parsed = registerUserSchema.safeParse(req.body);
        if (parsed.success) {
            const data = parsed.data;
            await userController.register(data.address);
            res.status(201).json({message: "User registered successfully"});
        } else {
            const errors = parsed.error.issues.map((i) => i.message);
            res.status(400).json({error: errors});
        }
    } catch(err) {
        if (err instanceof MyError) {
            if (err.message === Errors.INVALID_HEDERA_ACCOUNT) {
                res.status(400).json({error: [err.message]});
            }
        }
        console.error("Error registering user", err);
        res.status(500).json({error: Errors.INTERNAL_SERVER_ERROR});
    }
})

router.post("/follow", async(req, res) => {
    try {
        const parsed = followAgentSchema.safeParse(req.body);
        if (parsed.success) {
            const data = parsed.data;
            await userController.followAgent(data, agentModel);
            res.status(201).json({message: "User followed agent successfully"});
        } else {
            const errors = parsed.error.issues.map((i) => i.message);
            res.status(400).json({error: errors});
        }
    } catch(err) { 
        if (err instanceof MyError) {
            if (err.message === Errors.AGENT_NOT_EXIST) {
                res.status(400).json({error: [err.message]});
            } else if (err.message === Errors.INVALID_HEDERA_ACCOUNT) {
                res.status(400).json({error: `User data error => ${err.message}`})
            }
        }

        console.error("Error following agent", err);
        res.status(500).json({error: Errors.NOT_FOLLOW_AGENT});
    }
});

router.get("/agents/:user_wallet", async(req , res) => {
    try {
        const user_wallet = req.params.user_wallet;
        const agents = await userController.getFollowedAgents(user_wallet, agentModel);
        res.json(agents);
    } catch(err) {
        console.error("Could not get users agents", err);
        res.status(500).json({error: Errors.INTERNAL_SERVER_ERROR});
    }
});

router.get("/portfolio/stats/:user_wallet", async(req , res) => {
    try {
        const user_wallet = req.params.user_wallet as string;
        const stats = await userController.getPortfolioStats(user_wallet, agentController, smartContract, pairsModel, tokenModel, agentModel);
        res.json(stats);
    } catch(err) {
        console.error("Error getting user portfolio stats", err);
        res.status(500).json({error: Errors.INTERNAL_SERVER_ERROR});
    }
})

export default router;