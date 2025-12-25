import React, { useState } from 'react';
import { Container, Typography, Box, Paper, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const FAQ: React.FC = () => {
    const [expanded, setExpanded] = useState<string | false>('panel1');

    const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
    };

    const faqs = [
        { question: "What is ChargerBNB?", answer: "ChargerBNB is India's first peer-to-peer EV charging marketplace." },
        { question: "How do I book a charging station?", answer: "Search for stations, select your time slot, and complete the booking." },
        { question: "How much does it cost?", answer: "Pricing ranges from ₹15-₹30 per hour depending on charger type." },
        { question: "Can I list my charger?", answer: "Yes! Sign up as a host and start earning." },
        { question: "What charger types are supported?", answer: "Type 2 (AC), CCS2 (DC), and CHAdeMO." }
    ];

    return (
        <Container maxWidth="md" sx={{ py: 8 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h3" gutterBottom sx={{ fontWeight: 700, color: '#2C5F2D', textAlign: 'center' }}>
                    Frequently Asked Questions
                </Typography>

                <Box sx={{ mt: 4 }}>
                    {faqs.map((faq, index) => (
                        <Accordion key={index} expanded={expanded === `panel${index + 1}`} onChange={handleChange(`panel${index + 1}`)} sx={{ mb: 2 }}>
                            <AccordionSummary expandIcon={<ExpandMore />}>
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>{faq.question}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography variant="body1">{faq.answer}</Typography>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </Box>

                <Box sx={{ mt: 4, textAlign: 'center' }}>
                    <Link to="/" style={{ textDecoration: 'none' }}>
                        <Typography variant="body1" sx={{ color: '#2C5F2D', fontWeight: 600 }}>
                            ← Back to Home
                        </Typography>
                    </Link>
                </Box>
            </Paper>
        </Container>
    );
};

export default FAQ;
