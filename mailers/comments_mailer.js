const nodeMailer = require('../config/nodemailer');

exports.newComment = (commnet) => {

    nodeMailer.transporter.sendMail({
        from: 'Codeial@gmail.com',
        to: Comment.user.email,
        subject: "New Comment Published",
        html: '<h1> Your comment is now published </h1>',
    }).then(info => {
        console.log('Message sent!', info);
        return;
    }).catch(err => {
        console.log('Error in sending mail', err);
        return;
    })
}