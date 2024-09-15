<script lang="ts">
  import { _a, off, offset, on } from "$lib";
  import { onMount } from "svelte";
  import type { Egg } from "../../app";
  import { ANIME_DATA } from "../../data/anime";
  import { CHARA_DATA } from "../../data/chara";

  export let egg: Egg;
  export let onFinishAnime: (egg: Egg) => void = () => {};
  export let onClose: () => void = () => {};

  // @ts-ignore
  $: startEggRank = ANIME_DATA[egg.animeNum].startRank as EggRank;
  // @ts-ignore
  $: loading = ANIME_DATA[egg.animeNum].loading;
  // @ts-ignore
  $: chara = CHARA_DATA[egg.imgId];

  $: step = [
    ...["g", "s", "b", "w", "b", "s", "g", "r"],
    ...["w", "b", "s", "g"]
      .slice(["w", "b", "s", "g"].indexOf(egg.rank))
      .reverse(),
  ];

  let progress = 0;
  let isAnimeEnd = false;

  async function doAnime() {
    // ローディング演出
    on("loading");
    await new Promise((r) => {
      const timer = setInterval(() => {
        progress += 10;

        if (progress > loading) {
          clearInterval(timer);
          setTimeout(() => {
            off("loading");
            r("");
          }, 300);
        }
      }, 10);
    });

    // アニメーション処理

    // 卵が割れる演出
    for (let i = 0; i < step.length; i++) {
      on(`split-egg-${i}`);
      on(`split-egg-${i + 1}`);
      await offset(500, async () => {});
      await Promise.all([
        _a({
          targets: `#egg-l-${i}`,
          rotate: (30 + (step.length - i) * 5) * -1,
          duration: 100,
        }),
        _a({
          targets: `#egg-r-${i}`,
          rotate: 30 + (step.length - i) * 5,
          duration: 100,
        }),
      ]);
    }

    on("chara");
    await _a({
      targets: "#chara",
      opacity: 1,
      duration: 300,
    });

    isAnimeEnd = true;
    onFinishAnime(egg);
  }

  onMount(() => {
    doAnime();
  });
</script>

<div class="fixed top-0 left-0 p-4 bg-black/10 h-[100svh] w-screen z-50">
  <div class="h-[100%]">
    <div
      class="h-[90%] w-full bg-white relative left-1/2 transform -translate-x-1/2"
    >
      <div
        id="loading"
        class="p-2 absolute w-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        style="display: none;"
      >
        <div>Loading...</div>
        <div>
          <progress max="100" value={(progress / loading) * 100} class="w-full"
          ></progress>
        </div>
      </div>
      <!-- <img src={`/egg-${startEggRank}.png`} alt="" class="absolute bottom-[5%]" /> -->

      {#each step as r, i}
        <div
          id={`split-egg-${i}`}
          class="absolute top-0 left-0 w-full h-full"
          style={`display: none; z-index: ${99 - i}`}
        >
          <img
            id={`egg-l-${i}`}
            src={`/egg-${r}-l.png`}
            alt=""
            style={`transform-origin: 50% 100%;scale: ${1 - i * 0.05};`}
            class="absolute bottom-[5%]"
          />
          <img
            id={`egg-r-${i}`}
            src={`/egg-${r}-r.png`}
            alt=""
            style={`transform-origin: 50% 100%;scale: ${1 - i * 0.05};`}
            class="absolute bottom-[5%]"
          />
        </div>
      {/each}

      <div
        id="chara"
        class="absolute bottom-[20%] w-full"
        style="display: none; opacity: 0;"
      >
        <div class="">
          <img src={`/chara/${egg.imgId}.png`} alt="" id="chara-img" />
          <div class="absolute bottom-[10%] left-0 w-full">
            <div
              class="flex gap-4 justify-center text-xl font-bold bg-black/50 w-fit mx-auto p-2 text-white"
            >
              <div>{chara.rank}</div>
              <div>{chara.name}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    {#if isAnimeEnd}
      <div class="relative mt-4 w-full">
        <button
          class="border rounded p-3 bg-blue-500 text-white font-bold shadow-lg w-full"
          on:click={onClose}
        >
          閉じる
        </button>
      </div>
    {/if}
  </div>
</div>
