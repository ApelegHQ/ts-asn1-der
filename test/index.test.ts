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

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import * as asn1 from '../src/index.js';

describe('DER Encoding', () => {
	it('ASN.1 Sequence of NULLs', async function () {
		assert.deepEqual(
			new Uint8Array([0x30, 0x02, 0x05, 0x00]).buffer,
			new asn1.Asn1Sequence([new asn1.Asn1Null()]).derEncode(),
		);
		assert.deepEqual(
			new Uint8Array([0x30, 0x04, 0x05, 0x00, 0x05, 0x00]).buffer,
			new asn1.Asn1Sequence([
				new asn1.Asn1Null(),
				new asn1.Asn1Null(),
			]).derEncode(),
		);
	});
	it('ASN.1 Set of NULLs', async function () {
		assert.deepEqual(
			new Uint8Array([0x31, 0x02, 0x05, 0x00]).buffer,
			new asn1.Asn1Set([new asn1.Asn1Null()]).derEncode(),
		);
		assert.deepEqual(
			new Uint8Array([0x31, 0x04, 0x05, 0x00, 0x05, 0x00]).buffer,
			new asn1.Asn1Set([
				new asn1.Asn1Null(),
				new asn1.Asn1Null(),
			]).derEncode(),
		);
	});
	it('ASN.1 Context Sepecific', async function () {
		assert.deepEqual(
			new Uint8Array([
				0xa0, 0x0c, 0x31, 0x0a, 0x03, 0x02, 0x00, 0x00, 0x16, 0x04,
				0x74, 0x65, 0x73, 0x74,
			]).buffer,
			new asn1.Asn1ContextSpecific(
				0,
				new asn1.Asn1Set([
					new asn1.Asn1BitString(new Uint8Array(1), 0),
					new asn1.Asn1IA5String('test'),
				]),
				true,
			).derEncode(),
		);
		assert.deepEqual(
			new Uint8Array([
				0xa0, 0x0a, 0x03, 0x02, 0x00, 0x00, 0x16, 0x04, 0x74, 0x65,
				0x73, 0x74,
			]).buffer,
			new asn1.Asn1ContextSpecific(
				0,
				new asn1.Asn1Set([
					new asn1.Asn1BitString(new Uint8Array(1), 0),
					new asn1.Asn1IA5String('test'),
				]),
				false,
			).derEncode(),
		);
	});
	it('ASN.1 Large Tag Number', async function () {
		assert.deepEqual(
			new Uint8Array([
				0xbf, 0x89, 0x8d, 0x8a, 0x67, 0x0c, 0x31, 0x0a, 0x03, 0x02,
				0x00, 0x00, 0x16, 0x04, 0x74, 0x65, 0x73, 0x74,
			]).buffer,
			new asn1.Asn1ContextSpecific(
				0x1234567,
				new asn1.Asn1Set([
					new asn1.Asn1BitString(new Uint8Array(1), 0),
					new asn1.Asn1IA5String('test'),
				]),
				true,
			).derEncode(),
		);
	});
	it('ASN.1 OIDs', async function () {
		assert.deepEqual(
			new Uint8Array([0x06, 0x02, 0x00, 0x00]).buffer,
			new asn1.Asn1Object('0.0.0').derEncode(),
		);
		assert.deepEqual(
			new Uint8Array([0x06, 0x02, 0x2a, 0x03]).buffer,
			new asn1.Asn1Object('1.2.3').derEncode(),
		);
		assert.deepEqual(
			new Uint8Array([0x06, 0x03, 0x54, 0x05, 0x06]).buffer,
			new asn1.Asn1Object('2.4.5.6').derEncode(),
		);
		assert.deepEqual(
			new Uint8Array([0x06, 0x05, 0x84, 0x18, 0x84, 0xe8, 0x34]).buffer,
			new asn1.Asn1Object('2.456.78900').derEncode(),
		);
	});
});
