'use strict';

/**
 * Middleware de limitation de taux sécurisé
 * Protège contre les attaques de brute force et les abus d'API
 */

const rateLimit = require('express-rate-limit');

module.exports = (config, { strapi }) => {
  return rateLimit({
    windowMs: process.env.RATE_LIMIT_WINDOW || 60000, // 1 minute par défaut
    max: process.env.RATE_LIMIT_MAX || 100, // 100 requêtes par minute par défaut
    message: {
      error: 'Trop de requêtes',
      message: 'Limite de taux dépassée, veuillez réessayer plus tard.',
      statusCode: 429
    },
    standardHeaders: true, // Retourne les headers `RateLimit-*` 
    legacyHeaders: false, // Désactive les headers `X-RateLimit-*`
    
    // Personnalisation par utilisateur seulement (évite les problèmes IPv6)
    keyGenerator: (req) => {
      // Utiliser l'ID utilisateur si connecté, sinon une clé générique
      const userId = req.state?.user?.id;
      return userId ? `user_${userId}` : 'anonymous';
    },
    
    // Skip certaines requêtes
    skip: (req) => {
      // Skip les requêtes d'assets statiques
      if (req.url.startsWith('/uploads/') || req.url.startsWith('/favicon')) {
        return true;
      }
      
      // Skip les webhooks (ils ont leur propre sécurité)
      if (req.url.includes('/webhook')) {
        return true;
      }
      
      return false;
    },
    
    // Handler personnalisé pour les dépassements
    handler: (req, res) => {
      strapi.log.warn(`Rate limit dépassé pour ${req.ip}`, {
        ip: req.ip,
        url: req.url,
        userAgent: req.get('User-Agent'),
        userId: req.state?.user?.id || 'anonymous'
      });
      
      res.status(429).json({
        error: 'Rate limit exceeded',
        message: 'Trop de requêtes. Veuillez patienter avant de réessayer.',
        retryAfter: Math.round(60) // secondes
      });
    }
  });
};
