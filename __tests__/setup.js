import { config as configDotenv } from 'dotenv';

// Charger les variables d'environnement pour les tests
configDotenv();

// Configuration globale pour les tests
global.testTimeout = 10000;
