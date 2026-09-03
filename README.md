# pulsecommerce

Monorepo generated with [Koko-cli](https://github.com/BlasVernazza06/koko-cli) powered by [Turborepo](https://turbo.build/repo).

## Project Structure

```text
├── apps/
│   ├── web/        # Frontend application
│   └── api/        # Backend / API service
├── packages/
│   ├── db/                 # Database schema, client & migrations
│   ├── typescript-config/  # Shared TypeScript configuration
│   └── eslint-config/      # Shared ESLint configuration
├── package.json
└── turbo.json
```

## Getting Started

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Run development servers:
   ```bash
   pnpm dev
   ```

3. Build all applications:
   ```bash
   pnpm build
   ```
