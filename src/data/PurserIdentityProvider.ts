/* eslint-disable class-methods-use-this */

import OrbitDBKeystore from 'orbit-db-keystore';
import localForage from 'localforage';
import { IdentityProvider } from './types';

import PurserIdentity from './PurserIdentity';
import { createAddress } from '../types';

// Ideally, we should use the actual type for the common wallet interface
type PurserWallet = any;
type Options = {};
type ProviderType = 'ethereum';

const PROVIDER_TYPE = 'ethereum';

class PurserIdentityProvider<I extends PurserIdentity>
  implements IdentityProvider<I> {
  _options: Options;

  _localCache: LocalForage;

  _type: ProviderType;

  _keystore: OrbitDBKeystore;

  _purserWallet: PurserWallet;

  constructor(purserWallet: PurserWallet, options: Options = {}) {
    if (!purserWallet.address) {
      throw new Error(
        'Could not create an identity provider, is the wallet unlocked?',
      );
    }

    this._type = PROVIDER_TYPE;
    this._options = options;
    this._purserWallet = purserWallet;
    this._keystore = OrbitDBKeystore.create(`./keystore/${this.walletAddress}`);
    this._localCache = localForage.createInstance({
      // Make sure it uses indexedDB
      driver: localForage.INDEXEDDB,
      name: 'purser-identity-cache',
      storeName: 'purser-identity-cache',
    });
  }

  get type() {
    return this._type;
  }

  get keystore() {
    return this._keystore;
  }

  get walletAddress() {
    return createAddress(this._purserWallet.address);
  }

  async createIdentity() {
    if (!this._purserWallet.address) {
      throw new Error('Could not get wallet address. Is it unlocked?');
    }

    let cachedIdentity: PurserIdentity | undefined;

    try {
      cachedIdentity = await this._localCache.getItem(this.walletAddress);
    } catch (e) {
      cachedIdentity = undefined;
      console.warn(
        `Could not initialize local storage. If we're not in a browser, that's fine.`,
        e,
      );
    }

    if (cachedIdentity) {
      return new PurserIdentity(
        cachedIdentity.id,
        cachedIdentity.publicKey,
        cachedIdentity.signatures.id,
        cachedIdentity.signatures.publicKey,
        cachedIdentity.type,
        this,
      );
    }

    // Always create a key per wallet address. This is stored on indexedDB
    const orbitKey =
      (await this._keystore.getKey(this.walletAddress)) ||
      (await this._keystore.createKey(this.walletAddress));

    // Sign wallet address with the orbit signing key we've created and are going to use
    const idSignature = await this._keystore.sign(orbitKey, this.walletAddress);

    // Get the public key
    const publicKey = this._keystore.getPublic(orbitKey);

    // Sign both the key and the signature created with that key
    const pubKeyIdSignature = await this._purserWallet.signMessage({
      message: publicKey + idSignature,
    });

    const identity = new PurserIdentity(
      this.walletAddress,
      publicKey,
      idSignature,
      pubKeyIdSignature,
      this._type,
      this,
    );
    try {
      await this._localCache.ready();
    } catch (e) {
      console.warn(
        `Could not initialize local storage. If we're not in a browser, that's fine.`,
        e,
      );
      return identity;
    }
    await this._localCache.setItem(this.walletAddress, identity.toJSON());
    return identity;
  }

  async sign(identity: PurserIdentity, data: any): Promise<string> {
    const signingKey = await this._keystore.getKey(identity.id);
    if (!signingKey)
      throw new Error(`Private signing key not found from Keystore`);
    return this._keystore.sign(signingKey, data);
  }

  async verify(
    signature: string,
    publicKey: string,
    data: any,
  ): Promise<boolean> {
    return this._keystore.verify(signature, publicKey, data);
  }

  async close() {
    // Make sure the keystore exists before trying to close it
    if (this._keystore) await this._keystore.close();
  }
}

export default PurserIdentityProvider;
