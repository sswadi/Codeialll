const nodemailer = require('../config/nodemailer');
const nodeMailer = require('../config/nodemailer');

exports.newComment = (comment) => {

    let htmlString = nodemailer.renderTemplate({comment: comment}, '/comments/new_comment.ejs');

    nodeMailer.transporter.sendMail({
        from: 'Codeial@gmail.com',
        to: comment.user.email,
        subject: "New Comment Published",
        html: htmlString,
    }).then(info => {
        console.log('Message sent!', info);
        return;
    }).catch(err => {
        console.log('Error in sending mail', err);
        return;
    });
}