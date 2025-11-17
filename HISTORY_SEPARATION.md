# 📚 Histórico Separado - Documentação

## 🎯 Objetivo
Separar o histórico de vitórias em dois localStorage distintos:
- `historyClassic` - para o modo Classic
- `historyPoster` - para o modo Poster

E diferenciar visualmente no calendário com cores e ícones distintos.

## ✅ Implementações Realizadas

### 1. **Novas Funções no localStorage** (`lib/useLocalstorage.ts`)

#### Histórico Classic
```typescript
appendHistoryClassic(item: HistoryItem)  // Adiciona vitória no Classic
getHistoryClassic(): HistoryItem[]       // Retorna histórico do Classic
```

#### Histórico Poster
```typescript
appendHistoryPoster(item: HistoryItem)   // Adiciona vitória no Poster
getHistoryPoster(): HistoryItem[]        // Retorna histórico do Poster
```

#### Histórico Combinado
```typescript
getHistoryCombined(): HistoryItem[]      // Retorna Classic + Poster (para calendário)
```

---

### 2. **Diferenciação Visual no Calendário**

#### 🎨 Cores e Ícones
- **Classic**: Borda verde + ícone Film 🎬
- **Poster**: Borda roxa + ícone Clapperboard 🎞️

#### Legenda no Modal
```
🎬 Classic (verde)
🎞️ Poster (roxo)
```

#### Antes (Formato Antigo)
```json
{
  "history": [
    { "id": 123, "date": "2025-01-15", "totalAttempts": 3, "mode": "classic" },
    { "id": 456, "date": "2025-01-16", "totalAttempts": 4, "mode": "poster" }
  ]
}
```

#### Depois (Novo Formato)
```json
{
  "historyClassic": [
    { "id": 123, "date": "2025-01-15", "totalAttempts": 3, "mode": "classic" }
  ],
  "historyPoster": [
    { "id": 456, "date": "2025-01-16", "totalAttempts": 4, "mode": "poster" }
  ],
  "hasRunHistoryMigration": "true"
}
```

---

### 3. **Arquivos Modificados**

#### ✅ `lib/useLocalstorage.ts`
- ✅ Criadas funções específicas por modo
- ✅ Código otimizado e limpo
- ✅ Removidas funções deprecated de migração

#### ✅ `components/ui/calendarHistory.tsx`
- ✅ Diferenciação visual por modo (cores e ícones)
- ✅ Borda verde para Classic
- ✅ Borda roxa para Poster
- ✅ Ícones Film (Classic) e Clapperboard (Poster)

#### ✅ `components/ui/history.tsx`
- ✅ Legenda visual no modal
- ✅ Mostra ícones e cores para cada modo

#### ✅ `app/classic/[date]/table/classicTable.tsx`
```typescript
// Antes
import { appendHistoryItem } from "@/lib/useLocalstorage";
appendHistoryItem(newHistoryItem);

// Depois
import { appendHistoryClassic } from "@/lib/useLocalstorage";
appendHistoryClassic(newHistoryItem);
```

#### ✅ `app/poster/[date]/poster/poster.tsx`
```typescript
// Antes
import { appendHistoryItem } from "@/lib/useLocalstorage";
appendHistoryItem(newHistoryItem);

// Depois
import { appendHistoryPoster } from "@/lib/useLocalstorage";
appendHistoryPoster(newHistoryItem);
```

#### ✅ `app/classic/[date]/page.tsx`
```typescript
// Antes
import { getHistory } from "@/lib/useLocalstorage";
const history = getHistory();

// Depois
import { getHistoryClassic } from "@/lib/useLocalstorage";
const history = getHistoryClassic();
```

#### ✅ `app/poster/[date]/page.tsx`
```typescript
// Antes
import { getHistory } from "@/lib/useLocalstorage";
const history = getHistory();

// Depois
import { getHistoryPoster } from "@/lib/useLocalstorage";
const history = getHistoryPoster();
```

#### ✅ `components/ui/history.tsx`
```typescript
// Antes
import { getHistory } from "@/lib/useLocalstorage";
const history = getHistory();

// Depois
import { getHistoryCombined } from "@/lib/useLocalstorage";
const history = getHistoryCombined();
```

