#!/usr/bin/env node

/**
 * Vercel Environment Variable Management Script
 *
 * This script uses the Vercel CLI to set environment variables for the project.
 * It accepts --key and --value parameters to set a new environment variable.
 *
 * Usage:
 *   node scripts/set-vercel-env.js --key VITE_API_KEY --value your-api-key-value
 *   node scripts/set-vercel-env.js --key VITE_FEATURE_FLAG --value true --environment production
 *
 * Options:
 *   --key         The environment variable key (required)
 *   --value       The environment variable value (required)
 *   --environment The target environment (development, preview, production) - defaults to all
 *   --help        Show help information
 */

/* eslint-env node */

import { execSync } from 'child_process';
import { parseArgs } from 'util';
import process from 'process';

/**
 * Parse command line arguments
 */
function parseArguments() {
  try {
    const { values } = parseArgs({
      options: {
        key: {
          type: 'string',
          short: 'k'
        },
        value: {
          type: 'string',
          short: 'v'
        },
        environment: {
          type: 'string',
          short: 'e'
        },
        force: {
          type: 'boolean',
          short: 'f'
        },
        help: {
          type: 'boolean',
          short: 'h'
        }
      },
      allowPositionals: false
    });

    return values;
  } catch (error) {
    console.error('❌ Error parsing arguments:', error.message);
    showHelp();
    process.exit(1);
  }
}

/**
 * Show help information
 */
function showHelp() {
  console.log(`
🔧 Vercel Environment Variable Management Script

Usage:
  node scripts/set-vercel-env.js --key <KEY> --value <VALUE> [options]

Options:
  --key, -k         Environment variable key (required)
  --value, -v       Environment variable value (required)
  --environment, -e Target environment (development, preview, production)
                    If not specified, sets for all environments
  --force, -f       Force overwrite existing environment variables
  --help, -h        Show this help message

Examples:
  # Set API key for all environments
  node scripts/set-vercel-env.js --key VITE_API_KEY --value "your-api-key"
  
  # Set feature flag for production only
  node scripts/set-vercel-env.js --key VITE_FEATURE_FLAG --value "true" --environment production
  
  # Set Brevo API key for all environments
  node scripts/set-vercel-env.js --key VITE_BREVO_API_KEY --value "xkeysib-your-key"

Supported environments:
  - development (for local development)
  - preview (for preview deployments)
  - production (for production deployment)
`);
}

/**
 * Validate required arguments
 */
function validateArguments(args) {
  const errors = [];

  if (!args.key) {
    errors.push('--key is required');
  }

  if (!args.value) {
    errors.push('--value is required');
  }

  if (args.environment && !['development', 'preview', 'production'].includes(args.environment)) {
    errors.push('--environment must be one of: development, preview, production');
  }

  if (errors.length > 0) {
    console.error('❌ Validation errors:');
    errors.forEach(error => console.error(`  - ${error}`));
    console.log('\nUse --help for usage information.');
    process.exit(1);
  }
}

/**
 * Check if Vercel CLI is installed
 */
function checkVercelCLI() {
  try {
    execSync('vercel --version', { stdio: 'pipe' });
    console.log('✅ Vercel CLI is available');
  } catch {
    console.error('❌ Vercel CLI is not installed or not available in PATH');
    console.error('Please install it with: npm install -g vercel');
    process.exit(1);
  }
}

/**
 * Check if user is logged in to Vercel
 */
function checkVercelAuth() {
  try {
    execSync('vercel whoami', { stdio: 'pipe' });
    console.log('✅ Authenticated with Vercel');
  } catch {
    console.error('❌ Not authenticated with Vercel');
    console.error('Please run: vercel login');
    process.exit(1);
  }
}

/**
 * Check if environment variable already exists
 */
