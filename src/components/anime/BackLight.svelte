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

  let lightClass = "rainbow-light";

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
    on("egg");
    on("light");
    await offset(500);
    lightClass = "golden-light";
    await offset(500);
    lightClass = "silver-light";
    await offset(500);

    // 卵が割れる演出
    off("egg");
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
      <img
        id="egg"
        src={`/egg-${startEggRank}.png`}
        alt=""
        style="display: none;"
        class="absolute bottom-[5%] z-10"
      />

      <div
        id="light"
        class={lightClass +
          " absolute bottom-[11%] left-1/2 transform -translate-x-1/2 z-0"}
        style="display: none;"
      >
        <img id="egg-l" src={`/egg-${startEggRank}-l.png`} class="opacity-0" />
      </div>
      <div
        id="split-egg"
        class="absolute top-0 left-0 w-full h-full z-0"
        style="display: none;"
      >
        <img
          id="egg-l"
          src={`/egg-${startEggRank}-l.png`}
          alt=""
          style="transform-origin: 50% 100%;"
          class="absolute bottom-[5%] z-10"
        />
        <img
          id="egg-r"
          src={`/egg-${startEggRank}-r.png`}
          alt=""
          style="transform-origin: 50% 100%;"
          class="absolute bottom-[5%] z-10"
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

<style>
  .rainbow-light {
    width: 300px;
    height: 300px;
    border-radius: 50%; /* 光の丸みを表現 */
    background: conic-gradient(
      red,
      orange,
      yellow,
      green,
      blue,
      indigo,
      violet
    );
    filter: blur(20px); /* 光のぼかし効果 */
    box-shadow: 0 0 30px rgba(255, 255, 255, 0.5); /* 外側の光の輝き */
  }

  .golden-light {
    width: 300px;
    height: 300px;
    border-radius: 50%; /* ライトを丸くする */
    background: radial-gradient(
      circle,
      rgba(255, 223, 0, 0.8),
      rgba(255, 185, 0, 0.6),
      rgba(255, 140, 0, 0.4)
    );
    filter: blur(20px); /* ライトをぼかす */
    box-shadow:
      0 0 50px rgba(255, 215, 0, 0.7),
      0 0 100px rgba(255, 223, 0, 0.5); /* 光の輝き */
  }

  .silver-light {
    width: 300px;
    height: 300px;
    border-radius: 50%; /* ライトを丸くする */
    background: radial-gradient(
      circle,
      rgba(192, 192, 192, 0.8),
      rgba(169, 169, 169, 0.6),
      rgba(128, 128, 128, 0.4)
    );
    filter: blur(20px); /* ライトをぼかす */
    box-shadow:
      0 0 50px rgba(192, 192, 192, 0.7),
      0 0 100px rgba(169, 169, 169, 0.5); /* 光の輝き */
  }
</style>
