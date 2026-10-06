import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import OperationsCard from '../OperationsCard';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k: string) => k }),
}));

describe('OperationsCard', () => {
  const timelineData = [
    {
      id: 'txn-1',
      label: 'Shop Alpha',
      date: '10/10/2025 12:00',
      cents: 300,
    },
    {
      id: 'txn-2',
      label: 'Shop Bravo',
      date: '10/10/2025 13:00',
      cents: 50,
    },
    {
      id: 'onb-1',
      label: 'Onboarding completed',
      date: '01/09/2025 08:00',
    },
  ];

  test('renders title and items', () => {
    const onClick = jest.fn();
    render(<OperationsCard timelineData={timelineData as any} onClick={onClick} />);

    expect(screen.getByText('common.dashboard.operationsSection.title')).toBeInTheDocument();
    expect(screen.getByText('Shop Alpha')).toBeInTheDocument();
    expect(screen.getByText('10/10/2025 12:00')).toBeInTheDocument();
    expect(screen.getByText('Shop Bravo')).toBeInTheDocument();
    expect(screen.getByText('10/10/2025 13:00')).toBeInTheDocument();
    expect(screen.getByText('Onboarding completed')).toBeInTheDocument();
    expect(screen.getByText('01/09/2025 08:00')).toBeInTheDocument();
  });

  test('formats amount with sign, decimal and euro symbol', () => {
    const onClick = jest.fn();
    render(<OperationsCard timelineData={timelineData as any} onClick={onClick} />);

    expect(screen.getByText('-3,00 €')).toBeInTheDocument();

    expect(screen.getByText('-0,50 €')).toBeInTheDocument();
  });

  test('clicking on an amount calls onClick with the operation id', async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    render(<OperationsCard timelineData={timelineData as any} onClick={onClick} />);

    await user.click(screen.getByText('-3,00 €'));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledWith('txn-1');

    await user.click(screen.getByText('-0,50 €'));
    expect(onClick).toHaveBeenCalledTimes(2);
    expect(onClick).toHaveBeenCalledWith('txn-2');
  });

  test('does not render amount (nor call onClick) when cents is undefined', async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    render(<OperationsCard timelineData={timelineData as any} onClick={onClick} />);

    expect(screen.queryByText('+0,00 €')).not.toBeInTheDocument();
    expect(screen.queryByText('-0,00 €')).not.toBeInTheDocument();

    await user.click(screen.getByText('Onboarding completed'));
    expect(onClick).not.toHaveBeenCalled();
  });
});
