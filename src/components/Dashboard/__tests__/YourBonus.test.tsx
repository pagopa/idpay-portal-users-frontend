import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

jest.mock('../../../api/onboardingWebApiClient', () => ({
  OnboardingWebApi: {
    getBarCode: jest.fn(),
    getBonusDetail: jest.fn(),
    timeline: jest.fn(),
  },
}));

jest.mock('../../../utils/env', () => ({
  getInitiativeId: () => '68dd003ccce8c534d1da22bc',
  isMockAuthEnabled: () => false,
}));
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));
jest.mock('react-barcode', () => {
  return function MockBarcode() {
    return <div data-testid="barcode-card" data-trx-code="123abc" />;
  };
});

import YourBonus from '../YourBonus';
import { VoucherStatusEnum } from '../../../api/generated/onboarding-web/InitiativeDTO';
import { BonusDetail } from '../../../pages/Dashboard/Dashboard';

const baseProps = {
  bonusData: {
    voucherStatus: VoucherStatusEnum.ACTIVE,
    voucherStartDate: '2025-09-24',
    voucherEndDate: '2025-10-24',
    amountCents: 10000,
  } as BonusDetail,
  timelineData: [],
  trxCode: '',
  fiscalNumber: 'RSSLNZ85T10H501Z',
  showBarcode: false,
  drawerOpen: false,
  selectedTransaction: null,
  onOpenDrawer: jest.fn(),
  onCloseDrawer: jest.fn(),
};

describe('YourBonus', () => {

  test('renders title and description', () => {
    render(<YourBonus {...baseProps} />);
    expect(screen.getByText('common.dashboard.title')).toBeInTheDocument();
    expect(screen.getByText('common.dashboard.description')).toBeInTheDocument();
  });

  test('renders barcode when showBarcode=true and trxCode provided', () => {
    render(<YourBonus {...baseProps} showBarcode trxCode="123abc" />);
    expect(screen.getByTestId('barcode-card')).toHaveAttribute('data-trx-code', '123abc');
  });

  test('renders correct fiscal number', () => {
    render(<YourBonus {...baseProps} />);
    expect(screen.getByText('RSSLNZ85T10H501Z')).toBeInTheDocument();
  });

  test('renders "-" when no fiscal number', () => {
    render(<YourBonus {...baseProps} fiscalNumber="-" />);
    expect(screen.getByText('-')).toBeInTheDocument();
  });
});
