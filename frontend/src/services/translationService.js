const translations = {
  "Registration number {ra} is available": {
    "pt-BR": "Número de registro {ra} está disponível",
    es: "Número de registro {ra} está disponible",
  },
  "Registration number {ra} is already in use": {
    "pt-BR": "Número de registro {ra} já está em uso",
    es: "Número de registro {ra} ya está en uso",
  },

  "Invalid credentials": {
    "pt-BR": "Credenciais inválidas",
    es: "Credenciales inválidas",
  },
  "Not authorized": {
    "pt-BR": "Não autorizado",
    es: "No autorizado",
  },

  "Student created successfully": {
    "pt-BR": "Aluno criado com sucesso",
    es: "Estudiante creado con éxito",
  },
  "Student updated successfully": {
    "pt-BR": "Aluno atualizado com sucesso",
    es: "Estudiante actualizado con éxito",
  },
  "Student deleted successfully": {
    "pt-BR": "Aluno excluído com sucesso",
    es: "Estudiante eliminado con éxito",
  },

  "Error fetching students": {
    "pt-BR": "Erro ao buscar alunos",
    es: "Error al buscar estudiantes",
  },
  "Error creating student": {
    "pt-BR": "Erro ao criar aluno",
    es: "Error al crear estudiante",
  },
  "Error updating student": {
    "pt-BR": "Erro ao atualizar aluno",
    es: "Error al actualizar estudiante",
  },
  "Error deleting student": {
    "pt-BR": "Erro ao excluir aluno",
    es: "Error al eliminar estudiante",
  },
  "Error checking RA availability": {
    "pt-BR": "Erro ao verificar disponibilidade do RA",
    es: "Error al verificar disponibilidad del RA",
  },

  "RA available for use": {
    "pt-BR": "RA disponível para uso",
    es: "RA disponible para uso",
  },
  "This RA is already in use by another student": {
    "pt-BR": "Este RA já está em uso por outro aluno",
    es: "Este RA ya está en uso por otro estudiante",
  },

  // Novas traduções do backend
  "Student with ID {id} not found": {
    "pt-BR": "Aluno com ID {id} não encontrado",
    es: "Estudiante con ID {id} no encontrado",
  },
  "Invalid student data": {
    "pt-BR": "Dados do aluno inválidos",
    es: "Datos de estudiante inválidos",
  },
  "Registration number {ra} is already in use by another student": {
    "pt-BR": "Número de registro {ra} já está em uso por outro aluno",
    es: "Número de registro {ra} ya está en uso por otro estudiante",
  },
  "CPF {cpf} is already registered in the system": {
    "pt-BR": "CPF {cpf} já está registrado no sistema",
    es: "CPF {cpf} ya está registrado en el sistema",
  },
  "Please provide a registration number to check": {
    "pt-BR": "Por favor, forneça um número de registro para verificar",
    es: "Por favor, proporcione un número de registro para verificar",
  },

  // Adicionar a mensagem exata que está vindo do backend
  "CPF is already registered in the system": {
    "pt-BR": "CPF já está registrado no sistema",
    es: "CPF ya está registrado en el sistema",
  },

  // Variações possíveis da mensagem
  "CPF already registered in the system": {
    "pt-BR": "CPF já está registrado no sistema",
    es: "CPF ya está registrado en el sistema",
  },

  // Mensagem com o CPF formatado
  "CPF {formattedCpf} is already registered in the system": {
    "pt-BR": "CPF {formattedCpf} já está registrado no sistema",
    es: "CPF {formattedCpf} ya está registrado en el sistema",
  },
}

export function getBrowserLanguage() {
  const language = navigator.language || navigator.userLanguage || "en"

  const supportedLanguages = ["pt-BR", "es"]

  if (!supportedLanguages.includes(language)) {
    const baseLanguage = language.split("-")[0]
    if (supportedLanguages.some((lang) => lang.startsWith(baseLanguage))) {
      return supportedLanguages.find((lang) => lang.startsWith(baseLanguage))
    }
  }

  return supportedLanguages.includes(language) ? language : "en"
}

export function translateMessage(message, params = {}) {
  if (!message) return ""

  const language = getBrowserLanguage()

  if (language === "en" && Object.keys(params).length === 0) {
    return message
  }

  let translatedMessage = message

  if (translations[message] && translations[message][language]) {
    translatedMessage = translations[message][language]
  }

  // Substituir todos os parâmetros na mensagem traduzida
  Object.keys(params).forEach((key) => {
    translatedMessage = translatedMessage.replace(`{${key}}`, params[key])
  })

  // Se a mensagem não foi traduzida mas contém parâmetros, tentar substituir os parâmetros na mensagem original
  if (translatedMessage === message && Object.keys(params).length > 0) {
    Object.keys(params).forEach((key) => {
      translatedMessage = translatedMessage.replace(`{${key}}`, params[key])
    })
  }

  return translatedMessage
}

// Função para extrair o CPF de uma mensagem de erro
export function extractCPFFromMessage(message) {
  const match = message.match(/CPF (\d+) is already/)
  return match ? match[1] : ""
}

// Função para traduzir mensagens de erro relacionadas ao CPF
export function translateCPFErrorMessage(message) {
  const cpf = extractCPFFromMessage(message)

  if (cpf) {
    return translateMessage("CPF {cpf} is already registered in the system", { cpf })
  }

  // Se não conseguir extrair o CPF, tenta traduzir a mensagem diretamente
  return translateMessage(message)
}

export function translateRAAvailabilityMessage(data) {
  if (!data || !data.message) return ""

  const ra = data.ra || extractRAFromMessage(data.message)

  if (data.available) {
    return translateMessage("Registration number {ra} is available", { ra })
  } else {
    return translateMessage("Registration number {ra} is already in use", { ra })
  }
}

function extractRAFromMessage(message) {
  const match = message.match(/Registration number (\d+) is/)
  return match ? match[1] : ""
}

export default {
  translateMessage,
  translateRAAvailabilityMessage,
  translateCPFErrorMessage,
  getBrowserLanguage,
}
