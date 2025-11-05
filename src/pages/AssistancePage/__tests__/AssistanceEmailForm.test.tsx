import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import AssistanceEmailForm from '../assistanceEmailForm';
import '@testing-library/jest-dom';

const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedUsedNavigate,
}));

jest.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (k: string) => k }),
}));

jest.mock('../../../utils/env.ts', () => ({
    getInitiativeId: jest.fn(() => 'prod-123'),
}));

jest.mock('../../../utils/functions.ts', () => ({
    parseJwt: jest.fn(() => ({
        given_name: 'Mario',
        family_name: 'Rossi',
        fiscalNumber: 'RSSMRA80A01H501U',
    })),
}));

jest.mock('../../../utils/validateEmail.ts', () => ({
    isValidEmail: jest.fn((email: string) => /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/.test(email)),
}));

jest.mock('@pagopa/selfcare-common-frontend/lib/utils/storage', () => ({
    storageTokenOps: {
        read: jest.fn(() => 'fake.jwt.token'),
    },
}));

const renderWithRouter = (component: React.ReactElement) => {
    return render(<MemoryRouter>{component}</MemoryRouter>);
};

const mockSupport = jest.fn();
jest.mock('../../../api/onboardingWebApiClient.ts', () => ({
    OnboardingWebApi: {
        support: (...args: any[]) => mockSupport(...args),
    },
}));

beforeEach(() => {
    jest.clearAllMocks();
});

const getEmailField = () => screen.getByLabelText('assistance.emailPlaceholder');
const getConfirmEmailField = () => screen.getByLabelText('assistance.confirmEmailPlaceholder');
const getBackButton = () => screen.getByRole('button', { name: 'commons.back' });
const getNextButton = () => screen.getByRole('button', { name: 'assistance.next' });

describe('AssistanceEmailForm', () => {
    test('il bottone "next" è disabilitato all\'inizio', () => {
        renderWithRouter(<AssistanceEmailForm />);
        expect(getNextButton()).toBeDisabled();
    });


    test('mostra errore email non valida dopo blur', async () => {
        renderWithRouter(<AssistanceEmailForm />);
        const email = getEmailField();

        await userEvent.type(email, 'non-valida');
        fireEvent.blur(email);

        expect(screen.getByText('commons.invalidEmail')).toBeInTheDocument();
    });

    test('mostra errore mismatch tra email e conferma', async () => {
        renderWithRouter(<AssistanceEmailForm />);
        const email = getEmailField();
        const confirm = getConfirmEmailField();

        await userEvent.type(email, 'a@b.com');
        await userEvent.type(confirm, 'c@d.com');
        fireEvent.blur(confirm);

        expect(screen.getByText('commons.emailMismatch')).toBeInTheDocument();
        expect(getNextButton()).toBeDisabled();
    });

    test('abilita "next" con email valide e coincidenti', async () => {
        renderWithRouter(<AssistanceEmailForm />);
        await userEvent.type(getEmailField(), 'a@b.com');
        await userEvent.type(getConfirmEmailField(), 'a@b.com');

        expect(getNextButton()).toBeEnabled();
    });

    test('previene il paste nei campi email', () => {
        renderWithRouter(<AssistanceEmailForm />);
        const email = getEmailField();

        const preventDefaultEmail = jest.fn();
        fireEvent.paste(email, { preventDefault: preventDefaultEmail });
        expect(preventDefaultEmail).not.toHaveBeenCalled();
    });

    test('al click su back chiama navigate(-1)', async () => {
        renderWithRouter(<AssistanceEmailForm />);
        await userEvent.click(getBackButton());
        expect(mockedUsedNavigate).toHaveBeenCalledWith(-1);
    });

    test('invoca l’API con il payload atteso e sottomette il form quando riceve jwt/returnTo', async () => {
        mockSupport.mockResolvedValue({
            status: 200,
            data: { jwt: 'jwt-123', returnTo: 'https://ret.example/ok' },
        });

        const submitSpy = jest.spyOn(HTMLFormElement.prototype, 'submit').mockImplementation(() => {});

        renderWithRouter(<AssistanceEmailForm />);

        await userEvent.type(getEmailField(), 'user@example.com');
        await userEvent.type(getConfirmEmailField(), 'user@example.com');

        await userEvent.click(getNextButton());

        await waitFor(() => {
            expect(mockSupport).toHaveBeenCalledTimes(1);
        });

        const sentPayload = mockSupport.mock.calls[0][0];
        expect(sentPayload).toEqual({
            email: 'user@example.com',
            productId: 'prod-123',
            firstName: 'Mario',
            lastName: 'Rossi',
            fiscalCode: 'RSSMRA80A01H501U',
        });

        await waitFor(() => {
            expect(submitSpy).toHaveBeenCalled();
        });

        const jwtInput = screen.getByDisplayValue('jwt-123') as HTMLInputElement;
        const returnToInput = screen.getByDisplayValue('https://ret.example/ok') as HTMLInputElement;
        expect(jwtInput).toBeInTheDocument();
        expect(returnToInput).toBeInTheDocument();

        submitSpy.mockRestore();
    });

    test('gestisce risposta API non-OK senza crash (no submit)', async () => {
        mockSupport.mockResolvedValue({
            status: 400,
            data: { message: 'bad request' },
        });

        const submitSpy = jest.spyOn(HTMLFormElement.prototype, 'submit').mockImplementation(() => {});

        renderWithRouter(<AssistanceEmailForm />);
        await userEvent.type(getEmailField(), 'user@example.com');
        await userEvent.type(getConfirmEmailField(), 'user@example.com');
        await userEvent.click(getNextButton());

        await waitFor(() => {
            expect(mockSupport).toHaveBeenCalledTimes(1);
        });

        expect(submitSpy).not.toHaveBeenCalled();
        submitSpy.mockRestore();
    });

    test('gestisce eccezioni dell’API senza crash (no submit)', async () => {
        mockSupport.mockRejectedValue(new Error('network error'));

        const submitSpy = jest.spyOn(HTMLFormElement.prototype, 'submit').mockImplementation(() => {});

        renderWithRouter(<AssistanceEmailForm />);
        await userEvent.type(getEmailField(), 'user@example.com');
        await userEvent.type(getConfirmEmailField(), 'user@example.com');
        await userEvent.click(getNextButton());

        await waitFor(() => {
            expect(mockSupport).toHaveBeenCalledTimes(1);
        });

        expect(submitSpy).not.toHaveBeenCalled();
        submitSpy.mockRestore();
    });
});
