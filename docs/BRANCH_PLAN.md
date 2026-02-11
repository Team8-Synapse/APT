# Branching Strategy & Git Workflow

## Main Branches
- **`main`**: The production-ready code. Stable and tested. Do not push directly to main.
- **`dev` (or `development`)**: The integration branch. Features are merged here for testing.

## Feature Branches
- Format: `feat/feature-name` or `fix/bug-name`
- Example: `feat/student-profile`, `fix/login-error`

## Workflow Step-by-Step
1. **Pull Latest Changes**:
   ```bash
   git checkout main
   git pull origin main
   ```
2. **Create New Branch**:
   ```bash
   git checkout -b feat/my-new-feature
   ```
3. **Write Code & Commit**:
   ```bash
   git add .
   git commit -m "feat: added new dashboard widgets"
   ```
4. **Push to Remote**:
   ```bash
   git push origin feat/my-new-feature
   ```
5. **Create Merge Request (Pull Request)**:
   - Go to GitHub/GitLab.
   - Create a PR from `feat/my-new-feature` to `main`.
   - Request review from teammates.

## Commit Message Convention
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Formatting (no code change)
- `refactor:` Code restructuring
