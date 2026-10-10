# Écrire ou étoffer une page de « US Benefits Calc »

Notice pour les agents qui écrivent une page. À lire en entier avant d'écrire, avec
`~/Documents/GitHub/RECETTE-SITE.md` (§0, §6, §6.5, §7, §9, §9.3, §11, §17.4, §21, §26).

Le site : un calculateur d'aides sociales américaines par État — **SNAP** (montants FY 2027, options BBCE et
allocations de services publics de chaque État), **Medicaid et CHIP** (niveaux CMS par groupe), **crédit
d'impôt ACA 2026** (plafond de 400 % revenu), **EITC** (2025 et 2026), **WIC** (2026/2027), **Section 8**
(limites HUD FY 2026 par comté), **SSI** (2026) et **seuil de pauvreté** HHS 2026. **Anglais américain seul**,
sous `/en/`. Dollars, `$` devant, virgule des milliers. Éditeur : la société **Radif Partners** (jamais un nom
de personne, jamais de photo, ni INSEAD, ni Mines, ni LinkedIn). Aucun lien vers un autre site du portefeuille
(`_trame/domaines-ovh.txt`), jamais « taxineo », jamais usfamilycalc.com, calculaides.fr, myeicanada.com,
canadanetpay.com, statutorypay.co.uk.

## Les fichiers d'une page

| Page | Fichier de prose | Route |
|---|---|---|
| Page programme, guide, page « seuil » | `src/content/pages/<id>.ts` (`definePage`) | `/en/<slug>/` |
| Page d'État | `src/content/states/<slug>.ts` (`defineStatePage`) | `/en/states/<slug>/` |

Le **plan complet** (id, slug, groupe, type, requête visée) est dans `src/lib/planned.ts` : une page doit y
figurer avec exactement le même `id`, `slug`, `group` et `kind` (le test le vérifie). Les pages d'État ont l'id
`state:<slug>`. **Modèles à lire avant d'écrire** (structure seulement, jamais les phrases) :

- pilier avec calculateur : `src/content/pages/snap-calculator.ts` ;
- guide avec mini-simulateur : `src/content/pages/snap-work-requirements.ts` ;
- page seuil : `src/content/pages/fpl-138-percent.ts` ;
- page d'État : `src/content/states/texas.ts`.

### Champs d'une page (`definePage`)

