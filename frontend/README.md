# SisAlunos - Sistema de Gerenciamento de Alunos

SisAlunos é uma aplicação web para gerenciamento de informações acadêmicas de alunos, desenvolvida com Vue.js e Vuetify. O sistema permite cadastrar, visualizar, editar e excluir registros de alunos de forma intuitiva e responsiva.

## Requisitos do Sistema

- Node.js 14.x ou superior
- NPM 6.x ou superior
- Conexão com internet para carregar dependências

## Instalação

1. Clone o repositório:
\`\`\`bash
git clone https://github.com/rafaelHenrique1936/challenge-full-stack.git
cd challenge-full-stack
\`\`\`

2. Instale as dependências:
\`\`\`bash
npm install
\`\`\`

3. Configure as variáveis de ambiente:
   - Crie um arquivo `.env.local` na raiz do projeto
   - Adicione a URL da API:
\`\`\`
VITE_API_URL=http://localhost:3050
\`\`\`

4. Inicie o servidor de desenvolvimento:
\`\`\`bash
npm run dev
\`\`\`

5. Acesse a aplicação em `http://localhost:3000`

## Autenticação

### Credenciais de Acesso

Para acessar o sistema, utilize as seguintes credenciais:

- **Email**: admin@example.com
- **Senha**: admin

### Fluxo de Autenticação

O sistema utiliza autenticação baseada em JWT (JSON Web Token). Ao fazer login:

1. As credenciais são enviadas para o endpoint `/api/v1/auth/login`
2. O servidor valida as credenciais e retorna um token JWT
3. O token é armazenado no localStorage do navegador
4. Todas as requisições subsequentes incluem o token no cabeçalho de autorização
5. O token expira após um período determinado, exigindo novo login

## Estrutura do Projeto

\`\`\`
src/
├── assets/         # Recursos estáticos (CSS, imagens)
├── components/     # Componentes Vue reutilizáveis
├── config/         # Configurações da aplicação
├── plugins/        # Plugins Vue (Vuetify, Axios)
├── router/         # Configuração de rotas
├── services/       # Serviços de comunicação com API
├── stores/         # Gerenciamento de estado (Pinia)
├── views/          # Componentes de página
├── App.vue         # Componente raiz
└── main.js         # Ponto de entrada da aplicação
\`\`\`

## Funcionalidades Principais

- **Autenticação**: Login seguro com JWT
- **Gerenciamento de Alunos**: CRUD completo (Criar, Ler, Atualizar, Deletar)
- **Validação de Dados**: Validação de formulários em tempo real
- **Verificação de RA**: Verificação de disponibilidade de Registro Acadêmico
- **Formatação de CPF**: Formatação automática de CPF
- **Internacionalização**: Suporte para múltiplos idiomas
- **Tema Claro/Escuro**: Alternância entre temas

## Tecnologias Utilizadas

- **Vue.js 3**: Framework JavaScript progressivo
- **Vuetify 3**: Biblioteca de componentes UI baseada em Material Design
- **Pinia**: Gerenciamento de estado
- **Vue Router**: Roteamento de páginas
- **Axios**: Cliente HTTP para comunicação com a API
- **Vite**: Ferramenta de build rápida

## Desenvolvimento

### Comandos Disponíveis

\`\`\`bash
# Iniciar servidor de desenvolvimento
npm run dev

# Compilar para produção
npm run build

# Executar linting
npm run lint

# Executar testes
npm run test
\`\`\`

## API Backend

O frontend se comunica com uma API RESTful que deve estar disponível no endereço configurado em `VITE_API_URL`. A API deve fornecer os seguintes endpoints:

- `POST /api/v1/auth/login`: Autenticação de usuários
- `GET /api/v1/students`: Listar alunos (com paginação)
- `GET /api/v1/students/:id`: Obter detalhes de um aluno
- `POST /api/v1/students`: Criar novo aluno
- `PUT /api/v1/students/:id`: Atualizar aluno existente
- `DELETE /api/v1/students/:id`: Excluir aluno
- `GET /api/v1/students/check-ra/:ra`: Verificar disponibilidade de RA

