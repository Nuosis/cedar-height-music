# Vercel Environment Variable Management

This directory contains scripts for managing environment variables in Vercel deployments.

## set-vercel-env.js

A Node.js script that utilizes the Vercel CLI to create new environment variables for the project.

### Prerequisites

1. **Vercel CLI**: Install the Vercel CLI globally
   ```bash
   npm install -g vercel
   ```

2. **Authentication**: Login to Vercel
   ```bash
   vercel login
   ```

3. **Project Setup**: Ensure you're in a Vercel project directory or have linked your project
   ```bash
   vercel link
   ```

### Usage

#### Direct Script Execution
```bash
node scripts/set-vercel-env.js --key <KEY> --value <VALUE> [options]
```

#### Using npm Script
```bash
npm run vercel:env -- --key <KEY> --value <VALUE> [options]
```

### Options

- `--key, -k`: Environment variable key (required)
- `--value, -v`: Environment variable value (required)
- `--environment, -e`: Target environment (development, preview, production)
  - If not specified, sets for all environments
- `--help, -h`: Show help message

### Examples

#### Set API key for all environments
```bash
npm run vercel:env -- --key VITE_API_KEY --value "your-api-key-here"
```

#### Set feature flag for production only
```bash
npm run vercel:env -- --key VITE_FEATURE_FLAG --value "true" --environment production
```

#### Set Brevo API key for all environments
```bash
npm run vercel:env -- --key VITE_BREVO_API_KEY --value "xkeysib-your-brevo-key"
```

#### Set maintenance mode for development
```bash
npm run vercel:env -- --key VITE_UNDER_MAINTENANCE --value "false" --environment development
```

### Environment Types

- **development**: For local development environment
- **preview**: For preview deployments (branch deployments)
- **production**: For production deployment

### Security Notes

- Environment variable values are masked in the output for security
- Values longer than 20 characters are truncated in display
- The script validates that you're authenticated with Vercel before proceeding
- Always use secure values for sensitive data like API keys

### Troubleshooting

#### Vercel CLI not found
```
❌ Vercel CLI is not installed or not available in PATH
Please install it with: npm install -g vercel
```
**Solution**: Install the Vercel CLI globally

#### Not authenticated
```
❌ Not authenticated with Vercel
Please run: vercel login
```
**Solution**: Run `vercel login` and follow the authentication process

#### Project not linked
If you get errors about project not found, ensure your project is linked:
```bash
vercel link
```

### Script Features

- ✅ Validates required arguments
- ✅ Checks Vercel CLI availability
- ✅ Verifies authentication status
- ✅ Supports environment-specific deployment
- ✅ Provides detailed feedback and error messages
- ✅ Verifies environment variable was set successfully
- ✅ Masks sensitive values in output

### Integration with Existing Environment Variables

This script works with the existing environment variables defined in `.env.example`:

- `VITE_API_BASE_URL`: Base URL for live API
- `VITE_DATA_SOURCE`: Data source flag (mock | live)
- `VITE_BREVO_API_KEY`: Brevo email service API key
- `VITE_BREVO_FROM`: Brevo sender email address
- `VITE_UNDER_MAINTENANCE`: Site maintenance flag

### Next Steps After Setting Variables

1. **Redeploy**: Trigger a new deployment to use the updated environment variables
2. **Verify**: Check that the variables are available in your application
3. **Test**: Ensure the application functions correctly with the new values