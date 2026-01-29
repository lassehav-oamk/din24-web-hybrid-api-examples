// Here we have the simulated user databse

const users = [
    {
        id: 2354,
        name: 'Zayaan Camacho',
        email: 'zayaan@demo.com'
    },
    {
        id: 6553,
        name: 'Eliza Mccullough',
        email: 'eliza@demo.com'
    },
    {
        id: 3248,
        name: 'Eloise Wade',
        email: 'eloise@demo.com'
    },
    {
        id: 8729,
        name: 'Ptolemy Cervantes',
        email: 'ptolemy@demo.com'
    }
]

module.exports = function userHeaderReader(req, res, next) {
    const userIdFromHeader = req.get('user-id');
    // if we have a user id in the header, then try to find that user in our "database"

    // if found, then attach the user object to req.user

    // remember to call next at the end of the middleware
    next();
}