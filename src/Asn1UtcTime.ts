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

const UtcTimeRegex =
	/^[0-9]{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12][0-9]|3[01])(?:[01][0-9]|2[0-3])(?:[0-5][0-9]){1,2}(?:Z|[+-](?:[01][0-9]|2[0-3])(?:[0-5][0-9]))$/;

export class Asn1UtcTime extends Asn1Primitive {
	constructor(data: string) {
		if (
			typeof data !== 'string' ||
			data.length < 11 ||
			data.length > 17 ||
			!UtcTimeRegex.test(data)
		) {
			throw new TypeError('Invalid date or date format');
		}

		const encoded = new Uint8Array(
			data.split('').map((c) => c.codePointAt(0)!),
		);

		super(ASN1_CLASS_UNIVERSAL_, 23, encoded);
	}
}
