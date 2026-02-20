const fs = require('fs');
const path = require('path');

const map = {
    'text-\\[8px\\]': 'text-xs',
    'text-\\[9px\\]': 'text-xs',
    'text-\\[10px\\]': 'text-sm',
    'text-\\[11px\\]': 'text-sm',
    'text-\\[12px\\]': 'text-base',
    '\\btext-xs\\b': 'text-sm',
    '\\btext-sm\\b': 'text-base',
};

function replaceInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Create a regex that matches any of the keys
    const regex = new RegExp(Object.keys(map).join('|'), 'g');

    let newContent = content.replace(regex, (match) => {
        for (const key in map) {
            if (new RegExp(key).test(match)) {
                return map[key];
            }
        }
        return match;
    });

    if (content !== newContent) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log('Updated ' + filePath);
    }
}

function processDirectory(directory) {
    const files = fs.readdirSync(directory);
    for (const file of files) {
        const fullPath = path.join(directory, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            replaceInFile(fullPath);
        }
    }
}

replaceInFile('/Users/tomaszgt/ECM Digital/ecmdigitalwebsite/src/components/DashboardLayout.tsx');
processDirectory('/Users/tomaszgt/ECM Digital/ecmdigitalwebsite/src/app/dashboard');
