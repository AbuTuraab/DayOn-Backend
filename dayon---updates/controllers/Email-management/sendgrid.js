const sgMail = require('@sendgrid/mail');

const sendEmail = async(email_body, email_subject,)=>{
    sgMail.setApiKey(process.env.SENDGRID_KEY);
     const msg = {
         to: 'bolexguy@gmail.com', // Change to your recipient
         from: {email:'noreply@dartcash.com.ng', name: "Fumbol software", }, // Change to your verified sender
         subject: email_subject,
         html: email_body,
       }
       sgMail
         .send(msg)
         .then(() => {
           console.log('Email sent')
         })
         .catch((error) => {
           console.error(error)
         })
   }

   module.exports ={
    sendEmail
   }