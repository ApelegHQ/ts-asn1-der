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

import { Asn1Base } from './Asn1Base.js';
import { ASN1_CLASS_UNIVERSAL_ } from './Asn1ClassType.js';
import type { IAsn1Data } from './IAsn1Data.js';

export class Asn1Universal extends Asn1Base {
	data_?: IAsn1Data;
	explicit_: boolean;

	constructor(tagNumber: number, data?: IAsn1Data, explicit?: boolean) {
		super(ASN1_CLASS_UNIVERSAL_, !!data?.primitive_, tagNumber);
		this.data_ = data;
		this.explicit_ = !!explicit;
	}
	rawContents_() {
		if (!this.data_) return;

		return this.explicit_
			? this.data_.derEncode()
			: this.data_.rawContents_();
	}
}
