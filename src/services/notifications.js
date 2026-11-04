import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function configureNotifications() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('appointment-reminders', {
      name: 'Lembretes de consultas',
      description: 'Avisos sobre consultas e procedimentos agendados para os pets.',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 150, 250],
      lightColor: '#1C8DA3',
    });
  }
}

function parseLocalDateTime(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})$/.exec(value?.trim() || '');
  if (!match) return null;

  const [, year, month, day, hour, minute] = match.map(Number);
  const date = new Date(year, month - 1, day, hour, minute, 0, 0);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day ||
    date.getHours() !== hour ||
    date.getMinutes() !== minute
  ) {
    return null;
  }

  return date;
}

export async function scheduleAppointmentReminder(appointment) {
  const appointmentDate = parseLocalDateTime(appointment.data);

  if (!appointmentDate || appointmentDate.getTime() <= Date.now()) {
    throw new Error('Informe uma data futura válida no formato AAAA-MM-DD HH:mm.');
  }

  await configureNotifications();

  let permission = await Notifications.getPermissionsAsync();
  if (permission.status !== 'granted') {
    permission = await Notifications.requestPermissionsAsync();
  }

  if (permission.status !== 'granted') {
    throw new Error('A permissão de notificações não foi concedida neste dispositivo.');
  }

  const thirtyMinutesBefore = new Date(appointmentDate.getTime() - 30 * 60 * 1000);
  const triggerDate =
    thirtyMinutesBefore.getTime() > Date.now() ? thirtyMinutesBefore : appointmentDate;

  return Notifications.scheduleNotificationAsync({
    content: {
      title: 'Lembrete de cuidado 🐾',
      body: `${appointment.tipo} está agendado para ${appointment.data}.`,
      sound: true,
      data: {
        screen: 'Agendamentos',
        appointmentId: appointment.id ? String(appointment.id) : null,
      },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: triggerDate,
      channelId: 'appointment-reminders',
    },
  });
}

export async function cancelAppointmentReminders(appointmentId) {
  if (!appointmentId) return;

  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  const matching = scheduled.filter(
    (item) => String(item.content?.data?.appointmentId) === String(appointmentId)
  );

  await Promise.all(
    matching.map((item) => Notifications.cancelScheduledNotificationAsync(item.identifier))
  );
}
