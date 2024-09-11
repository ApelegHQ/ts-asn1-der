/* Copyright © 2024 Apeleg Limited. All rights reserved.
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

import { ASN1_CLASS_UNIVERSAL_ } from './Asn1ClassType.js';
import { Asn1Primitive } from './Asn1Primitive.js';

const BigIntBitLen = (x: bigint) => {
	let l = 1;
	if (x < BigInt(0)) x = -x;
	while ((x >>= BigInt(1)) != BigInt(0)) {
		l++;
	}
	return l;
};

const numBitLen = (x: number) => {
	let l = 1;
	if (x < 0) x = -x;
	while ((x >>= 1) != 0) {
		l++;
	}
	return l;
};

function encode2sComplement(
	n: number | bigint | AllowSharedBufferSource,
): AllowSharedBufferSource {
	if (typeof n === 'bigint') {
		const negative = n < BigInt(0);
		const size = Math.ceil(
			BigIntBitLen(negative ? -n : n + BigInt(128)) / 8,
		);
		const bytes = new Uint8Array(size);
		for (let i = size - 1; i >= 0; i--, n >> BigInt(8)) {
			bytes[i] = Number(n & BigInt(0xff));
		}

		return bytes.buffer;
	} else if (typeof n === 'number') {
		const negative = n < 0;
		const size = Math.ceil(numBitLen(negative ? -n : n + 128) / 8);
		const bytes = new Uint8Array(size);
		for (let i = size - 1; i >= 0; i--, n >>= 8) {
			bytes[i] = n & 0xff;
		}

		return bytes.buffer;
	} else {
		// Assume it's already correctly encoded
		return n;
	}
}

export class Asn1Integer extends Asn1Primitive {
	constructor(data: number | bigint | AllowSharedBufferSource) {
		// TODO: Allow real numbers and encode them instead of using a buffer
		super(ASN1_CLASS_UNIVERSAL_, 2, encode2sComplement(data));
	}
}
