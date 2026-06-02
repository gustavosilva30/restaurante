import { prisma } from "./prisma";

/**
 * Retorna uma instância estendida do Prisma Client que filtra automaticamente
 * todas as operações pelo `companyId` fornecido para garantir isolamento lógico (SaaS).
 */
export const getTenantClient = (companyId: string) => {
  if (!companyId) {
    throw new Error("É obrigatório fornecer um companyId para obter o cliente Tenant.");
  }

  return prisma.$extends({
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          // Lista de operações de leitura e escrita que aceitam filtros
          const filterableOperations = [
            "findFirst",
            "findFirstOrThrow",
            "findMany",
            "findUnique",
            "findUniqueOrThrow",
            "count",
            "aggregate",
            "groupBy",
            "update",
            "updateMany",
            "upsert",
            "delete",
            "deleteMany",
          ];

          // Modelos que não pertencem ao Tenant (ex: a própria tabela Company/Tenant não deve ser auto-filtrada por companyId)
          const bypassModels = ["Company"];

          if (filterableOperations.includes(operation) && !bypassModels.includes(model)) {
            // Garante que o objeto args.where exista
            args.where = args.where || {};
            
            // Injeta o companyId para isolamento
            args.where.companyId = companyId;

            // Se for operação de atualizar ou criar, garante que o ID correto seja gravado
            if (operation === "update" || operation === "updateMany") {
              if (args.data) {
                args.data.companyId = companyId;
              }
            }
          }

          // Se for inserção (create/createMany), injeta o companyId no objeto de dados
          if ((operation === "create" || operation === "createMany") && !bypassModels.includes(model)) {
            if (args.data) {
              if (Array.isArray(args.data)) {
                args.data = args.data.map((item: any) => ({ ...item, companyId }));
              } else {
                args.data.companyId = companyId;
              }
            }
          }

          return query(args);
        },
      },
    },
  });
};
