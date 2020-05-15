import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { moment } from 'meteor/momentjs:moment';
import Screenings from '../../models/screenings.js';
import Notifications from '../../models/notifications';
import NotificationTemplates from '../../models/notification_templates';

const processScreenings = {
  isGreaterThan10days(sDate, refDate = new Date()) {
    check(sDate, Date);
    const tenDaysAfter = moment(refDate).add(9 * 24, 'hours');

    return moment(sDate).isAfter(tenDaysAfter);
  },

  isBetween9and3days(sDate, refDate = new Date()) {
    check(sDate, Date);
    const nineDaysBefore = moment(refDate).add(9 * 24, 'hours').toDate();
    const fourDaysBefore = moment(refDate).add(2 * 24, 'hours').toDate();

    return moment(sDate).isBetween(fourDaysBefore, nineDaysBefore, null, '[]');
  },

  isLowerThan3days(sDate, refDate = new Date()) {
    // const threeDaysBefore = moment(refDate).add(3, 'days').toDate();
    const fourDaysBefore = moment(refDate).add(72, 'hours').toDate();

    check(sDate, Date);
    return moment(sDate).isSameOrBefore(fourDaysBefore);
  },

  isAt10thDayBefore(sDate, refDate = new Date()) {
    check(sDate, Date);
    const at9thDayBefore = moment(refDate).add(9 * 24, 'hours').toDate();
    const at10thDayBefore = moment(refDate).add(10 * 24, 'hours').toDate();

    return moment(sDate).isBetween(at9thDayBefore, at10thDayBefore, null, '[]');
  },

  is7daysBefore(sDate, refDate = new Date()) {
    check(sDate, Date);
    const sevenDaysBefore = moment(refDate).add(7 * 24, 'hours').toDate();

    return moment(sDate).isSameOrBefore(sevenDaysBefore);
  },

  is5daysBefore(sDate, refDate = new Date()) {
    check(sDate, Date);
    const fiveDaysBefore = moment(refDate).add(5 * 24, 'hours').toDate();

    return moment(sDate).isSameOrBefore(fiveDaysBefore);
  },


  is2daysBefore(sDate, refDate = new Date()) {
    check(sDate, Date);
    const twoDaysBefore = moment(refDate).add(48, 'hours').toDate();

    return moment(sDate).isSameOrBefore(twoDaysBefore);
  },

  is36hoursBefore(sDate, refDate = new Date()) {
    check(sDate, Date);
    const twoDaysBefore = moment(refDate).add(36, 'hours').toDate();

    return moment(sDate).isSameOrBefore(twoDaysBefore);
  },

  is1dayBefore(sDate, refDate = new Date()) {
    check(sDate, Date);
    const oneDayBefore = moment(refDate).add(24, 'hours').toDate();

    return moment(sDate).isSameOrBefore(oneDayBefore);
  },

  was24hoursAgo(sDate, refDate = new Date()) {
    check(sDate, Date);
    const fortyHours = moment(refDate).subtract(24, 'hours').toDate();

    return moment(fortyHours).isSameOrAfter(sDate);
  },

  was1weekAgo(sDate, refDate = new Date()) {
    check(sDate, Date);
    const sevenDays = moment(refDate).subtract(7 * 24, 'hours').toDate();

    return moment(sevenDays).isSameOrAfter(sDate);
  },

  was3monthsAgo(sDate, refDate = new Date()) {
    check(sDate, Date);
    const threeMonths = moment(refDate).subtract(3, 'months').toDate();

    return moment(threeMonths).isSameOrAfter(sDate);
  },

  process(s) {
    if (s.status === 'Agendada') {
      processScreenings.processAgendada(s);
    } else if (s.status === 'Confirmada') {
      processScreenings.processConfirmada(s);
    } else if (s.status === 'Pendente') {
      processScreenings.processPendente(s);
    } else if (s.status === 'Concluída') {
      processScreenings.processConcluida(s);
    } else if (s.status === 'Rascunho') {
      processScreenings.processRascunho(s);
    } else if (s.status === 'Cancelada') {
      // processScreenings.processCancelada(s);
    } else {
      console.log('NÃO ENCONTRADO FUNCAO PARA PROCESSAR STATUS', s.status, s._id);
    }
  },

  processAgendada(s) {
    // Agendada - Sessão agendada entre 3 dias de antecedência
    // ou menos, enviar e-mail confirm_scheduling_3 e trocar status para confirmada
    if (processScreenings.isLowerThan3days(s.date, s.created_at)) {
      processScreenings.createNotification(s, 'confirm_scheduling_3');
      // Agendada - Sessão agendada entre 9 e 4 dias de antecedência,
      //  enviar e-mail confirm_scheduling_9 e trocar status para confirmada
      processScreenings.updateStatus(s, 'Confirmada');
    } else if (processScreenings.isBetween9and3days(s.date, s.created_at)) {
      processScreenings.createNotification(s, 'confirm_scheduling_9');
      // Agendada - Sessão agendada com 10 dias ou mais de antecedência,
      // enviar e-mail confirm_scheduling_10 e trocar status para confirmada
      processScreenings.updateStatus(s, 'Confirmada');
    } else if (processScreenings.isGreaterThan10days(s.date, s.created_at)) {
      // Agendada - Sessão agendada com 10 dias ou mais de antecedência,
      processScreenings.createNotification(s, 'confirm_scheduling_10');
      processScreenings.updateStatus(s, 'Confirmada');
    }
  },

  processConfirmada(s) {
    if (processScreenings.isLowerThan3days(s.date, s.created_at)) {
      if (processScreenings.is36hoursBefore(s.date)) {
        processScreenings.createNotification(s, 'send_the_movie');
      }
    } else if (processScreenings.isBetween9and3days(s.date, s.created_at)) {
      if (processScreenings.is2daysBefore(s.date)) {
        processScreenings.createNotification(s, 'send_the_movie');
      }
    } else if (processScreenings.isGreaterThan10days(s.date, s.created_at)) {
      if (processScreenings.is5daysBefore(s.date)) {
        processScreenings.createNotification(s, 'send_the_movie');
      } else if (processScreenings.is7daysBefore(s.date)) {
        processScreenings.createNotification(s, 'confirm_screening_date');
      }
    }
    // Confirmada - Data da Sessão agendada ultrapassou o momento presente
    // trocar status para pendente
    if (s.date < new Date()) {
      processScreenings.updateStatus(s, 'Pendente');
    }
  },

  processPendente(s) {
    // Pendente - Enviar e-mail 40h depois da sessão ask_for_report
    if (processScreenings.was1weekAgo(s.date)) {
      processScreenings.createNotification(s, 'ask_for_report_take2');
    // Pendente - Enviar e-mail 1 semana depois da sessão ask_for_report_take2
    } else if (processScreenings.was24hoursAgo(s.date)) {
      processScreenings.createNotification(s, 'ask_for_report');
    }
  },

  processConcluida(s) {
    // Concluída - Após preencher relatório, trocar o status e
    // enviar e-mail 3 meses depois da sessão tell_ambassador_the_results
    if (processScreenings.was3monthsAgo(s.date)) {
      processScreenings.createNotification(s, 'tell_ambassador_the_results');
    }
  },

  processRascunho(s) {
    // Rascunho - Troca o status no admin via form
    // try to send first notification
    processScreenings.createNotification(s, 'draft_weekly_remember');

    const varsData = processScreenings.loadData(s);
    const nt = processScreenings.loadTemplate('draft_weekly_remember', varsData);
    const alreadyCreated = Notifications.find({
      userId: varsData.ambassador._id,
      screeningId: varsData.screening._id,
      notificationTemplateId: nt._id,
    }, { sort: { deliveredAt: 1 } }).fetch();

    const sevenDays = moment(alreadyCreated[0].deliveredAt).add(7, 'day').toDate();
    // console.log(sevenDays);

    if ((alreadyCreated.length <= 4) && moment(alreadyCreated[0].deliveredAt).isSameOrAfter(sevenDays)) {
      processScreenings.createNotification(s, 'draft_weekly_remember', false);
    }
  },

  autoStart() {
    Screenings.find({}).map((doc) => processScreenings.process(doc));
  },

  loadData(s) {
    return {
      screening: s,
      film: s.film(),
      ambassador: s.ambassador(),
      absoluteurl: Meteor.absoluteUrl(),
    };
  },

  loadTemplate(templateName) {
    const t = NotificationTemplates.find({ trigger: templateName }).fetch();
    // const hasFilmTemplate = t.filter((v) => v.filmId !== undefined);
    const defaultFilmTemplate = t;

    // if (hasFilmTemplate.length > 0) {
    //   return hasFilmTemplate[0];
    // }

    if (defaultFilmTemplate.length > 0) {
      return defaultFilmTemplate[0];
    }

    return false;
  },

  // 4. carregar template e verificar se existe específico para o filme
  updateStatus(s, newStatus) {
    return Screenings.update({ _id: s._id }, { $set: { status: newStatus } });
  },

  // 3. verificar se notificação já foi criada
  createNotification(s, templateName, unique = true) {
    const varsData = processScreenings.loadData(s);
    const nt = processScreenings.loadTemplate(templateName, varsData);
    const alreadyCreated = Notifications.find({
      userId: varsData.ambassador._id,
      screeningId: varsData.screening._id,
      notificationTemplateId: nt._id,
    });

    return alreadyCreated.count() > 0 && unique ? false : Notifications.insert({
      notificationTemplateId: nt._id,
      userId: varsData.ambassador._id,
      screeningId: varsData.screening._id,
    });
  }, // 5. criar notificação para enviar e-mail
};

// Regras para sessões por status:

// Cancelada - Após preencher relatório, a resposta para público real for zero, trocar o status

// Arquivada - Troca o status no admin via form

export default processScreenings;
