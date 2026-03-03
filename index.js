// *****************************************************
// <!-- Section 1 : Import Dependencies -->
// *****************************************************

const https = require('https');
const fs = require('fs');
const express = require('express'); // To build an application server or API
const path = require('path');
const fileUpload = require('express-fileupload');
const app = express();
const handlebars = require('express-handlebars');
const pgp = require('pg-promise')(); // To connect to the Postgres DB from the node server
const bodyParser = require('body-parser');
const session = require('express-session'); // To set the session object. To store or access session data, use the `req.session`, which is (generally) serialized as JSON by the store.
const bcrypt = require('bcrypt'); //  To hash passwords
const axios = require('axios');
const { userInfo } = require('os');
const crypto = require('crypto');
const PgSession = require('connect-pg-simple')(session);

// *****************************************************
// <!-- Section 2 : Connect to DB -->
// *****************************************************


// create `ExpressHandlebars` instance and configure the layouts and partials dir.
const hbs = handlebars.create({
    extname: 'hbs',
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials',
    helpers: {
        eq: (a, b) => a === b
    }
});


// database configuration
const dbConfig = {
    host: process.env.DB_HOST, // the database server
    port: 5432, // the database port
    database: process.env.DB_NAME, // the database name
    user: process.env.DB_USER, // the user account to connect with
    password: process.env.DB_PASS, // the password of the user account
};


const db = pgp(dbConfig);

// CSP Middleware
const cspHeaders = (req, res, next) => {
    res.setHeader("Content-Security-Policy",
        "default-src 'none'; " +
        "script-src 'self' https://cdn.jsdelivr.net https://unpkg.com https://code.jquery.com; " +
        "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com; " +
        "font-src 'self' https://cdnjs.cloudflare.com; " +
        "img-src 'self' data:; " +
        "connect-src 'self'; " +
        "object-src 'none'; " +
        "base-uri 'self'; " +
        "media-src 'self'; " +
        "frame-src 'none'; " +
        "worker-src 'self'; " +
        "child-src 'none'; " +
        "form-action 'self'; " +
        "frame-ancestors 'none';"
    );

    res.setHeader('X-Frame-Options', 'DENY');
    next();
};


app.use(cspHeaders);


// test your database
db.connect()
    .then(obj => {
        console.log('Database connection successful'); // you can view this message in the docker compose logs
        obj.done(); // success, release the connection;
    })
    .catch(error => {
        console.log('ERROR:', error.message || error);
    });


// *****************************************************
// <!-- Section 3 : App Settings -->
// *****************************************************

// Register `hbs` as our view engine using its bound `engine()` function.
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.json()); // specify the usage of JSON for parsing request body.

// Trust the first proxy (Render’s HTTPS load balancer)
app.set('trust proxy', 1);
// initialize session variables
app.use(
    session({
        store: new PgSession({
            pgPromise: db,
            createTableIfMissing: true,
        }),
        name: 'strsculpt_sess_1',
        secret: process.env.SESSION_SECRET,
        saveUninitialized: false,
        resave: false,
        rolling: true,
        cookie: {
            path: '/',
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            maxAge: 60 * 60 * 1000,
        },
    })
);

app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

console.log('🟢 Server (PID ' + process.pid + ') starting up…');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload()); // Enable file upload handling middleware
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    if (!req.session.csrfToken) {
        req.session.csrfToken = crypto.randomBytes(32).toString('hex');
    }
    res.locals.csrfToken = req.session.csrfToken;
    next();
});

// *****************************************************
// <!-- Section 4 : API Routes -->
// *****************************************************
// TODO - Include your API routes here
app.get('/', (req, res) => {
    res.redirect('/calculator');
});

app.get('/welcome', (req, res) => {
    res.json({ status: 'success', message: 'Welcome!' });
});

// *****************************************************
// <!-- Section 4.1 : Register Routes -->
// *****************************************************
app.get('/register', (req, res) => {
    const errorMessage = req.session.errorMessage;
    req.session.errorMessage = null;

    if (errorMessage) {
        res.render('pages/register', { excludeNav: true, message: errorMessage });
    } else {
        res.render('pages/register', { excludeNav: true });
    }
});

