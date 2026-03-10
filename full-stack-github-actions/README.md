# Full-Stack GitHub Actions Demo

This project demonstrates **Continuous Integration (CI)**, **Continuous Delivery / Deployment (CD)**, **Infrastructure as Code (IaC)**, and **GitHub Insights & Analytics** using GitHub Actions and Docker for a full-stack application (React client + Express server).

## Table of Contents

- [Project Structure](#project-structure)
- [CI Workflow](#ci-workflow)
  - [Trigger](#trigger)
  - [How CI is Triggered in Practice](#how-ci-is-triggered-in-practice)
  - [Jobs](#jobs)
  - [Job Steps](#job-steps)
  - [Why Separate Unit and Feature Tests?](#why-separate-unit-and-feature-tests)
  - [CI Results](#ci-results)
- [CD Workflow](#cd-workflow)
  - [Continuous Delivery vs. Continuous Deployment](#continuous-delivery-vs-continuous-deployment)
  - [Trigger](#trigger-1)
  - [Pipeline Stages](#pipeline-stages)
  - [Stage 1: Build](#stage-1-build)
  - [Stage 2: Deploy](#stage-2-deploy)
  - [Switching Between Delivery and Deployment](#switching-between-delivery-and-deployment)
  - [How CD is Triggered in Practice](#how-cd-is-triggered-in-practice)
- [Infrastructure as Code (IaC)](#infrastructure-as-code-iac)
  - [What is IaC?](#what-is-iac)
  - [IaC Files in This Project](#iac-files-in-this-project)
  - [How It Works](#how-it-works)
  - [Running with Docker Compose](#running-with-docker-compose)
  - [Without IaC vs. With IaC](#without-iac-vs-with-iac)
- [GitHub Insights & Analytics](#github-insights--analytics)
  - [Coverage Workflow](#coverage-workflow)
  - [Where to See Coverage](#where-to-see-coverage)
  - [PR Coverage Comment](#pr-coverage-comment)
  - [Status Badges](#status-badges)
  - [Built-in GitHub Insights](#built-in-github-insights)
- [Running Tests Locally](#running-tests-locally)

## Project Structure

```
full-stack-github-actions/
├── client/                  # React (Vite) frontend
│   ├── __mocks__/           # Jest mocks for testing
│   ├── __tests__/
│   │   ├── auth.test.jsx        # Feature tests
│   │   └── auth.unit.test.jsx   # Unit tests
│   ├── src/
│   └── ...
└── server/                  # Express + Mongoose backend
    ├── __tests__/
    │   ├── auth.test.js         # Feature tests (in-memory MongoDB)
    │   └── auth.unit.test.js    # Unit tests (mocked mongoose)
    ├── app.js               # Express app (exported for testing)
    ├── index.js             # Entry point (starts server)
    └── ...
```

## CI Workflow

The CI workflow is defined in the **repository root** at `.github/workflows/ci.yml` (not inside this folder), because GitHub Actions only recognizes workflows placed in the repository's root `.github/workflows/` directory.

### Trigger

```yaml
on:
  push:
    branches: [main]
    paths:
      - "full-stack-github-actions/**"
  pull_request:
    branches: [main]
    paths:
      - "full-stack-github-actions/**"
```

The workflow is triggered when:

- **`push` to `main`** — When code is pushed (or a PR is merged) to the `main` branch, GitHub automatically runs the CI workflow.
- **`pull_request` targeting `main`** — When a Pull Request is opened, synchronized (new commits pushed to the PR branch), or reopened against `main`, the CI runs and shows results directly on the PR page.

The `paths` filter ensures the workflow **only triggers when files inside `full-stack-github-actions/` are changed**. Modifications to other folders in the repository will not trigger this CI, avoiding unnecessary runs.

### How CI is Triggered in Practice

#### Scenario 1: Direct push to `main`

```bash
# Make changes to files in full-stack-github-actions/
git add .
git commit -m "update signup validation"
git push origin main
```

After the push, go to the GitHub repository page → **Actions** tab. You will see the CI workflow running with 4 parallel jobs.

#### Scenario 2: Pull Request workflow (recommended)

```bash
# Create a feature branch
git checkout -b feature/add-login

# Make changes, commit, and push
git add .
git commit -m "add login endpoint"
git push -u origin feature/add-login
```

Then create a Pull Request on GitHub (base: `main` ← compare: `feature/add-login`). The CI will:

1. Run automatically when the PR is created
2. Show a **status check** at the bottom of the PR page (green checkmark or red X)
3. Re-run every time new commits are pushed to the PR branch
4. Run again when the PR is merged into `main`

This is the typical CI workflow: **code change → PR → automated tests → review → merge**.

#### Scenario 3: No trigger (paths filter)

```bash
# If you only modify files outside full-stack-github-actions/
# e.g., editing full-stack-test/server/index.js
git push origin main
```

The CI will **not** run because the changed files don't match the `paths` filter.

### Jobs

The workflow runs **4 parallel jobs**, each on a fresh `ubuntu-latest` runner with Node.js 20:

| Job                      | Working Directory                  | Command                                       | Description                                                                                           |
| ------------------------ | ---------------------------------- | --------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| **Server Unit Tests**    | `full-stack-github-actions/server` | `npx jest --testPathPattern="unit"`           | Tests signup handler and connectDB with mocked mongoose (no real DB needed)                           |
| **Server Feature Tests** | `full-stack-github-actions/server` | `npx jest --testPathPattern="auth.test.js$"`  | Tests the `/api/auth/signup` endpoint with supertest and an in-memory MongoDB (`@shelf/jest-mongodb`) |
| **Client Unit Tests**    | `full-stack-github-actions/client` | `npx jest --testPathPattern="unit"`           | Tests React component rendering, controlled inputs, and API calls with mocked `apiClient`             |
| **Client Feature Tests** | `full-stack-github-actions/client` | `npx jest --testPathPattern="auth.test.jsx$"` | Tests full user signup flow (type email/password, click signup, verify success/error messages)        |

### Job Steps

Each job follows the same steps:

1. **Checkout** — `actions/checkout@v4` clones the repository
2. **Setup Node.js** — `actions/setup-node@v4` installs Node.js 20, with **cache: 'npm'** so the npm cache is restored and dependencies are not re-downloaded on every run. To achieve **Fast System Building** (as mentioned in Slide 28), we use `cache: "npm"` and `cache-dependency-path` pointing to the relevant `package-lock.json`, so repeated runs are much faster.
3. **Install dependencies** — `npm install` installs packages from `package.json`
4. **Run tests** — Jest runs the targeted test files

Since the 4 jobs are independent, they run **in parallel** on separate runners, reducing total CI time.

### Why Separate Unit and Feature Tests?

- **Unit tests** are fast, use mocks, and have no external dependencies — they verify individual functions/components in isolation.
- **Feature tests** are more realistic — the server feature tests spin up an in-memory MongoDB, and the client feature tests simulate full user interactions.

Separating them into different jobs provides clear feedback on **which category of tests failed**, making debugging faster.

### CI Results

After the workflow runs, you can view results in several places:

- **Actions tab** — Full logs for each job, including which tests passed/failed
- **PR status checks** — Green checkmark (all passed) or red X (something failed) shown on the PR page
- **Commit status** — Each commit on `main` shows a small icon indicating CI pass/fail

If any job fails, the entire workflow is marked as failed, and the PR cannot be merged (if branch protection rules are enabled).

---

## CD Workflow

The CD workflow is defined in `.github/workflows/cd.yml`. It handles **building and deploying** the application after CI passes.

### Continuous Delivery vs. Continuous Deployment

These two terms are often confused. They are **two alternative strategies** — you choose one or the other:

|                        | Continuous Delivery                                                                                             | Continuous Deployment                                                   |
| ---------------------- | --------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| **Definition**         | Every change that passes CI is **ready to deploy**, but requires **manual approval** before going to production | Every change that passes CI is **automatically deployed** to production |
| **Human intervention** | A reviewer must approve before production deploy                                                                | None — fully automatic                                                  |
| **Pipeline**           | CI → Build → **Manual Approval** → Deploy                                                                       | CI → Build → Deploy                                                     |
| **Best for**           | Teams that need compliance review or cautious rollouts                                                          | Teams with comprehensive test coverage and high confidence              |

```
Continuous Delivery:          Continuous Deployment:

  CI passes                     CI passes
      │                             │
      ▼                             ▼
    Build                         Build
      │                             │
      ▼                             │
  ┌────────┐                        ▼
  │ Review │ ← human approval   Deploy to
  │  Gate  │                    Production
  └───┬────┘                   (automatic)
      │ approved
      ▼
  Deploy to
  Production
```

Our `cd.yml` **defaults to Continuous Deployment** (fully automatic). By uncommenting one line (`environment: production`) and configuring a GitHub Environment with required reviewers, it switches to **Continuous Delivery**.

### Trigger

```yaml
on:
  workflow_run:
    workflows: ["CI"]
    types: [completed]
    branches: [main]
```

The CD workflow uses `workflow_run` to trigger **after the CI workflow completes** on the `main` branch. This creates a pipeline: CI → CD. The CD workflow only proceeds if CI succeeded (`if: github.event.workflow_run.conclusion == 'success'`).

### Pipeline Stages

The CD pipeline has 2 sequential stages:

```
CI passes on main
        │
        ▼
  ┌───────────┐
  │   Build    │  Build client (npm run build), upload artifact
  └─────┬─────┘
        │
        ▼
  ┌───────────┐
  │  Deploy    │  Deploy server and client to production
  └───────────┘
```

### Stage 1: Build

```yaml
build:
  if: ${{ github.event.workflow_run.conclusion == 'success' }}
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
    - run: npm install
    - run: npm run build # Vite builds client into dist/
    - uses: actions/upload-artifact@v4 # Save build output for later stages
```

- Only runs if CI succeeded
- Builds the React client with Vite (`npm run build` → `dist/`)
- Uploads the build artifact so downstream jobs can access it

### Stage 2: Deploy

```yaml
deploy:
  needs: build
  # environment: production    ← uncomment for Continuous Delivery
  steps:
    - run: echo "Deploying server to production..."
    - run: echo "Deploying client to production..."
```

- Runs after the build job succeeds
- The deploy steps are placeholders — in a real project, replace with actual deploy commands (e.g., Render deploy hooks, `aws` CLI, `docker push`, etc.)

**Note on Security:** In a real production pipeline, sensitive data (e.g. `SSH_KEY`, `API_TOKEN`, deploy hook URLs) must **never** be hardcoded in the YAML. They should be stored in **GitHub Secrets** (Settings → Secrets and variables → Actions) and accessed in the workflow via `${{ secrets.YOUR_SECRET_NAME }}`. This keeps credentials out of the repository and audit trail.

### Switching Between Delivery and Deployment

The same workflow supports both strategies. The difference is **one line**:

**Continuous Deployment** (default — fully automatic):

```yaml
deploy:
  needs: build
  # environment: production    ← commented out, no approval gate
```

CI passes → Build → Deploy happens automatically. No human intervention.

**Continuous Delivery** (manual approval before deploy):

```yaml
deploy:
  needs: build
  environment: production # ← uncomment this line
```

Then configure the approval gate in GitHub:

1. Go to **Settings → Environments → New environment** → name it `production`
2. Enable **Required reviewers** → add team members
3. Now when the pipeline reaches the deploy job, it **pauses and waits** for a reviewer to click "Approve" in the Actions tab

### How CD is Triggered in Practice

#### The Full Pipeline

```
Developer pushes to main
        │
        ▼
   CI workflow runs (4 test jobs in parallel)
        │
        ├── All pass ──▶ CD workflow triggers automatically
        │                      │
        │                    Build
        │                      │
        │              ┌───────┴────────┐
        │              │  Continuous     │  Continuous
        │              │  Deployment:    │  Delivery:
        │              │  auto deploy    │  wait for approval
        │              │                 │  → reviewer approves
        │              └───────┬────────┘
        │                      │
        │                Deploy to Production ✅
        │
        └── Any fail ──▶ CD does NOT trigger ❌
```

#### Step-by-step

1. Push code to `main` (directly or via merged PR)
2. **CI runs** — 4 test jobs execute in parallel
3. **CI passes** → CD workflow is triggered automatically
4. **Build** — Client is compiled into production-ready static files
5. **Deploy** — Depending on strategy:
   - **Continuous Deployment**: deploy runs immediately
   - **Continuous Delivery**: pipeline pauses, reviewer approves, then deploy runs
6. If CI fails, CD does **not** trigger — production is never touched

---

## Infrastructure as Code (IaC)

### What is IaC?

Infrastructure as Code means **defining your infrastructure (servers, databases, networking) in version-controlled code files** instead of manually setting them up. Benefits:

- **Reproducible** — anyone can spin up the same environment with one command
- **Version-controlled** — infrastructure changes go through the same review process as code
- **Self-documenting** — the files describe exactly what the infrastructure looks like
- **Disposable** — tear down and recreate environments easily

In this project, we use **Docker** as our IaC tool:

| File                 | Purpose                                           |
| -------------------- | ------------------------------------------------- |
| `client/Dockerfile`  | Defines how to build and serve the React frontend |
| `server/Dockerfile`  | Defines how to run the Express API server         |
| `docker-compose.yml` | Defines the entire multi-service infrastructure   |

### IaC Files in This Project

#### `client/Dockerfile` — Multi-stage build

```dockerfile
# Stage 1: Build the React app
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

- **Stage 1** installs dependencies and runs `npm run build` (Vite compiles React into static files in `dist/`)
- **Stage 2** copies those static files into an nginx container that serves them on port 80
- The multi-stage approach keeps the final image small (only nginx + static files, no Node.js or `node_modules`)

#### `client/nginx.conf` — Reverse proxy configuration

```nginx
location / {
    root /usr/share/nginx/html;
    try_files $uri $uri/ /index.html;   # SPA routing support
}

location /api/ {
    proxy_pass http://server:8747;      # Forward API calls to the server container
}
```

- Serves the React SPA on `/`
- Proxies all `/api/*` requests to the Express server container — the client and server communicate through Docker's internal network

#### `server/Dockerfile`

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY . .
EXPOSE 8747
CMD ["node", "index.js"]
```

- Uses `--omit=dev` to skip test dependencies (jest, supertest, etc.) in the production image
- Runs `index.js` which connects to MongoDB and starts the Express server

#### `docker-compose.yml` — The full infrastructure

```yaml
services:
  mongodb:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

  server:
    build: ./server
    ports:
      - "8747:8747"
    environment:
      - DATABASE_URL=mongodb://mongodb:27017/full-stack
      - ORIGIN=http://localhost
    depends_on:
      - mongodb

  client:
    build: ./client
    ports:
      - "80:80"
    depends_on:
      - server

volumes:
  mongo-data:
```

This single file defines **3 services** and their relationships:

| Service   | Image                            | Port  | Role                                                   |
| --------- | -------------------------------- | ----- | ------------------------------------------------------ |
| `mongodb` | `mongo:7`                        | 27017 | Database — data persisted in a named volume            |
| `server`  | Built from `./server/Dockerfile` | 8747  | Express API — connects to `mongodb` via Docker network |
| `client`  | Built from `./client/Dockerfile` | 80    | Nginx serving React SPA — proxies `/api/` to `server`  |

`depends_on` ensures the startup order: mongodb → server → client.

### How It Works

```
┌─────────────────────────────────────────────────┐
│                 Docker Compose                   │
│                                                  │
│   ┌──────────┐    ┌──────────┐    ┌──────────┐  │
│   │  client   │───▶│  server   │───▶│ mongodb  │  │
│   │ (nginx)  │    │ (express) │    │ (mongo)  │  │
│   │ port 80  │    │ port 8747 │    │ port     │  │
│   │          │    │           │    │  27017   │  │
│   └──────────┘    └──────────┘    └──────────┘  │
│                                                  │
│        Docker internal network                   │
└─────────────────────────────────────────────────┘
        │
    port 80
        │
    Browser
```

1. Browser visits `http://localhost` → nginx serves the React SPA
2. React app calls `/api/auth/signup` → nginx proxies to `http://server:8747`
3. Express server receives the request → queries MongoDB at `mongodb://mongodb:27017`
4. All three services communicate over Docker's internal network using service names as hostnames

### Running with Docker Compose

```bash
# Start the full stack (build images + start containers)
docker compose up --build

# Visit http://localhost in your browser

# Stop and remove containers
docker compose down

# Stop and also remove the database volume
docker compose down -v
```

### Without IaC vs. With IaC

|                           | Without IaC (manual setup)                                                                                | With IaC (Docker)                                                                                  |
| ------------------------- | --------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| **Setup steps**           | Install Node.js, install MongoDB, configure ports, set environment variables, start each service manually | `docker compose up --build`                                                                        |
| **"Works on my machine"** | Common — different OS, Node versions, MongoDB versions                                                    | Impossible — everyone runs the same containers                                                     |
| **New team member**       | Read a long setup guide, debug config issues                                                              | Clone repo → `docker compose up` → done                                                            |
| **Clean up**              | Uninstall services, clean data directories                                                                | `docker compose down -v`                                                                           |
| **Recovery**              | Manually uninstall, clean up, and reinstall an old version — error-prone and difficult                    | Simple: `git revert` the config files; CI/CD automatically redeploys the previous known-good image |
| **Production parity**     | Dev and prod environments may differ                                                                      | Same Dockerfiles run locally and in production                                                     |

---

## GitHub Insights & Analytics

GitHub provides built-in insights, and we can extend them with custom workflows. The **Coverage** workflow (`.github/workflows/coverage.yml`) automatically generates test coverage reports on every Pull Request.

### Coverage Workflow

The workflow runs on every PR targeting `main` and has 3 jobs:

```
PR opened / updated
        │
        ▼
  ┌──────────────────┐    ┌──────────────────┐
  │ Server Coverage   │    │ Client Coverage   │    (parallel)
  │ jest --coverage   │    │ jest --coverage   │
  └────────┬─────────┘    └────────┬─────────┘
           │                       │
           └───────────┬───────────┘
                       │
                       ▼
              ┌─────────────────┐
              │ Coverage Report  │  Parse results → comment on PR
              └─────────────────┘
```

1. **Server Coverage** — runs `jest --coverage` on the server, uploads `coverage-summary.json`
2. **Client Coverage** — runs `jest --coverage` on the client, uploads `coverage-summary.json`
3. **Coverage Report** — downloads both summaries, generates a markdown table, and posts it as a **PR comment**

### Where to See Coverage

- **After `git push` (to main)**  
  The Coverage workflow runs automatically. Go to the repo **Actions** tab → select the **Coverage** workflow → open the latest run. The **Server Coverage** and **Client Coverage** jobs show the coverage numbers in their logs (e.g. `% Stmts`, `% Branch`, `% Funcs`, `% Lines`). The "Post Coverage Report" job is skipped on push (it only runs for PRs).

- **On a Pull Request**  
  The same workflow runs, and when it finishes it **posts a comment** on that PR with a coverage table (see below). That comment is the only place in the GitHub UI where coverage is shown in a compact table.

- **GitHub Insights**  
  There is **no** built-in "Coverage" or "Code coverage" page under Insights. Coverage is visible only in the **Actions** run logs and (for PRs) in the **PR comment** from this workflow. To have a dedicated coverage dashboard, you would integrate a service like Codecov or Coveralls.

### PR Coverage Comment

When the workflow runs on a **pull request**, it automatically posts (or updates) a comment on the PR like this:

> **📊 Test Coverage Report**
>
> | Module     | Statements | Branches | Functions | Lines |
> | ---------- | ---------- | -------- | --------- | ----- |
> | **Server** | 95%        | 100%     | 85%       | 95%   |
> | **Client** | 88%        | 75%      | 90%       | 88%   |

This gives reviewers immediate visibility into test coverage **without leaving the PR page**. The comment is updated (not duplicated) on each new push to the PR.

### Status Badges

Add these badges to the top of a README to show workflow status at a glance:

```markdown
![CI](https://github.com/<owner>/<repo>/actions/workflows/ci.yml/badge.svg)
![CD](https://github.com/<owner>/<repo>/actions/workflows/cd.yml/badge.svg)
```

Replace `<owner>/<repo>` with your GitHub username and repository name. These badges show a green "passing" or red "failing" indicator that updates automatically.

### Built-in GitHub Insights

GitHub provides several analytics pages for any repository (no configuration needed):

| Page                 | Location                    | What It Shows                                                                |
| -------------------- | --------------------------- | ---------------------------------------------------------------------------- |
| **Pulse**            | Insights → Pulse            | Activity summary: PRs merged, issues opened/closed, contributors in a period |
| **Contributors**     | Insights → Contributors     | Commits, additions, and deletions per contributor over time                  |
| **Traffic**          | Insights → Traffic          | Page views, unique visitors, popular content, referring sites                |
| **Commits**          | Insights → Commits          | Commit frequency chart over the past year                                    |
| **Code frequency**   | Insights → Code frequency   | Lines added vs. deleted per week                                             |
| **Dependency graph** | Insights → Dependency graph | All npm dependencies and which packages depend on them                       |
| **Network**          | Insights → Network          | Branch and fork topology graph                                               |
| **Actions**          | Actions tab                 | Workflow run history, success/failure rates, run duration per job            |

The **Actions tab** is especially useful for CI/CD analytics — you can see trends in test pass rates, identify flaky tests (tests that sometimes pass and sometimes fail), and track how long each job takes over time.

---

## Running Tests Locally

```bash
# Server tests
cd server
npm install
npm test          # runs all tests
npx jest --testPathPattern="unit"          # unit tests only
npx jest --testPathPattern="auth.test.js$" # feature tests only

# Client tests
cd client
npm install
npm test          # runs all tests
npx jest --testPathPattern="unit"           # unit tests only
npx jest --testPathPattern="auth.test.jsx$" # feature tests only

# Generate coverage report locally
cd server && npx jest --coverage
cd client && npx jest --coverage
```
