
const azure = require('azure');

//baiju
//const connStr = process.env.CONNECTION_STRING || 'Endpoint=sb://cardservicebus.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=1HNT3euOtRZyMBYn95iNU92DjbIhF4hvLFa/bf7U6JY=';
//from Doug
const connStr = process.env.CONNECTION_STRING || 'Endpoint=sb://retailpayments-bus-dev.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=xs+ooW8ikWUwLhJRVo4ajl7RBlX+EKg3RecD33Sv21Y=';

const serviceBusService = azure.createServiceBusService(connStr);

const message = {
    body: 'This is response Message',
    customProperties: {
        messagenumber: 0,
        responsetopic: ''
    }

}

serviceBusService.createSubscription('cardrequesttopic', 'AllMessages', function (error) {
    if (!error) {
        console.log('createSubscription created -----.');
    }
});


setInterval(() => {
    
    serviceBusService.receiveSubscriptionMessage('cardrequesttopic', 'AllMessages', function (error, receivedMessage) {
        if (!error) {
             console.log(receivedMessage);
            // send/publish response 
            message.customProperties.messagenumber = receivedMessage.customProperties.messagenumber;
            message.customProperties.responsetopic = 'null';
            console.log('responsetopic====> ' + receivedMessage.customProperties.responsetopic);
            serviceBusService.sendTopicMessage(receivedMessage.customProperties.responsetopic, message, function (error) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('response sent to other end ');
                }
            });
    
            // send/publish response  ends..
    
        } else {
            console.log(error);
        }
    });
}, 100);

