const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  if (!content.includes('alert(')) return;

  // Add import if not exists
  if (!content.includes('import toast')) {
    const importStatement = "import toast from 'react-hot-toast';\n";
    // find last import or put at top
    const lastImportIndex = content.lastIndexOf('import ');
    if (lastImportIndex !== -1) {
      const endOfLastImport = content.indexOf('\n', lastImportIndex);
      content = content.slice(0, endOfLastImport + 1) + importStatement + content.slice(endOfLastImport + 1);
    } else {
      content = importStatement + content;
    }
  }

  // Replace alerts with regex
  // Match alert('...') or alert("...") or alert(`...`)
  content = content.replace(/alert\((['"`].*?['"`])\)/g, (match, p1) => {
    // If the message contains success words
    if (p1.includes('نجاح') || p1.includes('تم')) {
      return `toast.success(${p1})`;
    }
    // Otherwise it's an error
    return `toast.error(${p1})`;
  });

  // Match alert('خطأ: ' + ...)
  content = content.replace(/alert\((.*?)\)/g, (match, p1) => {
    if (p1.includes('toast.') || match.includes('toast.error') || match.includes('toast.success')) return match;
    if (p1.includes('نجاح') || p1.includes('تم')) {
      return `toast.success(${p1})`;
    }
    return `toast.error(${p1})`;
  });

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log('Processed:', filePath);
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      processFile(fullPath);
    }
  }
}

walkDir(srcDir);
