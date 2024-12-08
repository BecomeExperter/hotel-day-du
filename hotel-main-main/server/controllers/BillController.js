import Bill from '../models/Bill.js';

const getBills = async (req, res) => {
    try {
        const bills = await Bill.find()
            .populate({ path: 'booking', populate: { path: 'customerList' } })
            .populate({ path: 'booking', populate: { path: 'room' } })
            .populate('user');

        res.status(200).json({
            success: true,
            message: 'Get all bills successfully',
            bills,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error,
        });
    }
};

const getBillById = async (req, res) => {
    try {
        const { id } = req.params;
        const bill = await Bill.findById(id)
            .populate({ path: 'booking', populate: { path: 'customerList' } })
            .populate({ path: 'booking', populate: { path: 'room' } })
            .populate('user');
        if (!bill) {
            return res.status(404).json({
                success: false,
                message: 'Bill not found',
            });
        }
        res.status(200).json({
            success: true,
            message: 'Get bill successfully',
            bill,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error,
        });
    }
};

const getBillsByUserId = async (req, res) => {
    const { id } = req.params;

    try {
        const bills = await Bill.find({ user: id })
            .populate({ path: 'booking', populate: { path: 'customerList' } })
            .populate({ path: 'booking', populate: { path: 'room' } })
            .populate('user');

        if (bills.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not have any bill',
            });
        }
        res.status(200).json({
            success: true,
            message: 'Get bills successfully',
            bills,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server internal error',
            error,
        });
    }
};

const createBill = async (req, res) => {
    try {
        const { bookingId, userId, dateOfPayment, totalAmount, address } = req.body;

        // Kiểm tra tính hợp lệ của dateOfPayment
        if (!dateOfPayment || isNaN(new Date(dateOfPayment).getTime())) {
            return res.status(400).json({
                success: false,
                message: 'Invalid dateOfPayment. Please provide a valid date.',
            });
        }

        const bill = await Bill.create({
            booking: bookingId,
            user: userId,
            dateOfPayment: new Date(dateOfPayment), // Đảm bảo lưu dưới dạng đối tượng Date
            totalAmount,
            address,
        });

        if (!bill) {
            return res.status(400).json({
                success: false,
                message: 'Create bill failed',
            });
        }

        res.status(201).json({
            success: true,
            message: 'Create bill successfully',
            bill,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error,
        });
    }
};


export { getBills, getBillById, createBill, getBillsByUserId };
