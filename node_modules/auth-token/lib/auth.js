/*
 * auth
 * https://github.com/parroit/auth
 *
 * Copyright (c) 2014 Andrea Parodi
 * Licensed under the MIT license.
 */

"use strict";

var crypto = require("crypto");

/**
 * This function allows to create a password hash.
 * @param {String} password
 * @return md5 hash of password
 */
function makeHash(password) {
	return crypto
		.createHash("md5")
		.update(password)
		.digest("base64");
}


/**
 * This function verify authenticity of a session token.
 * @param {String} token  the token to verify
 * @param {String} keyPath  path of a public key in PEM format
 * @return true if token authenticity is proved, false otherwise
 */
function verifySessionToken(token, keyPath) {
	var tkParts = token.split(/-/g),

		username = tkParts[0],
		sessionId = tkParts[1],
		creation = tkParts[2],
		expirationMs = tkParts[3],
		sig = tkParts[4];

	var expireOn = parseInt(creation) + parseInt(expirationMs);

	if (expireOn < new Date().getTime()) {
		return false;
	}

	var crypto = require("crypto"),
		fs = require("fs"),

		pem = fs.readFileSync(keyPath),
		key = pem.toString("ascii"),

		sign = crypto.createVerify("RSA-SHA256");



	sign.update(username);
	sign.update(sessionId);
	sign.update(creation);
	sign.update(expirationMs);

	return sign.verify(key, sig, "hex");
}


/**
 * This function allows to create a session token for a user.
 * @param {String} username
 * @param {Number} expirationMinutes   the token expire within this number of minutes
 * @param {String} keyPath   path of a private key in PEM format
 * @param {Number} now   millisecond from epoch to use as creation time. Defaults to actual time. Mainly used for tests
 * @return a new session token
 */
function makeSessionToken(username, expirationMinutes, keyPath, now) {
	var crypto = require("crypto"),
		fs = require("fs"),
		uuid = require("node-uuid"),

		pem = fs.readFileSync(keyPath),
		key = pem.toString("ascii"),

		sign = crypto.createSign("RSA-SHA256"),
		creation = String(now || new Date().getTime()),
		expirationMs = String(expirationMinutes * 60000),

		sessionId = uuid.v4().replace(/-/g, "");

	sign.update(username);
	sign.update(sessionId);
	sign.update(creation);
	sign.update(expirationMs);

	var sig = sign.sign(key, "hex");
	return [username, sessionId, creation, expirationMs, sig].join("-");
}

/**
 * This object manage authorization.
 * @param {Object} storage  an AuthStorage instance to use for persistence
 */
function Auth(storage) {
	this.storage = storage;
}

/**
 * Verify user login credential.
 * On success, promise fullfilled value contains property token
 * which is a valid session token.
 * @param  {String} username username to validate
 * @param  {String} password password to validate, in clear form
 * @return a promise that is fullfilled with {valid:true} on success, or {valid:false} on failure.
 *
 */
Auth.prototype.login = function(username, password) {

};

/**
 * Create a user providing bare information.
 * It store new user after performing of these steps:
 *
 * 1. check that username matches `/^\s+$/`
 * 2. check that email is valid
 * 3. it verify that both username and email are unique
 * 4. create a crypto strong random password, and add it to the user object
 * 5. set user status property to `pending`
 * 6. create a crypto strong random confirmation ticket, and add it to the confirmation property
 * 7. send an email to the user address, including the confirmation
 * @param  {String} username
 * @param  {String} email
 * @return a promise that is fullfilled with {valid:true, confirmation: "the confirmation ticket"}
 * on success, or {valid:false,cause:"the error"} on failure.
 */
Auth.prototype.createUser = function(username, email) {

};


/**
 * Confirm a user creation.
 * It store modified user on storage after performing of these steps:
 *
 * 1. check that user exists with provided username
 * 2. check that user status is `pending`
 * 3. verify that `confirmationTicket` is equal to that saved on user object
 * 4. change user status to `confirmed`
 * 5. delete user confirmation ticket
 *
 * @param  {String} username
 * @param  {String} confirmationTicket confirmation ticket issued by a call to `createUser`
 *
 * @return a promise that is fullfilled with {valid:true, password: "the user pasword"}
 * on success, or {valid:false,cause:"the error"} on failure.
 */
Auth.prototype.confirmUser = function(username, confirmationTicket) {

};



module.exports = {
	makeHash: makeHash,
	makeSessionToken: makeSessionToken,
	verifySessionToken: verifySessionToken,
	Auth: Auth
};