#!/bin/bash
echo "🚀 Starting deployment..."

# 1. Build Next.js project
echo "📦 Building Next.js project..."
npm run build || { echo "❌ Build failed"; exit 1; }

# 2. Ensure public assets are in the output
echo "📂 Ensuring assets are present..."
cp -R public/* out/ 2>/dev/null || true
echo "✅ Public assets copied to out/"

# 3. Verification
if [ -f "out/index.html" ]; then
    echo "✅ index.html present in out/"
else
    echo "❌ index.html missing in out/"
    exit 1
fi

# 4. Deploy to Firebase
echo "🔥 Deploying to Firebase..."
firebase deploy --only hosting,functions --force

echo "✨ Deployment complete!"
