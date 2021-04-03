function saveToFile(content, filename, type = 'text/plain') {
  const blob = new window.Blob([content], { type });
  const url = window.URL.createObjectURL(blob);

  const anchorElem = document.createElement("a");

  anchorElem.href = url;
  anchorElem.download = filename;

  document.body.appendChild(anchorElem);
  anchorElem.click();

  document.body.removeChild(anchorElem);

  setTimeout(() => {
    window.URL.revokeObjectURL(url);
  }, 1000);
}

export default saveToFile;
