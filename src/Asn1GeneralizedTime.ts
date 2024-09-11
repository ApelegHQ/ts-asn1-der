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
import { Asn1UtcTime } from './Asn1UtcTime.js';

const GeneralizedTimeRegex =
	/^[0-9]{4}(?:0[1-9]|1[0-2])(?:0[1-9]|[12][0-9]|3[01])(?:[01][0-9]|2[0-3])(?:[0-5][0-9](?:[0-5][0-9](?:\.[0-9]{3})?)?)?(?:|Z|[+-](?:[01][0-9]|2[0-3])(?:[0-5][0-9]))$/;
const GeneralizedTimeCompatibleWithUtcTime =
	/^(?:19[5-9]|20[0-4])[0-9](?:0[1-9]|1[0-2])(?:0[1-9]|[12][0-9]|3[01])(?:[01][0-9]|2[0-3])(?:[0-5][0-9](?:[0-5][0-9](?:\.0{3})?)?)(?:Z|[+-](?:[01][0-9]|2[0-3])(?:[0-5][0-9]))$/;

export class Asn1GeneralizedTime extends Asn1Primitive {
	constructor(data: string, maybeUtcTime?: boolean) {
		if (
			typeof data !== 'string' ||
			data.length < 10 ||
			data.length > 23 ||
			!GeneralizedTimeRegex.test(data)
		) {
			throw new TypeError('Invalid date or date format');
		}

		if (maybeUtcTime && GeneralizedTimeCompatibleWithUtcTime.test(data)) {
			return new Asn1UtcTime(data.slice(2).replace('.000', ''));
		}

		const encoded = new Uint8Array(
			data.split('').map((c) => c.codePointAt(0)!),
		);

		super(ASN1_CLASS_UNIVERSAL_, 24, encoded);
	}
}
