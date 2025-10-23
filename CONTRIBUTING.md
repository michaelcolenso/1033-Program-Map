# Contributing to 1033 Program Map

Thank you for your interest in contributing to the 1033 Program Map project! This document provides guidelines for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Submitting Changes](#submitting-changes)
- [Reporting Issues](#reporting-issues)

## Code of Conduct

This project adheres to a code of conduct that all contributors are expected to follow:

- Be respectful and inclusive
- Exercise empathy and kindness
- Give and gracefully accept constructive feedback
- Focus on what is best for the community
- Show courtesy and respect towards other community members

## Getting Started

### Prerequisites

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/1033-Program-Map.git
   cd 1033-Program-Map
   ```
3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/michaelcolenso/1033-Program-Map.git
   ```
4. **Install dependencies**:
   ```bash
   npm install
   ```
5. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

### Local Development

1. Start MongoDB:
   ```bash
   # macOS with Homebrew
   brew services start mongodb-community
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open `http://localhost:8080` in your browser

## Development Workflow

### Creating a Branch

Always create a new branch for your work:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bugfix-name
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Test additions or modifications
- `chore/` - Maintenance tasks

### Keeping Your Fork Updated

Regularly sync your fork with the upstream repository:

```bash
git checkout main
git fetch upstream
git merge upstream/main
git push origin main
```

## Coding Standards

### JavaScript Style Guide

- Use **2 spaces** for indentation (not tabs)
- Use **semicolons** at the end of statements
- Use **single quotes** for strings (except to avoid escaping)
- Use **camelCase** for variable and function names
- Use **PascalCase** for class names
- Add **JSDoc comments** for functions and classes

### Example:

```javascript
/**
 * Fetches user data from the database
 * @param {String} userId - The user's unique identifier
 * @returns {Promise<Object>} User object
 */
function getUserData(userId) {
  return User.findById(userId)
    .then(user => {
      return user;
    })
    .catch(err => {
      console.error('Error fetching user:', err);
      throw err;
    });
}
```

### File Organization

- **Controllers**: Place route handlers in `controllers/`
- **Models**: Database schemas go in `models/`
- **Views**: Pug templates in `views/`
- **Public Assets**: Static files in `public/`
- **Configuration**: Config files in `config/`

### Security Best Practices

- Never commit sensitive data (API keys, passwords, etc.)
- Always validate and sanitize user input
- Use parameterized queries to prevent SQL/NoSQL injection
- Keep dependencies up to date
- Use HTTPS in production
- Implement proper authentication and authorization

## Testing Guidelines

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

### Writing Tests

- Write tests for new features and bug fixes
- Use descriptive test names
- Follow the Arrange-Act-Assert pattern
- Mock external dependencies

Example test:

```javascript
describe('User Controller', function() {
  describe('POST /signup', function() {
    it('should create a new user with valid credentials', function(done) {
      request(app)
        .post('/signup')
        .send({
          email: 'test@example.com',
          password: 'password123'
        })
        .expect(302)
        .end(function(err, res) {
          if (err) return done(err);
          done();
        });
    });
  });
});
```

## Submitting Changes

### Before Submitting

1. **Test your changes**:
   ```bash
   npm test
   ```

2. **Lint your code** (if linter is configured):
   ```bash
   npm run lint
   ```

3. **Commit your changes** with a clear message:
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

### Commit Message Convention

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Examples:
```
feat: add county-level filtering to map
fix: resolve session timeout issue
docs: update installation instructions
refactor: simplify user authentication logic
```

### Creating a Pull Request

1. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Open a Pull Request** on GitHub:
   - Go to the original repository
   - Click "New Pull Request"
   - Select your fork and branch
   - Fill out the PR template with:
     - Description of changes
     - Related issue numbers (if applicable)
     - Screenshots (for UI changes)
     - Testing steps

3. **Wait for review**:
   - Address any feedback from reviewers
   - Make requested changes in new commits
   - Push updates to the same branch

## Reporting Issues

### Before Creating an Issue

- Check if the issue already exists
- Verify it's not a configuration issue on your end
- Gather relevant information (error messages, logs, etc.)

### Creating an Issue

Include the following information:

1. **Title**: Clear and descriptive
2. **Description**: Detailed explanation of the issue
3. **Steps to Reproduce**: How to recreate the problem
4. **Expected Behavior**: What should happen
5. **Actual Behavior**: What actually happens
6. **Environment**:
   - OS: (e.g., macOS 12.0)
   - Node.js version: (e.g., 18.12.0)
   - npm version: (e.g., 9.1.0)
7. **Screenshots**: If applicable
8. **Additional Context**: Any other relevant information

### Issue Labels

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Documentation improvements
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention needed

## Questions?

If you have questions about contributing, feel free to:

- Open an issue with the `question` label
- Reach out to the maintainers

## Recognition

Contributors will be recognized in:
- The project's README
- Release notes
- GitHub's contributors page

Thank you for contributing to the 1033 Program Map! Your efforts help make this project better for everyone.
