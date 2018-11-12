function readFileAsJson(file) {
  if (!(file instanceof Blob)) {
    throw new TypeError("Must be instance of File or Blob");
  }

  return new Promise(function(resolve, reject) {
    const fileReader = new FileReader();

    fileReader.onerror = e => reject(e.target.error);
    fileReader.onload = e => {
      try {
        resolve(JSON.parse(e.target.result));
      } catch (error) {
        reject(error);
      }
    };

    fileReader.readAsText(file);
  });
}

export default readFileAsJson;
