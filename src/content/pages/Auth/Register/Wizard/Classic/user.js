export default class User {
  constructor(
    firstName,
    lastName,
    email,
    password,
    phoneNumber,
    documentType,
    documentNumber
  ) {
    this.password = password;
    this.documentNumber = documentNumber;
    this.documentType = documentType;
    this.email = email;
    this.fullName = `${firstName}, ${lastName}`;
    this.password = password;
    this.phoneNumber = phoneNumber === '' ? null : phoneNumber;
  }
}
