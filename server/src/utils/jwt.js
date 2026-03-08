// STEP 1: Import jsonwebtoken + env config.
// STEP 2: Implement signAccessToken(payload).
// STEP 3: Implement verifyAccessToken(token).
// STEP 4: Export both helpers.
import jwt from "jsonwebtoken";
function signAccessToken(_payload) {
  try {
    if (!_payload || typeof _payload !== "object") {
      throw new Error("Invalid payload for JWT");
    }
    const { JWT_SECRET, JWT_EXPIRES_IN } = process.env;
    const token = jwt.sign(_payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    
    return token;

  } catch (err) {
    console.error("[JWT]: error signing token", err);
    throw err;
  }

}

function verifyAccessToken(_token) {
  const { JWT_SECRET } = process.env;
  return jwt.verify(_token, JWT_SECRET);
}

export { signAccessToken, verifyAccessToken };
