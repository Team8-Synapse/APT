const mongoose = require('./services/mockMongoose');
const Announcement = require('./models/Announcement');

const seedAnnouncements = async () => {
    try {
        // Clear existing announcements
        await Announcement.deleteMany({});

        // Create sample announcements
        const announcements = [
            {
                content: '🎉 Google hiring for SDE positions - Apply by March 15',
                links: [{ title: 'Apply Here', url: 'https://careers.google.com' }]
            },
            {
                content: '📢 Mock interview sessions starting next week - Register now!',
                links: [{ title: 'Register', url: 'https://example.com/register' }]
            },
            {
                content: '🏆 Amazon offered highest package of ₹50 LPA this season',
                links: []
            },
            {
                content: '📝 Resume building workshop on Friday at 3 PM in Main Auditorium',
                links: [{ title: 'Workshop Details', url: 'https://example.com/workshop' }]
            },
            {
                content: '💼 Microsoft on-campus drive scheduled for March 22 - Eligibility: 7.0 CGPA',
                links: []
            }
        ];

        await Announcement.insertMany(announcements);
        console.log('✅ Announcements seeded successfully!');
        console.log(`Created ${announcements.length} announcements`);
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding announcements:', error);
        process.exit(1);
    }
};

seedAnnouncements();
