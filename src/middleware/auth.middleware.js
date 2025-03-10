import {userModel} from "../DB/Models/User.Model.js";
import {asyncHandler} from "../Utilis/error/error.js";
import {verifyToken} from "../Utilis/security/token.js";

export const authentication = asyncHandler(async (req, res, next) => {
  const {authorization} = req.headers;
  const [bearer, token] = authorization ? authorization.split(" ") : [];

  if (!bearer || !token) {
    return next(new Error("Invalid Token Parts", {cause: 400}));
  }

  let signature = "";

  switch (bearer) {
    case "Bearer":
      signature = process.env.TOKEN_SIGNATURE;
      break;

    default:
      break;
  }

  const decoded = verifyToken({token, signature});

  if (!decoded || !decoded.id) {
    // Fixed this line
    return next(new Error("Invalid Token", {cause: 400}));
  }

  const user = await userModel.findById(decoded.id);
  if (!user) {
    return next(new Error("User not Found", {cause: 404}));
  }

  if (
    user.changeTimeCredential &&
    user.changeTimeCredential.getTime() > decoded.iat * 1000
  ) {
    return next(new Error("invalid credentials", {cause: 400}));
  }

  req.user = user; // This will make the user available in the next request
  return next();
});
