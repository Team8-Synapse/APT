import { render, screen, fireEvent } from '@testing-library/react';
import CompanyLogo from '../../components/CompanyLogo';

describe('CompanyLogo Component', () => {
    it('renders logo with correct src', () => {
        render(<CompanyLogo name="Google" />);
        const img = screen.getByRole('img');
        expect(img).toHaveAttribute('alt', 'Google logo');
        expect(img).toHaveAttribute('src', expect.stringContaining('google.com')); // Simple check
    });

    it('renders fallback initial on error', () => {
        render(<CompanyLogo name="Google" />);
        const img = screen.getByRole('img');

        // Simulate error
        fireEvent.error(img);

        // Should now show fallback text "G"
        expect(screen.getByText('G')).toBeInTheDocument();
        // Image should be gone
        expect(screen.queryByRole('img')).not.toBeInTheDocument();
    });

    it('applies size classes correctly', () => {
        const { container } = render(<CompanyLogo name="Google" size="lg" />);
        // The container's first child is the wrapper div
        // We can check if the class "w-16" represents 'lg' size as per component definition
        expect(container.firstChild).toHaveClass('w-16 h-16');
    });

    it('renders placeholder if no name provided', () => {
        const { container } = render(<CompanyLogo />);
        expect(container.firstChild).toHaveClass('bg-gray-100');
        expect(screen.queryByRole('img')).not.toBeInTheDocument();
    });
});
