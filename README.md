# Kanban Board

Kanban tipa dēļa lietotne

## Mapju struktūra

```
src/
  components/      Komponentes
  stores/          state pārvaldība
  constants/       Vairākkārt izmantojamas definīcijas
  locales/         Tulkojumi
  utils/           Vairākkārt izmantojamas funkcijas
```

## Komponentu arhitektūra

```
App.vue
├── FilterBar.vue
├── KanbanBoard.vue
│   └── KanbanColumn.vue (x statusu skaits)
│       └── TaskCard.vue  (×n)
│           └── ConfirmModal.vue
├── TaskModal.vue
└── Notification.vue
```

## Apraksts

`App` apstrādā uzdevumu izmaiņu saglabāšanu/izveidi, izmantojot store, kā arī uzdevuma modālā loga(`TaskModal`) atvēršanu. `App` ar `TaskModal` ir two-way bind uzdevuma datiem(ar `editingTask` mainīgo). Tas ļauj datu saglabāšanu veikt caur `App`, jo caur to tiek noteikta arī modālā loga atvērtība.

`KanbanBoard` ir definēts kā atsevišķa komponente, nevis apvienots ar `KanbanColumn`, lai katra kolonna būtu kā atsevišķa komponente un nedalītu mainīgo(`isDragOver`), kas nosaka, virs kuras kolonnas ir pārvietots uzdevums.

`KanbanColumn` komponentē tiek apstrādāta uzdevuma dzēšana/izmaiņa pārvietošanas rezultātā ar store palīdzību. Visa uzdevuma pārvietošanas apstrāde notiek šajā komponentē. Kolonnas tiek izveidotas ar v-for, balstoties uz statusu konstantēm, lai statusu pievienošanas gadījumā tas uzreiz atspoguļotos arī iespējamajās kolonnās.

`TaskCard` komponente tiek izmantota uzdevuma datu mazākai attēlošanai. No `TaskCard` var tikt izsaukta dzēšanas darbība, kas tiek apstrādāta iekš `KanbanColumn`, lai nav pašā uzdevuma kartītē jādefinē vēl papildus store.

`ConfirmModal` ir vispārēja paziņojuma komponente, kas var tikt izmantota pēc nepieciešamības, kad ir nepieciešma Jā/Nē atbilde. `TaskCard` to izmanto, lai apstiprinātu dzēšanas darbību. Modālais logs ir novietots kartītes līmenī, lai katras kartītes ietvaros tiktu kontrolēta tā atvērtība, nevis globāli.

`Notification` komponente izmanto store, lai attēlotu paziņojumus par darbībām. Katram paziņojumam tiek dota attiecīga krāsa, balstoties uz statusu, kā arī dinamisks teksts, ko attēlot.

`FilterBar` tiek izmantots, lai attēlotu filtru, kā arī ar store palīdzību tiek izsaukta filtrēšana, balstoties uz filtra vērtībām. `KanbanColumn` attēlo filtrētos rezultātus ar store palīdzību. Filtrēšana notiek tikai pēc Meklēt pogas nospiešanas, lai ieraksti tiktu filtrēti tikai tad, kad ir izvēlēti/ievadīti pilnībā visi parametri. Citādi filtrēšana notiktu uz katru teksta ievades simbolu, kas pie lieliem datu apjomiem var būt problemātiski.

Uzdevumu un paziņojumu stores ir definēti atsevišķi, jo uzkrāj informāciju, kas nav savstarpēji saistīta.

Konstantes, kas var tikt vairākkārt izmantotas, tiek definētas vienviet, lai to izmaiņu gadījumā ir nepieciešams rediģēt tikai vienu failu.

Lokalizāciju(locales) izmantošana ļauj vienviet definēt frāzes, lai tās nepieciešamības gadījumā var pārizmantot.

## Palaišana lokāli

```
npm install
npm run dev
```

