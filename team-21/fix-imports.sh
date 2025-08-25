#!/bin/bash

# Script to fix MongoDB import statements in API routes
echo "Fixing MongoDB imports in API routes..."

# Find all JavaScript files in the api directory
find app/api -name "*.js" -type f | while read file; do
    echo "Processing: $file"
    
    # Replace the imports
    sed -i 's/import { getModels } from.*User.*;/import User from "@\/lib\/models\/User";/g' "$file"
    
    # Replace the connection pattern
    sed -i 's/const connection = await connectDB();/await connectDB();/g' "$file"
    sed -i 's/const { User } = getModels(connection);//g' "$file"
done

echo "MongoDB imports fixed successfully!"
