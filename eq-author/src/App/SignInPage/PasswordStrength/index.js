import passwords from "./files/filtered8.json";

function PasswordStrength(password) {
  let found = passwords.includes(password);
  return found;
}

export default PasswordStrength;
