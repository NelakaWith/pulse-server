import express from "express";
import githubService from "../services/githubService.js";

const router = express.Router();

/**
 * GET /api/github/status
 * Check GitHub service status
 */
router.get("/status", (req, res) => {
  res.json({
    message: "GitHub API integration",
    configured: githubService.isConfigured(),
    version: "1.0.0",
  });
});

/**
 * GET /api/github/repository/:owner/:name
 * Get repository information using GitHub GraphQL API
 */
router.get("/repository/:owner/:name", async (req, res) => {
  try {
    const { owner, name } = req.params;

    if (!githubService.isConfigured()) {
      return res.status(503).json({
        success: false,
        error: "GitHub token not configured",
      });
    }

    const result = await githubService.getRepository(owner, name);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

/**
 * GET /api/github/repository/:owner/:name/issues
 * Get repository issues using GitHub GraphQL API
 */
router.get("/repository/:owner/:name/issues", async (req, res) => {
  try {
    const { owner, name } = req.params;
    const { first = 10, states = "OPEN" } = req.query;

    if (!githubService.isConfigured()) {
      return res.status(503).json({
        success: false,
        error: "GitHub token not configured",
      });
    }

    const statesArray = Array.isArray(states) ? states : [states];
    const result = await githubService.getRepositoryIssues(
      owner,
      name,
      parseInt(first),
      statesArray
    );

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

/**
 * GET /api/github/repository/:owner/:name/pulls
 * Get repository pull requests using GitHub GraphQL API
 */
router.get("/repository/:owner/:name/pulls", async (req, res) => {
  try {
    const { owner, name } = req.params;
    const { first = 10, states = "OPEN" } = req.query;

    if (!githubService.isConfigured()) {
      return res.status(503).json({
        success: false,
        error: "GitHub token not configured",
      });
    }

    const statesArray = Array.isArray(states) ? states : [states];
    const result = await githubService.getRepositoryPullRequests(
      owner,
      name,
      parseInt(first),
      statesArray
    );

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

/**
 * GET /api/github/user/:login/repositories
 * Get user repositories using GitHub GraphQL API
 */
router.get("/user/:login/repositories", async (req, res) => {
  try {
    const { login } = req.params;
    const { first = 10 } = req.query;

    if (!githubService.isConfigured()) {
      return res.status(503).json({
        success: false,
        error: "GitHub token not configured",
      });
    }

    const result = await githubService.getUserRepositories(
      login,
      parseInt(first)
    );

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

/**
 * GET /api/github/search/repositories
 * Search repositories using GitHub GraphQL API
 */
router.get("/search/repositories", async (req, res) => {
  try {
    const { q: query, first = 10 } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Query parameter "q" is required',
      });
    }

    if (!githubService.isConfigured()) {
      return res.status(503).json({
        success: false,
        error: "GitHub token not configured",
      });
    }

    const result = await githubService.searchRepositories(
      query,
      parseInt(first)
    );

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

export default router;
