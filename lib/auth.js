import crypto from "crypto";

import User from "@/models/User";
import Session from "@/models/Session";

const SESSION_DURATION =
  7 * 24 * 60 * 60 * 1000;

/*
|--------------------------------------------------------------------------
| Password Hashing
|--------------------------------------------------------------------------
*/

function scryptAsync(password, salt, keyLength = 64) {
  return new Promise((resolve, reject) => {
    crypto.scrypt(
      password,
      salt,
      keyLength,
      {
        N: 16384,
        r: 8,
        p: 1,
      },
      (error, derivedKey) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(derivedKey);
      }
    );
  });
}

export async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");

  const derivedKey = await scryptAsync(
    password,
    salt
  );

  return [
    "scrypt",
    salt,
    derivedKey.toString("hex"),
  ].join("$");
}

export async function verifyPassword(
  password,
  storedPassword
) {
  /*
   * پشتیبانی موقت از رمزهای قدیمی
   *
   * اگر قبل از این تغییر کاربری با رمز ساده
   * داخل MongoDB وجود داشته باشد، Login همچنان
   * کار می‌کند و بعداً Login آن را Hash می‌کند.
   */

  if (
    typeof storedPassword !== "string" ||
    !storedPassword.startsWith("scrypt$")
  ) {
    return storedPassword === password;
  }

  const parts = storedPassword.split("$");

  if (parts.length !== 3) {
    return false;
  }

  const [, salt, storedHash] = parts;

  try {
    const derivedKey = await scryptAsync(
      password,
      salt
    );

    const storedHashBuffer =
      Buffer.from(storedHash, "hex");

    if (
      derivedKey.length !==
      storedHashBuffer.length
    ) {
      return false;
    }

    return crypto.timingSafeEqual(
      derivedKey,
      storedHashBuffer
    );
  } catch (error) {
    console.error(
      "PASSWORD_VERIFY_ERROR:",
      error
    );

    return false;
  }
}

/*
|--------------------------------------------------------------------------
| Session
|--------------------------------------------------------------------------
*/

export function generateSessionToken() {
  return crypto
    .randomBytes(32)
    .toString("hex");
}

export async function createSession(userId) {
  const token = generateSessionToken();

  const expiresAt = new Date(
    Date.now() + SESSION_DURATION
  );

  await Session.create({
    userId,
    sessionToken: token,
    expiresAt,
  });

  return {
    token,
    expiresAt,
  };
}

export async function getUserFromSessionToken(
  token
) {
  if (!token) {
    return null;
  }

  const session =
    await Session.findOne({
      sessionToken: token,
      expiresAt: {
        $gt: new Date(),
      },
    }).populate("userId");

  if (
    !session ||
    !session.userId
  ) {
    return null;
  }

  return {
    user: session.userId,
    session,
  };
}

export async function deleteSession(token) {
  if (!token) {
    return;
  }

  await Session.deleteOne({
    sessionToken: token,
  });
}

export async function deleteUserSessions(
  userId
) {
  await Session.deleteMany({
    userId,
  });
}