const User = require("../models/user.js");

// Render Signup Form
module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup");
};

// Signup Logic
module.exports.signup = async (req, res, next) => {
    try {
        let { username, email, password } = req.body;

        const newUser = new User({
            email,
            username,
        });

        const registeredUser = await User.register(
            newUser,
            password
        );

        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }

            req.flash("success", "Welcome to Wanderlust!");
            res.redirect("/listings");
        });

    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
};

// Render Login Form
module.exports.renderLoginForm = (req, res) => {
    res.render("users/login");
};

// Login Logic
module.exports.login = async (req, res) => {
    req.flash("success", "Welcome Back!");

    let redirectUrl = res.locals.redirectUrl || "/listings";

    delete req.session.redirectUrl;

    res.redirect(redirectUrl);
};

// Logout Logic
module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }

        req.flash("success", "You are Logged Out");
        res.redirect("/listings");
    });
};