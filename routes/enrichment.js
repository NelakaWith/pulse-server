import express from "express";
import githubService from "../services/githubService.js";
import { openRouterService } from "../services/openRouterService.js";
import { Logger } from "../utils/index.js";
import { config } from "../config/index.js";

const router = express.Router();

/**
 * Parse AI analysis text into structured sections
 */
function parseAnalysisIntoSections(content) {
  const sections = {
    overview: "",
    codeQuality: "",
    healthMetrics: "",
    areasForImprovement: "",
    recommendations: "",
    raw: content,
  };

  // Split content by common section headers (case insensitive)
  const lines = content.split("\n");
  let currentSection = "overview";

  for (const line of lines) {
    const lowerLine = line.toLowerCase().trim();

    if (lowerLine.includes("code quality") || lowerLine.includes("quality")) {
      currentSection = "codeQuality";
    } else if (lowerLine.includes("health") || lowerLine.includes("metrics")) {
      currentSection = "healthMetrics";
    } else if (
      lowerLine.includes("improvement") ||
      lowerLine.includes("areas")
    ) {
      currentSection = "areasForImprovement";
    } else if (lowerLine.includes("recommendation")) {
      currentSection = "recommendations";
    } else if (
      lowerLine.includes("overview") ||
      lowerLine.includes("summary")
    ) {
      currentSection = "overview";
    } else {
      // Add content to current section
      if (sections[currentSection]) {
        sections[currentSection] += line + "\n";
      } else {
        sections[currentSection] = line + "\n";
      }
    }
  }

  // Clean up sections (remove empty ones, trim whitespace)
  Object.keys(sections).forEach((key) => {
    if (key !== "raw") {
      sections[key] = sections[key].trim();
      if (!sections[key]) {
        delete sections[key];
      }
    }
  });

  return sections;
}

/**
 * POST /api/enrichment
 * Unified endpoint for repository enrichment tasks
 *
 * Expected payload:
 * {
 *   "owner": "username",
 *   "name": "repo-name",
 *   "scope": "repo",
 *   "task": "analyze" | "summarize-issues",
 *   "question": "optional custom question for analyze task"
 * }
 */
router.post("/", async (req, res) => {
  try {
    const { owner, name, scope, task, question } = req.body;

    // Validate required fields
    if (!owner || !name || !scope || !task) {
      return res.status(400).json({
        success: false,
        error: "owner, name, scope, and task are required",
      });
    }

    // Only repo scope supported for now
    if (scope !== "repo") {
      return res.status(400).json({
        success: false,
        error: "Only 'repo' scope is currently supported",
      });
    }

    // Route based on task
    if (task === "analyze") {
      return handleAnalyzeTask(res, owner, name, question);
    } else if (task === "summarize-issues") {
      return handleSummarizeIssuesTask(res, owner, name);
    } else {
      return res.status(400).json({
        success: false,
        error: `Unknown task: ${task}. Supported tasks: analyze, summarize-issues`,
      });
    }
  } catch (error) {
    Logger.error(`Enrichment error: ${error.stack || error}`);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

/**
 * Handle analyze task
 */
async function handleAnalyzeTask(res, owner, name, question) {
  try {
    // For analyze task, use a default question if not provided
    const analysisQuestion =
      question ||
      "Provide a comprehensive analysis of this repository's code quality, health, and potential areas for improvement.";

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

    // Step 3: Get repository pull requests for additional context
    Logger.info(
      `[Enrichment] Fetching recent pull requests for ${owner}/${name}`
    );
    const prsResult = await githubService.getRepositoryPullRequests(
      owner,
      name,
      5
    );
    if (prsResult.success) {
      Logger.info(
        `[Enrichment] PRs data: ${prsResult.data.totalCount} total PRs, fetched ${prsResult.data.nodes.length} recent`
      );
    } else {
      Logger.warn(`[Enrichment] PRs fetch failed: ${prsResult.error}`);
    }

    // Step 4: Prepare context for AI
    const repoData = repoResult.data;
    const issuesData = issuesResult.success ? issuesResult.data : null;
    const prsData = prsResult.success ? prsResult.data : null;

    const contextPrompt = `
Repository Information:
- Name: ${repoData.name}
- Description: ${repoData.description || "No description"}
- Stars: ${repoData.stargazerCount}
- Forks: ${repoData.forkCount}
- Primary Language: ${repoData.primaryLanguage?.name || "Unknown"}
- Languages: ${
      repoData.languages?.nodes?.map((l) => l.name).join(", ") || "Unknown"
    }
- Default Branch: ${repoData.defaultBranchRef?.name || "Unknown"}
- Branches: ${repoData.refs?.nodes?.map((r) => r.name).join(", ") || "Unknown"}
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

${
  prsData
    ? `Recent Pull Requests (${prsData.totalCount} total):
${prsData.nodes
  .slice(0, 3)
  .map(
    (pr) =>
      `- #${pr.number}: ${pr.title} (${pr.state}) - ${pr.additions}+/${pr.deletions}-`
  )
  .join("\n")}`
    : ""
}

User Question: ${analysisQuestion}

Please analyze this repository and answer the question based on the provided data. Structure your response with clear sections like: Code Quality, Health Metrics, Areas for Improvement, and Recommendations.`;

    // Step 5: Send to AI
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

    // Step 6: Parse AI analysis into structured sections
    const aiContent = aiResult.data.choices[0].message.content;
    const analysisSections = parseAnalysisIntoSections(aiContent);

    // Step 7: Return enriched response
    return res.json({
      success: true,
      data: {
        repository: {
          basic: {
            name: repoData.name,
            owner: owner,
            url: repoData.url,
            description: repoData.description,
            createdAt: repoData.createdAt,
            updatedAt: repoData.updatedAt,
          },
          stats: {
            stars: repoData.stargazerCount,
            forks: repoData.forkCount,
          },
          languages:
            repoData.languages?.nodes?.map((l) => ({
              name: l.name,
              color: l.color,
            })) || [],
          branches: repoData.refs?.nodes?.map((r) => r.name) || [],
          defaultBranch: repoData.defaultBranchRef?.name,
        },
        issues: issuesData
          ? {
              totalCount: issuesData.totalCount,
              recent: issuesData.nodes.slice(0, 3).map((issue) => ({
                number: issue.number,
                title: issue.title,
                state: issue.state,
                author: issue.author.login,
                labels: issue.labels.nodes.map((l) => l.name),
                createdAt: issue.createdAt,
              })),
            }
          : null,
        pullRequests: prsData
          ? {
              totalCount: prsData.totalCount,
              recent: prsData.nodes.slice(0, 3).map((pr) => ({
                number: pr.number,
                title: pr.title,
                state: pr.state,
                author: pr.author.login,
                additions: pr.additions,
                deletions: pr.deletions,
                changedFiles: pr.changedFiles,
                createdAt: pr.createdAt,
              })),
            }
          : null,
        analysis: analysisSections,
      },
    });
  } catch (error) {
    Logger.error(`Analyze task error: ${error.stack || error}`);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}

/**
 * Handle summarize-issues task
 */
async function handleSummarizeIssuesTask(res, owner, name) {
  try {
    Logger.info(`[Enrichment] Summarize-issues task: ${owner}/${name}`);

    // Step 1: Get repository issues
    Logger.info(`[Issues Summary] Fetching issues for ${owner}/${name}`);
    const issuesResult = await githubService.getRepositoryIssues(
      owner,
      name,
      10
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
    return res.json({
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
    Logger.error(`Summarize-issues task error: ${error.stack || error}`);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}

export default router;
