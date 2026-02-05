import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font, Link } from '@react-pdf/renderer';

// Define styles for a professional "Jake's Resume" style look
const styles = StyleSheet.create({
    page: {
        padding: '30px 40px',
        fontFamily: 'Helvetica',
        fontSize: 10,
        lineHeight: 1.4,
        color: '#333'
    },
    header: {
        marginBottom: 15,
        alignItems: 'center'
    },
    name: {
        fontSize: 22,
        color: '#000',
        textTransform: 'uppercase',
        fontWeight: 'bold',
        marginBottom: 4,
        fontFamily: 'Helvetica-Bold'
    },
    contactInfo: {
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap',
        fontSize: 9,
        color: '#444',
        gap: 8,
        marginTop: 2
    },
    link: {
        color: '#000',
        textDecoration: 'none'
    },
    section: {
        marginBottom: 10,
        width: '100%'
    },
    sectionTitle: {
        fontSize: 11,
        fontWeight: 'bold',
        fontFamily: 'Helvetica-Bold',
        color: '#000',
        textTransform: 'uppercase',
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        marginBottom: 6,
        paddingBottom: 2
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end', // Align baseline
        marginBottom: 2
    },
    // Left side of the row (Company/Title) should take maximum space but not overlap Date
    rowLeft: {
        flexGrow: 1,
        marginRight: 10,
    },
    // Right side (Date/Location) should stay fixed size or wrap if absolutely necessary (but usually distinct)
    rowRight: {
        flexShrink: 0,
        textAlign: 'right',
    },
    bold: {
        fontFamily: 'Helvetica-Bold',
        fontSize: 10,
        color: '#000'
    },
    italic: {
        fontFamily: 'Helvetica-Oblique',
        fontSize: 10,
        color: '#333'
    },
    date: {
        fontSize: 9,
        color: '#000',
        fontFamily: 'Helvetica'
    },
    content: {
        fontSize: 10,
        color: '#333'
    },
    bulletPoint: {
        flexDirection: 'row',
        marginBottom: 2,
        paddingLeft: 8
    },
    bullet: {
        width: 10,
        fontSize: 14,
        lineHeight: 1,
        marginTop: -2
    },
    bulletContent: {
        flex: 1,
        fontSize: 10
    }
});

const ResumeDocument = ({ profile }) => (
    <Document>
        <Page size="A4" style={styles.page}>

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.name}>{profile.firstName} {profile.lastName}</Text>
                <View style={styles.contactInfo}>
                    {profile.phone && <Text>{profile.phone}  •  </Text>}
                    {profile.email && <Text>{profile.email}  •  </Text>}
                    {profile.linkedIn && <Link src={profile.linkedIn} style={styles.link}>LinkedIn</Link>}
                    {profile.github && <Text>  •  <Link src={profile.github} style={styles.link}>GitHub</Link></Text>}
                    {profile.portfolio && <Text>  •  <Link src={profile.portfolio} style={styles.link}>Portfolio</Link></Text>}
                </View>
            </View>

            {/* Education */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Education</Text>

                {/* College */}
                <View style={{ marginBottom: 4 }}>
                    <View style={styles.row}>
                        <Text style={[styles.bold, styles.rowLeft]}>Amrita Vishwa Vidyapeetham</Text>
                        <Text style={[styles.date, styles.rowRight]}>{profile.batch ? `Exp. ${profile.batch}` : 'Present'}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.italic}>{profile.course || 'B.Tech'} in {profile.department}</Text>
                        <Text style={styles.content}>CGPA: {profile.cgpa}</Text>
                    </View>
                </View>

                {/* 12th / Diploma */}
                {profile.twelfthPercentage && (
                    <View>
                        <View style={styles.row}>
                            <Text style={[styles.bold, styles.rowLeft]}>Higher Secondary (Class XII)</Text>
                            <Text style={[styles.content, styles.rowRight]}>{profile.twelfthPercentage}%</Text>
                        </View>
                    </View>
                )}
            </View>

            {/* Skills (Compact) */}
            {profile.skills && profile.skills.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Technical Skills</Text>
                    <Text style={styles.content}>
                        <Text style={styles.bold}>Languages: </Text>
                        {profile.skills.filter(s => s.level === 'Advanced' || s.level === 'Expert').map(s => s.name).join(', ') || 'Java, Python, C++, JavaScript'}
                        {'\n'}
                        <Text style={styles.bold}>Technologies: </Text>
                        {profile.skills.filter(s => s.level !== 'Advanced' && s.level !== 'Expert').map(s => s.name).join(', ') || 'React, Node.js, MongoDB, SQL'}
                    </Text>
                </View>
            )}

            {/* Experience */}
            {profile.internships && profile.internships.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Experience</Text>
                    {profile.internships.map((intern, i) => (
                        <View key={i} style={{ marginBottom: 6 }}>
                            <View style={styles.row}>
                                <Text style={[styles.bold, styles.rowLeft]}>{intern.company || 'Company Name'}</Text>
                                <Text style={[styles.date, styles.rowRight]}>{intern.duration || 'Duration'}</Text>
                            </View>
                            <Text style={[styles.italic, { marginBottom: 2 }]}>{intern.role || 'Software Intern'}</Text>
                            {intern.description && (
                                <View style={styles.bulletPoint}>
                                    <Text style={styles.bullet}>•</Text>
                                    <Text style={styles.bulletContent}>{intern.description}</Text>
                                </View>
                            )}
                        </View>
                    ))}
                </View>
            )}

            {/* Projects */}
            {profile.projects && profile.projects.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Projects</Text>
                    {profile.projects.map((proj, i) => (
                        <View key={i} style={{ marginBottom: 6 }}>
                            <View style={styles.row}>
                                <Text style={[styles.bold, styles.rowLeft]}>{proj.title}</Text>
                                {proj.link ? <Link src={proj.link} style={[styles.link, styles.rowRight]}>View Project ↗</Link> : <Text style={styles.rowRight}> </Text>}
                            </View>
                            {proj.technologies && (
                                <Text style={[styles.italic, { fontSize: 9, marginBottom: 2 }]}>
                                    Tech Stack: {proj.technologies}
                                </Text>
                            )}
                            {proj.description && (
                                <View style={styles.bulletPoint}>
                                    <Text style={styles.bullet}>•</Text>
                                    <Text style={styles.bulletContent}>{proj.description}</Text>
                                </View>
                            )}
                        </View>
                    ))}
                </View>
            )}

            {/* Certifications / Awards */}
            {(profile.certifications?.length > 0 || profile.achievements?.length > 0) && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Certifications & Achievements</Text>
                    {profile.certifications?.map((cert, i) => (
                        <View key={`cert-${i}`} style={styles.bulletPoint}>
                            <Text style={styles.bullet}>•</Text>
                            <Text style={styles.bulletContent}>{cert}</Text>
                        </View>
                    ))}
                    {profile.achievements?.map((ach, i) => (
                        <View key={`ach-${i}`} style={styles.bulletPoint}>
                            <Text style={styles.bullet}>•</Text>
                            <Text style={styles.bulletContent}>{ach}</Text>
                        </View>
                    ))}
                </View>
            )}

        </Page>
    </Document>
);

export default ResumeDocument;
