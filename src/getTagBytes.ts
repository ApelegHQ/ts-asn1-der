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

import calculateBase128BytesNeeded from './calculateBase128BytesNeeded.js';
import encodeBase128 from './encodeBase128.js';

const ASN1_LONG_LEN = 0x80;
const lengthLen =
	typeof Math.clz32 === 'function'
		? (r: number): number => {
				let l = r >= 0x80 ? 2 : 1;
				while (r > 0xffff_ffff) {
					r = Math.floor(r / 256);
					l++;
				}
				return l + ((31 - Math.clz32(r | 1)) >> 3);
			}
		: (r: number): number => {
				let l = r >= 0x80 ? 2 : 1;
				while (r > 0xffff_ffff) {
					r = Math.floor(r / 256);
					l++;
				}
				while ((r >>>= 8)) {
					l++;
				}
				return l;
			};

const getTagBytes_ = (
	tagClass: number,
	primitive: boolean,
	tag: number,
	dataLength: number,
) => {
	if (tag < 0) throw new RangeError('Invalid negative tag');
	if (dataLength < 0) {
		throw new RangeError('Invalid negative data length');
	}
	if (dataLength > 0x1f_ffff_ffff_ffff) {
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
		head[tagOctetLength + 1] = (dataLength >>> 0o00) & 0xff;
	} else if (dataLength <= 0xffff) {
		head[tagOctetLength] = ASN1_LONG_LEN | 0x02;
		head[tagOctetLength + 1] = (dataLength >>> 0o10) & 0xff;
		head[tagOctetLength + 2] = (dataLength >>> 0o00) & 0xff;
	} else if (dataLength <= 0xff_ffff) {
		head[tagOctetLength] = ASN1_LONG_LEN | 0x03;
		head[tagOctetLength + 1] = (dataLength >>> 0o20) & 0xff;
		head[tagOctetLength + 2] = (dataLength >>> 0o10) & 0xff;
		head[tagOctetLength + 3] = (dataLength >>> 0o00) & 0xff;
	} else if (dataLength <= 0xffff_ffff) {
		head[tagOctetLength] = ASN1_LONG_LEN | 0x04;
		head[tagOctetLength + 1] = (dataLength >>> 0o30) & 0xff;
		head[tagOctetLength + 2] = (dataLength >>> 0o20) & 0xff;
		head[tagOctetLength + 3] = (dataLength >>> 0o10) & 0xff;
		head[tagOctetLength + 4] = (dataLength >>> 0o00) & 0xff;
	} else if (dataLength <= 0xff_ffff_ffff) {
		head[tagOctetLength] = ASN1_LONG_LEN | 0x05;
		head[tagOctetLength + 1] = (dataLength / 0x1_0000_0000) & 0xff;
		head[tagOctetLength + 2] = (dataLength >>> 0o30) & 0xff;
		head[tagOctetLength + 3] = (dataLength >>> 0o20) & 0xff;
		head[tagOctetLength + 4] = (dataLength >>> 0o10) & 0xff;
		head[tagOctetLength + 5] = (dataLength >>> 0o00) & 0xff;
	} else if (dataLength <= 0xffff_ffff_ffff) {
		head[tagOctetLength] = ASN1_LONG_LEN | 0x06;
		head[tagOctetLength + 1] = (dataLength / 0x100_0000_0000) & 0xff;
		head[tagOctetLength + 2] = (dataLength / 0x1_0000_0000) & 0xff;
		head[tagOctetLength + 3] = (dataLength >>> 0o30) & 0xff;
		head[tagOctetLength + 4] = (dataLength >>> 0o20) & 0xff;
		head[tagOctetLength + 5] = (dataLength >>> 0o10) & 0xff;
		head[tagOctetLength + 6] = (dataLength >>> 0o00) & 0xff;
	} else {
		head[tagOctetLength] = ASN1_LONG_LEN | 0x07;
		head[tagOctetLength + 1] = (dataLength / 0x1_0000_0000_0000) & 0xff;
		head[tagOctetLength + 2] = (dataLength / 0x100_0000_0000) & 0xff;
		head[tagOctetLength + 3] = (dataLength / 0x1_0000_0000) & 0xff;
		head[tagOctetLength + 4] = (dataLength >>> 0o30) & 0xff;
		head[tagOctetLength + 5] = (dataLength >>> 0o20) & 0xff;
		head[tagOctetLength + 6] = (dataLength >>> 0o10) & 0xff;
		head[tagOctetLength + 7] = (dataLength >>> 0o00) & 0xff;
	}

	return head;
};

export default getTagBytes_;
