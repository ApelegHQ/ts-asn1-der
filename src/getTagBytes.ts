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

import calculateBase128BytesNeeded from './calculateBase128BytesNeeded.js';
import encodeBase128 from './encodeBase128.js';

const ASN1_LONG_LEN = 0x80;
const lengthLen = (r: number) =>
	(r >= 0x80 ? 2 : 1) + ((Math.log2(r) | 0) >> 3);

const getTagBytes_ = (
	tagClass: number,
	primitive: boolean,
	tag: number,
	dataLength: number,
) => {
	if (tag < 0) throw new RangeError('Invalid negative tag');
	if (dataLength > 0xffffffff) {
		throw new RangeError('Data too long');
	}

	const tagOctetLength =
		tag < 0x1f ? 1 : 1 + calculateBase128BytesNeeded(tag);
	const headOctetsLength = tagOctetLength + lengthLen(dataLength);
	const head = new Uint8Array(headOctetsLength);
	if (tag < 0x1f) {
		head[0] = tag;
	} else {
		head[0] = 0x1f;
		const encodedTag = encodeBase128(tag);
		head.set(encodedTag, 1);
	}
	head[0] =
		((tagClass & 0x03) << 6) |
		((primitive ? 0 : 1) << 5) |
		(head[0] & 0x1f);

	if (dataLength < 0x80) {
		head[tagOctetLength] = dataLength;
	} else if (dataLength <= 0xff) {
		head[tagOctetLength] = ASN1_LONG_LEN | 0x01;
		head[tagOctetLength + 1] = (dataLength >>> 0) & 0xff;
	} else if (dataLength <= 0xffff) {
		head[tagOctetLength] = ASN1_LONG_LEN | 0x02;
		head[tagOctetLength + 1] = (dataLength >>> 8) & 0xff;
		head[tagOctetLength + 2] = (dataLength >>> 0) & 0xff;
	} else if (dataLength <= 0xffffff) {
		head[tagOctetLength] = ASN1_LONG_LEN | 0x03;
		head[tagOctetLength + 1] = (dataLength >>> 16) & 0xff;
		head[tagOctetLength + 2] = (dataLength >>> 8) & 0xff;
		head[tagOctetLength + 3] = (dataLength >>> 0) & 0xff;
	} else if (dataLength <= 0xffffffff) {
		head[tagOctetLength] = ASN1_LONG_LEN | 0x04;
		head[tagOctetLength + 1] = (dataLength >>> 24) & 0xff;
		head[tagOctetLength + 2] = (dataLength >>> 16) & 0xff;
		head[tagOctetLength + 3] = (dataLength >>> 8) & 0xff;
		head[tagOctetLength + 4] = (dataLength >>> 0) & 0xff;
	}

	return head;
};

export default getTagBytes_;
