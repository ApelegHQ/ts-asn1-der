/* Copyright © 2024 Exact Realty Limited. All rights reserved.
 *
 * Permission to use, copy, modify, and distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
 * REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
 * AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
 * INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
 * LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
 * OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
 * PERFORMANCE OF THIS SOFTWARE.
 */

import sharedBufferConcat_ from './lib/sharedBufferConcat.js';
import { ASN1_CLASS_UNIVERSAL_ } from './Asn1ClassType.js';
import { Asn1Primitive } from './Asn1Primitive.js';
import encodeBase128 from './encodeBase128.js';

type TOidStart = `0` | `1` | `2`;
type TOidNextPrimitive0 = `${bigint}`;
type TOidNextPrimitive1 =
	| `${TOidNextPrimitive0}`
	| `${TOidNextPrimitive0}.${TOidNextPrimitive0}`;
type TOidNextPrimitive2 =
	| `${TOidNextPrimitive1}`
	| `${TOidNextPrimitive1}.${TOidNextPrimitive1}`;
type TOidNextPrimitive3 =
	| `${TOidNextPrimitive2}`
	| `${TOidNextPrimitive2}.${TOidNextPrimitive2}`;
type TOidNextPrimitive4 =
	| `${TOidNextPrimitive3}`
	| `${TOidNextPrimitive3}.${TOidNextPrimitive3}`;
type TOidNextPrimitive5 =
	| `${TOidNextPrimitive4}`
	| `${TOidNextPrimitive4}.${TOidNextPrimitive4}`;

export type TOid = `${TOidStart}.${TOidNextPrimitive5}`;

const oidRegex = /^[012](\.[0-9]+)+$/;

const encodeOid = (oid: string) => {
	if (!oidRegex.test(oid)) {
		throw new Error('Invalid OID');
	}
	const parts = oid.split('.').map((v) => Number(v));

	// Encode the second part, which could be large, using base-128 encoding if necessary
	const output = [encodeBase128(40 * parts[0] + parts[1])];

	// Encode subsequent parts
	for (let i = 2; i < parts.length; i++) {
		output.push(encodeBase128(parts[i]));
	}

	return sharedBufferConcat_(...output);
};

export class Asn1Object extends Asn1Primitive {
	constructor(data: TOid) {
		const encoded = encodeOid(data);
		super(ASN1_CLASS_UNIVERSAL_, 6, encoded);
	}
}
