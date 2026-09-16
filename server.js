// ১. নতুন অ্যাকাউন্ট তৈরির রাউট (Sign Up)
app.post('/api/register', async (req, res) => {
    try {
        const { username, contact, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = new User({
            username,
            contact,
            password: hashedPassword,
            isVerified: false
        });

        await newUser.save();
        res.status(201).json({ message: "অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!", userId: newUser._id });
    } catch (err) {
        res.status(500).json({ error: "রেজিস্ট্রেশন করতে সমস্যা হয়েছে।" });
    }
});

// ২. লগইন রাউট
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        
        if (!user) {
            return res.status(404).json({ error: "Account not found / অ্যাকাউন্ট পাওয়া যায়নি।" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "ভুল পাসওয়ার্ড!" });
        }

        res.status(200).json({ message: "লগইন সফল হয়েছে!", user });
    } catch (err) {
        res.status(500).json({ error: "লগইন করতে সমস্যা হয়েছে।" });
    }
});

// ৩. পাসওয়ার্ড যাচাইসহ নাম পরিবর্তনের রাউট
app.post('/api/update-name', async (req, res) => {
    try {
        const { userId, newUsername, password } = req.body;
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ error: "ইউজার পাওয়া যায়নি।" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "ভুল পাসওয়ার্ড! পাসওয়ার্ড সঠিক না দিলে নাম পরিবর্তন করা যাবে না।" });
        }

        user.username = newUsername;
        await user.save();

        res.status(200).json({ message: "নাম সফলভাবে পরিবর্তন করা হয়েছে!", user });
    } catch (err) {
        res.status(500).json({ error: "নাম পরিবর্তন করতে সমস্যা হয়েছে।" });
    }
});