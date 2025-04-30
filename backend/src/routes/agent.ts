import { Router } from "express";
import { validateBody, validateParams } from "../middleware/validate";
import {
  AgentSchema,
  AgentUpdateSchema,
  AgentIdParamSchema,
} from "../schema/agents";
import agentController from "../controllers/agent";
import smartContract from "../model/smart_contract";
import { Errors } from "../constants/errors";
import { hederaAddress } from "../schema/user";
import swapsController from "../controllers/swaps";
import agentModel from "../model/agents";

const router: Router = Router();

// Get all agents
router.get("/", async (req, res) => {
  try {
    const agents = await agentController.getAllAgents();
    res.json(agents);
  } catch (error) {
    console.error("Error fetching agents:", error);
    res.status(500).json({ error: "Failed to fetch agents" });
  }
});

// Get agent by ID
router.get("/:id", validateParams(AgentIdParamSchema), async (req, res) => {
  try {
    const agent = await agentController.getAgentById(req.params.id);
    if (!agent) {
      res.status(404).json({ error: "Agent not found" });
      return;
    }
    res.json(agent);
  } catch (error) {
    console.error("Error fetching agent:", error);
    res.status(500).json({ error: "Failed to fetch agent" });
  }
});

// Get agents by user wallet address
router.get("/user/:address", async (req, res) => {
  try {
    const agents = await agentController.getUserAgents(req.params.address);
    res.json(agents);
  } catch (error) {
    console.error("Error fetching user agents:", error);
    res.status(500).json({ error: "Failed to fetch user agents" });
  }
});

// Create a new agent
router.post("/", validateBody(AgentSchema), async (req, res) => {
  try {
    await agentController.publish(req.body, smartContract);
    res.status(201).json({ message: "Agent published successfully" });
  } catch (error) {
    console.error("Error publishing agent:", error);
    res.status(500).json({ error: "Failed to publish agent" });
  }
});

// Update an agent
router.put(
  "/:id",
  validateParams(AgentIdParamSchema),
  validateBody(AgentUpdateSchema),
  async (req, res) => {
    try {
      const success = await agentController.updateAgent(
        req.params.id,
        req.body,
      );
      if (!success) {
        res.status(404).json({ error: "Nothing to update or agent not found" });
        return;
      }
      res.json({ message: "Agent updated successfully" });
    } catch (error) {
      console.error("Error updating agent:", error);
      res.status(500).json({ error: "Failed to update agent" });
    }
  },
);

// Delete an agent
router.delete("/:id", validateParams(AgentIdParamSchema), async (req, res) => {
  try {
    const success = await agentController.deleteAgent(req.params.id);
    if (!success) {
      res.status(404).json({ error: "Agent not found" });
      return;
    }
    res.json({ message: "Agent deleted successfully" });
  } catch (error) {
    console.error("Error deleting agent:", error);
    res.status(500).json({ error: "Failed to delete agent" });
  }
});

router.get("/trades/:agent_id", async(req, res) => {
  try {
    const agent_id = req.params.agent_id;
    const agent = await agentController.getAgentById(agent_id);
    if (agent) {
      const trades = await swapsController.getAgentTrades({id: agent_id}, agentController, smartContract);
      res.json(trades);
    } else {  
      res.status(400).json({error: [Errors.AGENT_NOT_EXIST]});
    }
  } catch(err) {
    console.error("Error getting agent trades", err);
    res.status(500).json({error: Errors.INTERNAL_SERVER_ERROR});
  }
})

export default router;
