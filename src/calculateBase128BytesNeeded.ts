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

const calculateBase128BytesNeeded_ = (num: number) => {
	// Start at 6 and not 0 to account for overflow and to ensure that the
	// division below always gives a value equal to or greater than 1.
	// For example, consider the following 'real' bits needed:
	// 0: 6 (initial value) + 1 (real) => 7 / 7 = 1
	// 7: 6 (initial value) + 7 (real) => 13 / 7 = 1
	// 8: 6 (initial value) + 8 (real) => 14 / 7 = 2
	let bitsNeeded = 6;

	do {
		bitsNeeded++;
		num >>>= 1;
	} while (num > 0);

	return (bitsNeeded / 7) >>> 0;
};

export default calculateBase128BytesNeeded_;
