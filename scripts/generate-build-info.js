#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

try {
    // Get Git Info
    const commitHash = execSync('git rev-parse --short HEAD').toString().trim();
    const commitAuthor = execSync('git log -1 --pretty=format:"%an"').toString().trim();
    const commitBranch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
    const commitMessage = execSync('git log -1 --pretty=format:"%s"').toString().trim();

    const buildInfo = {
        commitHash,
        commitAuthor,
        commitBranch,
        commitMessage,
        buildDate: new Date().toISOString()
    };

    // Determine path currently running from
    const targetPath = path.join(process.cwd(), 'global/build-info.json');
    // Or if you want it in the root:
    // const targetPath = path.join(process.cwd(), 'build-info.json');

    // Create directory if it doesn't exist
    const dir = path.dirname(targetPath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(targetPath, JSON.stringify(buildInfo, null, 2));
    console.log(`Build info generated at: ${targetPath}`);

} catch (error) {
    console.error('Error generating build info:', error);
    // Write a fallback so logic doesn't crash
    const fallbackInfo = {
        commitHash: 'Unknown',
        buildDate: new Date().toISOString()
    };
    // Ensure this path matches the try block target
    // fs.writeFileSync('global/build-info.json', JSON.stringify(fallbackInfo, null, 2));
}
