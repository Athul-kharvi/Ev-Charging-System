#!/bin/bash
set -e

echo "🚀 Starting Code Check..."

# Step 1: Check and install dependencies if missing
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
else
    echo "📦 Dependencies are already installed. Skipping installation..."
fi

# Step 2: Run ESLint for code quality and auto-fix issues
echo "🔍 Running ESLint..."
npx eslint --fix .

# Step 3: Check formatting with Prettier
echo "🎨 Checking formatting..."
npx prettier --check "src/**/*.js"

# Step 4: Check for code duplication
echo "🔁 Checking for duplicate code..."
npx jscpd --min-lines 3 --min-tokens 25 --threshold 0 --gitignore .

# Step 5: Run security audit
echo "🛡️ Running security audit..."
npm audit

# Step 6: Run tests using Mocha (or your preferred test framework)
echo "🧪 Running Tests..."
npx nyc --all --reporter=html --reporter=text npm test

# Step 7: Check test coverage
echo "📊 Checking test coverage..."
npx nyc check-coverage --functions 100 --branches 100 --lines 100

# Step 8: Show Test Result Status
if [ $? -eq 0 ]; then
    echo "✅ All tests passed!"
else
    echo "❌ Some tests failed. Check the logs above."
    exit 1
fi

echo "✅ Check Complete :)"
