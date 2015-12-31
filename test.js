var tap = require('tap')
var utils = require('./utils')

tap.test('Check output of makeAttachment on full contact', function(t){
    var contact = {
        id: 1,
        name: 'Philip James',
        address: '1600 Pennsylvania Avenue',
        cell_phone: '8675309',
        twitter: '@phildini',
    }
    var expected = {
        fallback: 'Philip James https://www.logtacts.com/1',
        title: 'Philip James',
        title_link: 'https://www.logtacts.com/1',
        text: '1600 Pennsylvania Avenue',
        fields: [
            {
                title: 'Phone',
                value: '8675309',
                short: true
            },
            {
                title: 'Twitter',
                value: '@phildini',
                short: true
            }
        ]
    }
    t.similar(
        utils.makeAttachment(contact, 'https://www.logtacts.com/'),
        expected
    )
    t.end()
})

tap.test('Check output of makeAttachment without address', function(t){
    var contact = {
        id: 1,
        name: 'Philip James',
        cell_phone: '8675309',
        twitter: '@phildini',
    }
    var expected = {
        fallback: 'Philip James https://www.logtacts.com/1',
        title: 'Philip James',
        title_link: 'https://www.logtacts.com/1',
        fields: [
            {
                title: 'Phone',
                value: '8675309',
                short: true
            },
            {
                title: 'Twitter',
                value: '@phildini',
                short: true
            }
        ]
    }
    t.similar(
        utils.makeAttachment(contact, 'https://www.logtacts.com/'),
        expected
    )
    t.end()
})