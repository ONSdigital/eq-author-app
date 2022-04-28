const passwordStrength = (password) =>
  new Promise((resolve) => {
    fetch("/commonPasswordList.json").then((response) => {
      response.json().then((passwords) => {
        let found = passwords.includes(password);
        resolve(found);
      });
    });
  });

export default passwordStrength;
