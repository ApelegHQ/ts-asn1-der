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

import sharedBufferToUint8Array from './sharedBufferToUint8Array.js';

const sharedBufferConcat_ = (
	...src: AllowSharedBufferSource[]
): ArrayBufferLike => {
	const result = new Uint8Array(
		src.reduce((acc, cv) => acc + cv.byteLength, 0),
	);
	src.reduce((acc, cv) => {
		const octets = sharedBufferToUint8Array(cv);
		result.set(octets, acc);
		return acc + cv.byteLength;
	}, 0);
	return result.buffer;
};

export default sharedBufferConcat_;
