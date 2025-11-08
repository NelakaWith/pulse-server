// Commitizen configuration for conventional commits
module.exports = {
  types: [
    { value: "feat", name: "✨ feat:      A new feature" },
    { value: "fix", name: "🐛 fix:       A bug fix" },
    { value: "docs", name: "📚 docs:      Documentation only changes" },
    {
      value: "style",
      name: "🎨 style:     Changes that do not affect the meaning of the code\n            (white-space, formatting, missing semi-colons, etc)",
    },
    {
      value: "refactor",
      name: "♻️  refactor:  A code change that neither fixes a bug nor adds a feature",
    },
    {
      value: "perf",
      name: "⚡ perf:      A code change that improves performance",
    },
    {
      value: "test",
      name: "✅ test:      Adding missing tests or correcting existing tests",
    },
    {
      value: "chore",
      name: "🔧 chore:     Changes to the build process, dependencies, or tooling",
    },
    {
      value: "ci",
      name: "👷 ci:        Changes to CI configuration files and scripts",
    },
    { value: "revert", name: "⏮️  revert:    Reverts a previous commit" },
  ],

  scopes: [
    { name: "api" },
    { name: "auth" },
    { name: "rate-limit" },
    { name: "security" },
    { name: "docs" },
    { name: "tests" },
    { name: "deps" },
    { name: "config" },
    { name: "middleware" },
    { name: "services" },
    { name: "routes" },
    { name: "utils" },
    { name: "release" },
  ],

  scopeOverrides: {
    fix: [
      { name: "merge-conflict" },
      { name: "typo" },
      { name: "performance" },
      { name: "security" },
    ],
  },

  // it needs to match the value for field type. Eg.: 'fix'
  /*
  scopeOverrides: {
    fix: [
      {name: 'merge-conflict'}
    ]
  },
  */
  allowTicketNumber: false,
  isTicketNumberRequired: false,
  ticketNumberPrefix: "TICKET-",
  ticketNumberRegExp: "\\d{1,5}",

  // it needs to match the value for field type. Eg.: 'fix'
  /*
  scopeOverrides: {
    fix: [

      {name: 'merge-conflict'}
    ]
  },
  */
  allowCustomScopes: true,
  allowBreakingChanges: ["feat", "fix"],
  // limit subject length
  subjectLimit: 100,
  breakingPrefix: "BREAKING CHANGE:",
  messagePattern: "^.{1,100}(\\n\\n.*)?$",
  commitUrlFormat: "https://github.com/NelakaWith/pulse-server/commit/{{hash}}",
  compareUrlFormat:
    "https://github.com/NelakaWith/pulse-server/compare/{{previousTag}}...{{currentTag}}",
  types: [
    { value: "feat", name: "✨ feat:      A new feature" },
    { value: "fix", name: "🐛 fix:       A bug fix" },
    { value: "docs", name: "📚 docs:      Documentation only changes" },
    {
      value: "style",
      name: "🎨 style:     Changes that do not affect the meaning of the code",
    },
    {
      value: "refactor",
      name: "♻️  refactor:  A code change that neither fixes a bug nor adds a feature",
    },
    {
      value: "perf",
      name: "⚡ perf:      A code change that improves performance",
    },
    {
      value: "test",
      name: "✅ test:      Adding missing tests or correcting existing tests",
    },
    {
      value: "chore",
      name: "🔧 chore:     Changes to build process, dependencies, or tooling",
    },
    {
      value: "ci",
      name: "👷 ci:        Changes to CI configuration files and scripts",
    },
    { value: "revert", name: "⏮️  revert:    Reverts a previous commit" },
  ],
  messages: {
    type: "Select the type of change that you're committing:",
    scope:
      "\nDenote the SCOPE of this change (optional). E.g. section, grammar, typo, ...",
    // used if allowCustomScopes is true
    customScope: "Denote the SCOPE of this change:",
    subject: "Write a SHORT, imperative tense description of the change:\n",
    body: 'Provide a LONGER description of the change (optional). Use "|" to break new line:\n',
    breaking:
      "List any BREAKING CHANGES (optional). E.g. deprecations, removals, etc:\n",
    footer:
      "List any ISSUE CLOSURES (optional). E.g. Fixes #123, Resolves #456:\n",
    confirmCommit: "Are you sure you want to proceed with the commit above?",
  },
  allowBreakingChanges: ["feat", "fix"],
  // limit subject length and body line length
  subjectLimit: 100,
  bodyLineLimit: 100,
  breakingPrefix: "BREAKING CHANGE:",
  footerPrefix: "Closes:",
  askForBreakingChangeFirst: true, // default is false
};