#### ✅ `components/ui/MigrationWrapper.tsx` ~~(REMOVIDO)~~
- ❌ Arquivo removido (não é mais necessário)

#### ✅ `app/layout.tsx`
- ✅ Removido MigrationWrapper
- ✅ Layout mais limpo

---

### 5. **Como Funciona o Calendário**

#### Classic Mode
```
Vitória → appendHistoryClassic() → localStorage["historyClassic"]
         ↓
   getHistoryClassic() ← página /classic/[date]
```

#### Poster Mode
```
Vitória → appendHistoryPoster() → localStorage["historyPoster"]
         ↓
   getHistoryPoster() ← página /poster/[date]
```

#### Calendário (History Component)
```
getHistoryCombined() → historyClassic + historyPoster → Calendar
                                                        ↓
                        Dia com Classic → Borda Verde + Film Icon 🎬
                        Dia com Poster → Borda Roxa + Clapperboard Icon 🎞️
```

**Exemplo Visual:**
- Dia 15: Verde + 🎬 = Vitória no Classic
- Dia 16: Roxo + 🎞️ = Vitória no Poster
- Dia 17: Sem borda = Não jogado

---

### 6. **Benefícios**

✅ **Organização**: Dados separados por modo
✅ **Performance**: Menos dados para ler em cada modo
✅ **Estatísticas**: Facilita criar stats separadas
✅ **Escalabilidade**: Fácil adicionar novos modos
✅ **Visual**: Diferenciação clara no calendário
✅ **UX**: Usuário identifica facilmente qual modo jogou
✅ **Manutenção**: Código otimizado e limpo

---

### 7. **Testes Recomendados**
   - Jogar e vencer no modo Classic
   - Verificar que salvou em `historyClassic`
   - Verificar que aparece no calendário

3. ✅ **Teste Poster**
   - Jogar e vencer no modo Poster
   - Verificar que salvou em `historyPoster`
   - Verificar que aparece no calendário

4. ✅ **Teste Calendário**
   - Verificar que mostra ambos os modos
   - Clicar em dia Classic → vai para `/classic/[date]`
   - Clicar em dia Poster → vai para `/poster/[date]`

---

### 8. **Estrutura Final do localStorage**

```typescript
localStorage = {
  // Históricos separados
  "historyClassic": HistoryItem[],
  "historyPoster": HistoryItem[],
  
  // Tentativas em progresso
  "tryClassic": TryClassic[],
  "tryPoster": PosterTry[],
  
  // Configurações
  "colorBlind": "true" | "false"
}
```

---

### 9. **Otimizações Realizadas**

- ✅ Removido `MigrationWrapper.tsx` (não necessário)
- ✅ Removidas funções deprecated de migração
- ✅ Código mais limpo e performático
- ✅ Menos arquivos e complexidade
- ✅ Reduzido tamanho do bundle

---

### 10. **Próximos Passos Sugeridos**

- [ ] Criar página de estatísticas separadas (Classic vs Poster)
- [ ] Adicionar filtro no calendário (toggle Classic/Poster/Ambos)
- [ ] Implementar exportação de dados
- [ ] Adicionar gráficos de progresso por modo
- [ ] Sistema de conquistas/achievements por modo
- [ ] Animação de hover nos dias do calendário

---

## 📊 Resumo das Mudanças

| Arquivo | Modificações |
|---------|-------------|
| `useLocalstorage.ts` | ~50 linhas (funções otimizadas) |
| `classicTable.tsx` | 2 linhas (import + função) |
| `poster.tsx` | 2 linhas (import + função) |
| `classic/page.tsx` | 2 linhas (import + função) |
| `poster/page.tsx` | 2 linhas (import + função) |
| `history.tsx` | +15 linhas (legenda visual) |
| `calendarHistory.tsx` | +30 linhas (diferenciação visual) |
| `MigrationWrapper.tsx` | ❌ Removido |
| `layout.tsx` | -3 linhas (limpeza) |

**Total**: ~100 linhas adicionadas/modificadas, código mais limpo

---

## ✨ Conclusão

O histórico está completamente separado entre Classic e Poster, com diferenciação visual clara no calendário:
- 🎬 **Verde + Film** = Classic
- 🎞️ **Roxo + Clapperboard** = Poster

Código otimizado, sem migração complexa, e pronto para escalar! 🚀