function checkExistingVariable(key, environment) {
  try {
    const result = execSync('vercel env ls', {
      stdio: 'pipe',
      encoding: 'utf8'
    });

    // Parse the output to check if the variable exists for the target environment
    const lines = result.split('\n');
    
    for (const line of lines) {
      if (line.includes(key)) {
        if (!environment || line.includes(environment)) {
          return true;
        }
      }
    }
    
    return false;
  } catch {
    // If we can't check, assume it doesn't exist
    return false;
  }
}

/**
 * Prompt user for confirmation
 */
function promptForConfirmation(key, environment) {
  const targetDesc = environment ? `${environment} environment` : 'all environments';
  console.log(`⚠️  Environment variable '${key}' already exists for ${targetDesc}`);
  console.log('Do you want to overwrite it? This action cannot be undone.');
  console.log('Type "yes" to confirm or anything else to cancel:');
  
  // In a real interactive scenario, you'd use readline or similar
  // For now, we'll suggest using --force flag
  console.log('💡 To skip this confirmation, use the --force flag');
  return false;
}

/**
 * Set environment variable using Vercel CLI
 */
function setEnvironmentVariable(key, value, environment, force = false) {
  try {
    console.log(`🔄 Setting environment variable: ${key}`);
    
    // Check if variable already exists
    const variableExists = checkExistingVariable(key, environment);
    
    if (!force && variableExists) {
      if (!promptForConfirmation(key, environment)) {
        console.log('❌ Operation cancelled. Use --force to overwrite without confirmation.');
        process.exit(1);
      }
    }
    
    let command = `vercel env add ${key}`;
    
    if (environment) {
      console.log(`📍 Target environment: ${environment}`);
      // Environment is passed as a positional argument, not a flag
      command += ` ${environment}`;
    } else {
      console.log('📍 Target: All environments');
    }

    // Add --force flag if we're forcing or if variable exists
    if (force || variableExists) {
      command += ' --force';
      console.log('🔄 Using --force to overwrite existing variable');
    }

    // Execute the command with the value piped in
    const result = execSync(`echo "${value}" | ${command}`, {
      stdio: ['pipe', 'pipe', 'pipe'],
      encoding: 'utf8'
    });

    console.log('✅ Environment variable set successfully');
    
    if (result.trim()) {
      console.log('📄 Vercel CLI output:', result.trim());
    }

  } catch (error) {
    console.error('❌ Failed to set environment variable');
    console.error('Error:', error.message);
    
    if (error.stdout) {
      console.error('Stdout:', error.stdout.toString());
    }
    
    if (error.stderr) {
      console.error('Stderr:', error.stderr.toString());
    }
    
    process.exit(1);
  }
}

/**
 * Verify the environment variable was set
 */
function verifyEnvironmentVariable(key) {
  try {
    console.log(`🔍 Verifying environment variable: ${key}`);
    const result = execSync('vercel env ls', { 
      stdio: 'pipe',
      encoding: 'utf8'
    });

    if (result.includes(key)) {
      console.log('✅ Environment variable verified in Vercel project');
    } else {
      console.warn('⚠️  Could not verify environment variable in listing');
    }
  } catch (error) {
    console.warn('⚠️  Could not verify environment variable:', error.message);
  }
}

/**
 * Main execution function
 */
function main() {
  console.log('🚀 Vercel Environment Variable Management Script\n');

  const args = parseArguments();

  if (args.help) {
    showHelp();
    process.exit(0);
  }

  validateArguments(args);
  checkVercelCLI();
  checkVercelAuth();

  const { key, value, environment } = args;

  console.log(`📝 Configuration:
  Key: ${key}
  Value: ${value.length > 20 ? value.substring(0, 20) + '...' : value}
  Environment: ${environment || 'all'}
`);

  setEnvironmentVariable(key, value, environment);
  verifyEnvironmentVariable(key);

  console.log('\n🎉 Environment variable management completed successfully!');
  console.log('\n💡 Next steps:');
  console.log('  - Redeploy your application to use the new environment variable');
  console.log('  - Verify the variable is available in your application');
}

// Execute the script
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}