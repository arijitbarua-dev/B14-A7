export function validateEmail(email: string): string {
  if (!email.trim()) {
    return "Email is required.";
  }

  if (!email.includes("@")) {
    return 'Email must contain an "@" symbol.';
  }

  return "";
}

export function getPasswordErrors(password: string): string[] {
  const errors: string[] = [];

  if (!password) {
    return ["Password is required."];
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("At least one uppercase letter (A–Z).");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("At least one lowercase letter (a–z).");
  }

  if (!/[0-9]/.test(password)) {
    errors.push("At least one number (0–9).");
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push("At least one special character (e.g. !@#$%).");
  }

  return errors;
}