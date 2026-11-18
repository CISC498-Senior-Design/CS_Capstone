import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { google } from "googleapis";
import type { Auth } from "googleapis";
import crypto from "node:crypto";
import "express-session";


//every resuest is given a req.session object. This object needs to have added fields of user etc...
declare module "express-session" {
  interface SessionData {
    oauthState?: string;
    tokens?: Auth.Credentials;
    user?: { name: string; email: string; picture?: string };
  }
}

// scope of api permission requests 
const SCOPES = [
  "openid", 
  "email",
  "profile",
  "https://www.googleapis.com/auth/drive.file", //ie. this lets you modify any file they make ONLY within the app
];

/**
 * To use OAuth2 authentication, we need access to a CLIENT_ID, CLIENT_SECRET, AND REDIRECT_URI
 * from the client_secret.json file. To get these credentials for your application, visit
 * https://console.cloud.google.com/apis/credentials.
 * -taken from the OAuth documentation
 */ 
// ie. this makes the client based on the stuff in the .env
export function makeOAuthClient() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
}

//Like the app=express(); but in the scope of a router. Similiar methods but needs to be attached to the app in the end. 
export const authRouter = Router();

// 1. Send the user to Google's consent screen
authRouter.get("/auth/google", (req, res) => {
    const state = crypto.randomBytes(16).toString("hex"); // CSRF protection
    req.session.oauthState = state;

    const url = makeOAuthClient().generateAuthUrl({
        access_type: "offline", // gives a refresh token so access lasts
        prompt: "consent",
        scope: SCOPES,
        state, //the randomized state
    });
    res.redirect(url); //redirects to google
});

// 2. Google redirects back here with a code
authRouter.get("/auth/google/callback", async (req, res) => {
    const { code, state } = req.query;
    if (typeof code !== "string" || state !== req.session.oauthState) {
        res.status(400).send("Invalid sign-in request");
        return;
    } //checks if random state is the same as the session's state

    const client = makeOAuthClient();
    const { tokens } = await client.getToken(code); //exchange for token

    const ticket = await client.verifyIdToken({
        idToken: tokens.id_token!,
        audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload()!; 

    req.session.tokens = tokens;
    req.session.user = {
        name: payload.name ?? "",
        email: payload.email ?? "",
        picture: payload.picture,
    }; //sets session user info
    delete req.session.oauthState;

    res.redirect("/");
});

// Who's signed in?
authRouter.get("/api/me", (req, res) => {
    if (!req.session.user) {
        res.status(401).json({ error: "Not signed in" });
        return;
    }
    res.json(req.session.user);
});

authRouter.post("/auth/logout", (req, res) => {
    req.session.destroy(() => res.json({ ok: true }));
});

// Middleware: blocks unauthenticated requests and attaches a ready Google client
export function requireGoogle(req: Request, res: Response, next: NextFunction) {
    if (!req.session.tokens) {
        res.status(401).json({ error: "Not signed in" });
        return;
    }
    const client = makeOAuthClient();
    client.setCredentials(req.session.tokens);
    // When Google refreshes an expired access token, save the new one
    client.on("tokens", (newTokens) => {
        req.session.tokens = { ...req.session.tokens, ...newTokens };
    });
    res.locals.google = client;
    next();
}