document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // Listen for subbmit button
  document.querySelector('#compose-form').onsubmit = sent_email

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#email').style.display = 'none';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}




function sent_email() {
  const recipients = document.querySelector('#compose-recipients').value;
  const subject = document.querySelector('#compose-subject').value;
  const body = document.querySelector('#compose-body').value;
  console.log(recipients, subject, body)

// Post email
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
        recipients: recipients,
        subject: subject,
        body: body
    })
  })
  .then(response => response.json())
  .then(result => {
      // Print result
      console.log(result);
      load_mailbox('sent');
  });
  return false;
}

function openEmail(event) {
  let email = event.currentTarget
  email = email.querySelector('.subjectTile')
  const id = email.dataset.id
  //console.log(id)

  fetch(`/emails/${id}`)
  .then(response => response.json())
  .then(email => {
    // Print email
    //console.log(email);
    if (email.read) {
      fetch(`/emails/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
            read: false
        })
      })
    }
    // Hide emails-view and show email
    document.querySelector('#emails-view').style.display = 'none';
    document.querySelector('#email').style.display = 'block';

    emailDetail = document.createElement('div');
    document.querySelector('#email').innerHTML = ""
    emailDetail.innerHTML = `<div>From: ${email.sender}</div>
                            <div>Subject: ${email.subject}</div>
                            <div>${email.body}</div>`
    document.querySelector('#email').append(emailDetail)

});

  
}


function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  //Get mailbox content
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
    // Print emails
    //console.log(emails)
      emails.forEach(element => {
      emailTile = document.createElement('div');
      emailTile.className = 'emailTile';
      if (!element.read){
        emailTile.classList.add('read');
      }
      emailTile.innerHTML = `<span class="senderTile">${element.sender}</span>|<span data-id="${element.id}" class="subjectTile">${element.subject}</span><span class="timeTile">${element.timestamp}</span>`;
      document.querySelector('#emails-view').append(emailTile);
      emailTile.onclick = openEmail
    });
    // ... do something else with emails ...
});
}