// Register
app.post('/register', async (req, res) => {
    const username = req.body.username;
    if (!/^[a-zA-Z0-9_-]{3,30}$/.test(username)) {
        req.session.errorMessage = "Username must be 3-30 characters and use only letters, numbers, _ or -";
        return res.redirect('/register');
    }

    console.log("Register POST hit", req.body);
    const hash = await bcrypt.hash(req.body.password, 10);
    try {
        await db.none('INSERT INTO users (username, password) values ($1, $2)', [req.body.username, hash]);
        console.log("User inserted!");
        res.redirect('/login');
    } catch (e) {
        console.error("Registration error:", e);
        req.session.errorMessage = "Unexpected error occurred";
        res.redirect('/register');
    }
});

// *****************************************************
// <!-- Section 4.2 : Login Routes -->
// *****************************************************
app.get('/login', (req, res) => {
    const errorMessage = req.session.errorMessage; // Get the error message from the session
    req.session.errorMessage = null; // Clear the error message from the session

    // If the user entered a wrong password or username it will notifythe user
    // otherwise it will just render the login page
    // excludeNav:true (also seen in get /register) is to remove the Navbar from
    // the login page and the register page as the user should not be able to access
    // any of the other pages like settings, home or any of Wizard Wardrobes functions.
    if (errorMessage) {
        res.render('pages/login', { excludeNav: true, message: errorMessage });
    } else {
        res.render('pages/login', { excludeNav: true });
    }
});

// Login
app.post('/login', async (req, res) => {
    try {
        const user = await db.one('SELECT user_id, username, password FROM users WHERE username = $1', [req.body.username]);

        const match = await bcrypt.compare(req.body.password, user.password);

        if (match) {//User's credentials were correct, sign user in:
            const userStats = await db.oneOrNone('SELECT bodyweight, gender, unit FROM user_stats WHERE user_id = $1', [user.user_id]);

            req.session.user = {
                id: user.user_id,
                username: user.username,
                bodyweight: userStats?.bodyweight || null,
                gender: userStats?.gender || null,
                unit: userStats?.unit || null
            };
            console.log('POST /login → session.user:', req.session.user);

            await req.session.save();
            res.redirect('/home');
        } else {
            req.session.errorMessage = "Incorrect password";
            res.redirect('/login');
        }
    } catch (e) {
        console.log(e);
        req.session.errorMessage = "Username not found";
        res.redirect('/login');
    }
});


// Authentication Middleware.
const auth = (req, res, next) => {
    const publicRoutes = ['/', '/login', '/register', '/home', '/calculator', '/about', '/api/get-strength-data', '/api/get-strength-standards', '/home', '/exercises'];
    if (publicRoutes.includes(req.path) || req.path.startsWith('/exercises')) {
        return next();
    }

    // Redirect to login if not authenticated
    if (!req.session.user) {
        return res.redirect('/login');
    }

    next();
};
// Authentication Required
app.use(auth);

// *****************************************************
// <!-- Section 4.3 : Home Routes -->
// *****************************************************

app.get('/home', async (req, res) => {
    res.render('pages/home', {
        isHome: true,
        user: req.session.user,
        title: 'Strength Sculptor',
        description: 'Build true muscle balance and measure your strength level with Strength Sculptor’s fitness dashboard, designed to track balance and symmetry.',
        canonicalLink: 'home'
    });
});

// *****************************************************
// <!-- Section 4.4 : Settings Routes -->
// *****************************************************
app.get('/settings', (req, res) => {
    res.render('pages/settings', {
        title: 'Settings'
    });
});

// *****************************************************
// <!-- Section 4.5 : About Routes -->
// *****************************************************
app.get('/about', (req, res) => {
    res.render('pages/about', {
        isAbout: true,
        user: req.session.user,
        title: 'About Us - Strength Sculptor',
        description: 'Learn about us and our mission to help you get stronger, better.',
        canonicalLink: 'about'
    });
});

// *****************************************************
// <!-- Section 4.5 : Exercises Routes -->
// *****************************************************
app.get('/exercises', (req, res) => {
    res.render('pages/exercises', {
        isExercises: true,
        user: req.session.user,
        title: 'Exercise Library - Strength Sculptor',
        description: 'Strength Sculptor Exercise Library helps you learn proper form, with a muscle analysis tool built in.',
        canonicalLink: 'exercises'
    });
});

app.get('/exercises/chest', (req, res) => {
    res.render('pages/exercises/chest', {
        isExercises: true,
        user: req.session.user,
        title: 'Chest Exercise Library - Strength Sculptor',
        description: 'Chest Exercise Library with a free muscle analysis tool',
        canonicalLink: 'exercises/chest'
    });
});

