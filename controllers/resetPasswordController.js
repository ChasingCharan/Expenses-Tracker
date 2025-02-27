const uuid = require('uuid');
const bcrypt = require('bcrypt');
const SibApiV3Sdk = require('sib-api-v3-sdk');
require('dotenv').config();

const ForgotPassword = require('../models/forgotpassword');
const User = require('../models/User');
const { text } = require('body-parser');

const client = SibApiV3Sdk.ApiClient.instance;
const apiKey = client.authentications['api-key'];
apiKey.apiKey = process.env.SENDINBLUE_API_KEY;


exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const id = uuid.v4();
        await ForgotPassword.create({ id, userId: user.id, active: true, expiresBy: new Date(Date.now() + 3600000) });

        const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

        const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
        sendSmtpEmail.sender = { email: 'swammy262@gmail.com' };
        sendSmtpEmail.to = [{ email }];
        sendSmtpEmail.subject = 'Reset Password';
        sendSmtpEmail.htmlContent = `<p>Click the link below to reset your password:</p> 
                                     <a href="http://localhost:3000/api/password/resetpassword/${id}">Reset Password</a>`;

        const response =await tranEmailApi.sendTransacEmail(sendSmtpEmail);
        console.log("Email sent successfully:", response);
    
        res.status(200).json({ message: "Password reset link sent to your email!" });
    } catch (error) {
        console.error("Error sending password reset email:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

// reset password

exports.resetPassword = async (req, res) => {
    const id = req.params.id;
    ForgotPassword.findOne({ where: { id } })
    .then((forgotpassword) => {
        if(forgotpassword){
            forgotpassword.update({ active: false });
            res.status(200).send(`
                                    <!DOCTYPE html>
                                    <html lang="en">
                                    <head>
                                        <meta charset="UTF-8">
                                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                        <title>Document</title>
                                        <script>
                                            function formsubmitted(e){
                                                e.preventDefault();
                                                console.log('called')
                                            }
                                        </script>
                                    </head>
                                    <body>
                                        <form action="/api/password/updatepassword/${id}" method="get">
                                            <label for="newpassword">Enter New password</label>
                                            <input name="newpassword" type="password" required></input>
                                            <button>reset password</button>
                                        </form>
                                    </body>
                                    </html>

                                `)
            res.end()
        }
    })
};

// update password
exports.updatePassword = async (req, res) => {
    try {
        console.log("Request body:", req.query);
        console.log("Request params:", req.params);

        const { newpassword } = req.query;
        const { resetpasswordid } = req.params;

        if (!newpassword) {
            return res.status(400).json({ error: "New password is required", success: false });
        }

        const forgotpassword = await ForgotPassword.findOne({ where: { id: resetpasswordid } });
        if (!forgotpassword) {
            return res.status(404).json({ error: "Invalid password reset link", success: false });
        }

        const user = await User.findOne({ where: { id: forgotpassword.userId } });
        if (!user) {
            return res.status(404).json({ error: "User not found", success: false });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newpassword, saltRounds);

        await user.update({ password: hashedPassword });
        await forgotpassword.update({ active: false });

        return res.status(200).json({ message: "Password updated successfully", success: true });

    } catch (error) {
        console.error("Error updating password:", error);
        return res.status(500).json({ error: "Internal Server Error", success: false });
    }
};