| Champ | Règle |
|---|---|
| `id`, `group`, `kind`, `slug` | = `src/lib/planned.ts`. `id` = nom du fichier. |
| `order` | place dans les menus du groupe (10, 20, 30…). |
| `nav`, `card` | libellé de menu ; une phrase pour les cartes « Read next ». |
| `title` | **50 à 60 caractères**, contient 2026 (ou 2027 pour SNAP FY 2027), **terme-clé en tête** (« SNAP Income Limits 2027: … », « EITC Calculator 2026: … »). Jamais en tête : un mot d'outil (Calculator), une question (How, What, Can…), le pays (US, USA, American). Pas de tiret cadratin, pas d'espace avant `:`. Unique sur le site. |
| `description` | **150 à 160 caractères**, contient l'année et au moins un chiffre **calculé** depuis les données. Unique. Compter avec le test. |
| `h1` | sans année de préférence. |
| `intro` | une phrase. |
| `resume` | **UN** paragraphe de **120 mots ou plus** (viser 130 à 180) : la réponse directe à la requête, chiffres compris. Pour un pilier il est affiché replié : la première phrase porte le message. |
| `tool` / `toolProps` | piliers : `screener`, `snap`, `fpl`, `medicaid`, `aca`, `eitc`, `wic`, `section8`, `ssi`. `toolProps` : `{ state, size, income }` (valeurs par défaut du calculateur sur cette page). |
| `mini` / `miniArg` | guides et seuils : un mini-simulateur `src/lib/minis/<kind>.ts` (voir plus bas). |
| `faqs` | piliers 6 à 8, autres 3 à 5 (jusqu'à 8 si long). **Vraies questions telles qu'on les tape**, réponses de **45 à 85 mots** (le test compte 42 à 88), avec le chiffre, la condition et la source. **Une question n'existe qu'une fois sur tout le site** (le test vérifie, y compris l'accueil). |
| `body(h)` | HTML. Piliers : **400 mots ou plus** de prose hors tableaux (viser 500 à 800). Guides : **1 000 mots ou plus** hors tableaux (`check-seo` exige 1 200 mots sur la page entière, réponse et FAQ comprises). Seuils : **400 mots ou plus** et au moins un tableau. Deux à cinq `<h2>` propres à la page. |
| `related` | 3 à 6 ids existants ou planifiés (pages, `state:<slug>`, `states`, `method`). |
| `sources` | clés de `src/data/params-2026.json > sources` (piliers 3 ou plus, autres 2 ou plus). Toutes doivent exister. |

### Champs d'une page d'État (`defineStatePage`)

| Champ | Règle |
|---|---|
| `slug` | = nom du fichier. |
| `title` | 50 à 60 caractères, **commence par le nom de l'État**, puis le terme-clé : « Ohio SNAP and Medicaid Limits 2026: $2,960 for 3 », « Florida Food Stamps and Medicaid 2026: No Expansion »… Unique, varié d'un État à l'autre (ne pas recopier le gabarit du Texas). |
| `description` | 150 à 160 caractères, avec l'année et au moins un chiffre calculé. |
| `intro` | une phrase propre à l'État. |
| `resume` | **UN** paragraphe de **120 mots ou plus** : la réponse pour cet État (SNAP : limite et allocation ; santé : expansion ou non, limites ; un exemple chiffré calculé avec le kit). Première phrase = le message. |
| `body(h)` | **350 mots ou plus** de prose hors tableaux (viser 400 à 600), écrite pour cet État seulement. Ouvrir sur ce que l'État a de plus rare (une option SNAP, une absence d'expansion, un programme au nom propre, un écart HUD spectaculaire, une région SUA, Alaska/Hawaii…). Un exemple chiffré **calculé** avec `h.snapCalc`. Facultatif : `${h.mini('fplThreshold', { pct })}` ou un autre mini. |
| `faqs` | 3 à 5 vraies questions **contenant le nom de l'État** (ou son abréviation), réponses 45 à 85 mots. |
| `related` | 3 à 6 ids : États voisins, pages programmes. |

Le composant de page affiche **seul**, depuis les données : les six chiffres clés, le screener verrouillé sur
l'État, puis après la prose les tableaux SNAP (limites, maximums, SUA), Medicaid/CHIP par groupe, et le
lookup Section 8 par comté. **La prose ne recopie pas ces tableaux** : elle explique ce qui est singulier.

## La règle des chiffres (non négociable, RECETTE §17.4 point 7)

Aucun taux, seuil, montant ou date qui existe dans les données n'est tapé en dur : il se lit ou se calcule
avec le kit (`src/lib/kit.ts`, aussi passé au corps sous `h.`).

```ts
import { definePage } from '../../lib/page-types';
import { P, sd, snapMax, snapGrossState, snapCalc, medLimit, fpl, fplAt, acaCalc, acaCliff, eitcCalc, wicAnnual, usd, usdx, pct, day, listOf } from '../../lib/kit';
const ex = snapCalc('ohio', { size: 3, earned: 2000, housing: 950 });   // SUA de l'État par défaut
title: `SNAP Income Limits 2027: ${usd(snapGrossState('california', 3))} for 3 in 200% States`
```

Une **hypothèse d'exemple** (« a worker earning $2,000 », « rent of $950 ») peut s'écrire `usd(2000)`. Un chiffre
**absent des données ne s'écrit pas**, sauf s'il vient d'un document officiel que vous lisez vous-même (copie
dans `research/`, ou lecture avec curl/WebFetch d'un site .gov) : citez-le alors avec `h.ext(url, texte)` et
signalez-le dans votre compte rendu. Un pourcentage de loi qui n'est pas un paramètre (130 % du test SNAP
fédéral, 100 % du test net) peut s'écrire.

