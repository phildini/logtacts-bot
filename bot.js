var Botkit = require('botkit')
var request = require('request')
var baseUrl = process.env.LOGTACTS_URL
var options = {
  headers: {}
}

var controller = Botkit.slackbot({
  debug: false,
  json_file_store: './bot_store'
})

controller.spawn({
  token: process.env.token
}).startRTM(function(err, bot, payload){
  if (err) {
    console.error(err)
  }
})

function makeAttachment(contact) {
  var url = baseUrl + contact.id
  attachment = {
    fallback: contact.name + ' ' + url,
    title: contact.name,
    title_link: url,
  }
  if (contact.address) {
    attachment.text = contact.address
  }
  attachment.fields = []
  if (contact.cell_phone) {
    attachment.fields.push({
      title: 'Phone',
      value: contact.cell_phone,
      short: true
    })
  } else if (contact.home_phone) {
    attachment.fields.push({
      title: 'Phone',
      value: contact.home_phone,
      short: true
    })
  }
  if (contact.twitter) {
    attachment.fields.push({
      title: 'Twitter',
      value: contact.twitter,
      short: true
    })
  }
  return attachment
}

controller.hears('^auth', 'direct_message', function(bot, message){
  var parts = message.text.split(' ')
  if (parts.length > 1) {
    var token = parts[1]
    var data = {
      id: message.user,
      token: token
    }
    controller.storage.users.save(data, function(err){console.log(err)})
  } else {
    bot.reply(message, {text: "No token found"})
  }
})

controller.hears('^find', 'direct_message', function(bot,message){
  controller.storage.users.get(message.user, function(err, user_data){
    if (err || !user_data.token) {
      bot.reply(message, {
        text: 'No token found for your user. Tell me "auth {TOKEN}" and try again.'
      })
    } else {
      options.headers['Authorization'] = "Token " + user_data.token
      var parts = message.text.split(' ')
      var searchString
      if (parts.length > 1) {
        var throwaway = parts.shift()
        searchString = parts.join(' ')
      }
      options.url = baseUrl + 'api/search?q=' + searchString
      function searchCallback(error, response, body) {
        if (!error && response.statusCode == 200) {
          var results = JSON.parse(body)
          bot.reply(message, {
            text: "Here's what I found for " + searchString,
          })
          var attachments = []
          for (var i=0; i<results.length; i++) {
            bot.reply(message, {attachments:[makeAttachment(results[i])]})
          }
        } else {
          bot.reply(message, {
            text: "Hmm... something went wrong. Try double-checking your auth token?"
          })
        }
      }
      request(options, searchCallback)
    }
  })
})
