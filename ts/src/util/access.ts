import { randomBytes, createCipheriv, createDecipheriv } from "node:crypto";
import checkUUID from "validator/lib/isUUID.js";
import { nowInSecond } from "./fn.js";
import { VALUES } from "../constant/index.js";

const isUUID = checkUUID.default;
const KEY_LENGTH = 32;
const IV_LENGTH = 16;
const ALGORITHM = "aes-256-cbc";
const EXPIRED = 5;

/**
 * How Access Token work?
 * First the encrypt id we need key and iv
 * Step 1: stringify id with a timer like: 5 minutes later
 * step 2: generate random key
 * step 3: generate random iv
 * step 4: encrypt id
 * step 5: return id as token in base64 and iv in hex and key
 * step 6: store key in session
 * step 7: store iv in database to validate later
 * step 8: send iv to email box for the user
 * step 9: send token in header with the response
 *
 * Client side should store token after the user set iv and get response with 2xx the user go to password reset password,
 * after setting the new password resend the iv with the token as in docs with the new password and confirm password,
 *
 * After that the server verify if sent iv is  already verified if true decrypt token else server or user error
 */

//? Create Access Token for some parts and verify the token
export const access = {
    token(id: string) {
        if (isUUID(id, 4) === false)
            throw new Error("Invalid id type (uuid) to create Access Token");

        const encryptData = `${nowInSecond(
            VALUES.TIME.MINUTE * EXPIRED
        )}_${id}`;
        const key = randomBytes(KEY_LENGTH);
        const iv = randomBytes(IV_LENGTH);

        const cipher = createCipheriv(ALGORITHM, key, iv);
        const token =
            cipher.update(encryptData, "utf8", "base64") +
            cipher.final("base64");

        const stringIv = iv.toString("hex");
        const stringKey = key.toString("hex");

        return {
            token,
            iv: stringIv.substring(3),
            key: stringKey.substring(3),
            code: stringKey.substring(0, 3) + stringIv.substring(0, 3),
        };
    },
    verify(token: string, key: string, iv: string, code: string) {
        const encrypted = Buffer.from(token, "base64");

        const codeKey = code.substring(0, 3);
        const codeIv = code.substring(3);

        const bufferKey = Buffer.from(codeKey + key, "hex");
        const bufferIv = Buffer.from(codeIv + iv, "hex");

        if (bufferIv.length !== IV_LENGTH || bufferKey.length !== KEY_LENGTH)
            return { valid: false, id: "" };

        const decipher = createDecipheriv(ALGORITHM, bufferKey, bufferIv);
        const decrypted = Buffer.concat([
            decipher.update(encrypted),
            decipher.final(),
        ]);

        const [expiryTime, id] = decrypted.toString().split("_");
        if (expiryTime === undefined || id === undefined)
            return { valid: false, id: "" };

        const parsedExpiryTime = parseInt(expiryTime);
        if (isNaN(parsedExpiryTime) || parsedExpiryTime < nowInSecond())
            return { valid: false, id: "" };

        return isUUID(id, 4) ? { valid: true, id } : { valid: false, id: "" };
    },
} as const;
