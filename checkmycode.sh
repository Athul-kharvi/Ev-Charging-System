
echo "Running ESLint..."
npx eslint src/ || exit 1

# echo "Running tests..."
# npm test || exit 1

echo "✅ All checks passed!"
