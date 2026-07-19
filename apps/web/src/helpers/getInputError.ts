export default function getInputError(inputType: string, value: string) {
  let errorMessage: string;
  let pattern: RegExp;
  switch (inputType) {
    case "name":
      pattern = /^[a-zA-Z0-9\s]{2,}$/;
      errorMessage =
        "Name should only contain letters, numbers, and spaces, and must be at least 2 characters long.";
      break;
    case "email":
      pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      errorMessage =
        "Invalid email format. Please enter a valid email address e.g example@gmail.com";
      break;
    case "password":
      pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{6,}$/;
      errorMessage =
        "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one symbol with a minimum of 6 characters.";
      break;
    case "c-password":
      pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{6,}$/;
      errorMessage =
        "Passwords do not match. Please re-enter the same password in both fields.";
      break;
    case "bday name":
      pattern = /^(?=.*\w).*$/;
      errorMessage = "Name cannot be empty";
      break;
    default:
      pattern = /^[A-Za-z]+$/;
      errorMessage = "Please enter a name";
  }

  return { isValid: pattern.test(value), errorMessage };
}
