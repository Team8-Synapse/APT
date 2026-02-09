import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import * as AuthContext from '../../context/AuthContext';
import axios from 'axios';

// Mock dependnecies
vi.mock('axios');
vi.mock('../../context/AuthContext', () => ({
    useAuth: vi.fn()
}));
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => vi.fn(),
        useLocation: () => ({ pathname: '/dashboard' })
    };
});

// Mock NotificationsPanel to avoid deep rendering issues
vi.mock('../../components/NotificationsPanel', () => ({
    default: ({ isOpen }) => isOpen ? <div data-testid="notifications-panel">Notifications Panel</div> : null
}));

describe('Navbar Component', () => {
    const mockLogout = vi.fn();
    const mockUser = {
        email: 'student@amrita.edu',
        role: 'student'
    };

    beforeEach(() => {
        vi.clearAllMocks();
        AuthContext.useAuth.mockReturnValue({
            user: mockUser,
            logout: mockLogout
        });
        axios.get.mockResolvedValue({ data: [] });
    });

    const renderNavbar = () => {
        return render(
            <BrowserRouter>
                <Navbar />
            </BrowserRouter>
        );
    };

    it('renders correctly for student', async () => {
        renderNavbar();

        // Wait for the component to stabilize
        await waitFor(() => {
            expect(screen.getByText(/AMRITA/i)).toBeInTheDocument();
        });

        // Use getAllByText if 'student' appears multiple times (e.g. in role display and somewhere else)
        // Or refine the query. In Navbar, role is displayed as Uppercase in one place.
        // Let's use getByText with exact: false or regex to be safe
        // The role is displayed as: <p className="...">student</p>

        // Debug: screen.debug() if needed
        expect(screen.getByText(/Placement Tracker/i)).toBeInTheDocument();

        // Student links check
        // "Drives" is a link text
        expect(screen.getAllByText('Drives').length).toBeGreaterThan(0);
    });

    it('renders correctly for admin', async () => {
        AuthContext.useAuth.mockReturnValue({
            user: { ...mockUser, role: 'admin' },
            logout: mockLogout
        });

        renderNavbar();

        await waitFor(() => {
            expect(screen.getByText('admin')).toBeInTheDocument();
        });

        // Check admin specific links
        expect(screen.getAllByText('Dashboard').length).toBeGreaterThan(0);
        // Should NOT see 'Prep' which is student only
        expect(screen.queryByText('Prep')).not.toBeInTheDocument();
    });

    it('toggles dark mode', () => {
        renderNavbar();
        const toggleBtn = screen.getByTitle(/Dark Mode/i) || screen.getByTitle(/Light Mode/i);

        // Initial state check (assuming default is whatever localStorage says or false)
        // We can just click and check if class is toggled on document (mocked dom)

        fireEvent.click(toggleBtn);
        expect(document.documentElement.classList.contains('dark')).toBeTruthy();

        fireEvent.click(toggleBtn);
        expect(document.documentElement.classList.contains('dark')).toBeFalsy();
    });

    it('handles logout', () => {
        renderNavbar();
        const logoutBtns = screen.getAllByText(/Logout/i);
        // Desktop logout is likely the first one or visible one
        fireEvent.click(logoutBtns[0]);

        expect(mockLogout).toHaveBeenCalled();
    });

    it('fetches notifications on mount', async () => {
        const mockNotifs = [{ _id: '1', title: 'Test Notif' }];
        axios.get.mockResolvedValueOnce({ data: mockNotifs });

        renderNavbar();

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('/notifications'), expect.any(Object));
        });

        // Check if red dot appears (indicator of notifications)
        // The red dot is a span with bg-red-500
        // It's hard to query by class, but we can check if it exists in the DOM structure
        // Or we can just trust the axios call for now.
    });

    it('opens notifications panel', () => {
        renderNavbar();
        // The bell button
        const bellBtn = screen.getAllByRole('button')[1]; // 0 is dark mode, 1 is bell usually. Better to use aria-label if available.
        // Let's use a more robust query if possible, or just index based on logic
        // The Bell icon is inside a button.

        // We can find the button that contains the Bell icon.
        // Assuming it's the second button in the right section.

        // Let's just click the button that *toggles* it.
        // Since we don't have aria-labels, we rely on structure.
        // The code has: DarkMode, Notifications, Logout.

        // Clicking the notification button
        // We can assume it's the one before the separator

        // Let's rely on the mock panel appearing
        const buttons = screen.getAllByRole('button');
        // Filter for the one that might be the notification button (container of Bell)
        // Since we mocked Lucid icons, they might render as SVGs.

        // Alternative: checking state change via side effect (panel visibility)

        // Just try clicking the 2nd button (index 1) which is usually the bell based on code order
        fireEvent.click(buttons[1]);

        expect(screen.getByTestId('notifications-panel')).toBeInTheDocument();
    });
});
