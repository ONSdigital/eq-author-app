async function PasswordStrength(password) {
  const passwords = await fetch("/commonPasswordList.json");
  let found =
    !passwords ||
    (typeof passwords === "array" && passwords.includes(password));
  return found;
}

export default PasswordStrength;
