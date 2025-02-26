const User = require('../models/User');


exports.getUserWithTotalExpenses = async (req, res) => {
    try {
        const user = await User.findAll({
            attributes: ['username', 'totalExpenses']
        });     

        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
}