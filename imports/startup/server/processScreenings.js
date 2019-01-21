import { check } from 'meteor/check';
import { moment } from 'meteor/momentjs:moment';
import Screenings from '../../models/screenings';
// import { SCREENING_STATUS } from '../../models/schemas';

const processScreenings = {
  isGreaterThan10days(screeningDate, refDate = new Date()) {
    check(screeningDate, Date);
    const tenDaysBefore = moment(refDate).subtract(10, 'days');

    return moment(screeningDate).isSameOrBefore(tenDaysBefore);
  },
  isBetween9and4days(screeningDate, refDate = new Date()) {
    check(screeningDate, Date);
    const nineDaysBefore = moment(refDate).subtract(9, 'days').toDate();
    const fourDaysBefore = moment(refDate).subtract(4, 'days').toDate();

    return moment(screeningDate).isBetween(nineDaysBefore, fourDaysBefore, null, '[]');
  },
  isLowerThan3days(screeningDate, refDate = new Date()) {
    const threeDaysBefore = moment(refDate).subtract(3, 'days').toDate();

    check(screeningDate, Date);
    return moment(screeningDate).isSameOrAfter(threeDaysBefore, 'seconds');
  },
  isAt10thDayBefore(screeningDate, refDate = new Date()) {
    check(screeningDate, Date);
    const at10thDayBefore = moment(refDate).subtract(10, 'days').toDate();

    return moment(screeningDate).isSame(at10thDayBefore, 'day');
  },
  is7daysBefore(screeningDate, refDate = new Date()) {
    check(screeningDate, Date);
    const sevenDaysBefore = moment(refDate).subtract(7, 'days').toDate();

    return moment(screeningDate).isSame(sevenDaysBefore, 'day');
  },
  is2daysBefore(screeningDate, refDate = new Date()) {
    check(screeningDate, Date);
    const twoDaysBefore = moment(refDate).subtract(2, 'days').toDate();

    return moment(screeningDate).isSame(twoDaysBefore, 'day');
  },
  is1dayBefore(screeningDate, refDate = new Date()) {
    check(screeningDate, Date);
    const oneDayBefore = moment(refDate).subtract(1, 'days').toDate();

    return moment(screeningDate).isSame(oneDayBefore, 'day');
  },
  was40hoursAgo(screeningDate, refDate = new Date()) {
    check(screeningDate, Date);
    const fortyHoursAfter = moment(refDate).subtract(40, 'hours').toDate();

    return moment(fortyHoursAfter).isSameOrAfter(screeningDate);
  },
  was1weekAgo(screeningDate, refDate = new Date()) {
    check(screeningDate, Date);
    const fortyHoursAfter = moment(refDate).subtract(1, 'weeks').toDate();

    return moment(fortyHoursAfter).isSameOrAfter(screeningDate);
  },
  was3monthsAgo(screeningDate, refDate = new Date()) {
    check(screeningDate, Date);
    const fortyHoursAfter = moment(refDate).subtract(3, 'months').toDate();

    return moment(fortyHoursAfter).isSameOrAfter(screeningDate);
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
  processAgendada(screening) {
    if (processScreenings.isLowerThan3days()) {
    } else if (processScreenings.isBetween9and4days()) {
    } else if (processScreenings.isGreaterThan10days()) {
      if (processScreenings.isAt10thDayBefore()) {}
    }
    processScreenings.updateStatus('Confirmada');
    // Agendada - Sessão agendada com 10 dias ou mais de antecedência, enviar e-mail confirm_scheduling_10 e trocar status para confirmada
    // Agendada - Sessão agendada entre 9 e 4 dias de antecedência, enviar e-mail confirm_scheduling_9 e trocar status para confirmada
    // Agendada - Sessão agendada entre 3 dias de antecedência ou menos, enviar e-mail confirm_scheduling_3 e trocar status para confirmada

    // Agendada - Sessão agendada com 10 dias ou mais de antecedência, enviar e-mail no dia 10 screening_date
  },
  processConfirmada(screening) {
    // Confirmada - Sessão agendada com 10 dias ou mais de antecedência, enviar e-mail 7 dias antes da sessão send_the_movie_10 e trocar status para pendente
    // Confirmada - Sessão agendada entre 9 e 4 dias de antecedência, enviar e-mail 2 dias antes da sessão send_the_movie_9 e trocar status para pendente
    // Confirmada - Sessão agendada com 10 dias ou mais de antecedência, enviar e-mail 1 dias antes da sessão send_the_movie_3 e trocar status para pendente
  },
  processPendente(screening) {
    // Pendente - Enviar e-mail 40h depois da sessão ask_for_report
    // Pendente - Enviar e-mail 1 semana depois da sessão ask_for_report_2
  },
  processConcluida(screening) {
    // Concluída - Após preencher relatório, trocar o status e enviar e-mail 3 meses depois da sessão tell_ambassador_the_results
  },
  processRascunho(screening) {
    // Rascunho - Troca o status no admin via form
  },
  autoStart() {
    Screenings.find({}).map(doc => processScreenings.process(doc));
  },
  loadData() {},
  loadTemplate() {}, // 4. carregar template e verificar se existe específico para o filme
  updateStatus() {},
  // 3. verificar se notificação já foi criada
  createNotification(vars_data, templateId) {}, // 5. criar notificação para enviar e-mail
};

// Regras para sessões por status:

// Cancelada - Após preencher relatório, a resposta para público real for zero, trocar o status

// Arquivada - Troca o status no admin via form

export default processScreenings;
