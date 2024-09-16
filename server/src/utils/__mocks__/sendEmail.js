const sendEmail = jest.fn().mockImplementation(async (options) => {
    return Promise.resolve();
});

module.exports = sendEmail;
