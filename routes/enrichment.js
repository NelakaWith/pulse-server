import express from "express";
import githubService from "../services/githubService.js";
import { openRouterService } from "../services/openRouterService.js";
import { Logger } from "../utils/index.js";
import { config } from "../config/index.js";

const router = express.Router();

/**
 * POST /api/enrichment/analyze-repository
 * Fetch GitHub repo data and send to AI for analysis
 */
router.post("/analyze-repository", async (req, res) => {
  try {
    const { owner, name, question } = req.body;

    if (!owner || !name || !question) {
      return res.status(400).json({
        success: false,
        error: "owner, name, and question are required",
      });
    }

    // Step 1: Get GitHub repository data
    Logger.info(`[Enrichment] Fetching repository: ${owner}/${name}`);
    const repoResult = await githubService.getRepository(owner, name);
    if (!repoResult.success) {
      Logger.error(`[Enrichment] Repository fetch failed: ${repoResult.error}`);
      return res.status(400).json({
        success: false,
        error: `Failed to fetch repository: ${repoResult.error}`,
      });
    }
    Logger.info(
      `[Enrichment] Repository data: ${repoResult.data.name} (${
        repoResult.data.stargazerCount
      } stars, ${repoResult.data.primaryLanguage?.name || "No language"})`
    );

    // Step 2: Get repository issues for more context
    Logger.info(`[Enrichment] Fetching recent issues for ${owner}/${name}`);
    const issuesResult = await githubService.getRepositoryIssues(
      owner,
      name,
      5
    );
    if (issuesResult.success) {
      Logger.info(
        `[Enrichment] Issues data: ${issuesResult.data.totalCount} total issues, fetched ${issuesResult.data.nodes.length} recent`
      );
    } else {
      Logger.warn(`[Enrichment] Issues fetch failed: ${issuesResult.error}`);
    }

    // Step 3: Prepare context for AI
    const repoData = repoResult.data;
    const issuesData = issuesResult.success ? issuesResult.data : null;

    const contextPrompt = `
Repository Information:
- Name: ${repoData.name}
- Description: ${repoData.description || "No description"}
- Stars: ${repoData.stargazerCount}
- Forks: ${repoData.forkCount}
- Primary Language: ${repoData.primaryLanguage?.name || "Unknown"}
- Created: ${repoData.createdAt}
- Last Updated: ${repoData.updatedAt}

${
  issuesData
    ? `Recent Issues (${issuesData.totalCount} total):
${issuesData.nodes
  .slice(0, 3)
  .map((issue) => `- #${issue.number}: ${issue.title} (${issue.state})`)
  .join("\n")}`
    : ""
}

User Question: ${question}

Please analyze this repository and answer the user's question based on the provided data.`;

    // Step 4: Send to AI
    Logger.info(
      `[Enrichment] Sending context to AI (${contextPrompt.length} characters)`
    );
    const aiResult = await openRouterService.chatCompletion(
      contextPrompt,
      config.openRouter.defaultModel,
      { maxTokens: 500 }
    );

    if (!aiResult.success) {
      Logger.error(
        `[Enrichment] AI analysis failed: ${aiResult.error || "Unknown error"}`
      );
      return res.status(500).json({
        success: false,
        error: "AI analysis failed",
      });
    }
    Logger.info(
      `[Enrichment] AI analysis completed successfully (${aiResult.data.choices[0].message.content.length} characters response)`
    );

    // Step 5: Return enriched response
    res.json({
      success: true,
      data: {
        repository: {
          name: repoData.name,
          owner: owner,
          url: repoData.url,
          stars: repoData.stargazerCount,
          language: repoData.primaryLanguage?.name,
        },
        analysis: aiResult.data.choices[0].message.content,
        metadata: {
          totalIssues: issuesData?.totalCount || 0,
          lastUpdated: repoData.updatedAt,
        },
      },
    });
  } catch (error) {
    Logger.error(
      `Enrichment error: ${error && error.stack ? error.stack : error}`
    );
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

/**
 * POST /api/enrichment/summarize-issues
 * Fetch GitHub issues and get AI summary
 */
router.post("/summarize-issues", async (req, res) => {
  try {
    const { owner, name, maxIssues = 10 } = req.body;

    if (!owner || !name) {
      return res.status(400).json({
        success: false,
        error: "owner and name are required",
      });
    }

    // Step 1: Get repository issues
    Logger.info(
      `[Issues Summary] Fetching ${maxIssues} issues for ${owner}/${name}`
    );
    const issuesResult = await githubService.getRepositoryIssues(
      owner,
      name,
      maxIssues
    );
    if (!issuesResult.success) {
      Logger.error(
        `[Issues Summary] Issues fetch failed: ${issuesResult.error}`
      );
      return res.status(400).json({
        success: false,
        error: `Failed to fetch issues: ${issuesResult.error}`,
      });
    }
    Logger.info(
      `[Issues Summary] Fetched ${issuesResult.data.nodes.length} issues (${issuesResult.data.totalCount} total available)`
    );

    const issues = issuesResult.data.nodes;

    // Step 2: Prepare issues summary for AI
    const issuesSummary = issues
      .map(
        (issue) =>
          `Issue #${issue.number}: ${issue.title}\n` +
          `Status: ${issue.state}\n` +
          `Author: ${issue.author.login}\n` +
          `Created: ${issue.createdAt}\n` +
          `Labels: ${
            issue.labels.nodes.map((l) => l.name).join(", ") || "None"
          }\n`
      )
      .join("\n---\n");

    const prompt = `Analyze these GitHub repository issues and provide a summary:

Repository: ${owner}/${name}
Total Issues: ${issuesResult.data.totalCount}

Recent Issues:
${issuesSummary}

Please provide:
1. A brief overview of the main themes/categories of issues
2. Any patterns you notice
3. Priority areas that might need attention
4. Overall repository health assessment based on these issues`;

    // Step 3: Send to AI
    Logger.info(
      `[Issues Summary] Sending ${issues.length} issues to AI for analysis (${prompt.length} characters)`
    );
    const aiResult = await openRouterService.chatCompletion(prompt, null, {
      maxTokens: 800,
    });

    if (!aiResult.success) {
      Logger.error(
        `[Issues Summary] AI analysis failed: ${
          aiResult.error || "Unknown error"
        }`
      );
      return res.status(500).json({
        success: false,
        error: "AI analysis failed",
      });
    }
    Logger.info(
      `[Issues Summary] AI analysis completed (${aiResult.data.choices[0].message.content.length} characters response)`
    );

    // Step 4: Return summary
    res.json({
      success: true,
      data: {
        repository: `${owner}/${name}`,
        totalIssues: issuesResult.data.totalCount,
        analyzedIssues: issues.length,
        summary: aiResult.data.choices[0].message.content,
        issues: issues.map((issue) => ({
          number: issue.number,
          title: issue.title,
          state: issue.state,
          author: issue.author.login,
          labels: issue.labels.nodes.map((l) => l.name),
        })),
      },
    });
  } catch (error) {
    Logger.error(
      `Issues summarization error: ${
        error && error.stack ? error.stack : error
      }`
    );
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

export default router;
