import { render, screen } from '@testing-library/react';
import SkillProgress from '../../components/SkillProgress';

describe('SkillProgress Component', () => {
    it('renders default skills when no props provided', () => {
        render(<SkillProgress />);
        expect(screen.getByText('Data Structures')).toBeInTheDocument();
        expect(screen.getByText('85%')).toBeInTheDocument();
    });

    it('renders provided skills correctly', () => {
        const customSkills = [
            { name: 'Python', level: 95 },
            { name: 'Django', level: 60 }
        ];
        render(<SkillProgress skills={customSkills} />);

        expect(screen.getByText('Python')).toBeInTheDocument();
        expect(screen.getByText('95%')).toBeInTheDocument();
        expect(screen.getByText('Django')).toBeInTheDocument();
        expect(screen.getByText('60%')).toBeInTheDocument();

        // Ensure default skills are NOT present
        expect(screen.queryByText('Data Structures')).not.toBeInTheDocument();
    });

    it('limits display to 5 skills', () => {
        const manySkills = [
            { name: '1', level: 10 }, { name: '2', level: 10 },
            { name: '3', level: 10 }, { name: '4', level: 10 },
            { name: '5', level: 10 }, { name: '6', level: 10 }
        ];
        render(<SkillProgress skills={manySkills} />);

        expect(screen.getByText('1')).toBeInTheDocument();
        expect(screen.getByText('5')).toBeInTheDocument();
        expect(screen.queryByText('6')).not.toBeInTheDocument();
    });
});
