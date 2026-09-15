import crypto from "crypto";

import User from "@/models/User";
import Session from "@/models/Session";

const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000;

export function generateSessionToken() {
  return crypto.randomBytes(32).toString("hex");
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

export async function getUserFromSessionToken(token) {
  if (!token) {
    return null;
  }

  const session = await Session.findOne({
    sessionToken: token,
    expiresAt: {
      $gt: new Date(),
    },
  }).populate("userId");

  if (!session || !session.userId) {
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

export async function deleteUserSessions(userId) {
  await Session.deleteMany({
    userId,
  });
}