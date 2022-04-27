function PasswordStrength(password) {
  fetch("/commonPasswordList.json").then((response) => {
    response.json().then((passwords) => {
      let found = passwords.includes(password);
      return found;
    });
  });
}
export default PasswordStrength;
