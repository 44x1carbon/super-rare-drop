<script lang="ts">
  import { save } from "$lib/Book";
  import type { ComponentType } from "svelte";
  import type { Egg } from "../app";
  import DoDoDo from "./anime/DoDoDo.svelte";
  import Liquid from "./anime/Liquid.svelte";
  import Loading from "./anime/Loading.svelte";
  import Nomal from "./anime/Nomal.svelte";
  import BackLight from "./anime/BackLight.svelte";
  import Matryoshka from "./anime/Matryoshka.svelte";
  import Notice from "./anime/Notice.svelte";

  export let egg: Egg;

  const ANIME_COMPONENTS: Record<number, ComponentType> = {
    [-1]: Nomal,
    1: DoDoDo,
    2: Liquid,
    3: Loading,
    4: BackLight,
    5: Matryoshka,
    6: Notice,
  };

  $: animeComponent = ANIME_COMPONENTS[egg.animeNum];

  let isShowAnime = false;
</script>

{#if egg.isOpen}
  {#if egg.animeNum !== 1}
    <img src={`/chara/${egg.imgId}.png`} alt="" />
  {/if}
{:else}
  <button on:click={() => (isShowAnime = true)}>
    <img src={`/egg-${egg.startEggRank}.png`} alt="" />
  </button>
{/if}

{#if isShowAnime}
  <svelte:component
    this={animeComponent}
    {egg}
    onClose={() => {
      isShowAnime = false;
      egg.isOpen = true;
      if (egg.animeNum === 1) return;
      save(egg.imgId);
    }}
    onFinishAnime={() => {
      if (egg.animeNum === 1) return;
      save(egg.imgId);
    }}
  />
{/if}