app.get('/exercises/back', (req, res) => {
    res.render('pages/exercises/back', {
        isExercises: true,
        user: req.session.user,
        title: 'Back Exercise Library - Strength Sculptor',
        description: 'Back Exercise Library with a free muscle analysis tool',
        canonicalLink: 'exercises/back'
    });
});

app.get('/exercises/shoulders', (req, res) => {
    res.render('pages/exercises/shoulders', {
        isExercises: true,
        user: req.session.user,
        title: 'Shoulders Exercise Library - Strength Sculptor',
        description: 'Shoulders Exercise Library with a free muscle analysis tool',
        canonicalLink: 'exercises/shoulders'
    });
});

app.get('/exercises/arms', (req, res) => {
    res.render('pages/exercises/arms', {
        isExercises: true,
        user: req.session.user,
        title: 'Arm Exercise Library - Strength Sculptor',
        description: 'Arm Exercise Library with a free muscle analysis tool',
        canonicalLink: 'exercises/arms'
    });
});

app.get('/exercises/legs', (req, res) => {
    res.render('pages/exercises/legs', {
        isExercises: true,
        user: req.session.user,
        title: 'Legs Exercise Library - Strength Sculptor',
        description: 'Legs Exercise Library with a free muscle analysis tool',
        canonicalLink: 'exercises/legs'
    });
});

app.get('/exercises/core', (req, res) => {
    res.render('pages/exercises/core', {
        isExercises: true,
        user: req.session.user,
        title: 'Ab Exercise Library - Strength Sculptor',
        description: 'Core Exercise Library with a free muscle analysis tool',
        canonicalLink: 'exercises/core'
    });
});


// *****************************************************
// <!-- Section 5.1 : Strength Calculator Routes -->
// *****************************************************

app.get('/calculator', async (req, res) => {
    res.render('pages/calculator', {
        isCalculator: true,
        user: req.session.user,
        title: 'Strength Calculator with Muscle Analysis',
        description: 'Calculate your strength level with Strength Sculptor. Compare your lifts by bodyweight, track progress, and see how you rank against global strength standards.',
        canonicalLink: 'calculator'
    });
});

// *****************************************************
// <!-- Section X : SQL Functions -->
// *****************************************************
app.post('/api/get-strength-data', (req, res) => {
    const { bodyweight, oneRepMax, exercise, gender } = req.body;

    // SQL query with dynamic values
    const query = `
      SELECT bodyweight_lbs, one_rep_max, percentile, level
      FROM public.strength_standards
      WHERE exercise = $3 AND gender = $4   
      ORDER BY 
        ABS(bodyweight_lbs - $1),   -- User's bodyweight
        ABS(one_rep_max - $2)       -- User's one-rep max
      LIMIT 2;
    `;

    // Run the query with user values
    db.query(query, [bodyweight, oneRepMax, exercise, gender])
        .then(rows => {
            const sorted = rows.sort((a, b) => b.one_rep_max - a.one_rep_max);
            console.log(sorted);
            res.json(sorted);
        })
        .catch(error => {
            console.error('Error executing query', error.stack);
            res.status(500).send('Error executing query');
        });
});

app.post('/api/get-strength-standards', (req, res) => {
    console.log('Received body:', req.body);
    const { bodyweight, exercise, gender } = req.body;

    // SQL query with dynamic values
    const fuzzyQuery = `
      SELECT bodyweight_lbs, level, one_rep_max
        FROM public.strength_standards
        WHERE exercise = $2 AND gender = $3
        ORDER BY 
            ABS(bodyweight_lbs - $1),
            CASE level
                WHEN 'Beginner' THEN 1
                WHEN 'Intermediate' THEN 2
                WHEN 'Advanced' THEN 3
                WHEN 'Pro-Level' THEN 4
                WHEN 'World-Class' THEN 5
            END
            LIMIT 10;
    `;

    const exactQuery = `SELECT bodyweight_lbs, level, one_rep_max
        FROM public.strength_standards
        WHERE exercise = $2 AND bodyweight_lbs = $1 AND gender = $3;
			`;

    const queryUsed = (bodyweight % 10 === 0) ? exactQuery : fuzzyQuery;

    // Run the query with user values
    db.query(queryUsed, [bodyweight, exercise, gender])
        .then(result => {
            console.log(result);
            res.json(result);
        })
        .catch(error => {
            console.error('Error executing query', error.stack);
            res.status(500).send('Error executing query');
        });
});

