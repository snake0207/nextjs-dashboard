import bcrypt from "bcrypt";

export default async function Page() {
  // throw new Error("Customers error occured - throw");
  const localDbID = "user@gmail.com";
  const hashID = await bcrypt.hash(localDbID, 10);
  const localDbPasswords = "123456";
  const hashPassword = await bcrypt.hash(localDbPasswords, 10);

  return (
    <div>
      <h1>
        ID : {localDbID}, {`"${hashID}"`}
      </h1>
      <h3>
        PWD : {localDbPasswords}, {`"${hashPassword}"`}
      </h3>
    </div>
  );
}
