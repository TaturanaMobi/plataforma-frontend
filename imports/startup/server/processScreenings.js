import { check } from 'meteor/check';
import { moment } from 'meteor/momentjs:moment';
import Screenings from '../../models/screenings.js';
import Notifications from '../../models/notifications';
import NotificationTemplates from '../../models/notification_templates';

const processScreenings = {
  isGreaterThan10days(sDate, refDate = new Date()) {
    check(sDate, Date);
    const tenDaysAfter = moment(refDate).add(10, 'days');

    return moment(sDate).isSameOrAfter(tenDaysAfter);
  },

  isBetween9and4days(sDate, refDate = new Date()) {
    check(sDate, Date);
    const nineDaysBefore = moment(refDate).add(9, 'days').toDate();
    const fourDaysBefore = moment(refDate).add(4, 'days').toDate();

    return moment(sDate).isBetween(fourDaysBefore, nineDaysBefore, null, '[]');
  },

  isLowerThan3days(sDate, refDate = new Date()) {
    const threeDaysBefore = moment(refDate).add(3, 'days').toDate();

    check(sDate, Date);
    return moment(sDate).isSameOrAfter(threeDaysBefore, 'seconds');
  },

  isAt10thDayBefore(sDate, refDate = new Date()) {
    check(sDate, Date);
    const at10thDayBefore = moment(refDate).add(10, 'days').toDate();

    return moment(sDate).isSame(at10thDayBefore, 'day');
  },

  is7daysBefore(sDate, refDate = new Date()) {
    check(sDate, Date);
    const sevenDaysBefore = moment(refDate).add(7, 'days').toDate();

    return moment(sDate).isSameOrBefore(sevenDaysBefore, 'day');
  },

  is2daysBefore(sDate, refDate = new Date()) {
    check(sDate, Date);
    const twoDaysBefore = moment(refDate).subtract(2, 'days').toDate();

    return moment(sDate).isSame(twoDaysBefore, 'day');
  },

  is1dayBefore(sDate, refDate = new Date()) {
    check(sDate, Date);
    const oneDayBefore = moment(refDate).subtract(1, 'days').toDate();

    return moment(sDate).isSame(oneDayBefore, 'day');
  },

  was40hoursAgo(sDate, refDate = new Date()) {
    check(sDate, Date);
    const fortyHoursAfter = moment(refDate).subtract(40, 'hours').toDate();

    return moment(fortyHoursAfter).isSameOrAfter(sDate);
  },

  was1weekAgo(sDate, refDate = new Date()) {
    check(sDate, Date);
    const fortyHoursAfter = moment(refDate).subtract(1, 'weeks').toDate();

    return moment(fortyHoursAfter).isSameOrAfter(sDate);
  },

  was3monthsAgo(sDate, refDate = new Date()) {
    check(sDate, Date);
    const fortyHoursAfter = moment(refDate).subtract(3, 'months').toDate();

    return moment(fortyHoursAfter).isSameOrAfter(sDate);
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
    } else {
      console.log('NÃO ENCONTRADO FUNCAO PARA PROCESSAR STATUS', s.status, s._id);
    }
  },

  processAgendada(s) {
    // Agendada - Sessão agendada entre 3 dias de antecedência
    // ou menos, enviar e-mail confirm_scheduling_3 e trocar status para confirmada
    if (processScreenings.isLowerThan3days(s.date)) {
      processScreenings.createNotification(s, 'confirm_scheduling_3');
    // Agendada - Sessão agendada entre 9 e 4 dias de antecedência,
    //  enviar e-mail confirm_scheduling_9 e trocar status para confirmada
    } else if (processScreenings.isBetween9and4days(s.date)) {
      processScreenings.createNotification(s, 'confirm_scheduling_9');
    // Agendada - Sessão agendada com 10 dias ou mais de antecedência,
    // enviar e-mail confirm_scheduling_10 e trocar status para confirmada
    } else if (processScreenings.isGreaterThan10days(s.date)) {
      // Agendada - Sessão agendada com 10 dias ou mais de antecedência,
      // enviar e-mail no dia 10 screening_date
      if (processScreenings.isAt10thDayBefore(s.date)) {
        processScreenings.createNotification(s, 'confirm_screening_date');
      }
      processScreenings.createNotification(s, 'confirm_scheduling_10');
    }
    processScreenings.updateStatus(s, 'Confirmada');
  },

  processConfirmada() {
    // Confirmada - Sessão agendada com 10 dias ou mais de antecedência,
    // enviar e-mail 7 dias antes da sessão send_the_movie_10 e trocar status para pendente
    // Confirmada - Sessão agendada entre 9 e 4 dias de antecedência,
    // enviar e-mail 2 dias antes da sessão send_the_movie_9 e trocar status para pendente
    // Confirmada - Sessão agendada com 10 dias ou mais de antecedência,
    // enviar e-mail 1 dias antes da sessão send_the_movie_3 e trocar status para pendente
  },

  processPendente() {
    // Pendente - Enviar e-mail 40h depois da sessão ask_for_report
    // Pendente - Enviar e-mail 1 semana depois da sessão ask_for_report_2
  },

  processConcluida() {
    // Concluída - Após preencher relatório, trocar o status e
    // enviar e-mail 3 meses depois da sessão tell_ambassador_the_results
  },

  processRascunho() {
    // Rascunho - Troca o status no admin via form
  },

  autoStart() {
    Screenings.find({}).map(doc => processScreenings.process(doc));
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
    const hasFilmTemplate = t.filter(v => v.filmId !== undefined);
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
    return Screenings.update({ _id: s._id  }, { $set: { status: newStatus } });
  },

  // 3. verificar se notificação já foi criada
  createNotification(s, templateName) {
    const varsData = processScreenings.loadData(s);
    const nt = processScreenings.loadTemplate(templateName, varsData);
    const alreadyCreated = Notifications.find({
      userId: varsData.ambassador._id,
      screeningId: varsData.screening._id,
      notificationTemplateId: nt._id,
    });

    return alreadyCreated.count() > 0 ? false : Notifications.insert({
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
