function makeAttachment(contact, logtactsURL) {
  var url = logtactsURL + contact.id
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

module.exports = {
  makeAttachment: makeAttachment
}