import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createInstance } from 'i18next';
import { I18nextProvider } from 'react-i18next';
import FAQSection from '../FAQSection';
import decoder from '../../../locale/it/bonusDecoder2026/copy';
import appliances from '../../../locale/it/bonusElettrodomestici2025/copy';
import defaultCopy from '../../../locale/it/default/copy';

let mockInitiative = 'bonusdecoder';
jest.mock('../../../utils/env', () => ({
  getBaseUrl: () => 'https://dev.pari.pagopa.it',
  getInitiative: () => mockInitiative,
  getPortalUrl: (path: string) => 'https://dev.pari.pagopa.it/' + mockInitiative + '/utente' + path,
}));

async function renderFaq(copy: { FAQSection: object }) {
  const i18n = Object.assign(createInstance(), {
    reportNamespaces: {
      addUsedNamespaces: () => undefined,
      getUsedNamespaces: () => ['translation'],
    },
  });
  await i18n.init({ lng: 'it', resources: { it: { translation: copy } }, interpolation: { escapeValue: false } });
  return render(<I18nextProvider i18n={i18n}><FAQSection /></I18nextProvider>);
}

beforeEach(() => { mockInitiative = 'bonusdecoder'; });

test.each([
  ['bonusdecoder', decoder, 9, 'bonusdecoder.it'],
  ['bonuselettrodomestici', appliances, 12, 'bonuselettrodomestici.it'],
  ['bonustest', appliances, 12, 'bonuselettrodomestici.it'],
  ['bonusvalore', defaultCopy, 12, 'del bonus'],
])('renders the FAQs and portal for %s', async (initiative, copy, count, label) => {
  mockInitiative = initiative as string;
  await renderFaq(copy as { FAQSection: object });
  expect(screen.getAllByRole('button')).toHaveLength(count as number);
  expect(screen.queryByText(/FAQSection\./)).not.toBeInTheDocument();
  for (const button of screen.getAllByRole('button')) await userEvent.click(button);
  const portal = screen.getByRole('link', { name: label as string, hidden: true });
  expect(portal).toHaveAttribute('href', 'https://dev.pari.pagopa.it/' + initiative + '/utente/');
  expect(screen.getByRole('link', { name: 'in questa lista', hidden: true })).toHaveAttribute('href', 'https://dev.pari.pagopa.it/' + initiative + '/elenco-prodotti');
});

test('decoder uses its own copy and can expand an answer', async () => {
  await renderFaq(decoder);
  expect(screen.queryByText(/Bonus Elettrodomestici|bonuselettrodomestici.it/)).not.toBeInTheDocument();
  expect(screen.queryByRole('link', { name: 'EPREL', hidden: true })).not.toBeInTheDocument();
  await userEvent.click(screen.getByRole('button', { name: decoder.FAQSection.ninthAccordion.title }));
  expect(screen.getByText(decoder.FAQSection.ninthAccordion.description)).toBeVisible();
});

test('appliances retains decree and EPREL links', async () => {
  mockInitiative = 'bonuselettrodomestici';
  await renderFaq(appliances);
  await userEvent.click(screen.getByRole('button', { name: appliances.FAQSection.thirdAccordion.title }));
  await userEvent.click(screen.getByRole('button', { name: appliances.FAQSection.ninthAccordion.title }));
  expect(screen.getByRole('link', { name: 'Decreto interministeriale', hidden: true })).toHaveAttribute('href', expect.stringContaining('mimit.gov.it'));
  for (const link of screen.getAllByRole('link', { name: 'EPREL', hidden: true })) {
    expect(link).toHaveAttribute('href', 'https://eprel.ec.europa.eu/screen/home');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  }
});

test('omits empty entries without exposing translation keys', async () => {
  await renderFaq({ FAQSection: { ...decoder.FAQSection, tenthAccordion: { title: '', description: '' } } });
  expect(screen.getAllByRole('button')).toHaveLength(9);
});
