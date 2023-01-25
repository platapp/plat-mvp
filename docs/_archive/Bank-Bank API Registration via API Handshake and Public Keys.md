* Goal is register (in advance, or on the fly for account portability) -- gotta be fast, automated, easy
* If you can't do the API registration on the fly, then you are relying on a data aggregator
* This solves bank-bank, doesn't solve app-bank

## Two kinds of authentication:
1. **Client Auth**: Client authenticates to share their data
2. **API Registration**: Bank or third-party registration to access the API endpoint

This sequence covers the second part of this


## Requirements
1.  FDIC API
	* **Async Database**: Asynchronously (Maintain a database of firms / FDIC # / etc / URL )
	* **Live** - Call the API to verify third-party bank domain name for public certificate comparison
2. Verification `/verify` API endpoint   #DNE


## Sequence of Events
1. Verify bank url is valid (FDIC API or database lookup)
	* If not verified, provide error and stop

2. Begin handshake at /verify endpoint  #DNE 
	1. Target bank verifies Source Bank (verify your caller)
		1. Source bank sends encrypted random `nonce` to verify endpoint with header on response
		2. Target bank decrypts using public key to verify source of the message
	2. Source bank verifies Target Bank (response verify)
		1. Target bank re-encrypts the nonce in payload using private key and sends to source bank
		2. Source bank decrypts and verifies the nonce and the authenticity of the sender

3. Begin classical symmetric key exchange (encrypt using their public key etc etc)

4. Using symmetric key, share api secrets and metadata are shared over secure session

5. Complete API endpoint registration programmatically