### AGHUse PLAY 🏥🎬

   Uma plataforma web premium e ultra-responsiva para exibição de vídeos de treinamento e manuais de instrução dos módulos do sistema **AGHUse** (Internação, Emergência, Exames, Ambulatório, Estoque e Faturamento).
   
   Desenvolvido inteiramente em **HTML, CSS e JavaScript puros (Vanilla JS)**, sem qualquer necessidade de compilação ou instalação de dependências.

### 1. **Painel de Gestão Admin Expandido**
   - Transformado de um painel simplificado em um painel completo e funcional
   - Modal responsivo com `max-w-5xl` (até 80vw de altura com scroll)
   - Integração com tema dark/light

### 2. **Box de Estatísticas em Tempo Real**
   Grid com 5 cards que mostram:
   - 🟢 **Acessos** (com indicador AO VIVO)
   - 👁️ **Views Totais**
   - 🎬 **Vídeos no Ar**
   - 💬 **Feedbacks**

### 3. **Grid de 2 Colunas (Responsivo)**

### Coluna Esquerda:
   1. **🎬 Novo Vídeo de Treinamento**
      - Título | Arquivo MP4 | Capa | Módulo
      - Salva em `state.videos`
   
   2. **📢 Mural de Notícias (Letreiro)**
      - Textarea para nova mensagem
      - Exibe notícias ativas com botão de exclusão individual
      - Botão "Excluir Todas"
   
   3. **🛠️ Gerenciador de Exclusões**
      - Toggle para ativar/desativar modo edição
      - Descrição de funcionalidade

#### Coluna Direita:
   1. **📄 Novo Manual Técnico (PDF)**
      - Título | PDF | Capa | Módulo
      - Salva em `state.manuais`
   
   2. **📊 Ranking de Vídeos**
      - Exibe top 8 vídeos ordenados por views
      - Mostra número de visualizações
   
   3. **💬 Feedbacks Enviados**
      - Lista de sugestões com nome, setor e data
      - Botão para deletar feedback individual

### 4. **Funções JavaScript Implementadas**

   javascript
   window.addItem(tipo)        // Adiciona vídeo, manual ou notícia
   window.limparNoticias()     // Limpa todas as notícias do letreiro
   window.removeItem(tipo, idx) // Remove item específico
   

### 🚀 Como Executar

   Para iniciar a plataforma, você não precisa rodar servidores, instalar Node.js ou executar comandos de terminal. 
   
   1. **Abra o arquivo principal:**
      Basta dar um duplo-clique no arquivo `index.html` em qualquer navegador web moderno (Google Chrome, Microsoft Edge, Firefox, etc.).
      
   2. **Uso Offline/Local:**
      Por ser estruturado de forma 100% estática e local, o aplicativo carrega instantaneamente e funciona diretamente a partir do protocolo `file:///` do seu computador.
      ## Run Locally
   
      **Prerequisites:**  Node.js
      1. Install dependencies:
         `npm install`
      2. Run the app:
         `npm run dev`

### 🔑 Painel de Gestão (Administrador)

   A plataforma possui um dashboard administrativo persistente em `localStorage` para gerenciar (adicionar, editar ou excluir) vídeos, manuais, mural de notícias e feedbacks dos usuários.
   
   * **Usuário:** `admin`
   * **Senha:** `Sucesso.2026`

### 🔧 Como Usar

   ### Para Adicionar Vídeos:
   1. Clique em ⚙️ Painel Admin
   2. Faça login
   3. Preencha título, arquivo MP4, capa e módulo
   4. Clique em "Adicionar Vídeo"
   
   ### Para Adicionar Notícias no Letreiro:
   1. Digite a mensagem no campo de notícia
   2. Clique em "Publicar Notícia"
   3. Notícia aparecerá no letreiro em tempo real
   
   ### Para Adicionar Manuais PDF:
   1. Similar aos vídeos, mas com caminho PDF
   2. Suporta capa customizada
   
   ### Para Deletar Itens:
   1. Ative o "Modo Edição" (botão 🛠️)
   2. Botões de exclusão aparecem nos cards
   3. Clique para remover

### 🎨 Destaques do Design Premium

   * **Fundo Gradiente Dinâmico e Iluminação Suave:** Suporte a 3 esquemas visuais harmônicos (*Dark Slate*, *Dark Aurora* com gradiente roxo/cósmico, e *Light Slate*).
   * **Sombras Realistas:** Sistema avançado de profundidade com sombras customizadas via CSS.
   * **Micro-animações:** Efeitos suaves de hover, sliders fluidos, transições elegantes e carregamento reativo de ícones.
   * **Totalmente Responsivo:** Layout adaptado perfeitamente para computadores, tablets e smartphones (com barra de navegação móvel nativa).

### ✨ Qualidade do Código
   
   - ✅ Sem duplicação de código
   - ✅ Funções bem organizadas
   - ✅ Sintaxe JavaScript válida
   - ✅ HTML bem-formado
   - ✅ Responsive design funcionando
   - ✅ Acessibilidade mantida

### 📊 Estado da Aplicação

   Os dados são armazenados em `state` com as seguintes propriedades:
   
   javascript
   ```
   state.videos[]                  // Array de vídeos com {titulo, modulo, arquivo, capa, views}
   state.manuais[]                 // Array de manuais com {titulo, modulo, arquivo, capa}
   state.noticias[]                // Array de notícias com {texto}
   state.feedbacks[]               // Array de feedbacks com {nome, setor, texto, data}
   state.estatisticas              // {acessos, online}
   state.isAdminAuthenticated      // Boolean para auth
   state.isEditMode                // Boolean para modo edição 
   ````

### 🚀 Próximas Melhorias (Opcional)

   - [ ] Persistência em LocalStorage
   - [ ] Export/Import de dados em JSON
   - [ ] Busca/filtro na lista de feedbacks
   - [ ] Paginação no ranking de vídeos
   - [ ] Dark mode completo para inputs
   - [ ] Upload de arquivos ao invés de digitar nomes


---
*Desenvolvido por Carlos Lima | Paulo Junior | Hugo Barros · 2026*
