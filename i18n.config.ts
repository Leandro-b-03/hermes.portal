import { viewDepthKey } from "vue-router";

export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'pt',
  messages: {
    en: {
      welcome: 'Welcome'
    },
    pt: {
      hermes_tms: 'Hermes TMS',
      welcome: 'Bem vindo',
      search: 'Buscar',
      login: {
        google_tooltip: 'Entrar com Google',
        or: 'Ou',
        email: 'E-mail',
        email_placeholder: 'Digite seu e-mail',
        password: 'Senha',
        password_placeholder: 'Digite sua senha',
        remember_me: 'Lembrar de mim',
        submit: 'Entrar',
        forgot_password: 'Esqueceu sua senha?',
        no_account: 'Não tem uma conta?',
        no_account_signup: 'Fale com um representantes',
        errors: {
          empty_field: 'Preencha os campos em vermelho.',
          invalid_user_pass: 'Usuário ou senha inválidos.',
          500: 'Erro interno do servidor. Tente novamente mais tarde.',
        }
      },
      sidebar: {
        dashboard: 'Dashboard',
        customers: 'Clientes',
        reports: 'Relatórios',
        revenue: 'Receita',
        view: 'Visualizar',
        expenses: 'Despesas',
        invoices: 'Faturas',
        events: 'Eventos',
        options: 'Opções',
        carriers: {
          title: 'Transportadoras',
          manage: 'Gerenciar',
          import: 'Importar tabela de frete',
        },
        orders: 'Ordens',
        settings: 'Configurações',
      },
      breadcrump: {
        dashboard: 'Dashboard',
        customers: 'Clientes',
        reports: 'Relatórios',
        revenue: 'Receita',
        view: 'Visualizar',
        expenses: 'Despesas',
        invoices: 'Faturas',
        events: 'Eventos',
        options: 'Opções',
        carriers: 'Transportadoras',
        import: 'Importar tabela de frete',
        orders: 'Ordens',
        settings: 'Configurações',
        create: 'Cadastrar',
        edit: 'Editar',
      },
      carriers: {
        fields: {
          name: 'Nome',
          name_placeholder: 'Empresa Transportadora LTDA',
          tax_id: 'CNPJ',
          tax_id_placeholder: '00.000.000/0000-00',
          tax_id_invalid: 'CNPJ inválido',
          address: 'Endereço',
          address_placeholder: 'Rua, Avenida, etc...',
          address_2: 'Complemento',
          address_2_placeholder: 'Complemento: Docas, Galpão',
          address_3: 'Bairro',
          address_3_placeholder: 'Bairro',
          number: 'Número',
          number_placeholder: '123',
          city: 'Cidade',
          city_placeholder: 'São Paulo',
          state: 'Estado',
          state_placeholder: 'SP',
          country: 'País',
          country_placeholder: 'Brasil',
          zip: 'CEP',
          zip_placeholder: '00000-000',
          contact: {
            name: 'Nome do contato',
            name_placeholder: 'João da Silva',
            name_errior_required: 'Nome do contato é obrigatório',
            phone: 'Telefone',
            phone_placeholder: '(11) 9999-9999',
            email: 'E-mail',
            email_placeholder: 'joao.silva＠empresa.com',
            fax: 'Fax',
            fax_placeholder: '(11) 9999-9999',
            mobile: 'Celular',
            mobile_placeholder: '(11) 99999-9999',
            title: 'Cargo',
            title_placeholder: 'Gerente',
            department: 'Departamento',
            department_placeholder: 'Comercial',
          },
          created_at: 'Criado em',
          updated_at: 'Atualizado em',
          status: 'Status',
          active: 'Ativo',
          inactive: 'Desativado',
        },
        index: {
          title: 'Transportadoras',
          subtitle: 'Gerencie suas transportadoras e tabelas de frete com facilidade.',
          table: {
            name: 'Nome',
            tax_id: 'CNPJ',
            address: 'Endereço',
            zip: 'CEP',
            contact_name: 'Nome do contato',
            status: 'Status',
            updated_at: 'Atualizado em',
            actions: 'Ações',
          },
          contact_info: {
            title: 'Informações do contato',
            name: 'Nome',
            email: 'E-mail',
            mobile: 'Celular',
            phone: 'Telefone',
            fax: 'Fax',
            department: 'Departamento',
            contact_title: 'Cargo',
          },
          delete: {
            title: 'Excluir Transportadora',
            subtitle: 'Tem certeza que deseja excluir a transportadora?',
            buttons: {
              cancel: 'Cancelar',
              delete: 'Excluir',
            },
            message: {
              success_header: 'Sucesso',
              success: 'Transportadora excluída com sucesso.',
              error_header: 'Erro',
              error: 'Erro ao excluir transportadora.',
            }
          }
        },
        create: {
          title: 'Cadastrar Transportadora',
          subtitle: 'Preencha os campos abaixo para cadastrar uma nova transportadora.',
          buttons: {
            cancel: 'Cancelar',
            save: 'Cadastrar',
          },
          message: {
            success: 'Transportadora cadastrada com sucesso.',
            error: 'Erro ao cadastrar transportadora.',
          }
        },
        edit: {
          title: 'Editar Transportadora',
          subtitle: 'Preencha os campos abaixo para editar a transportadora.',
          buttons: {
            cancel: 'Cancelar',
            save: 'Salvar',
          },
          message: {
            success: 'Transportadora editada com sucesso.',
            error: 'Erro ao editar transportadora.',
          }
        },
        import: {
          title: 'Tabelas de Frete',
          subtitle: 'Gerencie as suas tabelas de frete.',
          buttons: {
            cancel: 'Cancelar',
            save: 'Importar',
          },
          message: {
            success: 'Tabela de frete importada com sucesso.',
            error: 'Erro ao importar tabela de frete.',
          }
        }
      },
      dashboard: 'Dashboard',
      customers: 'Clientes',
      reports: 'Relatórios',
      revenue: 'Receita',
      view: 'Visualizar',
      expenses: 'Despesas',
      invoices: 'Faturas',
      events: 'Eventos',
      options: 'Opções',
      orders: 'Ordens',
      settings: 'Configurações',
      setup: {
        success: 'Sucesso',
        error: 'Erro',
        tax_id: 'CNPJ',
        export: {
          all: 'Exportar todos registros',
          partial: 'Exportar parcial',
        },
        status: {
          1: 'Ativo',
          0: 'Inativo',
        },
        options: {
          title: 'Opções',
          edit: 'Editar',	
          export: 'Exportar',
          delete: 'Excluir',
          add: 'Adicionar',
          save: 'Salvar',
          cancel: 'Cancelar',
        },
        tables: {
          search: 'Palavra Chave',
          select: 'Selecione os campos',
          page: 'Página',
          first: 'Primeira',
          rows: 'Linhas',
          last: 'Última',
          of: 'de',
          total: 'Total',
        },
        validations: {
            required: 'Campo é obrigatório',
            email: 'Email inválido',
            minLength: 'Campo deve ter no mínimo {min} caracteres',
            maxLength: 'Campo deve ter no máximo {max} caracteres',
            numeric: 'Campo deve ser numérico',
            phone: 'Campo inválido',
            mobile: 'Celular inválido',
        }
      }
    }
  }
}));