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
      description: 'Avisos sobre consultas e procedimentos veterinários.',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 150, 250],
      lightColor: '#1C8DA3',
    });
  }
}

function parseLocalDateTime(value) {
  if (!value || typeof value !== 'string') return null;
  const normalized = value.trim().replace(' ', 'T');
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(normalized);

  if (!match) return null;
  const [, yearText, monthText, dayText, hourText, minuteText, secondText = '0'] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const hour = Number(hourText);
  const minute = Number(minuteText);
  const second = Number(secondText);
  const date = new Date(year, month - 1, day, hour, minute, second, 0);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day ||
    date.getHours() !== hour ||
    date.getMinutes() !== minute ||
    date.getSeconds() !== second
  ) return null;

  return date;
}

export async function scheduleAppointmentReminder(appointment) {
  const appointmentDate = parseLocalDateTime(appointment.dataHora);

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

  const reminderDate = new Date(appointmentDate.getTime() - 30 * 60 * 1000);
  const triggerDate = reminderDate.getTime() > Date.now() ? reminderDate : appointmentDate;

  return Notifications.scheduleNotificationAsync({
    content: {
      title: 'Lembrete de cuidado 🐾',
      body: `${appointment.motivo || 'Consulta veterinária'} está agendado para ${appointment.dataHora.replace('T', ' ')}.`,
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
