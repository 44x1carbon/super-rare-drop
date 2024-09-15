<script lang="ts">
  import { loadAll } from "$lib/Book";
  import { onMount } from "svelte";
  import { CHARA_DATA } from "../../data/chara";

  type Chara = {
    id: string;
    rank: string;
    name: string;
  };

  $: charaDataGroupByRank = Object.entries(CHARA_DATA)
    .map(([id, { rank, name }]) => {
      return {
        id,
        rank,
        name,
      };
    })
    .reduce(
      (p, c) => {
        if (p[c.rank] === undefined) {
          p[c.rank] = [];
        }

        p[c.rank].push(c);

        return p;
      },
      {} as Record<string, Chara[]>
    );

  let charaIdList: string[] = [];

  onMount(() => {
    charaIdList = loadAll();
  });
</script>

<div class="font-bold text-2xl mb-2">ありくいずかん</div>

<div
  class="rounded bg-white w-full h-[80%] flex flex-col overflow-scroll border"
>
  {#each ["N", "R", "SR", "UR", "LR"] as r}
    <div class="p-2">
      <div class="font-bold">{r}</div>
      <div class="grid grid-cols-4 gap-2">
        {#each charaDataGroupByRank[r] as chara}
          <div class="bg-gray-100 pb-1 rounded">
            <img
              src={`/chara/${chara.id}.png`}
              alt=""
              class={`${charaIdList.includes(chara.id) ? "" : "filter brightness-0 contrast-200"}`}
            />
            <div class="text-xs text-center font-bold">{chara.name}</div>
          </div>
        {/each}
      </div>
    </div>
  {/each}
</div>

<div class="mt-4">
  <a
    class="border rounded-lg p-4 font-bold text-white bg-blue-500 shadow-lg w-full block text-center"
    href="/"
    data-sveltekit-reload
  >
    トップにもどる
  </a>
</div>
