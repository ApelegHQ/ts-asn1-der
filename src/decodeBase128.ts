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

const decodeBase128_ = (bytes: Readonly<ArrayLike<number>>) => {
	let value = 0;
	let done = false;
	for (let i = 0; i < bytes.length; i++) {
		const byte = bytes[i];
		// Remove the continuation bit and add the 7-bit chunk to value
		value = (value << 7) | (byte & 0x7f); // Shift value left by 7 and add the new 7 bits
		if ((byte & 0x80) === 0) {
			done = true;
			// If the continuation bit is not set, this is the last byte
			break;
		}
	}
	if (!done) {
		throw new RangeError('Out of data too early');
	}
	return value;
};

export default decodeBase128_;
