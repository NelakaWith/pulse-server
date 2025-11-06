import { GraphQLClient, gql } from "graphql-request";
import { config, isDevelopment } from "../config/index.js";

class GitHubService {
  constructor() {
    this.client = new GraphQLClient("https://api.github.com/graphql", {
      headers: {
        authorization: `Bearer ${
          config.github?.token || process.env.GITHUB_TOKEN
        }`,
      },
    });
  }

  /**
   * Get repository information
   * @param {string} owner - Repository owner
   * @param {string} name - Repository name
   * @returns {Promise<Object>} Repository data
   */
  async getRepository(owner, name) {
    const query = gql`
      query GetRepository($owner: String!, $name: String!) {
        repository(owner: $owner, name: $name) {
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
          languages(first: 10) {
            nodes {
              name
              color
            }
          }
          defaultBranchRef {
            name
          }
          refs(refPrefix: "refs/heads/", first: 10) {
            nodes {
              name
            }
          }
        }
      }
    `;

    try {
      const data = await this.client.request(query, { owner, name });
      return {
        success: true,
        data: data.repository,
      };
    } catch (error) {
      if (isDevelopment) {
        console.error("GitHub GraphQL Error:", error);
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
      const data = await this.client.request(query, {
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
        console.error("GitHub GraphQL Error:", error);
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
      const data = await this.client.request(query, {
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
        console.error("GitHub GraphQL Error:", error);
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
      const data = await this.client.request(query, { login, first });
      return {
        success: true,
        data: data.user.repositories,
      };
    } catch (error) {
      if (isDevelopment) {
        console.error("GitHub GraphQL Error:", error);
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
      const data = await this.client.request(query, {
        query: searchQuery,
        first,
      });
      return {
        success: true,
        data: data.search,
      };
    } catch (error) {
      if (isDevelopment) {
        console.error("GitHub GraphQL Error:", error);
      }
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Check if GitHub token is configured
   * @returns {boolean} True if token is available
   */
  isConfigured() {
    return !!(config.github?.token || process.env.GITHUB_TOKEN);
  }
}

export default new GitHubService();
