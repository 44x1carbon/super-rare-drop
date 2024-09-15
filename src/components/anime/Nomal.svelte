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
    on("split-egg");
    await Promise.all([
      _a({
        targets: "#egg-l",
        rotate: -30,
        duration: 2000,
      }),
      _a({
        targets: "#egg-r",
        rotate: 30,
        duration: 2000,
      }),
      offset(1000, async () => {
        on("chara");
        await _a({
          targets: "#chara",
          opacity: 1,
          duration: 2000,
        });
      }),
    ]);
    // off("split-egg");

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

      <div
        id="split-egg"
        class="absolute top-0 left-0 w-full h-full"
        style="display: none;"
      >
        <img
          id="egg-l"
          src={`/egg-${startEggRank}-l.png`}
          alt=""
          style="transform-origin: 50% 100%;"
          class="absolute bottom-[5%]"
        />
        <img
          id="egg-r"
          src={`/egg-${startEggRank}-r.png`}
          alt=""
          style="transform-origin: 50% 100%;"
          class="absolute bottom-[5%]"
        />
      </div>

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
