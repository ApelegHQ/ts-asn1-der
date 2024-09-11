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

import sharedBufferConcat_ from './lib/sharedBufferConcat.js';
import { ASN1_CLASS_UNIVERSAL_ } from './Asn1ClassType.js';
import { Asn1Primitive } from './Asn1Primitive.js';

export class Asn1BitString extends Asn1Primitive {
	constructor(data: AllowSharedBufferSource, unusedBits: number) {
		const encoded = sharedBufferConcat_(new Uint8Array([unusedBits]), data);
		super(ASN1_CLASS_UNIVERSAL_, 3, encoded);
	}
}
