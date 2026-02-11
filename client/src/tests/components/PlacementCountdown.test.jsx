import { render, screen, act } from '@testing-library/react';
import { vi } from 'vitest';
import PlacementCountdown from '../../components/PlacementCountdown';

describe('PlacementCountdown Component', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('renders countdown elements', () => {
        render(<PlacementCountdown />);
        expect(screen.getByText('Next Major Drive')).toBeInTheDocument();
        expect(screen.getByText('Days')).toBeInTheDocument();
        expect(screen.getByText('Hours')).toBeInTheDocument();
        expect(screen.getByText('Mins')).toBeInTheDocument();
        expect(screen.getByText('Secs')).toBeInTheDocument();
    });

    it('calculates time difference correctly', () => {
        // Mock current time to be 1 day and 1 second BEFORE the target
        // Target: 2026-03-15T09:00:00
        // Mock:   2026-03-14T08:59:59
        const mockNow = new Date('2026-03-14T08:59:59');
        vi.setSystemTime(mockNow);

        render(<PlacementCountdown />);

        // Initially shows 0s because useEffect hasn't run the interval callback yet
        // Advance by 1 second to trigger first update
        act(() => {
            vi.advanceTimersByTime(1000);
        });

        // Now time is 09:00:00. Diff is exactly 24 hours (1 day).
        expect(screen.getByText('01')).toBeInTheDocument(); // Days
        expect(screen.getAllByText('00').length).toBeGreaterThan(0); // Hours/Mins/Secs

        // Advance time by 1 more second
        act(() => {
            vi.advanceTimersByTime(1000);
        });

        // Now time is 09:00:01. Diff is 23h 59m 59s.
        expect(screen.getByText('23')).toBeInTheDocument(); // Hours
        expect(screen.getAllByText('59').length).toBeGreaterThanOrEqual(2); // Mins and Secs
    });
});
