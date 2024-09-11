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

import sharedBufferToUint8Array_ from './lib/sharedBufferToUint8Array.js';
import type { TAsn1ClassType } from './Asn1ClassType.js';
import type { IAsn1Data } from './IAsn1Data.js';
import calculateBase128BytesNeeded from './calculateBase128BytesNeeded.js';
import decodeBase128 from './decodeBase128.js';

export class Asn1AnyRaw implements IAsn1Data {
	class_: TAsn1ClassType;
	primitive_: boolean;
	tag_: number;
	data_: Uint8Array;
	dataStart_: number;

	constructor(data: AllowSharedBufferSource) {
		const buffer = sharedBufferToUint8Array_(data);
		this.class_ = ((buffer[0] & 0xc0) >>>
			6) as unknown as typeof this.class_;
		this.primitive_ = !!(~buffer[0] & 0x20);
		const tag =
			(buffer[0] & 0x1f) === 0x1f
				? buffer[0] & 0x1f
				: decodeBase128(buffer.subarray(1));
		this.tag_ = tag;
		const tagOctetLength =
			tag < 0x1f ? 1 : 1 + calculateBase128BytesNeeded(tag);
		const lenLength =
			buffer[tagOctetLength] < 0x80
				? 1
				: 1 + (buffer[tagOctetLength] & 0x0f);
		this.data_ = buffer;
		this.dataStart_ = tagOctetLength + lenLength;
	}

	rawContents_(): AllowSharedBufferSource | null | undefined {
		return this.data_.subarray(this.dataStart_);
	}

	derEncode() {
		return this.data_;
	}
}
