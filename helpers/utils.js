import crypto from "crypto";
import db from "../models/index.js";

const UsedToken = db.Usedtokens;

export const markTokenUsed = async (token) => {
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const existing = await UsedToken.findOne({ where: { tokenHash } });
    if (existing) return false;

    await UsedToken.create({ tokenHash, usedAt: new Date() });
    return true;
};
