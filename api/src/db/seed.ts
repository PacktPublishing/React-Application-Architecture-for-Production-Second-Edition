import db from "@/db";
import { ideas, reviews, users } from "@/db/schema";
import { hashPassword } from "@/lib/auth";

const testUsers = [
  {
    id: "5bdba81b-e8fe-4ca7-a6b7-1250b6368634",
    email: "test1@mail.com",
    username: "test1",
    password: "password123",
    bio: "Software engineer passionate about building innovative solutions",
  },
  {
    id: "5bdba81b-e8fe-4ca7-a6b7-1250b6368635",
    email: "test2@mail.com",
    username: "test2",
    password: "password123",
    bio: "Product designer with a love for user-centered design",
  },
  {
    id: "5bdba81b-e8fe-4ca7-a6b7-1250b6368636",
    email: "test3@mail.com",
    username: "test3",
    password: "password123",
    bio: "Data scientist exploring the intersection of AI and healthcare",
  },
  {
    id: "5bdba81b-e8fe-4ca7-a6b7-1250b6368637",
    email: "test4@mail.com",
    username: "test4",
    password: "password123",
    bio: "Full-stack developer interested in web technologies",
  },
  {
    id: "5bdba81b-e8fe-4ca7-a6b7-1250b6368638",
    email: "test5@mail.com",
    username: "test5",
    password: "password123",
    bio: "Machine learning researcher focused on computer vision",
  },
  {
    id: "5bdba81b-e8fe-4ca7-a6b7-1250b6368639",
    email: "test6@mail.com",
    username: "test6",
    password: "password123",
    bio: "DevOps engineer specializing in cloud infrastructure and automation",
  },
  {
    id: "5bdba81b-e8fe-4ca7-a6b7-1250b6368640",
    email: "test7@mail.com",
    username: "test7",
    password: "password123",
    bio: "UX researcher passionate about accessibility and inclusive design",
  },
  {
    id: "5bdba81b-e8fe-4ca7-a6b7-1250b6368641",
    email: "test8@mail.com",
    username: "test8",
    password: "password123",
    bio: "Cybersecurity expert focused on threat detection and prevention",
  },
  {
    id: "5bdba81b-e8fe-4ca7-a6b7-1250b6368642",
    email: "test9@mail.com",
    username: "test9",
    password: "password123",
    bio: "Mobile app developer with expertise in React Native and Flutter",
  },
  {
    id: "5bdba81b-e8fe-4ca7-a6b7-1250b6368643",
    email: "test10@mail.com",
    username: "test10",
    password: "password123",
    bio: "Blockchain developer building decentralized applications",
  },
  {
    id: "5bdba81b-e8fe-4ca7-a6b7-1250b6368644",
    email: "test11@mail.com",
    username: "test11",
    password: "password123",
    bio: "Game developer creating immersive virtual worlds",
  },
  {
    id: "5bdba81b-e8fe-4ca7-a6b7-1250b6368645",
    email: "test12@mail.com",
    username: "test12",
    password: "password123",
    bio: "Data engineer building scalable data pipelines and warehouses",
  },
  {
    id: "5bdba81b-e8fe-4ca7-a6b7-1250b6368646",
    email: "test13@mail.com",
    username: "test13",
    password: "password123",
    bio: "Frontend architect designing component libraries and design systems",
  },
  {
    id: "5bdba81b-e8fe-4ca7-a6b7-1250b6368647",
    email: "test14@mail.com",
    username: "test14",
    password: "password123",
    bio: "Backend engineer specializing in microservices and distributed systems",
  },
  {
    id: "5bdba81b-e8fe-4ca7-a6b7-1250b6368648",
    email: "test15@mail.com",
    username: "test15",
    password: "password123",
    bio: "AI ethicist researching responsible AI development and deployment",
  },
  {
    id: "5bdba81b-e8fe-4ca7-a6b7-1250b6368649",
    email: "test16@mail.com",
    username: "test16",
    password: "password123",
    bio: "QA automation engineer ensuring software quality and reliability",
  },
  {
    id: "5bdba81b-e8fe-4ca7-a6b7-1250b6368650",
    email: "test17@mail.com",
    username: "test17",
    password: "password123",
    bio: "Technical writer making complex concepts accessible to all",
  },
  {
    id: "5bdba81b-e8fe-4ca7-a6b7-1250b6368651",
    email: "test18@mail.com",
    username: "test18",
    password: "password123",
    bio: "Product manager bridging the gap between users and developers",
  },
  {
    id: "5bdba81b-e8fe-4ca7-a6b7-1250b6368652",
    email: "test19@mail.com",
    username: "test19",
    password: "password123",
    bio: "Cloud architect designing scalable and resilient infrastructure",
  },
  {
    id: "5bdba81b-e8fe-4ca7-a6b7-1250b6368653",
    email: "test20@mail.com",
    username: "test20",
    password: "password123",
    bio: "Embedded systems engineer working on IoT and edge computing",
  },
  {
    id: "5bdba81b-e8fe-4ca7-a6b7-1250b6368654",
    email: "test21@mail.com",
    username: "test21",
    password: "password123",
    bio: "Database administrator optimizing performance and ensuring data integrity",
  },
  {
    id: "5bdba81b-e8fe-4ca7-a6b7-1250b6368655",
    email: "test22@mail.com",
    username: "test22",
    password: "password123",
    bio: "Site reliability engineer maintaining high-availability systems",
  },
  {
    id: "5bdba81b-e8fe-4ca7-a6b7-1250b6368656",
    email: "test23@mail.com",
    username: "test23",
    password: "password123",
    bio: "AR/VR developer creating immersive experiences and spatial computing",
  },
  {
    id: "5bdba81b-e8fe-4ca7-a6b7-1250b6368657",
    email: "test24@mail.com",
    username: "test24",
    password: "password123",
    bio: "API designer building developer-friendly interfaces and integrations",
  },
  {
    id: "5bdba81b-e8fe-4ca7-a6b7-1250b6368658",
    email: "test25@mail.com",
    username: "test25",
    password: "password123",
    bio: "Open source contributor passionate about community-driven development",
  },
];

