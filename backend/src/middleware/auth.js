const { supabase } = require('../lib/supabase');
const logger = require('../utils/logger');

const auth = async (req, res, next) => {
	try {
		const token = req.header('Authorization')?.replace('Bearer ', '');
		if (!token) {
			return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
		}

		// Verify JWT with Supabase and get the user
		const { data: { user }, error } = await supabase.auth.getUser(token);
		if (error || !user) {
			return res.status(401).json({ success: false, message: 'Invalid token.' });
		}

		// Attach minimal user info to request
		req.user = { id: user.id, email: user.email };
		next();
	} catch (error) {
		logger.error('Authentication error:', error);
		res.status(500).json({ success: false, message: 'Authentication failed.', error: error.message });
	}
};

module.exports = auth;