
export default function (obj, path) {
  const parts = path.split('.');
  const nonLeafLen = parts.length - 1;
  
  for (let i = 0; i < nonLeafLen; i++) {
    obj = obj[parts[i]];
    if (typeof obj !== 'object' || obj === null) { return; }
  }
  
  delete obj[parts[nonLeafLen]];
}
