import { getInitiative } from '../utils/env';
import common from './it/common';
import bonusDecoder2026Copy from './it/bonusDecoder2026/copy';
import bonusElettrodomestici2025Copy from './it/bonusElettrodomestici2025/copy';
import defaultCopy from './it/default/copy';

const initiativeCopies = {
  bonusdecoder: bonusDecoder2026Copy,
  bonuselettrodomestici: bonusElettrodomestici2025Copy,
  bonustest: bonusElettrodomestici2025Copy,
  bonusvalore: defaultCopy,
} as const;

type InitiativeCopy = keyof typeof initiativeCopies;

const activeInitiative = getInitiative()?.toLocaleLowerCase() as InitiativeCopy;

const initiativeCopy = initiativeCopies[activeInitiative] ?? defaultCopy;

export default {
  common,
  ...initiativeCopy,
};