const sampleIdeas = [
  {
    title: "AI-Powered Code Review Assistant",
    shortDescription: "Automated tool that provides intelligent code review suggestions",
    description: "An AI assistant that analyzes code commits and provides contextual feedback on code quality, potential bugs, security issues, and best practices. Uses natural language processing to understand code intent and provides human-readable suggestions.",
    tags: ["Machine Learning", "Productivity", "API"],
  },
  {
    title: "Smart Home Energy Optimizer",
    shortDescription: "IoT system to optimize household energy consumption",
    description: "A comprehensive smart home system that learns household patterns and automatically adjusts heating, cooling, and lighting to minimize energy consumption while maintaining comfort. Includes mobile app for monitoring and manual control.",
    tags: ["IoT", "Automation", "Mobile App"],
  },
  {
    title: "Virtual Reality Meditation App",
    shortDescription: "Immersive VR experience for guided meditation and mindfulness",
    description: "A virtual reality application that transports users to peaceful environments for guided meditation sessions. Features customizable environments, breathing exercises, progress tracking, and integration with health monitoring devices.",
    tags: ["AR/VR", "Healthcare", "Mobile App"],
  },
  {
    title: "Blockchain-Based Supply Chain Tracker",
    shortDescription: "Transparent supply chain management using blockchain technology",
    description: "A decentralized platform that tracks products from manufacture to consumer, ensuring authenticity and transparency. Enables consumers to verify product origins, ethical sourcing, and environmental impact through QR code scanning.",
    tags: ["Blockchain", "Security", "Web App"],
  },
  {
    title: "Real-Time Language Translation Tool",
    shortDescription: "Live translation service for video calls and meetings",
    description: "A real-time language translation tool that works during video conferences, providing live subtitles and voice translation. Supports multiple languages and integrates with popular video conferencing platforms.",
    tags: ["Natural Language Processing", "Real-time", "API"],
  },
  {
    title: "Personalized Learning Platform",
    shortDescription: "Adaptive e-learning system that customizes content for each student",
    description: "An intelligent tutoring system that adapts to individual learning styles and pace. Uses machine learning to identify knowledge gaps and provides personalized content recommendations, practice exercises, and progress tracking.",
    tags: ["Education", "Machine Learning", "Web App"],
  },
  {
    title: "Mental Health Chatbot",
    shortDescription: "AI companion for mental health support and wellness tracking",
    description: "A compassionate AI chatbot that provides 24/7 mental health support, mood tracking, and coping strategies. Includes crisis detection, resource recommendations, and integration with professional counseling services.",
    tags: ["Healthcare", "Chatbot", "Natural Language Processing"],
  },
  {
    title: "Sustainable Transportation Planner",
    shortDescription: "App to find the most eco-friendly travel routes",
    description: "A comprehensive transportation planning app that suggests the most sustainable travel options based on carbon footprint, cost, and time. Integrates public transport, bike sharing, electric vehicle charging stations, and carpooling options.",
    tags: ["Mobile App", "Analytics", "Real-time"],
  },
  {
    title: "AR Recipe Assistant",
    shortDescription: "Augmented reality cooking guidance with step-by-step instructions",
    description: "An AR application that overlays cooking instructions directly onto your kitchen workspace. Provides real-time guidance, ingredient recognition, timer management, and nutritional information while you cook.",
    tags: ["AR/VR", "Computer Vision", "Mobile App"],
  },
  {
    title: "Cybersecurity Risk Assessment Tool",
    shortDescription: "Automated security vulnerability scanner for small businesses",
    description: "A comprehensive cybersecurity assessment platform that scans network infrastructure, identifies vulnerabilities, and provides actionable security recommendations. Includes compliance checking and ongoing monitoring capabilities.",
    tags: ["Security", "Analytics", "Automation"],
  },
  {
    title: "Social Impact Marketplace",
    shortDescription: "Platform connecting volunteers with local community organizations",
    description: "A social platform that matches volunteers with local nonprofits and community organizations based on skills, interests, and availability. Features project tracking, impact measurement, and recognition systems.",
    tags: ["Social Media", "Web App", "Analytics"],
  },
  {
    title: "AI-Powered Personal Finance Manager",
    shortDescription: "Intelligent budgeting and investment recommendation system",
    description: "A personal finance application that uses AI to analyze spending patterns, create personalized budgets, and provide investment recommendations. Includes bill tracking, savings goals, and financial education resources.",
    tags: ["Finance", "Machine Learning", "Mobile App"],
  },
  {
    title: "Gaming Performance Analytics",
    shortDescription: "Tool to analyze and improve competitive gaming performance",
    description: "A comprehensive analytics platform for esports players that tracks gameplay metrics, identifies improvement areas, and provides personalized training recommendations. Supports multiple game titles and includes team collaboration features.",
    tags: ["Gaming", "Analytics", "Data Processing"],
  },
  {
    title: "Smart Agriculture Monitoring System",
    shortDescription: "IoT-based crop monitoring and automated irrigation system",
    description: "An intelligent farming system that monitors soil conditions, weather patterns, and crop health using IoT sensors. Automatically adjusts irrigation, fertilization, and pest control while providing farmers with actionable insights through a mobile dashboard.",
    tags: ["IoT", "Automation", "Data Processing"],
  },
  {
    title: "Voice-Controlled Smart Shopping List",
    shortDescription: "AI assistant that manages shopping lists through voice commands",
    description: "A voice-activated shopping companion that learns household consumption patterns, suggests items to buy, finds the best deals, and integrates with grocery delivery services. Includes barcode scanning and pantry inventory management.",
    tags: ["Natural Language Processing", "Mobile App", "E-commerce"],
  },
  {
    title: "Collaborative Code Learning Platform",
    shortDescription: "Interactive coding education with peer programming features",
    description: "An online coding education platform that emphasizes collaborative learning through pair programming sessions, code reviews, and project-based learning. Features real-time code sharing, mentor matching, and skill assessment.",
    tags: ["Education", "Web App", "Productivity"],
  },
  {
    title: "Predictive Maintenance System",
    shortDescription: "AI system to predict equipment failures before they occur",
    description: "An industrial IoT solution that monitors equipment health using sensors and machine learning to predict failures before they happen. Reduces downtime, optimizes maintenance schedules, and extends equipment lifespan.",
    tags: ["Machine Learning", "IoT", "Analytics"],
  },
  {
    title: "Virtual Event Networking Platform",
    shortDescription: "AI-powered networking tool for virtual conferences and events",
    description: "A platform that enhances virtual event networking by using AI to match attendees with similar interests, facilitates meaningful connections, and provides interactive networking activities. Includes video chat, collaboration tools, and follow-up systems.",
    tags: ["Social Media", "Web App", "Recommendation System"],
  },
  {
    title: "Elderly Care Monitoring System",
    shortDescription: "Smart home system for monitoring and assisting elderly residents",
    description: "A comprehensive elderly care system that uses smart sensors and AI to monitor daily activities, detect emergencies, remind about medications, and connect with family members and caregivers. Prioritizes privacy while ensuring safety.",
    tags: ["Healthcare", "IoT", "Mobile App"],
  },
  {
    title: "Climate Change Data Visualization",
    shortDescription: "Interactive platform for exploring climate change data and trends",
    description: "A comprehensive data visualization platform that makes climate change data accessible and understandable through interactive charts, maps, and simulations. Helps users understand local impacts and track progress on climate goals.",
    tags: ["Analytics", "Web App", "Data Processing"],
  },
  {
    title: "Micro-Learning Mobile App",
    shortDescription: "Bite-sized learning modules for busy professionals",
    description: "A mobile learning platform that delivers personalized micro-learning content in 5-minute sessions. Uses spaced repetition and adaptive algorithms to optimize knowledge retention while fitting into busy schedules.",
    tags: ["Education", "Mobile App", "Machine Learning"],
  },
  {
    title: "Community Garden Management Tool",
    shortDescription: "Platform for organizing and managing community garden projects",
    description: "A web application that helps communities organize garden projects, coordinate planting schedules, share resources, track harvest yields, and connect with local food banks. Includes weather integration and gardening tips.",
    tags: ["Web App", "Social Media", "Analytics"],
  },
  {
    title: "Privacy-Focused Social Network",
    shortDescription: "Social platform with end-to-end encryption and user-controlled data",
    description: "A social networking platform built with privacy as the core principle. Features end-to-end encryption, user-controlled data policies, decentralized architecture, and transparent algorithms. Users maintain full ownership of their data.",
    tags: ["Social Media", "Security", "Web App"],
  },
  {
    title: "AR Furniture Placement App",
    shortDescription: "Augmented reality app for visualizing furniture in your space",
    description: "An AR application that allows users to virtually place furniture in their homes before purchasing. Includes accurate measurements, lighting simulation, color customization, and integration with furniture retailers.",
    tags: ["AR/VR", "E-commerce", "Computer Vision"],
  },
  {
    title: "Habit Tracking Gamification Platform",
    shortDescription: "Gamified system to build and maintain positive habits",
    description: "A habit tracking application that uses gamification elements like points, achievements, and social challenges to motivate users. Features habit stacking, progress analytics, and community support for accountability.",
    tags: ["Mobile App", "Gaming", "Analytics"],
  },
  {
    title: "AI-Powered Job Interview Simulator",
    shortDescription: "Virtual interview practice with AI feedback and coaching",
    description: "An AI-powered platform that conducts realistic job interviews and provides detailed feedback on responses, body language, and communication skills. Includes industry-specific questions and personalized improvement recommendations.",
    tags: ["AI", "Career Development", "Web App"],
  },
  {
    title: "Smart Pet Health Monitor",
    shortDescription: "IoT device to track pet health and behavior patterns",
    description: "A wearable device for pets that monitors vital signs, activity levels, and behavior patterns. Sends alerts to owners about potential health issues and integrates with veterinary records for comprehensive health tracking.",
    tags: ["IoT", "Healthcare", "Mobile App"],
  },
  {
    title: "Decentralized Content Creator Platform",
    shortDescription: "Blockchain-based platform for fair creator compensation",
    description: "A decentralized platform where content creators are directly compensated by their audience through cryptocurrency. Eliminates middlemen, ensures fair pay, and provides transparent analytics and community governance.",
    tags: ["Blockchain", "Social Media", "Web3"],
  },
  {
    title: "AI Recipe Generator",
    shortDescription: "Create custom recipes based on available ingredients and dietary preferences",
    description: "An AI-powered cooking assistant that generates personalized recipes based on available ingredients, dietary restrictions, and taste preferences. Includes nutritional analysis, cooking time optimization, and step-by-step video guidance.",
    tags: ["AI", "Food & Beverage", "Mobile App"],
  },
  {
    title: "Virtual Reality Therapy Sessions",
    shortDescription: "VR-based therapy for phobias, PTSD, and anxiety disorders",
    description: "A therapeutic VR platform that provides controlled exposure therapy for various mental health conditions. Features customizable virtual environments, progress tracking, and integration with licensed therapists for guided sessions.",
    tags: ["VR", "Healthcare", "Mental Health"],
  },
  {
    title: "Smart City Traffic Optimization",
    shortDescription: "AI system to optimize traffic flow and reduce congestion",
    description: "An intelligent traffic management system that uses real-time data from sensors, cameras, and connected vehicles to optimize traffic signals, suggest alternative routes, and predict congestion patterns to improve urban mobility.",
    tags: ["AI", "Smart Cities", "Analytics"],
  },
  {
    title: "Personalized News Aggregator",
    shortDescription: "AI-curated news feed that reduces bias and echo chambers",
    description: "An intelligent news platform that presents diverse perspectives on current events, fact-checks information, and helps users understand different viewpoints. Uses AI to break filter bubbles while maintaining personalization.",
    tags: ["AI", "News", "Web App"],
  },
  {
    title: "Blockchain Voting System",
    shortDescription: "Secure, transparent, and verifiable digital voting platform",
    description: "A blockchain-based voting system that ensures election integrity through cryptographic verification, voter anonymity, and transparent vote counting. Includes voter registration, identity verification, and real-time results.",
    tags: ["Blockchain", "Security", "Government"],
  },
  {
    title: "AI-Powered Language Learning",
    shortDescription: "Personalized language learning with conversational AI tutors",
    description: "An advanced language learning platform that uses AI to create personalized lesson plans, provides real-time conversation practice with AI tutors, and adapts to individual learning styles and progress rates.",
    tags: ["AI", "Education", "Language Learning"],
  },
  {
    title: "Smart Waste Management System",
    shortDescription: "IoT-based waste collection optimization and recycling tracking",
    description: "An intelligent waste management system that uses sensors to monitor waste levels, optimizes collection routes, and tracks recycling rates. Includes citizen engagement features and environmental impact reporting.",
    tags: ["IoT", "Sustainability", "Smart Cities"],
  },
  {
    title: "Virtual Reality Real Estate Tours",
    shortDescription: "Immersive VR property viewing and virtual staging",
    description: "A VR platform that allows potential buyers to take immersive virtual tours of properties, visualize different furniture arrangements, and experience properties at different times of day. Includes virtual staging and renovation previews.",
    tags: ["VR", "Real Estate", "Web App"],
  },
  {
    title: "AI-Powered Medical Diagnosis Assistant",
    shortDescription: "AI system to assist doctors with preliminary diagnosis and treatment recommendations",
    description: "A medical AI assistant that analyzes patient symptoms, medical history, and test results to provide preliminary diagnosis suggestions and treatment recommendations. Designed to augment, not replace, medical professionals.",
    tags: ["AI", "Healthcare", "Medical"],
  },
  {
    title: "Blockchain-Based Digital Identity",
    shortDescription: "Self-sovereign digital identity system for secure online interactions",
    description: "A decentralized digital identity platform that gives users complete control over their personal data. Enables secure, privacy-preserving authentication and data sharing across different services and platforms.",
    tags: ["Blockchain", "Security", "Identity"],
  },
  {
    title: "Smart Home Security System",
    shortDescription: "AI-powered home security with facial recognition and behavior analysis",
    description: "An intelligent home security system that uses computer vision, facial recognition, and behavioral analysis to distinguish between family members, guests, and potential intruders. Includes automated alerts and emergency response integration.",
    tags: ["AI", "Security", "Smart Home"],
  },
  {
    title: "Virtual Reality Fitness Classes",
    shortDescription: "Immersive VR fitness experiences with real-time coaching",
    description: "A VR fitness platform that offers immersive workout experiences in virtual environments. Features real-time form correction, personalized coaching, social workouts, and progress tracking with gamification elements.",
    tags: ["VR", "Fitness", "Gaming"],
  },
  {
    title: "AI-Powered Code Documentation Generator",
    shortDescription: "Automated code documentation with intelligent explanations",
    description: "An AI tool that automatically generates comprehensive documentation for codebases, including API documentation, code comments, and user guides. Understands code context and provides human-readable explanations.",
    tags: ["AI", "Developer Tools", "Documentation"],
  },
  {
    title: "Smart Agriculture Drone Fleet",
    shortDescription: "Autonomous drone system for precision farming and crop monitoring",
    description: "A fleet of autonomous agricultural drones that perform precision farming tasks including crop monitoring, pesticide application, soil analysis, and yield prediction. Uses AI and computer vision for optimal farming decisions.",
    tags: ["Drones", "AI", "Agriculture"],
  },
  {
    title: "Blockchain-Based Carbon Credit Trading",
    shortDescription: "Transparent platform for buying and selling carbon credits",
    description: "A blockchain platform that enables transparent trading of carbon credits, tracks environmental impact, and provides incentives for sustainable practices. Includes verification of carbon offset projects and real-time impact tracking.",
    tags: ["Blockchain", "Sustainability", "Trading"],
  },
  {
    title: "AI-Powered Personal Stylist",
    shortDescription: "Virtual stylist that recommends outfits based on occasion, weather, and personal style",
    description: "An AI-powered personal styling assistant that analyzes your wardrobe, considers weather conditions, calendar events, and personal preferences to suggest perfect outfits. Includes virtual try-on and shopping integration.",
    tags: ["AI", "Fashion", "Mobile App"],
  },
  {
    title: "Automated Test Case Generator",
    shortDescription: "AI tool that automatically generates comprehensive test cases from code",
    description: "An intelligent testing tool that analyzes code structure and automatically generates unit tests, integration tests, and edge case scenarios. Learns from existing test patterns and adapts to different testing frameworks.",
    tags: ["AI", "Developer Tools", "Testing"],
  },
  {
    title: "Smart Water Quality Monitor",
    shortDescription: "IoT sensors for real-time water quality tracking in homes and communities",
    description: "A network of IoT sensors that continuously monitor water quality parameters including pH, contaminants, and mineral content. Provides alerts for unsafe conditions and tracks water usage patterns for conservation.",
    tags: ["IoT", "Healthcare", "Sustainability"],
  },
  {
    title: "AI-Powered Resume Optimizer",
    shortDescription: "Tool that optimizes resumes for specific job postings using AI",
    description: "An AI-powered platform that analyzes job descriptions and automatically optimizes resumes to match keywords and requirements. Provides suggestions for improvements and tracks application success rates.",
    tags: ["AI", "Career Development", "Web App"],
  },
  {
    title: "Virtual Co-Working Spaces",
    shortDescription: "VR platform for remote teams to collaborate in virtual offices",
    description: "A virtual reality platform that creates immersive co-working spaces where remote teams can interact, collaborate, and maintain social connections. Features customizable office environments and spatial audio for natural conversations.",
    tags: ["VR", "Productivity", "Social Media"],
  },
  {
    title: "Blockchain-Based Art Authentication",
    shortDescription: "Platform for verifying and tracking artwork authenticity using blockchain",
    description: "A blockchain platform that creates immutable records of artwork provenance, ownership history, and authenticity certificates. Prevents art forgery and provides transparent ownership tracking for collectors and galleries.",
    tags: ["Blockchain", "Security", "E-commerce"],
  },
  {
    title: "AI Sleep Quality Analyzer",
    shortDescription: "Smart device that analyzes sleep patterns and provides improvement recommendations",
    description: "A wearable device and app that tracks sleep stages, breathing patterns, and environmental factors. Uses AI to identify sleep issues and provides personalized recommendations for better sleep hygiene.",
    tags: ["AI", "Healthcare", "Mobile App"],
  },
  {
    title: "Smart Parking Finder",
    shortDescription: "Real-time parking availability app with reservation system",
    description: "An app that uses IoT sensors and crowd-sourced data to show real-time parking availability. Allows users to reserve spots, navigate to available spaces, and pay for parking seamlessly.",
    tags: ["IoT", "Mobile App", "Real-time"],
  },
  {
    title: "AI-Powered Legal Document Analyzer",
    shortDescription: "Tool that analyzes legal documents and extracts key information",
    description: "An AI platform that reads and analyzes legal documents, contracts, and agreements. Extracts key terms, identifies potential issues, and provides summaries in plain language for non-legal professionals.",
    tags: ["AI", "Legal", "Productivity"],
  },
  {
    title: "Virtual Museum Tours",
    shortDescription: "Immersive VR experiences for exploring museums and cultural sites",
    description: "A VR platform that offers virtual tours of museums, historical sites, and cultural landmarks worldwide. Features interactive exhibits, expert commentary, and educational content for students and enthusiasts.",
    tags: ["VR", "Education", "Web App"],
  },
  {
    title: "Blockchain-Based Loyalty Rewards",
    shortDescription: "Decentralized loyalty program that works across multiple businesses",
    description: "A blockchain-based loyalty platform where users earn tokens that can be redeemed across a network of participating businesses. Eliminates siloed loyalty programs and provides transparent reward tracking.",
    tags: ["Blockchain", "E-commerce", "Web3"],
  },
  {
    title: "AI-Powered Meeting Summarizer",
    shortDescription: "Automatically generates meeting notes and action items",
    description: "An AI tool that joins video calls and automatically transcribes, summarizes, and extracts action items from meetings. Integrates with calendar apps and project management tools for seamless workflow.",
    tags: ["AI", "Productivity", "API"],
  },
  {
    title: "Smart Plant Care System",
    shortDescription: "IoT system that monitors and automates plant care",
    description: "An intelligent plant care system with soil sensors, automated watering, and light management. Uses AI to learn optimal care routines for different plant species and sends alerts when attention is needed.",
    tags: ["IoT", "Automation", "Mobile App"],
  },
  {
    title: "AR Navigation for Indoor Spaces",
    shortDescription: "Augmented reality navigation system for malls, airports, and large buildings",
    description: "An AR app that provides turn-by-turn navigation inside large indoor spaces. Overlays directions on the real world using AR, helping users find stores, gates, or facilities without getting lost.",
    tags: ["AR/VR", "Mobile App", "Navigation"],
  },
  {
    title: "AI-Powered Investment Portfolio Optimizer",
    shortDescription: "Intelligent system for optimizing investment portfolios based on goals",
    description: "An AI platform that analyzes market trends, risk tolerance, and financial goals to optimize investment portfolios. Provides real-time recommendations and automatically rebalances investments for optimal returns.",
    tags: ["AI", "Finance", "Analytics"],
  },
  {
    title: "Blockchain-Based Music Royalty Distribution",
    shortDescription: "Transparent platform for distributing music royalties to artists",
    description: "A blockchain platform that automatically distributes music royalties to artists based on smart contracts. Ensures fair compensation, eliminates intermediaries, and provides transparent tracking of music usage and payments.",
    tags: ["Blockchain", "Music", "Web3"],
  },
  {
    title: "Smart Air Quality Monitor",
    shortDescription: "IoT device that tracks indoor air quality and suggests improvements",
    description: "A smart air quality monitoring system that tracks pollutants, allergens, and air quality metrics. Provides real-time alerts, suggests air purifier settings, and tracks trends over time for health insights.",
    tags: ["IoT", "Healthcare", "Analytics"],
  },
  {
    title: "AI-Powered Code Refactoring Assistant",
    shortDescription: "Tool that suggests and performs code refactoring improvements",
    description: "An AI assistant that analyzes codebases and suggests refactoring opportunities to improve code quality, maintainability, and performance. Can automatically apply safe refactorings and explain the reasoning behind changes.",
    tags: ["AI", "Developer Tools", "Productivity"],
  },
  {
    title: "Virtual Reality Social Events",
    shortDescription: "Platform for hosting social gatherings and events in VR",
    description: "A VR platform where users can attend virtual concerts, parties, conferences, and social gatherings. Features customizable avatars, interactive environments, and real-time social interactions with friends and strangers.",
    tags: ["VR", "Social Media", "Entertainment"],
  },
  {
    title: "Blockchain-Based Supply Chain Finance",
    shortDescription: "Platform for transparent financing and payment in supply chains",
    description: "A blockchain platform that enables transparent financing, invoicing, and payment processing across supply chains. Reduces payment delays, prevents fraud, and provides real-time visibility into financial transactions.",
    tags: ["Blockchain", "Finance", "Supply Chain"],
  },
  {
    title: "AI-Powered Email Prioritizer",
    shortDescription: "Intelligent email management that prioritizes important messages",
    description: "An AI email assistant that learns from user behavior to automatically prioritize emails, suggest responses, and organize messages. Reduces email overload and helps users focus on what matters most.",
    tags: ["AI", "Productivity", "Email"],
  },
  {
    title: "Smart Home Air Conditioning Optimizer",
    shortDescription: "AI system that optimizes AC usage for comfort and energy savings",
    description: "An intelligent AC management system that learns household patterns and optimizes cooling schedules. Balances comfort with energy efficiency, predicts optimal settings, and integrates with smart thermostats.",
    tags: ["AI", "Smart Home", "Automation"],
  },
  {
    title: "AR Shopping Assistant",
    shortDescription: "Augmented reality tool for trying products before buying",
    description: "An AR app that lets users virtually try on clothes, test furniture placement, or preview products in their environment. Integrates with e-commerce platforms for seamless shopping experiences.",
    tags: ["AR/VR", "E-commerce", "Mobile App"],
  },
  {
    title: "Blockchain-Based Academic Credentials",
    shortDescription: "Immutable system for storing and verifying educational credentials",
    description: "A blockchain platform for issuing, storing, and verifying academic degrees and certificates. Prevents credential fraud, enables instant verification, and gives students control over their educational records.",
    tags: ["Blockchain", "Education", "Security"],
  },
  {
    title: "AI-Powered Content Moderation",
    shortDescription: "Automated system for detecting and moderating inappropriate content",
    description: "An AI platform that automatically detects and moderates inappropriate content across text, images, and videos. Uses advanced machine learning to understand context and reduce false positives while maintaining platform safety.",
    tags: ["AI", "Security", "Content Moderation"],
  },
  {
    title: "Smart Exercise Form Corrector",
    shortDescription: "AI-powered app that analyzes and corrects exercise form",
    description: "A mobile app that uses computer vision to analyze exercise form in real-time. Provides instant feedback and corrections to prevent injuries and maximize workout effectiveness.",
    tags: ["AI", "Fitness", "Computer Vision"],
  },
  {
    title: "Virtual Reality Training Simulator",
    shortDescription: "VR platform for professional training in various industries",
    description: "A VR training platform that creates realistic simulations for medical procedures, flight training, emergency response, and other high-stakes professions. Provides safe, repeatable training experiences with detailed performance analytics.",
    tags: ["VR", "Education", "Training"],
  },
  {
    title: "Blockchain-Based Charity Donation Tracker",
    shortDescription: "Transparent platform for tracking charitable donations and impact",
    description: "A blockchain platform that tracks charitable donations from donor to beneficiary, ensuring transparency and accountability. Shows real-time impact of donations and prevents fraud in charitable giving.",
    tags: ["Blockchain", "Social Impact", "Transparency"],
  },
  {
    title: "AI-Powered Customer Support Bot",
    shortDescription: "Intelligent chatbot for handling customer inquiries and support",
    description: "An advanced AI chatbot that understands context, handles complex queries, and escalates to human agents when needed. Learns from interactions to continuously improve response quality and customer satisfaction.",
    tags: ["AI", "Customer Service", "Chatbot"],
  },
  {
    title: "Smart Home Lighting System",
    shortDescription: "AI-controlled lighting that adapts to activities and circadian rhythms",
    description: "An intelligent lighting system that adjusts color temperature and brightness based on time of day, activities, and circadian rhythms. Promotes better sleep, productivity, and energy efficiency.",
    tags: ["AI", "Smart Home", "Health"],
  },
  {
    title: "AR Historical Site Reconstruction",
    shortDescription: "Augmented reality app that shows historical sites as they were",
    description: "An AR app that overlays historical reconstructions onto current locations, allowing users to see how places looked in the past. Includes educational content and interactive historical narratives.",
    tags: ["AR/VR", "Education", "History"],
  },
  {
    title: "Blockchain-Based Insurance Claims",
    shortDescription: "Transparent and automated insurance claim processing system",
    description: "A blockchain platform that automates insurance claim processing using smart contracts. Reduces fraud, speeds up claim resolution, and provides transparent tracking of claim status and payouts.",
    tags: ["Blockchain", "Insurance", "Automation"],
  },
  {
    title: "AI-Powered Language Translation for Sign Language",
    shortDescription: "Real-time translation between sign language and spoken language",
    description: "An AI system that uses computer vision to translate sign language to text/speech in real-time, and vice versa. Enables seamless communication between deaf and hearing individuals.",
    tags: ["AI", "Accessibility", "Computer Vision"],
  },
  {
    title: "Smart Refrigerator Inventory Manager",
    shortDescription: "AI system that tracks food inventory and suggests recipes",
    description: "A smart refrigerator system with cameras and sensors that tracks food inventory, expiration dates, and consumption patterns. Suggests recipes based on available ingredients and helps reduce food waste.",
    tags: ["AI", "IoT", "Food & Beverage"],
  },
  {
    title: "Virtual Reality Architecture Visualization",
    shortDescription: "VR platform for architects and clients to experience designs",
    description: "A VR platform that allows architects and clients to walk through building designs before construction. Enables real-time design modifications and provides immersive experiences of spaces.",
    tags: ["VR", "Architecture", "Design"],
  },
  {
    title: "Blockchain-Based Intellectual Property Registry",
    shortDescription: "Immutable registry for protecting and licensing intellectual property",
    description: "A blockchain platform for registering, protecting, and licensing intellectual property including patents, trademarks, and copyrights. Provides proof of ownership and transparent licensing agreements.",
    tags: ["Blockchain", "Legal", "IP Protection"],
  },
  {
    title: "AI-Powered Personal Trainer",
    shortDescription: "Virtual fitness coach that creates personalized workout plans",
    description: "An AI-powered fitness app that creates personalized workout plans based on goals, fitness level, and available equipment. Provides real-time form feedback and adjusts plans based on progress.",
    tags: ["AI", "Fitness", "Mobile App"],
  },
  {
    title: "Smart City Noise Monitoring",
    shortDescription: "IoT network for monitoring and managing urban noise pollution",
    description: "A network of IoT sensors that monitor noise levels across cities. Helps identify noise pollution sources, enforce regulations, and plan urban development to reduce noise impact on residents.",
    tags: ["IoT", "Smart Cities", "Analytics"],
  },
  {
    title: "AR Medical Training Tool",
    shortDescription: "Augmented reality system for medical students to practice procedures",
    description: "An AR platform that overlays anatomical information and procedure guidance onto medical training models. Allows medical students to practice procedures safely with real-time feedback and assessment.",
    tags: ["AR/VR", "Healthcare", "Education"],
  },
  {
    title: "Blockchain-Based Freelance Payment System",
    shortDescription: "Transparent payment platform for freelancers and clients",
    description: "A blockchain platform that automates freelance payments using smart contracts. Ensures timely payments, handles disputes transparently, and provides escrow services for project milestones.",
    tags: ["Blockchain", "Freelance", "Payments"],
  },
  {
    title: "AI-Powered Study Planner",
    shortDescription: "Intelligent system that creates optimized study schedules",
    description: "An AI-powered study planning app that creates personalized study schedules based on learning goals, deadlines, and cognitive science principles. Optimizes study sessions for maximum retention and efficiency.",
    tags: ["AI", "Education", "Productivity"],
  },
  {
    title: "Smart Home Window Automation",
    shortDescription: "Automated window system for natural light and temperature control",
    description: "An intelligent window system that automatically opens, closes, and adjusts blinds based on weather, time of day, and indoor temperature. Maximizes natural light while maintaining comfort and energy efficiency.",
    tags: ["IoT", "Smart Home", "Automation"],
  },
  {
    title: "Virtual Reality Therapy for Phobias",
    shortDescription: "VR-based exposure therapy for treating phobias and anxiety",
    description: "A VR therapy platform that provides controlled exposure therapy for phobias, anxiety disorders, and PTSD. Creates safe, customizable virtual environments for gradual desensitization under professional guidance.",
    tags: ["VR", "Healthcare", "Mental Health"],
  },
  {
    title: "Blockchain-Based Carbon Footprint Tracker",
    shortDescription: "Platform for tracking and offsetting individual carbon footprints",
    description: "A blockchain platform that tracks individual carbon footprints from daily activities. Provides transparent offsetting options and rewards for sustainable choices, creating a gamified approach to climate action.",
    tags: ["Blockchain", "Sustainability", "Mobile App"],
  },
  {
    title: "AI-Powered Voice Cloning for Accessibility",
    shortDescription: "System that creates synthetic voices for speech-impaired individuals",
    description: "An AI platform that creates personalized synthetic voices for individuals who have lost their ability to speak. Learns from existing voice samples to create natural-sounding speech for communication devices.",
    tags: ["AI", "Accessibility", "Healthcare"],
  },
  {
    title: "Smart Garden Irrigation System",
    shortDescription: "IoT-based automated irrigation that optimizes water usage",
    description: "An intelligent irrigation system that monitors soil moisture, weather forecasts, and plant needs. Automatically adjusts watering schedules to optimize plant health while minimizing water waste.",
    tags: ["IoT", "Automation", "Sustainability"],
  },
  {
    title: "AR Interior Design Tool",
    shortDescription: "Augmented reality app for visualizing interior design changes",
    description: "An AR app that allows users to visualize furniture, paint colors, and decor changes in their homes before making purchases. Includes virtual staging and design recommendations based on room analysis.",
    tags: ["AR/VR", "Design", "E-commerce"],
  },
  {
    title: "Blockchain-Based Event Ticketing",
    shortDescription: "Secure and transparent ticketing system that prevents scalping",
    description: "A blockchain-based ticketing platform that prevents ticket scalping and fraud. Uses smart contracts to enforce transfer rules, ensures fair pricing, and provides transparent ticket ownership tracking.",
    tags: ["Blockchain", "Events", "Security"],
  },
  {
    title: "AI-Powered Music Composer",
    shortDescription: "AI system that generates original music compositions",
    description: "An AI platform that generates original music compositions based on style, mood, and user preferences. Can create background music, full compositions, or assist musicians in the creative process.",
    tags: ["AI", "Music", "Creative Tools"],
  },
  {
    title: "Smart Home Energy Storage Manager",
    shortDescription: "AI system that optimizes home battery storage and solar usage",
    description: "An intelligent energy management system that optimizes home battery storage, solar panel output, and grid interactions. Maximizes self-consumption, reduces energy costs, and supports grid stability.",
    tags: ["AI", "Smart Home", "Sustainability"],
  },
  {
    title: "Virtual Reality Remote Collaboration",
    shortDescription: "VR platform for remote teams to work together in virtual spaces",
    description: "A VR collaboration platform where remote teams can work together in shared virtual workspaces. Features 3D whiteboards, file sharing, and natural interactions that mimic in-person collaboration.",
    tags: ["VR", "Productivity", "Remote Work"],
  },
  {
    title: "Blockchain-Based Land Registry",
    shortDescription: "Immutable land ownership and property records system",
    description: "A blockchain platform for recording land ownership, property transfers, and real estate transactions. Prevents fraud, reduces paperwork, and provides transparent property history for buyers and sellers.",
    tags: ["Blockchain", "Real Estate", "Government"],
  },
  {
    title: "AI-Powered Social Media Content Scheduler",
    shortDescription: "Intelligent tool for optimizing social media posting times",
    description: "An AI-powered social media management tool that analyzes audience engagement patterns and suggests optimal posting times. Automatically schedules content for maximum reach and engagement.",
    tags: ["AI", "Social Media", "Marketing"],
  },
  {
    title: "Smart Home Air Purifier System",
    shortDescription: "Intelligent air purification that adapts to air quality",
    description: "A smart air purifier system that monitors air quality in real-time and automatically adjusts filtration settings. Learns household patterns and optimizes operation for maximum air quality with minimal energy use.",
    tags: ["IoT", "Smart Home", "Healthcare"],
  },
  {
    title: "AR Language Learning",
    shortDescription: "Augmented reality app for immersive language learning",
    description: "An AR language learning app that overlays translations and language lessons onto real-world objects. Provides immersive, contextual language learning experiences that accelerate vocabulary acquisition.",
    tags: ["AR/VR", "Education", "Language Learning"],
  },
  {
    title: "Blockchain-Based Micro-Lending Platform",
    shortDescription: "Decentralized platform for peer-to-peer micro-lending",
    description: "A blockchain platform that connects lenders and borrowers for micro-loans. Uses smart contracts for automated loan agreements, transparent credit scoring, and secure repayment tracking.",
    tags: ["Blockchain", "Finance", "Social Impact"],
  },
  {
    title: "AI-Powered Code Review Bot",
    shortDescription: "Automated code reviewer that provides detailed feedback",
    description: "An AI-powered code review assistant that analyzes pull requests and provides detailed feedback on code quality, security, performance, and best practices. Learns from team coding standards to provide contextual suggestions.",
    tags: ["AI", "Developer Tools", "Code Review"],
  },
  {
    title: "Smart Home Security Camera AI",
    shortDescription: "AI-powered security system that recognizes faces and activities",
    description: "An intelligent security camera system that uses AI to recognize family members, detect suspicious activities, and send contextual alerts. Reduces false alarms and provides meaningful security insights.",
    tags: ["AI", "Security", "Computer Vision"],
  },
  {
    title: "Virtual Reality Meditation Retreats",
    shortDescription: "VR platform offering immersive meditation and wellness experiences",
    description: "A VR wellness platform that transports users to peaceful virtual environments for meditation, yoga, and mindfulness practices. Features guided sessions, progress tracking, and customizable environments.",
    tags: ["VR", "Wellness", "Mental Health"],
  },
  {
    title: "Blockchain-Based Food Traceability",
    shortDescription: "Transparent system for tracking food from farm to table",
    description: "A blockchain platform that tracks food products from origin to consumer, providing complete transparency about sourcing, processing, and transportation. Helps ensure food safety and supports ethical consumption.",
    tags: ["Blockchain", "Food Safety", "Supply Chain"],
  },
  {
    title: "AI-Powered Email Security",
    shortDescription: "Intelligent system for detecting and preventing email threats",
    description: "An AI-powered email security system that detects phishing, malware, and spam with high accuracy. Learns from user behavior to identify suspicious patterns and provides real-time threat protection.",
    tags: ["AI", "Security", "Email"],
  },
  {
    title: "Smart Home Climate Zones",
    shortDescription: "AI system that creates personalized climate zones in homes",
    description: "An intelligent HVAC system that creates personalized temperature zones for different rooms and occupants. Learns preferences and schedules to optimize comfort while minimizing energy consumption.",
    tags: ["AI", "Smart Home", "Automation"],
  },
  {
    title: "AR Museum Exhibits",
    shortDescription: "Augmented reality enhancements for museum experiences",
    description: "An AR app that enhances museum visits by overlaying interactive content, 3D models, and historical context onto exhibits. Provides immersive educational experiences for visitors of all ages.",
    tags: ["AR/VR", "Education", "Museums"],
  },
  {
    title: "Blockchain-Based Academic Research Sharing",
    shortDescription: "Platform for transparent and verifiable research publication",
    description: "A blockchain platform for publishing and sharing academic research with immutable timestamps and authorship verification. Ensures research integrity and provides transparent peer review processes.",
    tags: ["Blockchain", "Education", "Research"],
  },
  {
    title: "AI-Powered Personal Nutritionist",
    shortDescription: "Virtual nutritionist that creates personalized meal plans",
    description: "An AI-powered nutrition app that creates personalized meal plans based on health goals, dietary restrictions, and preferences. Tracks nutrition intake and provides real-time recommendations for optimal health.",
    tags: ["AI", "Healthcare", "Nutrition"],
  },
  {
    title: "Smart Home Water Leak Detection",
    shortDescription: "IoT system for early detection and prevention of water leaks",
    description: "An intelligent water monitoring system with sensors that detect leaks, unusual water usage, and potential plumbing issues. Sends immediate alerts and can automatically shut off water supply to prevent damage.",
    tags: ["IoT", "Smart Home", "Safety"],
  },
  {
    title: "Virtual Reality Concerts",
    shortDescription: "VR platform for attending live concerts from anywhere",
    description: "A VR platform that streams live concerts and music events, allowing users to experience performances from the best seats. Features social interactions, customizable viewing angles, and high-quality audio.",
    tags: ["VR", "Entertainment", "Music"],
  },
  {
    title: "Blockchain-Based Renewable Energy Trading",
    shortDescription: "Platform for peer-to-peer renewable energy trading",
    description: "A blockchain platform that enables homeowners with solar panels to sell excess energy directly to neighbors. Uses smart contracts for automated transactions and transparent energy tracking.",
    tags: ["Blockchain", "Energy", "Sustainability"],
  },
  {
    title: "AI-Powered Accessibility Checker",
    shortDescription: "Tool that automatically checks and improves digital accessibility",
    description: "An AI tool that scans websites and applications for accessibility issues and provides actionable recommendations. Helps developers create inclusive digital experiences that comply with accessibility standards.",
    tags: ["AI", "Accessibility", "Developer Tools"],
  },
  {
    title: "Smart Home Appliance Coordinator",
    shortDescription: "AI system that optimizes appliance usage for efficiency",
    description: "An intelligent home management system that coordinates appliance usage to optimize energy consumption. Learns household patterns and schedules appliances to run during off-peak hours for cost savings.",
    tags: ["AI", "Smart Home", "Energy Efficiency"],
  },
  {
    title: "AR Sports Training Assistant",
    shortDescription: "Augmented reality tool for improving athletic performance",
    description: "An AR app that overlays training data, form analysis, and performance metrics onto real-world sports activities. Provides real-time feedback to help athletes improve technique and performance.",
    tags: ["AR/VR", "Sports", "Training"],
  },
  {
    title: "Blockchain-Based Digital Collectibles",
    shortDescription: "Platform for creating and trading verified digital collectibles",
    description: "A blockchain platform for creating, owning, and trading digital collectibles with verified authenticity. Supports various types of digital assets including art, trading cards, and virtual items.",
    tags: ["Blockchain", "NFTs", "Collectibles"],
  },
  {
    title: "AI-Powered Mental Health Companion",
    shortDescription: "AI companion that provides emotional support and wellness tracking",
    description: "An AI-powered mental health companion that provides daily check-ins, mood tracking, and emotional support. Offers coping strategies, mindfulness exercises, and connects users with professional resources when needed.",
    tags: ["AI", "Mental Health", "Wellness"],
  },
  {
    title: "Smart Home Fire Prevention System",
    shortDescription: "IoT network for early fire detection and prevention",
    description: "An intelligent fire prevention system with multiple sensors that detect smoke, heat, and gas leaks. Provides early warnings, automatically activates suppression systems, and alerts emergency services.",
    tags: ["IoT", "Safety", "Smart Home"],
  },
  {
    title: "Virtual Reality Travel Experiences",
    shortDescription: "VR platform for virtual tourism and travel planning",
    description: "A VR platform that offers immersive virtual tours of destinations worldwide. Helps travelers preview locations, plan trips, and experience places they may not be able to visit in person.",
    tags: ["VR", "Travel", "Entertainment"],
  },
  {
    title: "Blockchain-Based Healthcare Records",
    shortDescription: "Secure and portable system for medical records",
    description: "A blockchain platform for storing and sharing medical records securely. Gives patients control over their health data while enabling seamless sharing with healthcare providers when authorized.",
    tags: ["Blockchain", "Healthcare", "Privacy"],
  },
  {
    title: "AI-Powered Code Search Engine",
    shortDescription: "Intelligent search tool for finding code snippets and solutions",
    description: "An AI-powered code search engine that understands code semantics and intent. Helps developers find relevant code examples, solutions to problems, and similar implementations across codebases.",
    tags: ["AI", "Developer Tools", "Search"],
  },
  {
    title: "Smart Home Occupancy Optimizer",
    shortDescription: "AI system that learns occupancy patterns and optimizes home systems",
    description: "An intelligent home system that learns when rooms are occupied and automatically adjusts lighting, temperature, and other systems. Maximizes comfort and energy efficiency based on actual usage patterns.",
    tags: ["AI", "Smart Home", "Automation"],
  },
  {
    title: "AR Car Maintenance Guide",
    shortDescription: "Augmented reality app for DIY car maintenance and repairs",
    description: "An AR app that overlays step-by-step instructions and part identification onto car engines and components. Helps car owners perform basic maintenance and repairs with visual guidance.",
    tags: ["AR/VR", "Automotive", "DIY"],
  },
  {
    title: "Blockchain-Based Crowdfunding Platform",
    shortDescription: "Transparent and secure platform for project crowdfunding",
    description: "A blockchain-based crowdfunding platform that ensures transparent fund management and automatic milestone-based releases. Provides donors with clear visibility into how funds are used.",
    tags: ["Blockchain", "Crowdfunding", "Social Impact"],
  },
  {
    title: "AI-Powered Time Management Coach",
    shortDescription: "Virtual coach that helps optimize daily schedules and productivity",
    description: "An AI-powered time management app that analyzes daily activities, identifies time-wasting patterns, and suggests optimized schedules. Provides personalized productivity coaching and habit formation support.",
    tags: ["AI", "Productivity", "Time Management"],
  },
  {
    title: "Smart Home Window Security",
    shortDescription: "IoT system for monitoring and securing windows",
    description: "An intelligent window security system with sensors that detect break-ins, monitor window status, and integrate with home security systems. Provides alerts and can automatically lock windows when needed.",
    tags: ["IoT", "Security", "Smart Home"],
  },
  {
    title: "Virtual Reality Language Immersion",
    shortDescription: "VR platform for immersive language learning experiences",
    description: "A VR language learning platform that places users in virtual environments where they must use the target language to interact. Creates immersive, contextual learning experiences that accelerate language acquisition.",
    tags: ["VR", "Education", "Language Learning"],
  },
  {
    title: "Blockchain-Based Supply Chain Quality Assurance",
    shortDescription: "Transparent system for tracking product quality through supply chains",
    description: "A blockchain platform that records quality inspections and certifications at each stage of the supply chain. Ensures product quality and provides transparent quality history for consumers and regulators.",
    tags: ["Blockchain", "Quality Assurance", "Supply Chain"],
  },
  {
    title: "AI-Powered Bug Predictor",
    shortDescription: "Tool that predicts potential bugs before code is deployed",
    description: "An AI tool that analyzes code changes and predicts potential bugs, security vulnerabilities, and performance issues. Helps developers catch problems early and prioritize testing efforts.",
    tags: ["AI", "Developer Tools", "Testing"],
  },
  {
    title: "Smart Home Energy Dashboard",
    shortDescription: "Comprehensive dashboard for monitoring and optimizing home energy",
    description: "An intelligent energy dashboard that provides real-time insights into home energy consumption. Identifies energy waste, suggests optimizations, and tracks savings from efficiency improvements.",
    tags: ["IoT", "Smart Home", "Analytics"],
  },
  {
    title: "AR Fitness Class Instructor",
    shortDescription: "Augmented reality fitness instructor for home workouts",
    description: "An AR fitness app that projects a virtual instructor into your space for guided workouts. Provides real-time form correction, motivation, and personalized workout recommendations.",
    tags: ["AR/VR", "Fitness", "Mobile App"],
  },
  {
    title: "Blockchain-Based Freight Tracking",
    shortDescription: "Transparent system for tracking shipments and logistics",
    description: "A blockchain platform for tracking freight and shipments across the entire logistics chain. Provides real-time visibility, prevents fraud, and automates documentation and payments.",
    tags: ["Blockchain", "Logistics", "Supply Chain"],
  },
  {
    title: "AI-Powered Learning Path Generator",
    shortDescription: "System that creates personalized learning paths for skills",
    description: "An AI platform that analyzes career goals and current skills to generate personalized learning paths. Recommends courses, resources, and projects to efficiently achieve learning objectives.",
    tags: ["AI", "Education", "Career Development"],
  },
  {
    title: "Smart Home Garage Automation",
    shortDescription: "IoT system for automated garage management and security",
    description: "An intelligent garage system that automatically opens/closes doors, monitors vehicle presence, and manages storage. Integrates with home security and provides remote access and notifications.",
    tags: ["IoT", "Smart Home", "Automation"],
  },
  {
    title: "Virtual Reality Team Building",
    shortDescription: "VR platform for remote team building activities",
    description: "A VR platform that hosts team building activities and games for remote teams. Creates shared virtual spaces where team members can interact, collaborate, and build relationships.",
    tags: ["VR", "Team Building", "Remote Work"],
  },
  {
    title: "Blockchain-Based Patent Marketplace",
    shortDescription: "Platform for buying, selling, and licensing patents",
    description: "A blockchain platform for transparent patent trading and licensing. Provides immutable records of ownership, automates licensing agreements, and facilitates patent transactions.",
    tags: ["Blockchain", "IP", "Marketplace"],
  },
  {
    title: "AI-Powered Contract Analyzer",
    shortDescription: "Tool that analyzes contracts and identifies important terms",
    description: "An AI tool that reads and analyzes contracts to extract key terms, identify potential issues, and compare with standard agreements. Helps non-legal professionals understand contract implications.",
    tags: ["AI", "Legal", "Business"],
  },
  {
    title: "Smart Home Pet Care System",
    shortDescription: "IoT system for monitoring and caring for pets remotely",
    description: "An intelligent pet care system with cameras, feeders, and activity monitors. Allows pet owners to check on, feed, and interact with pets remotely while tracking their health and activity.",
    tags: ["IoT", "Pet Care", "Mobile App"],
  },
  {
    title: "AR Navigation for Hiking",
    shortDescription: "Augmented reality navigation tool for outdoor adventures",
    description: "An AR hiking app that overlays trail information, points of interest, and navigation cues onto the real world. Helps hikers stay on trails, find landmarks, and discover natural features.",
    tags: ["AR/VR", "Outdoor", "Navigation"],
  },
  {
    title: "Blockchain-Based Digital Rights Management",
    shortDescription: "Platform for managing and protecting digital content rights",
    description: "A blockchain platform for managing digital content rights, licensing, and distribution. Ensures creators are properly compensated and provides transparent rights tracking for all stakeholders.",
    tags: ["Blockchain", "Content", "Rights Management"],
  },
  {
    title: "AI-Powered Personal Assistant",
    shortDescription: "Intelligent virtual assistant that manages daily tasks and schedules",
    description: "An advanced AI personal assistant that learns user preferences, manages schedules, makes reservations, and handles routine tasks. Integrates with various services and provides proactive suggestions.",
    tags: ["AI", "Productivity", "Virtual Assistant"],
  },
  {
    title: "Smart Home Solar Panel Optimizer",
    shortDescription: "AI system that optimizes solar panel positioning and output",
    description: "An intelligent solar panel management system that optimizes panel angles, tracks sun position, and maximizes energy generation. Provides real-time monitoring and predictive maintenance alerts.",
    tags: ["AI", "Solar Energy", "Optimization"],
  },
  {
    title: "Virtual Reality Education Platform",
    shortDescription: "VR platform for immersive educational experiences",
    description: "A comprehensive VR education platform that creates immersive learning experiences across subjects. Allows students to explore historical events, scientific concepts, and abstract ideas in 3D virtual environments.",
    tags: ["VR", "Education", "Learning"],
  },
  {
    title: "Blockchain-Based Certificate Verification",
    shortDescription: "Immutable system for verifying professional certifications",
    description: "A blockchain platform for issuing and verifying professional certifications, licenses, and credentials. Prevents fraud and enables instant verification by employers and institutions.",
    tags: ["Blockchain", "Education", "Verification"],
  },
  {
    title: "AI-Powered Market Research Tool",
    shortDescription: "Intelligent system for analyzing market trends and opportunities",
    description: "An AI platform that analyzes market data, consumer trends, and competitive landscapes to identify business opportunities. Provides actionable insights and predictions for strategic decision-making.",
    tags: ["AI", "Business", "Analytics"],
  },
  {
    title: "Smart Home Integration Hub",
    shortDescription: "Centralized system for managing all smart home devices",
    description: "An intelligent hub that unifies control of all smart home devices from different manufacturers. Provides a single interface, automates device coordination, and learns user preferences.",
    tags: ["IoT", "Smart Home", "Integration"],
  },
  {
    title: "AR Product Manual Viewer",
    shortDescription: "Augmented reality app for interactive product manuals",
    description: "An AR app that overlays interactive instructions and troubleshooting guides onto products. Makes product manuals more accessible and helps users understand and repair products easily.",
    tags: ["AR/VR", "Productivity", "Consumer"],
  },
  {
    title: "Blockchain-Based Micropayment System",
    shortDescription: "Platform for low-cost microtransactions and payments",
    description: "A blockchain platform optimized for micropayments, enabling new business models like pay-per-article, tip creators, and micro-donations. Reduces transaction fees and enables instant payments.",
    tags: ["Blockchain", "Payments", "Micropayments"],
  },
  {
    title: "AI-Powered Code Quality Monitor",
    shortDescription: "Continuous monitoring system for code quality metrics",
    description: "An AI-powered platform that continuously monitors code quality, technical debt, and code health across projects. Provides actionable insights and tracks improvements over time.",
    tags: ["AI", "Developer Tools", "Code Quality"],
  },
  {
    title: "Smart Home Sleep Environment Optimizer",
    shortDescription: "AI system that optimizes bedroom environment for better sleep",
    description: "An intelligent sleep optimization system that adjusts temperature, lighting, and sound based on sleep stages and personal preferences. Tracks sleep quality and continuously improves the sleep environment.",
    tags: ["AI", "Smart Home", "Health"],
  },
  {
    title: "AI-Powered Code Migration Assistant",
    shortDescription: "Automated tool for migrating code between frameworks and languages",
    description: "An AI-powered tool that analyzes codebases and automatically migrates code between different frameworks, languages, or versions. Understands code patterns and maintains functionality while updating syntax and structure.",
    tags: ["AI", "Developer Tools", "Migration"],
  },
  {
    title: "Blockchain-Based Freelance Reputation System",
    shortDescription: "Immutable reputation tracking for freelancers and clients",
    description: "A blockchain platform that creates tamper-proof reputation records for freelancers and clients. Ensures fair reviews, prevents manipulation, and provides transparent work history for better matching.",
    tags: ["Blockchain", "Freelance", "Reputation"],
  },
  {
    title: "Smart Home Energy Cost Predictor",
    shortDescription: "AI system that predicts and optimizes energy costs",
    description: "An intelligent energy management system that predicts future energy costs based on usage patterns and market rates. Suggests optimal times to use appliances and helps reduce overall energy expenses.",
    tags: ["AI", "Smart Home", "Finance"],
  },
  {
    title: "Virtual Reality Code Visualization",
    shortDescription: "VR platform for visualizing and navigating codebases in 3D",
    description: "A VR application that transforms codebases into interactive 3D visualizations. Helps developers understand code structure, relationships, and flow through immersive exploration of their projects.",
    tags: ["VR", "Developer Tools", "Visualization"],
  },
  {
    title: "AI-Powered Meeting Room Optimizer",
    shortDescription: "System that optimizes meeting room bookings and usage",
    description: "An AI platform that analyzes meeting patterns, room usage, and preferences to optimize meeting room bookings. Suggests optimal times, rooms, and durations to maximize space utilization.",
    tags: ["AI", "Productivity", "Office Management"],
  },
  {
    title: "Blockchain-Based Academic Credential Verification",
    shortDescription: "Instant verification system for educational credentials",
    description: "A blockchain platform that enables instant verification of academic credentials by employers and institutions. Prevents degree fraud and streamlines the hiring process with transparent verification.",
    tags: ["Blockchain", "Education", "Verification"],
  },
  {
    title: "Smart Home Carbon Footprint Tracker",
    shortDescription: "IoT system that tracks and reduces household carbon emissions",
    description: "An intelligent system that monitors all household energy consumption and calculates carbon footprint in real-time. Provides actionable recommendations to reduce emissions and tracks progress over time.",
    tags: ["IoT", "Sustainability", "Analytics"],
  },
  {
    title: "AR Home Improvement Planner",
    shortDescription: "Augmented reality tool for planning home renovations",
    description: "An AR app that allows homeowners to visualize home improvement projects before starting. Overlays new designs, materials, and layouts onto existing spaces for better planning and decision-making.",
    tags: ["AR/VR", "Home Improvement", "Design"],
  },
  {
    title: "AI-Powered Bug Triage System",
    shortDescription: "Intelligent system for prioritizing and assigning bug reports",
    description: "An AI platform that analyzes bug reports, assigns priority levels, and routes them to appropriate developers. Learns from historical data to improve triage accuracy and reduce resolution time.",
    tags: ["AI", "Developer Tools", "Bug Tracking"],
  },
  {
    title: "Blockchain-Based Supply Chain Transparency",
    shortDescription: "Complete transparency in product supply chains",
    description: "A blockchain platform that provides end-to-end transparency in supply chains. Tracks products from raw materials to final delivery, ensuring ethical sourcing and preventing counterfeiting.",
    tags: ["Blockchain", "Supply Chain", "Transparency"],
  },
  {
    title: "Smart Home Health Monitor",
    shortDescription: "IoT system that monitors household health indicators",
    description: "An intelligent health monitoring system that tracks air quality, water quality, and environmental factors affecting health. Provides alerts and recommendations for maintaining a healthy home environment.",
    tags: ["IoT", "Healthcare", "Smart Home"],
  },
  {
    title: "Virtual Reality Code Review",
    shortDescription: "VR platform for collaborative code review sessions",
    description: "A VR platform where developers can review code together in immersive virtual spaces. Features 3D code visualization, collaborative annotations, and natural interaction for better code review experiences.",
    tags: ["VR", "Developer Tools", "Collaboration"],
  },
  {
    title: "AI-Powered Dependency Update Manager",
    shortDescription: "Intelligent system for managing and updating code dependencies",
    description: "An AI tool that analyzes dependency updates, identifies breaking changes, and suggests safe update paths. Automates dependency management while preventing compatibility issues and security vulnerabilities.",
    tags: ["AI", "Developer Tools", "Dependencies"],
  },
  {
    title: "Blockchain-Based Event Attendance Verification",
    shortDescription: "Immutable system for verifying event attendance and participation",
    description: "A blockchain platform that creates verifiable records of event attendance, participation, and achievements. Prevents fraud and provides transparent certification for conferences, workshops, and training.",
    tags: ["Blockchain", "Events", "Verification"],
  },
  {
    title: "Smart Home Appliance Health Monitor",
    shortDescription: "IoT system for monitoring appliance health and predicting failures",
    description: "An intelligent monitoring system that tracks appliance performance, usage patterns, and health indicators. Predicts potential failures before they occur and suggests maintenance to extend appliance lifespan.",
    tags: ["IoT", "Smart Home", "Predictive Maintenance"],
  },
  {
    title: "AR Learning Companion for Kids",
    shortDescription: "Augmented reality educational assistant for children",
    description: "An AR app that creates interactive learning experiences for children. Overlays educational content onto real-world objects, making learning fun and engaging through immersive experiences.",
    tags: ["AR/VR", "Education", "Children"],
  },
  {
    title: "AI-Powered Code Comment Generator",
    shortDescription: "Automated system for generating meaningful code comments",
    description: "An AI tool that analyzes code and automatically generates comprehensive, meaningful comments. Understands code intent and creates documentation that explains complex logic and business rules.",
    tags: ["AI", "Developer Tools", "Documentation"],
  },
  {
    title: "Blockchain-Based Digital Asset Marketplace",
    shortDescription: "Platform for trading verified digital assets and collectibles",
    description: "A blockchain marketplace for buying, selling, and trading digital assets with verified authenticity. Supports various asset types including art, music, videos, and virtual items with transparent ownership.",
    tags: ["Blockchain", "Marketplace", "Digital Assets"],
  },
  {
    title: "Smart Home Water Quality Monitor",
    shortDescription: "IoT system for continuous water quality monitoring",
    description: "An intelligent water quality monitoring system that continuously tracks pH, contaminants, and mineral content. Provides real-time alerts for unsafe conditions and tracks water quality trends over time.",
    tags: ["IoT", "Healthcare", "Water Quality"],
  },
  {
    title: "Virtual Reality Project Management",
    shortDescription: "VR platform for visualizing and managing projects in 3D",
    description: "A VR project management platform that transforms project timelines and dependencies into interactive 3D visualizations. Enables teams to navigate and understand complex projects through immersive experiences.",
    tags: ["VR", "Project Management", "Visualization"],
  },
  {
    title: "AI-Powered API Documentation Generator",
    shortDescription: "Automated system for generating comprehensive API documentation",
    description: "An AI tool that analyzes API code and automatically generates interactive documentation. Creates examples, explains endpoints, and maintains documentation as APIs evolve.",
    tags: ["AI", "Developer Tools", "API Documentation"],
  },
  {
    title: "Blockchain-Based Loyalty Program Aggregator",
    shortDescription: "Unified platform for managing multiple loyalty programs",
    description: "A blockchain platform that aggregates loyalty points from multiple programs into a unified system. Enables point exchange, redemption across partners, and transparent point tracking.",
    tags: ["Blockchain", "Loyalty Programs", "E-commerce"],
  },
  {
    title: "Smart Home Security Camera AI Analytics",
    shortDescription: "AI-powered analytics for security camera footage",
    description: "An intelligent security system that analyzes camera footage to identify patterns, detect anomalies, and provide actionable security insights. Reduces false alarms and provides meaningful security intelligence.",
    tags: ["AI", "Security", "Computer Vision"],
  },
  {
    title: "AR Navigation for Public Transportation",
    shortDescription: "Augmented reality navigation for buses, trains, and transit",
    description: "An AR app that overlays real-time transit information, routes, and schedules onto the real world. Helps users navigate public transportation systems with visual guidance and live updates.",
    tags: ["AR/VR", "Navigation", "Public Transit"],
  },
  {
    title: "AI-Powered Performance Profiler",
    shortDescription: "Intelligent system for identifying code performance bottlenecks",
    description: "An AI-powered profiling tool that analyzes application performance and identifies bottlenecks. Provides actionable recommendations for optimization and tracks performance improvements over time.",
    tags: ["AI", "Developer Tools", "Performance"],
  },
  {
    title: "Blockchain-Based Content Licensing Platform",
    shortDescription: "Transparent platform for licensing digital content",
    description: "A blockchain platform that manages digital content licensing with smart contracts. Ensures creators are properly compensated and provides transparent licensing terms for all parties.",
    tags: ["Blockchain", "Content", "Licensing"],
  },
];

