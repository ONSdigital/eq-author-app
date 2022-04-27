async function PasswordStrength(password) {
  const response = await fetch("/commonPasswordList.json");
  const passwords = await response.json();
  let found = passwords.includes(password);
  return found;
}

export default PasswordStrength;
