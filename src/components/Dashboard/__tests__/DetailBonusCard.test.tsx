import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DetailBonusCard from '../DetailBonusCard';
import { VoucherStatusEnum } from '../../../api/generated/onboarding-web/InitiativeDTO';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key
  })
}));

jest.mock('../../../utils/formatUtils', () => ({
  formatCurrency: (amountCents: number) => `€${(amountCents / 100).toFixed(2)}`,
  formatDate: (dateString: string) => new Date(dateString).toLocaleDateString('it-IT'),
}));

describe('DetailBonusCard', () => {
  const mockBonusData = {
    voucherStatus: VoucherStatusEnum.ACTIVE,
    voucherStartDate: '2025-09-24',
    voucherEndDate: '2025-10-24',
    amountCents: 10000,
  };

  test('renders bonus details correctly', () => {
    render(
      <DetailBonusCard 
        bonusData={mockBonusData} 
        fiscalNumber="RSSLNZ85T10H501Z" 
      />
    );

    expect(screen.getByText('dashboard.detailBonusSection.bonusDetail')).toBeInTheDocument();
    expect(screen.getByText('€100.00')).toBeInTheDocument();
    expect(screen.getByText('RSSLNZ85T10H501Z')).toBeInTheDocument();
    expect(screen.getByText('dashboard.voucherStatus.ACTIVE')).toBeInTheDocument();
  });

  test('renders default fiscal number when provided as dash', () => {
    render(
      <DetailBonusCard 
        bonusData={mockBonusData} 
        fiscalNumber="-" 
      />
    );

    expect(screen.getByText('-')).toBeInTheDocument();
  });

  test('renders correct status chip for ACTIVE voucher', () => {
    render(
      <DetailBonusCard 
        bonusData={mockBonusData} 
        fiscalNumber="RSSLNZ85T10H501Z" 
      />
    );

    const statusChip = screen.getByText('dashboard.voucherStatus.ACTIVE');
    expect(statusChip).toBeInTheDocument();
  });

  test('renders correct status chip for EXPIRED voucher', () => {
    const expiredBonusData = {
      ...mockBonusData,
      voucherStatus: VoucherStatusEnum.EXPIRED,
    };

    render(
      <DetailBonusCard 
        bonusData={expiredBonusData} 
        fiscalNumber="RSSLNZ85T10H501Z" 
      />
    );

    expect(screen.getByText('dashboard.voucherStatus.EXPIRED')).toBeInTheDocument();
  });

  test('renders correct status chip for USED voucher', () => {
    const usedBonusData = {
      ...mockBonusData,
      voucherStatus: VoucherStatusEnum.USED,
    };

    render(
      <DetailBonusCard 
        bonusData={usedBonusData} 
        fiscalNumber="RSSLNZ85T10H501Z" 
      />
    );

    expect(screen.getByText('dashboard.voucherStatus.USED')).toBeInTheDocument();
  });

  test('renders correct status chip for EXPIRING voucher', () => {
    const expiringBonusData = {
      ...mockBonusData,
      voucherStatus: VoucherStatusEnum.EXPIRING,
    };

    render(
      <DetailBonusCard 
        bonusData={expiringBonusData} 
        fiscalNumber="RSSLNZ85T10H501Z" 
      />
    );

    expect(screen.getByText('dashboard.voucherStatus.EXPIRING')).toBeInTheDocument();
  });

  test('formats different amount values correctly', () => {
    const bonusDataWithDifferentAmount = {
      ...mockBonusData,
      amountCents: 5000,
    };

    render(
      <DetailBonusCard 
        bonusData={bonusDataWithDifferentAmount} 
        fiscalNumber="RSSLNZ85T10H501Z" 
      />
    );

    expect(screen.getByText('€50.00')).toBeInTheDocument();
  });

  test('renders all detail sections', () => {
    render(
      <DetailBonusCard 
        bonusData={mockBonusData} 
        fiscalNumber="RSSLNZ85T10H501Z" 
      />
    );

    expect(screen.getByText('dashboard.detailBonusSection.amount')).toBeInTheDocument();
    expect(screen.getByText('dashboard.detailBonusSection.status')).toBeInTheDocument();
    expect(screen.getByText('dashboard.detailBonusSection.voucherStartDate')).toBeInTheDocument();
    expect(screen.getByText('dashboard.detailBonusSection.voucherEndDate')).toBeInTheDocument();
    expect(screen.getByText('dashboard.detailBonusSection.fiscalNumber')).toBeInTheDocument();
  });
});