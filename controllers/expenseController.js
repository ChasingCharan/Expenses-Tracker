const Expense = require("../models/Expense");
const User = require("../models/User");

exports.addExpense = async (req, res) => {

    try {
        const { description, amount, category } = req.body;

        const userId = req.user.id;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const expense = await Expense.create({ description, amount, category, userId });

        await user.update({ totalExpenses: Number(user.totalExpenses) + Number(amount) });

        res.status(201).json({ message: "Expense added successfully", expense });
    } catch (error) {
        console.error("Error adding expense:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

exports.getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.findAll({ where: { userId: req.user.id } });

        res.status(200).json(expenses);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};


exports.updateExpense = async (req, res) => {
    try {
        const id = req.params.id;
        const { description, amount, category } = req.body;

        console.log(req.body);
        console.log(req.params);

        const expense = await Expense.findOne({ where: { id, userId: req.user.id } });

        if (!expense) return res.status(404).json({ message: "Expense not found" });    

        expense.description = description;
        expense.amount = amount;
        expense.category = category;

        await expense.save();

        res.status(200).json({ message: "Expense updated successfully", expense });    
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
}

exports.deleteExpense = async (req, res) => {

    try {
        const id = req.params.id;
        
        const expense = await Expense.findOne({ where: { id, userId: req.user.id } });
        if (!expense) return res.status(404).json({ message: "Expense not found" });

        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const updatedTotalExpenses = Number(user.totalExpenses) - Number(expense.amount);        
        await User.update({ totalExpenses: updatedTotalExpenses }, { where: { id: req.user.id } });
        

        await expense.destroy();
        res.json({ message: "Expense deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};