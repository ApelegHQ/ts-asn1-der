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

import calculateBase128BytesNeeded_ from './calculateBase128BytesNeeded.js';

const encodeBase128_ = (value: number) => {
	const bytes = new Uint8Array(calculateBase128BytesNeeded_(value));
	const lastPos = bytes.byteLength - 1;
	let pos = lastPos;
	do {
		let byte = value & 0x7f; // Take the last 7 bits
		value >>>= 7; // Shift right, unsigned
		if (pos !== lastPos) {
			byte |= 0x80; // Set the continuation bit on all but the first byte
		}
		bytes[pos--] = byte; // Insert the byte at the start of the array
	} while (value > 0);
	return bytes;
};

export default encodeBase128_;
