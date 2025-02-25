#!/bin/bash

echo "🚀 Starting Code Check..."

if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
else
    echo "📦 Dependencies are already installed. Skipping installation..."
fi

# Step 2: Run ESLint for code quality
echo "🔍 Running ESLint..."
npx eslint src/ --fix

# Step 3: Check formatting with Prettier
echo "🎨 Checking formatting..."
npx prettier --check "src/**/*.js"

# Step 4: Run tests using Mocha
echo "🧪 Running Tests..."
npm test

# Step 5: Show Test Result Status
if [ $? -eq 0 ]; then
    echo "✅ All tests passed!"
else
    echo "❌ Some tests failed. Check the logs above."
    exit 1
fi
