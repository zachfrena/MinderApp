const req = {
  actionIdentifier: 'expo.modules.notifications.actions.DEFAULT',
  notification: {
    date: 1646098664.787565,
    request: {
      content: {
        summaryArgumentCount: 0,
        targetContentIdentifier: null,
        threadIdentifier: '',
        attachments: [],
        categoryIdentifier: '',
        summaryArgument: null,
        data: {
          reminderDate: '2020-01-01',
          reminderTime: '6:37 pm',
          reminderType: 'exercise',
          reminderID: '123456789',
        },
        title: 'Reminder Tile',
        subtitle: null,
        badge: null,
        launchImageName: '',
        sound: 'default',
        body: 'Reminder Body here...',
      },
      identifier: '77B70076-C5B0-427E-B01F-E07B508FC34E',
      trigger: {
        payload: {
          body: {
            reminderID: '123456789',
            reminderType: 'exercise',
            reminderTime: '6:37 pm',
            reminderDate: '2020-01-01',
          },
          aps: {
            sound: 'default',
            alert: {
              body: 'Reminder Body here...',
              'launch-image': '',
              title: 'Reminder Tile',
              subtitle: '',
            },
            category: '',
            'thread-id': '',
          },
          scopeKey: '@aleakos/NHFrontEnd',
          projectId: null,
          experienceId: '@aleakos/NHFrontEnd',
        },
        type: 'push',
        class: 'UNPushNotificationTrigger',
      },
    },
  },
};

// console.log(req.request.trigger.payload);
console.log(req.notification.request.content.body);
console.log(req.notification.request.content.title);
console.log(req.notification.request.content.data);
