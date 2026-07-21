# Contributing to Azure Policy Lens

We welcome contributions! This document explains our development workflow.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally
3. **Create a feature branch**: `git checkout -b feature/your-feature-name`
4. **Set up local environment**: See [LOCAL_DEVELOPMENT.md](./LOCAL_DEVELOPMENT.md)

## Development Workflow

### 1. Create a Feature Branch

Always create a new branch for your work:

```bash
git checkout -b feature/add-new-feature
```

Branch naming conventions:
- `feature/` — New features
- `bugfix/` — Bug fixes
- `refactor/` — Code refactoring
- `docs/` — Documentation updates

### 2. Make Changes

- Write clean, readable code
- Follow existing code style
- Add comments for complex logic
- Test your changes locally

### 3. Test Locally

```bash
npm run dev
npm run test
npm run lint
```

### 4. Commit Changes

Write clear, descriptive commit messages:

```bash
git commit -m "feat: add policy filtering by framework"
git commit -m "fix: correct compliance percentage calculation"
git commit -m "docs: update API documentation"
```

Commit message format:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test changes
- `chore:` Build/dependency updates

### 5. Push and Open a Pull Request

```bash
git push -u origin feature/your-feature
```

Then open a Pull Request on GitHub:
- Use a clear title describing your change
- Reference related issues (`Fixes #123`)
- Describe what changed and why
- List any breaking changes

## Pull Request Process

1. **Automated checks** run automatically
   - Linting and formatting
   - Unit tests
   - Build verification

2. **Code review** by maintainers
   - We may request changes
   - Be responsive to feedback

3. **Merge** once approved
   - Use "Squash and merge" for clean history
   - Delete the feature branch

## Code Style Guidelines

### TypeScript

- Use strict mode (`strict: true`)
- Type all function parameters and returns
- Avoid `any` types when possible
- Use `const` by default, `let` when needed

```typescript
// ✓ Good
const getUserById = (id: string): Promise<User> => {
  return apiClient.get(`/users/${id}`)
}

// ✗ Avoid
const getUser = (id) => {
  return api.get(`/users/${id}`)
}
```

### React

- Use functional components with hooks
- Prefer composition over inheritance
- Keep components focused and single-responsibility
- Memoize expensive computations

```typescript
// ✓ Good
export const UserCard: React.FC<UserCardProps> = ({ user }) => {
  return <div>{user.name}</div>
}

// ✗ Avoid
export class UserCard extends React.Component {
  // ...
}
```

### SQL/Database

- Use parameterized queries (never string concatenation)
- Add proper indexes for performance
- Write readable queries with comments
- Handle NULL values explicitly

```sql
-- ✓ Good
SELECT * FROM policies WHERE category = ? AND framework = ?

-- ✗ Avoid
SELECT * FROM policies WHERE category = '" + category + "'"
```

## Version Bumping

When making releases:

1. Update `package.json` version:
```json
{
  "version": "1.1.0"
}
```

2. Run changelog script:
```bash
npm run generate-changelog
```

3. Update `CHANGELOG.md` with user-facing changes

4. Commit and tag:
```bash
git tag v1.1.0
git push origin main --tags
```

## Reporting Bugs

When opening an issue for a bug:

1. **Title**: Clear, concise description
2. **Steps to reproduce**: Detailed steps
3. **Expected behavior**: What should happen
4. **Actual behavior**: What actually happens
5. **Environment**: Node version, OS, browser
6. **Logs**: Include relevant error messages

Example:
```
Title: Import fails with special characters in policy name

Steps:
1. Create policy with name "Test (Policy) #1"
2. Export to CSV
3. Try to import back

Expected: Import succeeds
Actual: Import fails with "CSV parse error"

Environment: Node 20.6.0, Windows 11, Chrome 120
```

## Documentation

- Update [README.md](./README.md) for user-facing changes
- Update [LOCAL_DEVELOPMENT.md](./LOCAL_DEVELOPMENT.md) for setup changes
- Add code comments for complex logic
- Keep API documentation in [backend/README.md](./backend/README.md) in sync

## Performance Considerations

- Lazy-load components when possible
- Cache API responses appropriately
- Paginate large datasets
- Use database indexes for frequent queries
- Profile before optimizing

## Security

- Never commit secrets or API keys
- Use environment variables for configuration
- Validate all user input
- Sanitize SQL queries (use parameters)
- Keep dependencies updated

```bash
npm audit
npm update
```

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Questions?

- Check [LOCAL_DEVELOPMENT.md](./LOCAL_DEVELOPMENT.md)
- Open an issue for discussion
- Ask in PR comments

Thank you for contributing! 🎉
