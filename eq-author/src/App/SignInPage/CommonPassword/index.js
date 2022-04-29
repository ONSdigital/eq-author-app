const isCommonPassword = (password) =>
  new Promise((resolve) => {
    fetch("/commonPasswordList.json").then((response) => {
      response.json().then((passwords) => {
        let found = passwords.includes(password.toLowerCase());
        resolve(found);
      });
    });
  });

export default isCommonPassword;
