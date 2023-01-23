/* HTTPS */
import * as fs from 'fs';

export function getSentryDsn() {
	return '';
}

export function getCredentials() {
	const privateKey = fs.readFileSync('/etc/letsencrypt/live//privkey.pem', 'utf8');
	const certificate = fs.readFileSync('/etc/letsencrypt/live//cert.pem', 'utf8');
	const ca = fs.readFileSync('/etc/letsencrypt/live//chain.pem', 'utf8');

	return {
		key: privateKey,
		cert: certificate,
		ca: ca,
	};
}
