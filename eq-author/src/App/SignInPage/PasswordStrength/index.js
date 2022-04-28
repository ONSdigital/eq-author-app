const passwordStrength = (password) =>
  new Promise((resolve) => {
    fetch("/commonPasswordList.json").then((response) => {
      response.json().then((passwords) => {
        password = password.toLowerCase();
        let found = passwords.includes(password);
        resolve(found);
      });
    });
  });

export default passwordStrength;
