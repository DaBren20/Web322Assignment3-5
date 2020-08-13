const userPassport = require('passport').Strategy
const bcrypt = require('bcryptjs')

function initialize(passport) {
    const authUser = (email, password, done) => {
        const user = getUserByEmail(email)
        if (user == null) {
            return done(null, false, {
                message: 'User does not exist'
            })
        }

        try {
            if (await bcrypt.conpare(password, user.password)) {
                return done(null, user)
            }

            else {
                return done(null, false, {
                    message: 'Password incorrect'
                })
            }
        }
        catch(err) {
            return done(e)
        }
    }
}

module.exports = initialize