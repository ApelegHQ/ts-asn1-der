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

/* eslint-disable @typescript-eslint/naming-convention */
export const ASN1_CLASS_UNIVERSAL_ = 0;
export const ASN1_CLASS_APPLICATION_ = 1;
export const ASN1_CLASS_CONTEXT_SPECIFIC_ = 2;
export const ASN1_CLASS_PRIVATE_ = 3;
/* eslint-enable @typescript-eslint/naming-convention */

export type TAsn1ClassType =
	| typeof ASN1_CLASS_UNIVERSAL_
	| typeof ASN1_CLASS_APPLICATION_
	| typeof ASN1_CLASS_CONTEXT_SPECIFIC_
	| typeof ASN1_CLASS_PRIVATE_;
