import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CustomDrawer } from '../CustomDrawer';
import { OperationDTO } from '../../../api/generated/onboarding-web/OperationDTO';

jest.mock('../../../hooks/useIsMobile', () => ({
    useIsMobile: jest.fn(),
}));

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

jest.mock('../../../utils/formatUtils', () => ({
    formatCurrency: (cents: number) => `${(cents / 100).toFixed(2)} €`,
    formatDateTime: (date: string) => date,
}));

const mockOperation: OperationDTO = {
    operationId: '68de96984833d744ad86c63c',
    operationType: 'TRANSACTION',
    eventId: 'b1bd1122-7cbf-4b41-9734-a43f3e44495f_BARCODE_1759417495001',
    channel: 'BARCODE',
    status: 'AUTHORIZED',
    operationDate: '2025-08-20T15:30:00.000Z',
    amountCents: 30000,
    accruedCents: 9000,
    businessName: 'Esercente di test IdPay',
};

const mockClipboard = {
    writeText: jest.fn(),
};

Object.assign(navigator, {
    clipboard: mockClipboard,
});

describe('CustomDrawer', () => {
    const mockOnClose = jest.fn();
    const mockOnOpen = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        const { useIsMobile } = require('../../../hooks/useIsMobile');
        useIsMobile.mockReturnValue(false);
    });

    describe('Desktop mode (Drawer)', () => {
        test('renders drawer in desktop mode when isMobile is false', () => {
            render(
                <CustomDrawer
                    open={true}
                    onClose={mockOnClose}
                    operation={mockOperation}
                />
            );

            expect(screen.getByText('common.drawerDetail.title')).toBeInTheDocument();
        });

        test('displays all transaction details correctly', () => {
            render(
                <CustomDrawer
                    open={true}
                    onClose={mockOnClose}
                    operation={mockOperation}
                />
            );

            expect(screen.getByText('common.drawerDetail.assetAmount')).toBeInTheDocument();
            expect(screen.getByText('300.00 €')).toBeInTheDocument();

            expect(screen.getByText('common.drawerDetail.appliedDiscount')).toBeInTheDocument();
            expect(screen.getByText('90.00 €')).toBeInTheDocument();

            expect(screen.getByText('common.drawerDetail.merchant')).toBeInTheDocument();
            expect(screen.getByText('Esercente di test IdPay')).toBeInTheDocument();

            expect(screen.getByText('common.drawerDetail.status')).toBeInTheDocument();
            expect(screen.getByText('common.drawerDetail.statusMap.AUTHORIZED')).toBeInTheDocument();

            expect(screen.getByText('common.drawerDetail.date')).toBeInTheDocument();
            expect(screen.getByText(mockOperation.operationDate)).toBeInTheDocument();

            expect(screen.getByText('common.drawerDetail.idTransaction')).toBeInTheDocument();
            expect(screen.getByText(mockOperation.eventId!)).toBeInTheDocument();
        });

        test('close button calls onClose', () => {
            render(
                <CustomDrawer
                    open={true}
                    onClose={mockOnClose}
                    operation={mockOperation}
                />
            );

            const closeButton = screen.getByRole('button', { name: '' });
            fireEvent.click(closeButton);

            expect(mockOnClose).toHaveBeenCalledTimes(1);
        });

        test('does not render content when operation is null', () => {
            render(
                <CustomDrawer
                    open={true}
                    onClose={mockOnClose}
                    operation={null}
                />
            );

            expect(screen.getByText('common.drawerDetail.title')).toBeInTheDocument();
            expect(screen.queryByText('common.drawerDetail.assetAmount')).not.toBeInTheDocument();
        });
    });

    describe('Mobile mode (SwipeableDrawer)', () => {
        beforeEach(() => {
            const { useIsMobile } = require('../../../hooks/useIsMobile');
            useIsMobile.mockReturnValue(true);
        });

        test('renders swipeable drawer in mobile mode when isMobile is true', () => {
            render(
                <CustomDrawer
                    open={true}
                    onClose={mockOnClose}
                    onOpen={mockOnOpen}
                    operation={mockOperation}
                />
            );

            expect(screen.getByText('common.drawerDetail.title')).toBeInTheDocument();
        });

        test('displays all transaction details in mobile mode', () => {
            render(
                <CustomDrawer
                    open={true}
                    onClose={mockOnClose}
                    onOpen={mockOnOpen}
                    operation={mockOperation}
                />
            );

            expect(screen.getByText('Esercente di test IdPay')).toBeInTheDocument();
            expect(screen.getByText('300.00 €')).toBeInTheDocument();
            expect(screen.getByText('90.00 €')).toBeInTheDocument();
        });
    });

    describe('Copy to clipboard functionality', () => {
        test('copy button triggers clipboard write with eventId', async () => {
            render(
                <CustomDrawer
                    open={true}
                    onClose={mockOnClose}
                    operation={mockOperation}
                />
            );

            const copyButton = screen.getByRole('button', { name: /copia/i });
            fireEvent.click(copyButton);

            await waitFor(() => {
                expect(mockClipboard.writeText).toHaveBeenCalledWith(mockOperation.eventId);
            });
        });
    });
});
