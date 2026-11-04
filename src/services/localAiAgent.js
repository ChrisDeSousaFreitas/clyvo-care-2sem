const KNOWLEDGE_BASE = [
  {
    keywords: ['clyvo', 'aplicativo', 'app', 'sistema'],
    answer: 'O Clyvo SmartCare é um aplicativo de apoio à gestão clínica veterinária. Ele reúne informações de pets, agendamentos e recursos de acompanhamento em uma única experiência.',
  },
  {
    keywords: ['pet', 'pets', 'animal', 'paciente', 'cadastro'],
    answer: 'Na área de Pets, a equipe pode consultar os pacientes cadastrados e acessar informações como nome, espécie, idade e dados de identificação. Nesta demonstração, estou usando apenas este conteúdo local.',
  },
  {
    keywords: ['agenda', 'agendamento', 'consulta', 'veterinário', 'veterinario'],
    answer: 'A agenda do Clyvo organiza consultas e procedimentos veterinários. Um agendamento normalmente reúne o pet, o profissional responsável, a data, o horário e o motivo da consulta.',
  },
  {
    keywords: ['coleira', 'smart collar', 'iot', 'batimento', 'bpm'],
    answer: 'O Smart Collar é a área demonstrativa de IoT do Clyvo. A tela pode ilustrar indicadores como frequência cardíaca, mas os valores exibidos no modo de demonstração são fictícios e não vêm de um sensor real.',
  },
  {
    keywords: ['sintoma', 'sintomas', 'doente', 'dor', 'vomito', 'vômito', 'febre', 'apetite', 'apatia'],
    answer: 'Posso ajudar a organizar informações gerais, mas esta versão não faz diagnóstico e não analisa sintomas clinicamente. Se o pet apresentar dificuldade para respirar, convulsões, sangramento intenso, desmaio ou piora rápida, procure atendimento veterinário imediatamente.',
  },
  {
    keywords: ['horario', 'horário', 'funciona', 'funcionamento'],
    answer: 'Não tenho horários de funcionamento cadastrados na minha base local. Consulte diretamente a equipe da clínica para confirmar essa informação.',
  },
  {
    keywords: ['obrigado', 'obrigada', 'valeu'],
    answer: 'Por nada! Se quiser, posso explicar os recursos do Clyvo usando as informações disponíveis nesta demonstração.',
  },
  {
    keywords: ['oi', 'olá', 'ola', 'bom dia', 'boa tarde', 'boa noite'],
    answer: 'Olá! Sou o assistente do Clyvo. Posso responder perguntas básicas sobre o aplicativo, cadastro de pets, agenda e Smart Collar com base nas informações locais.',
  },
];

export function answerFromLocalKnowledge(message) {
  const normalized = String(message || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR')
    .trim();

  if (!normalized) {
    return 'Escreva uma pergunta para que eu possa consultar minha base local.';
  }

  const match = KNOWLEDGE_BASE.find((entry) =>
    entry.keywords.some((keyword) => normalized.includes(
      keyword.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR')
    ))
  );

  return match
    ? match.answer
    : 'Ainda não encontrei essa informação na minha base local. Posso responder sobre o Clyvo, cadastro de pets, agendamentos e Smart Collar.';
}