app.post('/api/store-user-set', (req, res) => {
    // Check if the user is logged in
    if (!req.session.user) {
        return res.status(401).send('User not logged in');
    }

    const userId = req.session.user.id;
    //console.log(userId);
    const { exercise, setReps, setWeight, set1RM, percentile, muscleGroup } = req.body;

    const insertQuery = `
        INSERT INTO user_lifts (user_id, exercise, one_rep_max, set_weight, set_reps, percentile, muscle_group)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;

    db.query(insertQuery, [userId, exercise, set1RM, setWeight, setReps, percentile, muscleGroup])
        .then(() => {
            console.log('User set successfully stored!');
            res.status(200).send('Set stored');
        })
        .catch(error => {
            console.error('Error storing user set:', error.stack);
            res.status(500).send('Error storing user set');
        });
});

app.post('/update-muscle-group-percentile', (req, res) => {
    const { muscleGroup } = req.body;

    if (!muscleGroup) {
        return res.status(400).json({ success: false, message: 'Missing muscleGroup' });
    }

    const userId = req.session.user.id;

    const query = `
    WITH avg_percentile AS (
        SELECT AVG(percentile) AS avg
        FROM (
            SELECT DISTINCT ON (exercise)
                percentile
            FROM user_lifts
            WHERE user_id = $1 AND muscle_group = $2
            ORDER BY exercise, timestamp DESC
        ) latest_per_exercise
        )
        INSERT INTO user_muscle_groups (user_id, muscle_group, average_percentile, last_updated)
        SELECT $1, $2, avg, NOW() FROM avg_percentile
        ON CONFLICT (user_id, muscle_group)
        DO UPDATE SET 
            average_percentile = (SELECT avg FROM avg_percentile),
            last_updated = NOW();
  `;

    db.query(query, [userId, muscleGroup])
        .then(() => res.status(200).json({ success: true }))
        .catch(err => {
            console.error('DB error:', err);
            res.status(500).json({ success: false });
        });
});

app.post('/api/get-user-muscle-percentiles', (req, res) => {
    const userId = req.session.user.id;

    const query = `
      SELECT muscle_group, average_percentile
        FROM public.user_muscle_groups
        WHERE user_id = $1
    `;

    db.query(query, [userId])
        .then(result => {
            console.log(result);
            const percentiles = {};
            result.forEach(row => {
                percentiles[row.muscle_group] = row.average_percentile;
            });

            res.json({ success: true, percentiles });
        })
        .catch(error => {
            console.error('Error executing query', error.stack);
            res.status(500).json({ success: false, error: 'Error executing query' });
        });
});

app.post('/api/save-user-stats', async (req, res) => {
    const { genderInput, bodyweightInput, unit } = req.body;
    const userId = req.session.user.id;

    //FUTURE: add bodyweight_logs table (user_id, bodyweight, unit)with recorded_at TIMESTAMPTZ DEFAULT NOW() so that users can track their weight over time

    try {
        await db.query(
            `
      INSERT INTO user_stats (user_id, gender, bodyweight, unit)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (user_id)
      DO UPDATE SET gender = EXCLUDED.gender, bodyweight = EXCLUDED.bodyweight, unit = EXCLUDED.unit
      `,
            [userId, genderInput, bodyweightInput, unit]
        );

        res.redirect('/calculator');
    } catch (err) {
        console.error('Failed to save user stats:', err);
        res.sendStatus(500);
    }
});



// *****************************************************
// <!-- Section Y : Logout Routes -->
// *****************************************************
app.post('/logout', async (req, res) => {
    req.session.destroy();
    res.render('pages/login', { excludeNav: true });
});

// *****************************************************
// <!-- Section Z : Start Server-->
// *****************************************************

if (process.env.NODE_ENV !== 'production') {
    const options = {
        key: fs.readFileSync('./certifications/localhost+2-key.pem'),
        cert: fs.readFileSync('./certifications/localhost+2.pem'),
    };
    https.createServer(options, app).listen(3000, () =>
        console.log('HTTPS Server running on port 3000')
    );
} else {
    app.listen(process.env.PORT || 3000, () =>
        console.log('App running in production...')
    );
}
