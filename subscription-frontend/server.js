const express = require('express');
const path = require('path');
const app = express();

// Set up EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files (CSS, images)
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.redirect('/pricing');
});

app.get('/pricing', (req, res) => {
    const plans = [
        {
            id: 'basic',
            name: 'Basic',
            price: '$9.99',
            period: '/month',
            features: [
                '5 IP Assets',
                'Basic Analytics',
                'Email Support',
                'Standard Processing'
            ],
            popular: false
        },
        {
            id: 'pro',
            name: 'Pro',
            price: '$29.99',
            period: '/month',
            features: [
                '50 IP Assets',
                'Advanced Analytics',
                'Priority Support',
                'Fast Processing',
                'API Access'
            ],
            popular: true
        },
        {
            id: 'enterprise',
            name: 'Enterprise',
            price: '$99.99',
            period: '/month',
            features: [
                'Unlimited IP Assets',
                'Premium Analytics',
                '24/7 Support',
                'Instant Processing',
                'Full API Access',
                'Custom Integrations',
                'Dedicated Account Manager'
            ],
            popular: false
        }
    ];
    
    res.render('pricing', { plans });
});

app.get('/payment', (req, res) => {
    const planId = req.query.plan;
    const planName = req.query.name;
    const planPrice = req.query.price;
    
    if (!planId || !planName || !planPrice) {
        return res.redirect('/pricing');
    }
    
    res.render('payment', {
        planId,
        planName,
        planPrice,
        qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=DummyPayment_${planId}_${Date.now()}`
    });
});

app.post('/simulate-payment', (req, res) => {
    const { planId, planName, planPrice } = req.body;
    
    // Simulate payment processing delay
    setTimeout(() => {
        res.redirect('/success');
    }, 1000);
});

app.get('/success', (req, res) => {
    res.render('success');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