const sampleReviews = [
  {
    content: "This is a brilliant idea! The AI-powered approach could really revolutionize code reviews and save developers tons of time.",
    rating: 5,
  },
  {
    content: "Great concept, but I'm concerned about the privacy implications of AI analyzing sensitive code. Would need strong security measures.",
    rating: 4,
  },
  {
    content: "Love the energy optimization focus! This could make a real difference in reducing household carbon footprints.",
    rating: 5,
  },
  {
    content: "The IoT integration sounds complex. Would be interested to see how reliable the sensors are in real-world conditions.",
    rating: 3,
  },
  {
    content: "VR meditation is such an innovative approach to mindfulness. The customizable environments feature is particularly appealing.",
    rating: 4,
  },
  {
    content: "Interesting idea but VR headsets might be a barrier for many people. Maybe start with mobile AR?",
    rating: 3,
  },
  {
    content: "Blockchain for supply chain transparency is exactly what we need. Consumers deserve to know where their products come from.",
    rating: 5,
  },
  {
    content: "The technical complexity of blockchain implementation might be challenging for smaller suppliers to adopt.",
    rating: 3,
  },
  {
    content: "Real-time translation during video calls would be a game-changer for international business communications.",
    rating: 5,
  },
  {
    content: "Solid concept but accuracy of real-time translation is still a major challenge, especially for technical discussions.",
    rating: 4,
  },
  {
    content: "Personalized learning platforms are the future of education. The adaptive content recommendation sounds very promising.",
    rating: 5,
  },
  {
    content: "Great idea! I'd love to see how this handles different learning disabilities and accessibility needs.",
    rating: 4,
  },
  {
    content: "Mental health support is so important. Having 24/7 access to a compassionate AI could help many people.",
    rating: 5,
  },
  {
    content: "While helpful, this should complement but never replace professional mental health care. Important to set clear boundaries.",
    rating: 4,
  },
  {
    content: "Love the sustainability focus! An app that makes eco-friendly transportation easy could drive real behavioral change.",
    rating: 5,
  },
  {
    content: "Excellent initiative. Would be great to include carbon offset options and rewards for choosing sustainable transport.",
    rating: 4,
  },
  {
    content: "AR cooking assistance is such a clever use of technology. Could really help beginners learn cooking skills.",
    rating: 4,
  },
  {
    content: "Fun idea but might be distracting while actually cooking. Safety considerations would be important.",
    rating: 3,
  },
  {
    content: "Cybersecurity tools for small businesses are desperately needed. This could help level the playing field.",
    rating: 5,
  },
  {
    content: "Good concept but would need to be very user-friendly since small business owners aren't usually security experts.",
    rating: 4,
  },
  {
    content: "Social impact marketplace is brilliant! Connecting volunteers with organizations efficiently could amplify community impact.",
    rating: 5,
  },
  {
    content: "Love this idea. Would be great to include skills-based volunteering and remote opportunities too.",
    rating: 4,
  },
  {
    content: "AI personal finance management could help people make better financial decisions. The educational component is key.",
    rating: 4,
  },
  {
    content: "Privacy concerns with financial data would need to be addressed thoroughly. Transparency in AI recommendations is crucial.",
    rating: 3,
  },
  {
    content: "Gaming performance analytics for esports is a niche but growing market. Could give competitive players a real edge.",
    rating: 4,
  },
  {
    content: "Interesting but might create an unfair advantage. Would need to consider competitive integrity.",
    rating: 3,
  },
  {
    content: "Smart agriculture is the future of farming! IoT sensors could help farmers increase yields while reducing waste.",
    rating: 5,
  },
  {
    content: "Great for tech-savvy farmers, but would need to be affordable and simple for widespread adoption.",
    rating: 4,
  },
  {
    content: "Voice-controlled shopping lists are so convenient! The AI learning consumption patterns could prevent food waste.",
    rating: 4,
  },
  {
    content: "Nice idea but I'd want strong privacy controls over what data the AI can access about my household habits.",
    rating: 3,
  },
];

