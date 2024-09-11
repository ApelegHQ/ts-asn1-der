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
import type { TAsn1ClassType } from './Asn1ClassType.js';
import type { IAsn1Data } from './IAsn1Data.js';
import getTagBytes from './getTagBytes.js';

export abstract class Asn1Base implements IAsn1Data {
	class_: TAsn1ClassType;
	primitive_: boolean;
	tag_: number;
	derEncoded__: AllowSharedBufferSource | undefined;

	constructor(tagClass: TAsn1ClassType, primitive: boolean, tag: number) {
		this.tag_ = tag;
		this.primitive_ = primitive;
		this.class_ = tagClass;
	}

	rawContents_(): AllowSharedBufferSource | null | undefined {
		throw new Error('Method not implemented.');
	}

	derEncode(): AllowSharedBufferSource {
		if (!this.derEncoded__) {
			const innerData = this.rawContents_();

			if (!innerData) {
				return getTagBytes(this.class_, this.primitive_, this.tag_, 0);
			}

			const head = getTagBytes(
				this.class_,
				this.primitive_,
				this.tag_,
				innerData.byteLength,
			);

			this.derEncoded__ = sharedBufferConcat_(head, innerData);
		}

		return this.derEncoded__;
	}
}
