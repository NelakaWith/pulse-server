import { GraphQLClient, gql } from "graphql-request";
import axios from "axios";
import { config, isDevelopment } from "../config/index.js";
import { Logger } from "../utils/index.js";

class GitHubService {
  constructor() {
    // Use GraphQL client with token for authenticated requests
    this.graphqlClient = new GraphQLClient(config.github.graphqlApiBaseUrl, {
      headers: config.github.token
        ? {
            authorization: `Bearer ${config.github.token}`,
          }
        : {},
    });

    // Use axios for REST API calls (can work without auth for public repos)
    this.restClient = axios.create({
      baseURL: config.github.restApiBaseUrl,
      headers: config.github.token
        ? {
            authorization: `Bearer ${config.github.token}`,
          }
        : {},
    });
  }

  /**
   * Get repository information
   * @param {string} owner - Repository owner
   * @param {string} name - Repository name
   * @returns {Promise<Object>} Repository data
   */
  async getRepository(owner, name) {
    try {
      // First try REST API (works without auth for public repos)
      const restResponse = await this.restClient.get(`/repos/${owner}/${name}`);
      const repoData = restResponse.data;

      // Try to get additional data with GraphQL if token is available
      let languages = [];
      let branches = [];
      let defaultBranch = repoData.default_branch;

      if (config.github.token) {
        try {
          const query = gql`
            query GetRepositoryDetails($owner: String!, $name: String!) {
              repository(owner: $owner, name: $name) {
                languages(first: 10) {
                  nodes {
                    name
                    color
                  }
                }
                refs(refPrefix: "refs/heads/", first: 10) {
                  nodes {
                    name
                  }
                }
              }
            }
          `;
          const graphqlData = await this.graphqlClient.request(query, {
            owner,
            name,
          });
          languages = graphqlData.repository.languages?.nodes || [];
          branches =
            graphqlData.repository.refs?.nodes?.map((r) => r.name) || [];
        } catch (graphqlError) {
          Logger.warn(
            `GraphQL failed, using REST data only: ${graphqlError.message}`
          );
        }
      }

      // Format response to match expected structure
      const formattedData = {
        id: repoData.id.toString(),
        name: repoData.name,
        description: repoData.description,
        url: repoData.html_url,
        stargazerCount: repoData.stargazers_count,
        forkCount: repoData.forks_count,
        createdAt: repoData.created_at,
        updatedAt: repoData.updated_at,
        primaryLanguage: repoData.language
          ? { name: repoData.language, color: null }
          : null,
        languages: { nodes: languages },
        defaultBranchRef: { name: defaultBranch },
        refs: { nodes: branches.map((name) => ({ name })) },
      };

      return {
        success: true,
        data: formattedData,
      };
    } catch (error) {
      if (isDevelopment) {
        Logger.error(`GitHub API Error (getRepository): ${error.message}`);
      }
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Get repository issues
   * @param {string} owner - Repository owner
   * @param {string} name - Repository name
   * @param {number} first - Number of issues to fetch
   * @param {string} states - Issue states (OPEN, CLOSED)
   * @returns {Promise<Object>} Issues data
   */
  async getRepositoryIssues(owner, name, first = 10, states = ["OPEN"]) {
    const query = gql`
      query GetRepositoryIssues(
        $owner: String!
        $name: String!
        $first: Int!
        $states: [IssueState!]
      ) {
        repository(owner: $owner, name: $name) {
          issues(
            first: $first
            states: $states
            orderBy: { field: UPDATED_AT, direction: DESC }
          ) {
            totalCount
            nodes {
              id
              number
              title
              body
              state
              createdAt
              updatedAt
              author {
                login
              }
              labels(first: 5) {
                nodes {
                  name
                  color
                }
              }
              assignees(first: 3) {
                nodes {
                  login
                }
              }
            }
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }
      }
    `;

    try {
      const data = await this.graphqlClient.request(query, {
        owner,
        name,
        first,
        states,
      });
      return {
        success: true,
        data: data.repository.issues,
      };
    } catch (error) {
      if (isDevelopment) {
        Logger.error(
          `GitHub GraphQL Error (getRepositoryIssues): ${error.message}`
        );
      }
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Get repository pull requests
   * @param {string} owner - Repository owner
   * @param {string} name - Repository name
   * @param {number} first - Number of PRs to fetch
   * @param {string} states - PR states (OPEN, CLOSED, MERGED)
   * @returns {Promise<Object>} Pull requests data
   */
  async getRepositoryPullRequests(owner, name, first = 10, states = ["OPEN"]) {
    const query = gql`
      query GetRepositoryPullRequests(
        $owner: String!
        $name: String!
        $first: Int!
        $states: [PullRequestState!]
      ) {
        repository(owner: $owner, name: $name) {
          pullRequests(
            first: $first
            states: $states
            orderBy: { field: UPDATED_AT, direction: DESC }
          ) {
            totalCount
            nodes {
              id
              number
              title
              body
              state
              createdAt
              updatedAt
              author {
                login
              }
              headRefName
              baseRefName
              mergeable
              additions
              deletions
              changedFiles
              labels(first: 5) {
                nodes {
                  name
                  color
                }
              }
              assignees(first: 3) {
                nodes {
                  login
                }
              }
              reviewRequests(first: 3) {
                nodes {
                  requestedReviewer {
                    ... on User {
                      login
                    }
                  }
                }
              }
            }
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }
      }
    `;

    try {
      const data = await this.graphqlClient.request(query, {
        owner,
        name,
        first,
        states,
      });
      return {
        success: true,
        data: data.repository.pullRequests,
      };
    } catch (error) {
      if (isDevelopment) {
        Logger.error(
          `GitHub GraphQL Error (getRepositoryPullRequests): ${error.message}`
        );
      }
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Get user repositories
   * @param {string} login - User login
   * @param {number} first - Number of repositories to fetch
   * @returns {Promise<Object>} Repositories data
   */
  async getUserRepositories(login, first = 10) {
    const query = gql`
      query GetUserRepositories($login: String!, $first: Int!) {
        user(login: $login) {
          repositories(
            first: $first
            orderBy: { field: UPDATED_AT, direction: DESC }
          ) {
            totalCount
            nodes {
              id
              name
              description
              url
              stargazerCount
              forkCount
              createdAt
              updatedAt
              primaryLanguage {
                name
                color
              }
              isPrivate
              isFork
            }
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }
      }
    `;

    try {
      const data = await this.graphqlClient.request(query, { login, first });
      return {
        success: true,
        data: data.user.repositories,
      };
    } catch (error) {
      if (isDevelopment) {
        Logger.error(
          `GitHub GraphQL Error (getUserRepositories): ${error.message}`
        );
      }
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Search repositories
   * @param {string} query - Search query
   * @param {number} first - Number of results to fetch
   * @returns {Promise<Object>} Search results
   */
  async searchRepositories(searchQuery, first = 10) {
    const query = gql`
      query SearchRepositories($query: String!, $first: Int!) {
        search(query: $query, type: REPOSITORY, first: $first) {
          repositoryCount
          nodes {
            ... on Repository {
              id
              name
              description
              url
              stargazerCount
              forkCount
              createdAt
              updatedAt
              owner {
                login
              }
              primaryLanguage {
                name
                color
              }
              isPrivate
              isFork
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    `;

    try {
      const data = await this.graphqlClient.request(query, {
        query: searchQuery,
        first,
      });
      return {
        success: true,
        data: data.search,
      };
    } catch (error) {
      if (isDevelopment) {
        Logger.error(
          `GitHub GraphQL Error (searchRepositories): ${error.message}`
        );
      }
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Get repository README content (decoded)
   * @param {string} owner
   * @param {string} name
   */
  async getRepositoryReadme(owner, name) {
    try {
      const response = await this.restClient.get(
        `/repos/${owner}/${name}/readme`,
        {
          headers: { Accept: "application/vnd.github.v3.raw" },
        }
      );
      // When using `application/vnd.github.v3.raw`, GitHub returns raw text
      const content = response.data;
      return { success: true, data: { content } };
    } catch (error) {
      if (isDevelopment) {
        Logger.error(
          `GitHub API Error (getRepositoryReadme): ${error.message}`
        );
      }
      return { success: false, error: error.message };
    }
  }

  /**
   * Get recent commits for a repository via REST
   * @param {string} owner
   * @param {string} name
   * @param {number} perPage
   */
  async getRecentCommits(owner, name, perPage = 5) {
    try {
      const response = await this.restClient.get(
        `/repos/${owner}/${name}/commits?per_page=${perPage}`
      );
      const commits = (response.data || []).map((c) => ({
        sha: c.sha,
        message: c.commit.message,
        author: c.commit.author?.name || c.author?.login || null,
        date: c.commit.author?.date || null,
        url: c.html_url,
      }));
      return { success: true, data: commits };
    } catch (error) {
      if (isDevelopment) {
        Logger.error(`GitHub API Error (getRecentCommits): ${error.message}`);
      }
      return { success: false, error: error.message };
    }
  }

  /**
   * Get a repository file content (decoded)
   * @param {string} owner
   * @param {string} name
   * @param {string} path
   */
  async getFileContent(owner, name, path) {
    try {
      const response = await this.restClient.get(
        `/repos/${owner}/${name}/contents/${encodeURIComponent(path)}`,
        { headers: { Accept: "application/vnd.github.v3.raw" } }
      );
      const content = response.data;
      return { success: true, data: { path, content } };
    } catch (error) {
      if (isDevelopment) {
        Logger.error(
          `GitHub API Error (getFileContent ${path}): ${error.message}`
        );
      }
      return { success: false, error: error.message };
    }
  }

  /**
   * Check if GitHub token is configured
   * @returns {boolean} True if token is available
   */
  isConfigured() {
    return !!config.github.token;
  }
}

export default new GitHubService();