### Le kit (extraits, voir `src/lib/kit.ts`)

- Seuil de pauvreté : `fpl(size, area='us'|'ak'|'hi', year=2026|2025)`, `fplAt(size, pct, area, year)`, `fplPctOf(size, annual, area, year)`.
- SNAP FY 2027 : `snapMax(size, area)` (`'us'|'ak-urban'|'ak-rural1'|'ak-rural2'|'hi'`), `snapMaxPrev(size)` (FY 2026), `snapGross/snapNet/snapGross165(size, area)`, `snapStd(size, area)`, `bbceAll(slug)`, `snapGrossState(slug, size)`, `sua(slug, size)`, `suaRow(slug, size, region?)`, `snapCalc(slug, { size, earned, unearned, elderlyDisabled, housing, utilities?, dependentCare, childSupportPaid, medical, assets, homeless, akArea })` → `{ eligible, benefit, maxAllotment, gross, grossLimit, grossTest, net, netLimit, netTest, bbce, deductions{earned,standard,dependentCare,childSupport,medical,shelter}, adjusted, shelterCosts, excessShelter, shelterCapped, thirtyPercent, minimumApplied, reason }` (montants mensuels).
- Données d'État : `sd(slug)` → `{ name, abbr, area, snap{ bbce[{who,grossPct,assetLimit,assetText,program}], sua[], programName, agency, agencyUrl, applyUrl }, medicaid{ child0to1, child1to5, child6to18, chip, chipAges, pregnant, pregnantChip, parent, parentDollarStandard, expansion, adultPct, bhpPct, note, programName, agency, agencyUrl, chipName }, marketplace{type,name,url}, wic, notes[], hud{ rows, areas, vli4Max, vli4MaxName, vli4Min, vli4MinName } }`. `STATES` = les 51.
- Medicaid : `medLimit(slug, group, size)` avec `group` = `'adult'|'parent'|'pregnant'|'infant'|'child1to5'|'child6to18'` → `{ pct, effectivePct, program, monthly, annual }` ; `medCheck(slug, group, size, monthlyIncome)` ; `bhpOf(slug, size)` ; `expansionStates()`.
- ACA 2026 : `apct(fplPct)`, `acaCalc(income, size, benchmarkMonthly, area, old=false)` → `{ fplPct, eligible, applicablePct, expectedMonthly, creditMonthly, … }` (`old=true` : barème 2021-2025 expiré), `acaCliff(size, area)`.
- EITC : `eitcCalc(children, earned, joint=false, year=2026|2025, agi?)` → `{ credit, maxCredit, phaseInEnd, threshold, completed, stage }`.
- WIC : `wicAnnual(size)`, `wicMonthly(size)`, `wicCheck(size, annual, expectedBabies, adjunctive)`.
- HUD : `hudRows(slug)`, `hudRow(slug, name)`, `hudOf(slug, countyName, size)` → `{ eli, vli, li }`, `rentCalc({ annualIncome, dependents, elderlyDisabled, childCare, medical })`.
- SSI : `ssiCalc(earned, unearned, couple)`.
- Paramètres : `P` (params-2026.json : `P.snap.*`, `P.medicaid.*`, `P.aca.*`, `P.eitc.*`, `P.wic.*`, `P.hud.*`, `P.ssi.*`, `P.fpl.*`).
- Formats : `usd(n)` (sans cents), `usdx(n)` (cents si le chiffre officiel en a : `$205.66`), `pct(9.96)` → « 9.96% », `num`, `day(iso)` → « October 1, 2026 », `listOf([...])`.
- Dans `body(h)` en plus : `h.a(id, texte)` (lien interne ; id inconnu = test en échec), `h.table(entêtes, lignes, légende, alignements)`, `h.src(clé, texte?)` (source officielle de params), `h.ext(url, texte)`, `h.box(titre, html)`, `h.mini(kind, arg)`.

### Les mini-simulateurs (`src/lib/minis/<kind>.ts`)

