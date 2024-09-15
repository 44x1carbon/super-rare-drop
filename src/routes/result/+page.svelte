<script lang="ts">
  import { choiceAnimeNum, choiceChara, choiceEggRank } from "$lib/Gacha";
  import { onMount, tick } from "svelte";
  import type { Egg } from "../..";
  import type { EggRank } from "../../app";
  import EggComponent from "../../components/Egg.svelte";
  import { ANIME_DATA } from "../../data/anime";

  let eggs: Egg[] = [];

  async function roll10Gacha() {
    eggs = [];

    let isAllLR = 0.05 >= Math.random();

    for (let i = 0; i < 10; i++) {
      await tick();
      await new Promise((r) => setTimeout(r, 200));

      const animeNum = isAllLR ? -1 : choiceAnimeNum();
      // @ts-ignore
      const startEggRank = ANIME_DATA[animeNum].startRank as EggRank;

      const rankList: EggRank[] =
        startEggRank === "g" ? ["s", "b", "w"] : ["g", "s", "b", "w"];
      const rank = choiceEggRank(rankList);
      const chara = choiceChara(rank);
      const imgId = isAllLR ? "LR-1" : chara.id;

      eggs = [
        ...eggs,
        {
          rank: rank,
          animeNum: animeNum,
          imgId: imgId,
          startEggRank,
          isOpen: false,
        },
      ];
    }
  }

  onMount(() => {
    setTimeout(() => {
      roll10Gacha();
    }, 100);
  });
</script>

<div class="pt-[50%]">
  <div class="mb-4 text-2xl fton-bold text-center">ガチャ結果</div>

  <div class="grid grid-cols-5 gap-2 bg-white rounded-xl">
    {#each new Array(10) as _, i}
      <div>
        {#if eggs[i]}
          <EggComponent bind:egg={eggs[i]} />
        {:else}
          <img src="/egg-r.png" alt="" class="opacity-0" />
        {/if}
      </div>
    {/each}
  </div>

  <div class="mt-4 text-center drop-shadow-xl font-bold">
    たまごをタップして開封しよう！！
  </div>

  {#if eggs.every((egg) => egg.isOpen)}
    <div class="mt-4 flex flex-col gap-2">
      <a
        href="/result"
        data-sveltekit-reload
        class="w-full p-4 bg-blue-500 text-white shadow-lg rounded-xl block text-center text-xl font-bold"
        >もういちどまわす</a
      >
      <a
        href="/"
        data-sveltekit-reload
        class="w-full p-4 bg-blue-500 text-white shadow-lg rounded-xl block text-center text-xl font-bold"
        >とっぷにもどる</a
      >
    </div>
  {/if}
</div>
