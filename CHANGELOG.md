# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.2.0](https://github.com/NelakaWith/pulse-server/compare/v1.1.0...v1.2.0) (2025-11-08)


### Features

* **docs:** create CHANGELOG.md for version history and project updates ([cd8785a](https://github.com/NelakaWith/pulse-server/commit/cd8785a63d26d042f8badee691d6127ab49404b6))


### Bug Fixes

* **app:** rename GITHUB_TOKEN to GITHUB_API_TOKEN across configuration files and documentation ([2947c34](https://github.com/NelakaWith/pulse-server/commit/2947c348d2700d600dc393f388f03592525ba16a))
* **docs:** update GITHUB_TOKEN to GITHUB_API_TOKEN in changelog and pipeline configuration ([3b38815](https://github.com/NelakaWith/pulse-server/commit/3b3881590da2a9ee2fda5f5d590d3e7acd0508c3))

## 1.1.0 (2025-11-08)

### Features

- **api:** Add API key generation, validation, and hashing utilities with comprehensive documentation ([05c650e](https://github.com/NelakaWith/pulse-server/commit/05c650ebbf89bef30e41d898ddcc64ced101f16e))
- **app:** Initialize Pulse Server with Express.js and OpenRouter integration placeholders ([2fbebaa](https://github.com/NelakaWith/pulse-server/commit/2fbebaa716d166307db0e02064536a492f1edc2c))
- **ci:** add CI pipelines for PR linting, automated releases, and deployment processes ([e9081fe](https://github.com/NelakaWith/pulse-server/commit/e9081fe87eafed4c0e8bf9d2e4ca258a7d49fd1b))
- **ci:** enhance CI pipeline with dry-run build step and file verification ([0f75179](https://github.com/NelakaWith/pulse-server/commit/0f75179477bb70704db4d980f72bda8849d05a1c))
- **config:** Update default AI model to an empty string for improved flexibility ([666c343](https://github.com/NelakaWith/pulse-server/commit/666c343e7586b7ff35a978387e9ffe66594ff5c2))
- **docs:** add CI/CD quick reference, setup guide, and visual workflow documentation ([156dd90](https://github.com/NelakaWith/pulse-server/commit/156dd90da06eb92b1153e1d83d4b013c1fd7e0fe))
- **docs:** Add initial README and environment configuration example ([df285b4](https://github.com/NelakaWith/pulse-server/commit/df285b4ab44d38cc5deb07fd58606dc8fbb5ae11))
- **docs:** Add purpose document outlining OpenRouter AI integration benefits for Pulse-Ops ([5af9ef3](https://github.com/NelakaWith/pulse-server/commit/5af9ef31ae830f5c0d4e70eaea41a17a9f5114dd))
- **docs:** enhance README with additional guides and references for CI/CD and project setup ([d9a8a60](https://github.com/NelakaWith/pulse-server/commit/d9a8a60eae02d129c3ebb95ecf70e3cb28b5a120))
- **docs:** update README with additional badges for build status, Node.js version, license, and testing ([0de7c58](https://github.com/NelakaWith/pulse-server/commit/0de7c58b209a0edb708b71d77ffb64414c8a3a01))
- **docs:** update README with structured table of contents for improved navigation ([8f44cf5](https://github.com/NelakaWith/pulse-server/commit/8f44cf5d48d3163df0680f7339921896ec946b8a))
- **enrichment:** Add enrichment routes for AI analysis and issue summarization ([d812d18](https://github.com/NelakaWith/pulse-server/commit/d812d186d6f32221486512f1fb48d9e080a92597))
- **enrichment:** Implement unified endpoint for repository enrichment tasks with enhanced validation and default analysis question ([8f7d33d](https://github.com/NelakaWith/pulse-server/commit/8f7d33d7367cc5717ac17cf4c3b5cdeb1c7b04be))
- **github:** Integrate GitHub API with new routes and service for repository management ([f655a66](https://github.com/NelakaWith/pulse-server/commit/f655a66c8b33a14a1140cd48656b2e7141e36115))
- **logging:** Enhance logging with Logger utility across services and routes ([499f785](https://github.com/NelakaWith/pulse-server/commit/499f785a481d7fc50277ae3d4bacb796a58cb54a))
- **modules:** Implement OpenRouter AI integration with environment configuration and modular architecture ([bec0410](https://github.com/NelakaWith/pulse-server/commit/bec041088cc607506b7300a599a7fa11cb328e82))
- **pipeline:** add startup check step with version info and timestamp ([514037a](https://github.com/NelakaWith/pulse-server/commit/514037ad9f0c2ae70ad9886126760ef408035fa2))
- **release:** add release scripts and versioning tools ([e509f8c](https://github.com/NelakaWith/pulse-server/commit/e509f8cdf149c243a84582a0c4859288324d0982))
- **security:** Implement API key authentication and rate limiting with comprehensive documentation updates ([0b173fe](https://github.com/NelakaWith/pulse-server/commit/0b173fe2ac677eaa8bbc33408aff3063e4ce56bb))
- **service:** add logging for successful OpenRouter API calls ([328c4fa](https://github.com/NelakaWith/pulse-server/commit/328c4fae2811248d1b67e4639e641ab0bcb04056))
- **tests:** Add API endpoint and connection tests for improved reliability ([19a8130](https://github.com/NelakaWith/pulse-server/commit/19a81306f292ef2f6d3b233a6aa35e2056194252))
- **tests:** Add API endpoint tests and connection validation for OpenRouter integration ([b9d6224](https://github.com/NelakaWith/pulse-server/commit/b9d6224ba99a0bec38e5c535b6a1e388f3dbe291))
- **tests:** add HTTP/HTTPS agents with keep-alive configuration to OpenRouterService ([dc520f4](https://github.com/NelakaWith/pulse-server/commit/dc520f40192015800546d14665ac07c41a6d806b))
- **tests:** Enhance API tests with API key authentication and rate limiting checks ([6bbf927](https://github.com/NelakaWith/pulse-server/commit/6bbf927d1ba96b7d4525f53de45b9382a62279c2))
- **tests:** enhance test commands with detailed logging and environment checks ([dcf811e](https://github.com/NelakaWith/pulse-server/commit/dcf811ee9b66c47c44030561c3a7bb731f4a1615))
- **tests:** enhance test configuration with API key management and update test command ([3dd6f59](https://github.com/NelakaWith/pulse-server/commit/3dd6f5982e1c6906266bc3de67382b4079ca0957))
- **tests:** update test configuration with fallback API keys and improved logging ([9451b90](https://github.com/NelakaWith/pulse-server/commit/9451b909e4b9e77c6ceabb8c6f3bbd5452ca1c11))

### Bug Fixes

- **ai:** Update endpoint from /chat to /llm for AI integration ([4a93865](https://github.com/NelakaWith/pulse-server/commit/4a93865497c3a72f2615ac8ab84facf085401945))
- **ci:** disable API key auth in tests to prevent 401 errors ([468b662](https://github.com/NelakaWith/pulse-server/commit/468b662f7e4c14e6498c91e9162369de71e22ea2))
- **docs:** remove extraneous markdown syntax from Conventional Commits guide ([7dffded](https://github.com/NelakaWith/pulse-server/commit/7dffded03a286dc8452d041ec230bdbb7696066a))
- **docs:** update example in generateApiKeys documentation for clarity ([c4ecdc3](https://github.com/NelakaWith/pulse-server/commit/c4ecdc353927684bc960d5a1acb91042152bf3b6))
- **docs:** update license badge in README from GPL to AGPL 3.0 ([7869bf7](https://github.com/NelakaWith/pulse-server/commit/7869bf71d736d875bbb8ffd59be759e6839830f1))
- **docs:** update license information in README from ISC to AGPL 3.0 ([01eb613](https://github.com/NelakaWith/pulse-server/commit/01eb6134230b06a055bdc213666b65bc1dce3919))
- **import:** Change import statement for openRouterService to named import ([678783e](https://github.com/NelakaWith/pulse-server/commit/678783efd5eb2ef673bb5ee00743672e65eeef99))
- **logging:** simplify error logging in enrichment tasks ([6ab3481](https://github.com/NelakaWith/pulse-server/commit/6ab348139d40437237a291f64c2eb4bbfe78c2a7))
- **rateLimit:** add periodic cleanup of expired request entries ([ada3143](https://github.com/NelakaWith/pulse-server/commit/ada3143b56a11edb143a0adb5e930f3183bbb271))
- **release:** use semver for version increment logic in release script ([458e875](https://github.com/NelakaWith/pulse-server/commit/458e8755d17c2519a457d8dcf5cd6651565bc220))
- **tests:** ensure app is properly closed after tests ([2519a99](https://github.com/NelakaWith/pulse-server/commit/2519a9969e08b0e72618220751f34cc3e09d73e7))
- **tests:** update expected response status codes to include authentication errors ([e43fb21](https://github.com/NelakaWith/pulse-server/commit/e43fb21cea2633f2a04c9b8a64796c4e9caaef0c))