Un fichier par mini, chargé automatiquement. Modèles : `abawdCheck.ts`, `fplThreshold.ts`, `stateCompare.ts`.
Règles : n'importe **jamais** `src/lib/kit.ts` ; importe `./_kit` (`P`, `F26`, `F25`, `usd`, `sizes`, `yesNo`,
`parseArg`) et les moteurs de `src/lib/engine/` ; un à quatre champs (`options` pour une liste), le chiffre du
sujet en `head`, deux à quatre lignes ; des données d'État passent par `arg` (JSON écrit par la page avec le
kit). Pas d'année dans un champ numérique. Libellés courts (Oui/Non tiennent sur une ligne).

## Ton et langue

- **Anglais américain** ; termes exacts des programmes : « SNAP » (et le nom local : CalFresh, Basic Food,
  FoodShare…), « allotment », « gross/net income test », « standard utility allowance (SUA) », « broad-based
  categorical eligibility (BBCE) », « MAGI », « expansion adults », « premium tax credit », « benchmark silver
  plan », « Housing Choice Voucher », « very low income limit », « federal benefit rate ».
- Voix humaine, phrases de longueur variable, **le chiffre d'abord**. Interdits (le test les refuse) : tiret
  cadratin « — », « it's important to note », « dive into », « delve », « whether you're… », « navigate the »,
  « Moreover », « Additionally », « Furthermore », « in today's world ». Pas de triplets en série, pas de
  conclusion qui résume, pas d'émoji.
- **Local réel** : agences et programmes de l'État tels qu'ils figurent dans `sd(slug)` (si un champ est vide,
  ne pas l'inventer), comtés et villes du fichier HUD, options de l'État.
- **Vérité** : jamais de chiffre ou de règle non sourcés. Les changements 2026 (loi OBBBA, fin des crédits ACA
  renforcés) s'écrivent uniquement comme dans `research/` et `P` (dates comprises). Une règle annoncée mais pas
  encore en vigueur s'écrit avec sa date d'effet. Pas d'avis juridique : « the agency decides ».
- **Unicité** (§6) : `check-unique` compare toutes les pages, chiffres neutralisés, seuil 30 %, fenêtre des
  12 000 premiers caractères. Écrire ce qui n'appartient qu'à la page, avec **un vocabulaire propre** ; aucune
  tournure reprise d'une autre page ni d'un autre site du portefeuille (`check-portefeuille`). Pour les États :
  ouvrir le `body` sur la donnée la plus rare de l'État, pas sur ce que tous partagent ; varier l'ordre des
  sections et les questions d'un État à l'autre.

## Contrôles (à lancer avant de rendre la main)

```bash
cd ~/Documents/GitHub/a-publier/Mottalib-10M/us-benefits
ALLOW_PLANNED=1 PAGE_FILES=snap-income-limits,state:ohio npx vitest run tests/pages.test.ts   # vos pages
```

Puis l'orchestrateur : `npm run build`, `check-unique`, `check-seo`, `check-trame`, `check-portefeuille`…

## Ce qu'on ne fait pas

- Ne pas toucher au cœur (`src/lib/*.ts` hors `src/lib/minis/`, `src/components`, `src/data`, `scripts`) : un
  besoin va dans le compte rendu.
- Ne pas toucher à `_trame`, à la RECETTE, ni à un autre site. Pas de git, pas de dépôt, pas de DNS, pas de Chrome.

## Données et mise à jour annuelle

- `src/data/params-2026.json` : paramètres fédéraux, chacun avec sa source (copies dans `research/`).
- `src/data/states.json` et `src/data/hud/<ST>.json` : reconstruits par `python3 scripts/build-data.py` depuis
  `research/` (tableau BBCE USDA, table SUA, tableau CMS, fichier HUD, `research/state-facts.json`).
- Chaque octobre : nouveau mémo COLA SNAP → `P.snap` ; chaque janvier : HHS → `P.fpl`, IRS → `P.eitc`, `P.aca` ;
  mai : HUD → fichier Section 8 ; juillet : WIC. Relancer `npx vitest run` : les tests recalculent les tables.
