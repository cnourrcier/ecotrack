const sendEmail = jest.fn().mockImplementation(async (options) => {
    console.log('Mocked email sent:', options);
    return Promise.resolve();
});

module.exports = sendEmail;