async function seedDatabase() {
  try {
    console.log("🌱 Starting database seed...");

    // Clear existing data
    console.log("🗑️  Clearing existing data...");
    await db.delete(reviews);
    await db.delete(ideas);
    await db.delete(users);
    console.log("✅ Database cleared");

    // Hash passwords and create users
    console.log("Creating users...");
    const createdUsers = [];
    for (const user of testUsers) {
      const hashedPassword = await hashPassword(user.password);
      const [createdUser] = await db.insert(users).values({
        id: user.id,
        email: user.email,
        username: user.username,
        password: hashedPassword,
        bio: user.bio,
      }).returning();
      createdUsers.push(createdUser);
      console.log(`Created user: ${user.username}`);
    }

    // Distribute all ideas among all users
    console.log("Creating ideas...");
    let ideaIndex = 0;
    const createdIdeas = [];
    const EXTRA_IDEAS_FOR_FIRST_USER = 25;
    const remainingUsers = createdUsers.length - 1; // All users except the first
    const ideasForOtherUsers = sampleIdeas.length - EXTRA_IDEAS_FOR_FIRST_USER;
    const ideasPerOtherUser = Math.floor(ideasForOtherUsers / remainingUsers);
    const extraIdeasForOthers = ideasForOtherUsers % remainingUsers;

    for (let userIndex = 0; userIndex < createdUsers.length; userIndex++) {
      const user = createdUsers[userIndex];
      let ideasForThisUser;

      if (userIndex === 0) {
        // First user gets their normal share plus 25 extra ideas
        ideasForThisUser = ideasPerOtherUser + EXTRA_IDEAS_FOR_FIRST_USER;
      }
      else {
        // Other users get their share of remaining ideas
        ideasForThisUser = ideasPerOtherUser + (userIndex - 1 < extraIdeasForOthers ? 1 : 0);
      }

      for (let i = 0; i < ideasForThisUser && ideaIndex < sampleIdeas.length; i++) {
        const idea = sampleIdeas[ideaIndex];
        const [createdIdea] = await db.insert(ideas).values({
          title: idea.title,
          shortDescription: idea.shortDescription,
          description: idea.description,
          tags: JSON.stringify(idea.tags),
          authorId: user.id,
        }).returning();
        createdIdeas.push(createdIdea);
        console.log(`Created idea: ${idea.title} for ${user.username}`);
        ideaIndex++;
      }
    }

    // Create reviews - each user reviews some ideas from other users
    console.log("Creating reviews...");
    let reviewIndex = 0;
    for (const user of createdUsers) {
      // Each user will review 6 ideas (not their own)
      const otherUsersIdeas = createdIdeas.filter(idea => idea.authorId !== user.id);
      const ideasToReview = otherUsersIdeas.slice(0, 6);

      for (const idea of ideasToReview) {
        if (reviewIndex < sampleReviews.length) {
          const review = sampleReviews[reviewIndex];
          await db.insert(reviews).values({
            content: review.content,
            rating: review.rating,
            authorId: user.id,
            ideaId: idea.id,
          });
          console.log(`Created review by ${user.username} for idea ${idea.id}`);
          reviewIndex++;
        }
      }
    }

    console.log("✅ Database seeded successfully!");
    console.log(`Created ${createdUsers.length} users, ${createdIdeas.length} ideas, and reviews`);
  }
  catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase().then(() => {
  console.log("🎉 Seeding complete!");
  process.exit(0);
});
